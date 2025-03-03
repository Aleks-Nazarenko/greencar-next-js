import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { JOOMLA_API_BASE, JOOMLA_URL_BASE } from '@/utils/config';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import {FormSelect} from "react-bootstrap";

function ProductImage({ src, alt, fallback, className }) {
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setImgSrc(src); // If the image loads, keep the original src
        img.onerror = () => setImgSrc(fallback); // If the image fails to load, use fallback
    }, [src, fallback]);

    return (
        <img src={imgSrc} alt={alt} className={className} />
    );
}
export async function getStaticPaths() {
    const paths = [];

    try {
        const categoryRes = await fetch(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=454&format=json`);
        //404 500 http errors
        //  if (!categoryRes.ok) throw new Error(`Failed to fetch categories: ${categoryRes.status}`);
        const categories = await categoryRes.json();
        // Step 2: Fetch subcategories for each category
        for (const category of categories) {
            try {
                const productRes = await fetch(`${JOOMLA_API_BASE}&task=getProductsBySubcategory&subcategory_id=${category.category_id}&format=json`);
                //        if (!productRes.ok) throw new Error(`Failed to fetch products for subcategory ${subcategory.category_id}: ${productRes.status}`);
                const products = await productRes.json();
                // Generate paths for each product in the subcategory
                products.forEach((product) => {
                    paths.push({
                        params: {
                            "id-name": `${category.category_id}-${category.category_name.toLowerCase().replace(/\s*\/\s*/g, '-').replace(/\./g, '').replace(/\s+/g, '-').replace(/-+/g, '-')}`,
                            "product-id-name": `${product.product_id}-${product.product_name.toLowerCase().replace(/\s+/g, '-')}`,
                        },
                    });
                });
            } catch (error) {
                console.error(`Failed to fetch subcategories for category ID ${category.category_id}:`, error.message);
            }
        }
    } catch (error) {
        console.error("Failed to fetch categories:", error.message);
    }

    return {
        paths,
        fallback: false,
    };
}
export async function getStaticProps({ params }) {
    // Base URL of your Joomla server (adjust this to your Joomla installation URL)
    const joomlaBaseUrl = JOOMLA_URL_BASE;
    // Extract product ID from `product-id-name`
    const [productId] = params["product-id-name"].split('-');
    // Fetch the product details from the Joomla API
    const res = await fetch(`${JOOMLA_API_BASE}&task=getProduct&product_id=${productId}&format=json`);
    const productData = await res.json();
    const product = productData.product_name ? productData : null;
    if (!productData.product_name) {
        console.error("Invalid product data received:", productData);
    }
    const resArticle = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=22&format=json`);
    const articleData = await resArticle.json();
    // Extract the footer article from the response
    const article = articleData.article || null;
    if (article) {
        article.content = article.content ? convertRelativeUrls(article.content, joomlaBaseUrl) : '';
        if (!article.content) {
            console.log('footerArticle.content not found');
        }
    }
    const resOptions = await fetch(`${JOOMLA_API_BASE}&task=getProductOptions&product_id=${productId}&format=json`);
    const options = resOptions.ok ? await resOptions.json() : [];
    // Ensure options is always an array
    const validOptions = Array.isArray(options) ? options : [];
    const versand = validOptions.find(option => option.name === "Versand") || null;
    const einbau = validOptions.find(option => option.name === "Mit Einbau") || null;

    return {
        props: {
            product,
            article,
            versand,
            einbau,
        },
    };
}

export default function BauNachruestFilterProductPage({ product, article, versand, einbau }) {

    const router = useRouter();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
        }).format(price);
    };
    // Utility function to determine the total price label
    const getTotalPriceLabel = () => {
        if (installationOption === 'with') {
            return 'Preis mit Einbau';
        } else  {
            return 'Preis mit Versand';
        }
    };
    const VAT_SHARE = 1.19; // MwSt.
    const mwStWording = " (inkl. MwSt.) ";
    const BASE_PRICE = parseFloat(product.product_prices[0].price_value) * VAT_SHARE ; // Product query returns multiple prices, we use the first one
    const DELIVERY_COST = parseFloat(versand.price) * VAT_SHARE; // Options query returns only one price
    const INSTALLATION_COST = parseFloat(einbau.price) * VAT_SHARE; // Options query returns only one price

    // State to manage form selections
    const [installationOption, setInstallationOption] = useState('with'); // Default to 'with installation'
    const [deliveryDesired, setDeliveryDesired] = useState('yes'); //Versand. Immer berechnet, keine Auswahl. Wird nur im cartItem verwendet
    const [totalPrice, setTotalPrice] = useState(BASE_PRICE + INSTALLATION_COST);

    // Product options configuration
    const productOptions = {
        installation: { //Aus- und Einbau bzw. Mit Einbau
            isAvailable: true,
            cost: INSTALLATION_COST,
            label: "Mit Einbau",
            withoutLabel: "No Installation",
        },
        delivery: { //Abholung bzw. Versand
            isAvailable: true,
            cost: DELIVERY_COST,
            label: "Versand",
        },
        deposit: { //Kaution
            isAvailable: false,
            cost: null,
            label: "Kaution",
        },
        advancePayment: {//Vorauszahlung
            isAvailable: true,
            cost: 20,
            label: "Vorauszahlung",
        },
    };
    const handleInstallationChange = (e) => {
        const selectedOption = e.target.value;
        setInstallationOption(selectedOption);
        // Update total price based on installation option
        let newTotalPrice = BASE_PRICE + INSTALLATION_COST;
        if (selectedOption === 'without') {
            newTotalPrice = BASE_PRICE + DELIVERY_COST;
        }
        setTotalPrice(newTotalPrice);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();

        if (!product) {
            alert('Produkt nicht gefunden');
            return;
        }
        // Construct the cart item with selected options
        const cartItem = {
            productName: product.product_name,
            productImage: product.product_images?.[0] || 'beispielphoto.jpg',
            basePrice: formatPrice(BASE_PRICE),
            options: {
                // Aus- und Einbau bzw. Mit Einbau
                installation: productOptions.installation.isAvailable && installationOption === 'with'
                    ? {
                        label: productOptions.installation.label,
                        cost: formatPrice(productOptions.installation.cost),
                    }
                    : null,
                // Abholung bzw. Versand
                delivery: productOptions.installation.isAvailable && installationOption === 'without'
                    ? {
                        label: productOptions.delivery.label,
                        cost: formatPrice(productOptions.delivery.cost),
                    }
                    : null,
                // Kaution
                deposit: productOptions.deposit.isAvailable
                    ? {
                        label: productOptions.deposit.label,
                        cost: formatPrice(productOptions.deposit.cost),
                    }
                    : null,
                // Vorauszahlung hier unnötig !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                advancePayment: productOptions.advancePayment.isAvailable
                    ? {
                        label: productOptions.advancePayment.label,
                        cost: productOptions.advancePayment.cost,
                    }
                    : null,
            },
            landName: null,
            cityName: null,
            totalPrice: formatPrice(totalPrice),
            totalPriceUnformatted: totalPrice,
            vatShare: VAT_SHARE,

        };

        // Save to local storage
        sessionStorage.setItem('cart', JSON.stringify(cartItem));
        sessionStorage.setItem('productOptions', JSON.stringify(productOptions));
        // Get the current page URL using the router
        const productUrl = `${window.location.origin}${router.asPath}`;
        sessionStorage.setItem('lastVisitedProduct', productUrl);

        // Navigate to checkout
        router.push('/checkout');

    }


    const productImages = product.product_images;

    return (
        <>
            {product && (
                <div className={"row g-0"}>
                    <h1 className={"pb-0 mb-0"}>{product.product_name} für {product.motorleistung_liste}</h1>
                </div>
            )}
            <div className="w-100 pb-4"></div>
            <div className="row g-0 p-3 p-sm-4 product-detail-view rounded-4 align-items-center">
                {product && (
                    <>
                        <div className={"col"}>
                            <div className={"row"}>
                                <div className="col-sm-6">

                                    {productImages && productImages.length > 1 ? (
                                        <Swiper spaceBetween={10} slidesPerView={1} navigation modules={[Navigation]}>
                                            {productImages.map((image, index) => (
                                                <SwiperSlide key={index}>
                                                    <ProductImage
                                                        className={"img-fluid"}
                                                        src={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/${image}`}
                                                        alt={product.product_name}
                                                        fallback={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/beispielphoto.jpg`}
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    ):(
                                        <ProductImage
                                            className={"img-fluid"}
                                            src={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/${productImages[0]}`}
                                            alt={product.product_name}
                                            fallback={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/beispielphoto.jpg`}
                                        />
                                    )}
                                </div>
                                <div className="col-sm-6">
                                    <div className={"row g-0 pt-3 pt-sm-0"}>
                                        <div className={"col-12"}>
                                            <p><strong>Motorleistung: </strong> {product.motorleistung_liste} </p>
                                            <p><strong>Ausführung / Einsatzgebie: </strong> {product.einsatz_liste}</p>
                                            <p><strong>Artikelnummer:</strong> {product.artikelnummer}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </>
                )}
            </div>

            <div className="row g-0 p-3 p-sm-4 pt-sm-3">
                <div className="col-12 product-info">
                    <div>
                        <span className={"gc-green display-1"}>{formatPrice(BASE_PRICE)}</span><span className={"ps-2"}>pro Stück {mwStWording}</span>
                    </div>
                    <div className={"w-100 pb-3"}></div>
                    { installationOption === 'with' && (
                        <>
                            <p>Keine Versandkosten</p>
                            <p>Einbau vor Ort beim Kunden, deutschlandweit</p>
                        </>
                    )}
                    { installationOption === 'without' && (
                    <p>Versand +{formatPrice(DELIVERY_COST)} {mwStWording}</p>
                    )}
                </div>

                <div className="w-100">Mit Einbau:</div>
                <div className="col-sm-6">
                        <FormSelect value={installationOption} onChange={handleInstallationChange}>
                            <option value="with">Ja + {formatPrice(INSTALLATION_COST)}</option>
                            <option value="without">Nein</option>
                        </FormSelect>

                </div>

                <div className="row g-0 total-price mt-3 pt-1">
                    <div className={"display-3 gc-green"}>{getTotalPriceLabel()}: {formatPrice(totalPrice)}</div>
                </div>
            </div>


            <div className="row g-0 p-4 pt-0 pb-3">
                <div className={"col col-sm-6"}>
                    <Link href={`/anfrage-partikelfilter`}>
                        <button className="btn btn-primary btn-yellow btn-100">Unverbindliches Angebot anfordern</button>
                    </Link>
                </div>
            </div>

            <div className="row g-0 p-4 pt-3 pb-3">
                <div className={"col col-sm-6"}>
                    <button className="btn btn-primary btn-light-green btn-100" onClick={handleAddToCart}>
                        In den Warenkorb
                    </button>
                </div>
            </div>

            <div className="row g-0 p-4 pt-3">
                <div className={"col col-sm-6"}>
                    <button onClick={() => router.back()} className="btn btn-primary btn-green btn-100">Zurück zur Listenansicht</button>
                </div>
            </div>



            <div className="w-100 pb-4"></div>
            <div className="row g-0">
                {article?.content && (
                    <div dangerouslySetInnerHTML={{ __html: article.content}} />
                )}
            </div>

        </>
    );
}
