import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { JOOMLA_API_BASE } from '@/utils/config';
import { JOOMLA_URL_BASE } from '@/utils/config';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import Form from 'react-bootstrap/Form';
import { createSlug } from '@/utils/sanitizeProductSlug';
function ProductImage({ src, alt, fallback, className }) {
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setImgSrc(src); // If the image loads, keep the original src
        img.onerror = () => setImgSrc(fallback); // If the image fails to load, use fallback
    }, [src, fallback]);

    return (
        <img src={imgSrc} alt={alt}  className={className}/>
    );
}

export async function getStaticPaths() {
    const paths = [];

    // Step 1: Fetch all categories
    try {
        const categoryRes = await fetch(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=70&format=json`);
        //404 500 http errors
        //  if (!categoryRes.ok) throw new Error(`Failed to fetch categories: ${categoryRes.status}`);
        const categories = await categoryRes.json();
        // Step 2: Fetch subcategories for each category
        for (const category of categories) {
            try {
                const subcategoryRes = await fetch(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=${category.category_id}&format=json`);
                //     if (!subcategoryRes.ok) throw new Error(`Failed to fetch subcategories for category ID ${category.category_id}: ${subcategoryRes.status}`);
                const subcategories = await subcategoryRes.json();
                // Step 3: Fetch products for each subcategory
                for (const subcategory of subcategories) {
                    try {
                        const productRes = await fetch(`${JOOMLA_API_BASE}&task=getProductsBySubcategory&subcategory_id=${subcategory.category_id}&format=json`);
                        //        if (!productRes.ok) throw new Error(`Failed to fetch products for subcategory ${subcategory.category_id}: ${productRes.status}`);
                        const products = await productRes.json();
                        // Generate paths for each product in the subcategory
                        products.forEach((product) => {
                            const productName = createSlug(product.product_name);
                            paths.push({
                                params: {
                                    "id-name": `${category.category_id}-${category.category_name.toLowerCase().replace(/\s+/g, '-')}`,
                                    "subcategory-id-name": `${subcategory.category_id}-${subcategory.category_name.toLowerCase().replace(/\s+/g, '-')}`,
                                    "product-id-name": `${product.product_id}-${productName}`,
                                },
                            });
                        });
                    } catch (error) {
                        console.error(`Error fetching austauschfilter products for subcategory ${subcategory.category_id}: ${error.message}`);
                    }
                }
            } catch (error) {
                console.error(`Failed to fetch austauschfilter subcategories for category ID ${category.category_id}:`, error.message);
            }
        }
    } catch (error) {
        console.error("Failed to fetch austauschfilter categories:", error.message);
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
    const resProduct = await fetch(`${JOOMLA_API_BASE}&task=getProduct&product_id=${productId}&format=json`);
    const productData = await resProduct.json();
    const product = productData.product_name ? productData : null;
    if (!productData.product_name) {
        console.error("Invalid product data received:", productData);
    }
    const resInstall = await fetch(`${JOOMLA_API_BASE}&task=getProduct&product_id=3259&format=json`);
    const installData = await resInstall.json();
    const installation = installData.product_id ? installData : null;
    if (!installData.product_id) {
        console.error("Invalid product data received:", installData);
    }
    const resDelivery = await fetch(`${JOOMLA_API_BASE}&task=getProduct&product_id=3258&format=json`);
    const deliveryData = await resDelivery.json();
    const delivery = deliveryData.product_id ? deliveryData : null;
    if (!deliveryData.product_id) {
        console.error("Invalid product data received:", deliveryData);
    }

    const resDeposit = await fetch(`${JOOMLA_API_BASE}&task=getProduct&product_id=14794&format=json`);
    const depositData = await resDeposit.json();
    const deposit = depositData.product_id ? depositData : null;
    if (!depositData.product_id) {
        console.error("Invalid product data received:", depositData);
    }

    const resArticle = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=18&format=json`);
    const articleData = await resArticle.json();
    // Extract the footer article from the response
    const article = articleData.article || null;
    if (article) {
        article.content = article.content ? convertRelativeUrls(article.content, joomlaBaseUrl) : '';
        if (!article.content) {
            console.log('footerArticle.content not found');
        }
    }

    return {
        props: {
            product,
            article,
            installation,
            delivery,
            deposit,
        },
    };
}

export default function ProductPage({ product, article, installation, delivery, deposit }) {
    const router = useRouter();
    // Constants for pricing
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
        } else if (installationOption === 'without' && deliveryDesired === 'yes') {
            return 'Preis mit Versand';
        } else {
            return 'Preis';
        }
    };
    const [selectedBasePrice, setSelectedBasePrice] = useState(null);
    const [selectedDeliveryPrice, setSelectedDeliveryPrice] = useState(null);
    const [selectedInstallPrice, setSelectedInstallPrice] = useState(null);
    const [selectedDepositPrice, setSelectedDepositPrice] = useState(null);

    const [totalPrice, setTotalPrice] = useState(selectedBasePrice + selectedDeliveryPrice + selectedInstallPrice + selectedDepositPrice);

    const [mwStWording, setMwStWording] = useState('');
    const [mwSt, setMwSt] = useState(null);

    const sortedDeliveryPrices = [...delivery.product_prices].sort((a, b) => Number(a.price_value) - Number(b.price_value));
    const sortedBasePrices = [...product.product_prices].sort((a, b) => Number(a.price_value) - Number(b.price_value));
    const sortedInstallPrices = [...installation.product_prices].sort((a, b) => Number(a.price_value) - Number(b.price_value));
    const sortedDepositPrices = [...deposit.product_prices].sort((a, b) => Number(a.price_value) - Number(b.price_value));

    const VAT_SHARE = 1.19; // MwSt.

    useEffect(() => {
        if (delivery && product && installation && deposit) {
            // Adjust prices based on the presence of authToken
            const authToken = typeof window !== "undefined" && sessionStorage.getItem("authToken");

            if (authToken) {
                // User authenticated: Use smallest prices
                setSelectedDeliveryPrice(parseFloat(sortedDeliveryPrices[0].price_value));
                setSelectedBasePrice(parseFloat(sortedBasePrices[0].price_value));
                setSelectedInstallPrice(parseFloat(sortedInstallPrices[0].price_value));
                setSelectedDepositPrice(parseFloat(sortedDepositPrices[0].price_value));
                setTotalPrice((parseFloat(sortedBasePrices[0].price_value) + parseFloat(sortedDeliveryPrices[0].price_value) + parseFloat(sortedDepositPrices[0].price_value)));
                setMwStWording('(ohne MwSt.)');
                setMwSt(false);
                setInstallationOption('without');
            } else {
                // User not authenticated: Use largest prices
                setSelectedDeliveryPrice(parseFloat(sortedDeliveryPrices[sortedDeliveryPrices.length - 1].price_value) * VAT_SHARE);
                setSelectedBasePrice(parseFloat(sortedBasePrices[sortedBasePrices.length - 1].price_value) * VAT_SHARE);
                setSelectedInstallPrice(parseFloat(sortedInstallPrices[sortedInstallPrices.length - 1].price_value) * VAT_SHARE);
                setSelectedDepositPrice(parseFloat(sortedDepositPrices[sortedDepositPrices.length - 1].price_value) * VAT_SHARE);
                setTotalPrice((parseFloat(sortedBasePrices[sortedBasePrices.length - 1].price_value) * VAT_SHARE
                    + parseFloat(sortedInstallPrices[sortedInstallPrices.length - 1].price_value) * VAT_SHARE
                    + parseFloat(sortedDeliveryPrices[sortedDeliveryPrices.length - 1].price_value) * VAT_SHARE
                    + parseFloat(sortedDepositPrices[sortedDepositPrices.length - 1].price_value) * VAT_SHARE
                ) );
                setMwStWording('(inkl. MwSt.)');
                setMwSt(true);
            }
        }
    }, [delivery, product, installation]);

    const BASE_PRICE = selectedBasePrice // Base product price
    const DELIVERY_COST = selectedDeliveryPrice; // Versand
    const DEPOSIT_COST = selectedDepositPrice; // Kaution
    const INSTALLATION_COST = selectedInstallPrice; // Einbau

    // Product options configuration
    const productOptions = {
        installation: { //Aus- und Einbau bzw. Mit Einbau
            isAvailable: true,
            cost: INSTALLATION_COST,
            label: "Aus- und Einbau",
            withoutLabel: "No Installation",
        },
        delivery: { //Abholung bzw. Versand
            isAvailable: true,
            cost: DELIVERY_COST,
            label: "Versand",
        },
        deposit: { //Kaution
            isAvailable: true,
            cost: DEPOSIT_COST,
            label: "Kaution",
        },
        advancePayment: {//Vorauszahlung
            isAvailable: true,
            cost: 10,
            label: "Vorauszahlung",
        },
    };
    // State to manage form selections
    const [installationOption, setInstallationOption] = useState('with'); // Default to 'with installation'
    const [deliveryDesired, setDeliveryDesired] = useState('yes'); //Versand. Immer berechnet, keine Auswahl. Wird nur im cartItem verwendet
    const [selectedLand, setSelectedLand] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [lands, setLands] = useState([]);
    const [cities, setCities] = useState([]);

    // Fetch lands when the component loads
    useEffect(() => {
        const fetchLands = async () => {
            try {
                const response = await fetch(`${JOOMLA_API_BASE}&task=getLands&format=json`);
                const data = await response.json();
                setLands(data);
            } catch (error) {
                console.error('Failed to fetch lands:', error);
            }
        };
        fetchLands();
    }, []);

    // Fetch cities when a land is selected
    useEffect(() => {
        if (selectedLand) {
            const fetchCities = async () => {
                try {
                    const response = await fetch(`${JOOMLA_API_BASE}&task=getCities&land_id=${selectedLand}&format=json`);
                    const data = await response.json();
                    setCities(data);
                } catch (error) {
                    console.error('Failed to fetch cities:', error);
                }
            };
            fetchCities();
        } else {
            setCities([]); // Clear cities if no land is selected
        }
    }, [selectedLand]);

    // Handle changes in installation option
    const handleInstallationChange = (e) => {
        const selectedOption = e.target.value;
        setInstallationOption(selectedOption);

        // Update total price based on installation option
        let newTotalPrice = BASE_PRICE + DELIVERY_COST + DEPOSIT_COST;

        if (selectedOption === 'with') {
            newTotalPrice += INSTALLATION_COST;
        }

        setTotalPrice(newTotalPrice);
    };

    // Handle changes in land selection
    const handleLandChange = (e) => {
        setSelectedLand(e.target.value);
    };

    // Handle changes in city selection
    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
    };
    // Handle add to cart
    const handleAddToCart = (e) => {
        e.preventDefault();

        if(!product){
            alert('Produkt nicht gefunden');
            return;
        }

        if (installationOption === 'with' && (!selectedLand || !selectedCity)) {
            alert('Einbauort-Wahl unvollständig');
            return;
        }

        // Construct the cart item with selected options
        const cartItem = {
            productName: product.product_name,
            productImage: product.product_images?.[0] || 'beispielphoto.jpg',
            basePrice: formatPrice(BASE_PRICE  * (mwSt ? 1 : VAT_SHARE )),
            options: {
                // Aus- und Einbau bzw. Mit Einbau
                installation: productOptions.installation.isAvailable && installationOption === 'with'
                    ? {
                        label: productOptions.installation.label,
                        cost: formatPrice(productOptions.installation.cost  * (mwSt ? 1 : VAT_SHARE )),
                    }
                    : null,
                // Abholung bzw. Versand
                delivery: productOptions.delivery.isAvailable && deliveryDesired === 'yes'
                    ? {
                        label: productOptions.delivery.label,
                        cost: formatPrice(productOptions.delivery.cost * (mwSt ? 1 : VAT_SHARE )),
                    }
                    : null,
                // Kaution
                deposit: productOptions.deposit.isAvailable
                    ? {
                        label: productOptions.deposit.label,
                        cost: formatPrice(productOptions.deposit.cost * (mwSt ? 1 : VAT_SHARE )),
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
            landName: selectedLand ? lands.find((land) => parseInt(land.id, 10) === parseInt(selectedLand, 10))?.title : null,
            cityName: selectedCity ? cities.find((city) => parseInt(city.id, 10) === parseInt(selectedCity, 10))?.title : null,
            totalPrice: formatPrice(totalPrice * (mwSt ? 1 : VAT_SHARE )),
            totalPriceUnformatted: totalPrice * (mwSt ? 1 : VAT_SHARE ),
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
    };

    const productImages = product.product_images;

    return (
        <>
            {product && (
                <div className={"row g-0"}>
                    <h1 className={"pb-0 mb-0"}>{product.product_name} für {product.modell_liste}</h1>
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

                                    <div className={"col-sm-6"}>
                                        <div className={"row g-0 pt-3 pt-sm-0"}>
                                            <div className={"col"}>
                                                <p className={""}><strong>Hersteller: </strong> {product.hersteller}</p>
                                                <p><strong>Modell: </strong> {product.modell_liste} </p>
                                                <p><strong>Hubraum KW/PS: </strong> {product.hubraum_liste} </p>
                                                <p><strong>Bauzeit: </strong> {product.bauzeit_liste}</p>
                                                <p><strong>Bestellnr.:</strong> {product.bestellnr}</p>
                                                <p><strong>OE-Nummer:</strong> {product.oe_nummer}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                            <div className="w-100 pb-3"></div>
                            <div className="row g-0 ">
                                    <div className="col-12 product-info">
                                        <div>
                                            <span className={"gc-green display-1"}>{formatPrice(BASE_PRICE)}</span><span className={"ps-2"}>pro Stück {mwStWording}</span>
                                        </div>
                                        <div className={"w-100 pb-3"}></div>
                                        <p>Versand +{formatPrice(DELIVERY_COST)} {mwStWording}</p>
                                        <p>Kaution +{formatPrice(DEPOSIT_COST)} {mwStWording}</p>
                                        <p>Kaution wird nach Erhalt des schadlosen Rücknahmeteils storniert</p>
                                    </div>

                            {mwSt && (
                                <>
                                <div className={"w-100 pb-2"}></div>
                                    <div className="row g-0 ">
                                        <div className={"w-100"}>Mit Einbau:</div>
                                        <div className="col-sm-6">
                                            <Form.Select value={installationOption} onChange={handleInstallationChange}>
                                                <option value="with">Ja + {formatPrice(INSTALLATION_COST)}</option>
                                                <option value="without">Nein</option>
                                            </Form.Select>
                                        </div>
                                   </div>
                                </>
                            )}
                           {installationOption === 'with' && (
                                        <>
                                            <div className={"w-100 pb-2"}></div>
                                            <div className="row g-0 land-selection">
                                                <div className={"w-100 pb-0"}>Bitte wählen Sie Ihren gewünschten Einbauort:</div>
                                                <div className={"col-sm-6"}>
                                                    <Form.Select value={selectedLand} onChange={handleLandChange}>
                                                        <option value="">- Bundesland -</option>
                                                        {lands.map((land) => (
                                                            <option key={land.id} value={land.id}>
                                                                {land.title}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </div>
                                            </div>

                                            {selectedLand && (
                                                <>
                                                    <div className={"w-100 pb-2"}></div>
                                                    <div className="row g-0 city-selection">
                                                        <div className={"col-sm-6"}>
                                                            <Form.Select value={selectedCity} onChange={handleCityChange}>
                                                                <option value="">- Ort -</option>
                                                                {cities.map((city) => (
                                                                    <option key={city.id} value={city.id}>
                                                                        {city.title}
                                                                    </option>
                                                                    ))}
                                                            </Form.Select>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </>
                           )}

                                <div className="row g-0 total-price mt-3 pt-1">
                                    <div className={"display-3 gc-green"}>{getTotalPriceLabel()}: {formatPrice(totalPrice)}</div>
                                </div>
                            </div>
                            </div>
                            </>
                        )}
            </div>



            <div className="row g-0 p-4 pb-3">
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
