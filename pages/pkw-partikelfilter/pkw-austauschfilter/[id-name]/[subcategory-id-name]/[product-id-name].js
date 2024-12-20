import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { JOOMLA_API_BASE } from '@/utils/config';
import { JOOMLA_URL_BASE } from '@/utils/config';
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
                            paths.push({
                                params: {
                                    "id-name": `${category.category_id}-${category.category_name.toLowerCase().replace(/\s+/g, '-')}`,
                                    "subcategory-id-name": `${subcategory.category_id}-${subcategory.category_name.toLowerCase().replace(/\s+/g, '-')}`,
                                    "product-id-name": `${product.product_id}-${product.product_name.toLowerCase().replace(/\s+/g, '-')}`,
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
    const res = await fetch(`${JOOMLA_API_BASE}&task=getProduct&product_id=${productId}&format=json`);
    const productData = await res.json();
    const product = productData.product_name ? productData : null;
    if (!productData.product_name) {
        console.error("Invalid product data received:", productData);
    }
    // Fetch data for the footer from Joomla API
    const resFooter = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=2&format=json`);
    const footerData = await resFooter.json();
    // Extract the footer article from the response
    const footerArticle = footerData.article || null;
    // Convert relative URLs in the footer content to absolute URLs
    if (footerArticle) {
        footerArticle.introtext = footerArticle.introtext ? convertRelativeUrls(footerArticle.introtext, joomlaBaseUrl) : '';
        if (!footerArticle.introtext) {
            console.log('footerArticle.introtext not found');
        }
    }

    return {
        props: {
            product,
            footerArticle,
        },
    };
}

export default function ProductPage({ product, footerArticle }) {
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
    const BASE_PRICE = 449.00; // Base product price
    const DELIVERY_COST = 29.75; // Versand
    const DEPOSIT_COST = 523.60; // Kaution
    const INSTALLATION_COST = 226.10; // Einbau
    const VAT_SHARE = 1.19; // MwSt.
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
    const [totalPrice, setTotalPrice] = useState(BASE_PRICE + DELIVERY_COST + DEPOSIT_COST + INSTALLATION_COST);

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
            productImage: product.product_image,
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
                delivery: productOptions.delivery.isAvailable && deliveryDesired === 'yes'
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
            landName: selectedLand ? lands.find((land) => parseInt(land.id, 10) === parseInt(selectedLand, 10))?.title : null,
            cityName: selectedCity ? cities.find((city) => parseInt(city.id, 10) === parseInt(selectedCity, 10))?.title : null,
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
    };

    return (
        <>
            <main>
                <div className="container-fluid container-greencar">
                    <div className="row g-0 p-4">
                        {product && (
                            <div className={"col"}>
                                <div className={"row g-0"}>
                                    <h1>{product.product_name}</h1>
                                    <p>
                                        <ProductImage
                                            className={"img-fluid"}
                                            src={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/${product.product_image}`}
                                            alt={product.product_name}
                                            fallback={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/beispielphoto.jpg`}
                                        />
                                    </p>
                                    <p>{product.product_description}</p>
                                    <p>Price: {formatPrice(product.price_value)}</p>
                                    {/* Additional product details */}
                                </div>
                                <div className="row g-0 p-4">
                                    <div className="product-info">
                                        <p>{formatPrice(BASE_PRICE)} pro Stück (inkl. MwSt.)</p>
                                        <p>Versand +{formatPrice(DELIVERY_COST)} (inkl. MwSt.)</p>
                                        <p>Kaution +{formatPrice(DEPOSIT_COST)} (inkl. MwSt.)</p>
                                        <p>Kaution wird nach Erhalt des schadlosen Rücknahmeteils storniert</p>
                                    </div>

                                    <div className="installation-options">
                                        <label>
                                            Mit Einbau:
                                            <select value={installationOption} onChange={handleInstallationChange}>
                                                <option value="with">Ja + {formatPrice(INSTALLATION_COST)}</option>
                                                <option value="without">Nein</option>
                                            </select>
                                        </label>
                                    </div>
                                    {installationOption === 'with' && (
                                        <>
                                            <div className="land-selection">
                                                <label>
                                                    Select Land:
                                                    <select value={selectedLand} onChange={handleLandChange}>
                                                        <option value="">- Bundesland -</option>
                                                        {lands.map((land) => (
                                                            <option key={land.id} value={land.id}>
                                                                {land.title}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </label>
                                            </div>

                                            {selectedLand && (
                                                <div className="city-selection">
                                                    <label>
                                                        Select City:
                                                        <select value={selectedCity} onChange={handleCityChange}>
                                                            <option value="">- Ort -</option>
                                                            {cities.map((city) => (
                                                                <option key={city.id} value={city.id}>
                                                                    {city.title}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </label>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <div className="total-price">
                                        <h2>{getTotalPriceLabel()}: {formatPrice(totalPrice)}</h2>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="row g-0 p-4">
                        <Link href={`/anfrage`}>
                            <button className="btn btn-primary">Unverbindliches Angebot anfordern</button>
                        </Link>
                    </div>
                    <div className="row g-0 p-4">
                        <button className="btn btn-primary" type="button" onClick={handleAddToCart}>
                            In den Warenkorb
                        </button>
                    </div>
                    <div className="row g-0 p-4">
                        <button onClick={() => router.back()} className="btn btn-primary">Zurück zur Listenansicht</button>
                    </div>
                </div>
            </main>
            <footer>
                <div className="container-fluid container-footer container-greencar">
                    <div className="row g-0 p-4">
                        {footerArticle?.introtext && (
                            <div dangerouslySetInnerHTML={{ __html: footerArticle.introtext}} />
                        )}
                    </div>
                </div>
            </footer>
        </>
    );
}
