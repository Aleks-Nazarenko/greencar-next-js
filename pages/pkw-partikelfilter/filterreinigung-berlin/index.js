import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import { JOOMLA_API_BASE } from '@/utils/config';
import { JOOMLA_URL_BASE } from '@/utils/config';
import Pictos from "@/components/PictosBerlin";

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

export async function getStaticProps() {

    // Fetch the product details from the Joomla API
    const resProduct = await fetch(`${JOOMLA_API_BASE}&task=getProduct&product_id=14422&format=json`);
    const productData = await resProduct.json();
    const product = productData.product_id ? productData : null;
    if (!productData.product_id) {
        console.error("Invalid product data received:", productData);
    }
    const resInstall = await fetch(`${JOOMLA_API_BASE}&task=getProduct&product_id=8442&format=json`);
    const installData = await resInstall.json();
    const installation = installData.product_id ? installData : null;
    if (!installData.product_id) {
        console.error("Invalid product data received:", installData);
    }
    const resDelivery = await fetch(`${JOOMLA_API_BASE}&task=getProduct&product_id=8444&format=json`);
    const deliveryData = await resDelivery.json();
    const delivery = deliveryData.product_id ? deliveryData : null;
    if (!deliveryData.product_id) {
        console.error("Invalid product data received:", deliveryData);
    }

    const resArticle2 = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=10&format=json`);
    const articleData2 = await resArticle2.json();
    const article2 = articleData2.article || null;
    if (article2) {
        article2.content = article2.content ? convertRelativeUrls(article2.content, JOOMLA_URL_BASE) : '';
        if (!article2.content) {
            console.log('Filterreinigungsmaschinen not found');
        }
    }
    const resArticle3 = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=11&format=json`);
    const articleData3 = await resArticle3.json();
    const article3 = articleData3.article || null;
    if (article3) {
        article3.content = article3.content ? convertRelativeUrls(article3.content, JOOMLA_URL_BASE) : '';
        if (!article3.content) {
            console.log('PKW - Filterreinigung UNTEN not found');
        }
    }

    return {
        props: {
            product,
            installation,
            delivery,
            article2,
            article3,
        },
    };
}
export default function FilterreinigungPage({ product,installation, delivery, article2, article3 }) {
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
            return 'Preis mit Aus- und Einbau and Abholung';
        } else if (installationOption === 'without' && deliveryDesired === 'yes') {
            return 'Preis mit Abholung';
        } else {
            return 'Preis';
        }
    };
    // Utility function to format a date to "DD.MM.YYYY"
    const formatDateToGerman = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };
    // Utility function to determine the next valid day (skipping weekends)
    const getNextValidDay = (date) => {
        // If the date falls on Saturday (6) or Sunday (0), adjust it to the next Monday
        while (date.getDay() === 0 || date.getDay() === 6) {
            date.setDate(date.getDate() + 1);
        }
        return date;
    };

    const [selectedDeliveryPrice, setSelectedDeliveryPrice] = useState(null);
    const [selectedBasePrice, setSelectedBasePrice] = useState(null);
    const [selectedInstallPrice, setSelectedInstallPrice] = useState(null);

    const [totalPrice, setTotalPrice] = useState(selectedBasePrice + selectedDeliveryPrice + selectedInstallPrice);

    const [mwStWording, setMwStWording] = useState('');
    const [mwSt, setMwSt] = useState(null);

    const sortedDeliveryPrices = [...delivery.product_prices].sort((a, b) => Number(a.price_value) - Number(b.price_value));
    const sortedBasePrices = [...product.product_prices].sort((a, b) => Number(a.price_value) - Number(b.price_value));
    const sortedInstallPrices = [...installation.product_prices].sort((a, b) => Number(a.price_value) - Number(b.price_value));

    const VAT_SHARE = 1.19;

    useEffect(() => {
        if (delivery && product && installation) {
            // Adjust prices based on the presence of authToken
            const authToken = typeof window !== "undefined" && sessionStorage.getItem("authToken");

            if (authToken) {
                // User authenticated: Use smallest prices
                setSelectedDeliveryPrice(parseFloat(sortedDeliveryPrices[0].price_value));
                setSelectedBasePrice(parseFloat(sortedBasePrices[0].price_value));
                setSelectedInstallPrice(parseFloat(sortedInstallPrices[0].price_value));
                setTotalPrice((parseFloat(sortedBasePrices[0].price_value) + parseFloat(sortedDeliveryPrices[0].price_value)));
                setMwStWording('(ohne MwSt.)');
                setMwSt(false);
                setInstallationOption('without');
            } else {
                // User not authenticated: Use largest prices
                setSelectedDeliveryPrice(parseFloat(sortedDeliveryPrices[sortedDeliveryPrices.length - 1].price_value) * VAT_SHARE);
                setSelectedBasePrice(parseFloat(sortedBasePrices[sortedBasePrices.length - 1].price_value) * VAT_SHARE);
                setSelectedInstallPrice(parseFloat(sortedInstallPrices[sortedInstallPrices.length - 1].price_value) * VAT_SHARE);
                setTotalPrice((parseFloat(sortedBasePrices[sortedBasePrices.length - 1].price_value) * VAT_SHARE   + parseFloat(sortedInstallPrices[sortedInstallPrices.length - 1].price_value) * VAT_SHARE + parseFloat(sortedDeliveryPrices[sortedDeliveryPrices.length - 1].price_value) * VAT_SHARE ) );
                setMwStWording('(inkl. MwSt.)');
                setMwSt(true);
            }
        }
    }, [delivery, product, installation]);

    console.log(mwSt + ' mwSt');

    const BASE_PRICE = selectedBasePrice // Base product price
    const DELIVERY_COST = selectedDeliveryPrice; // Abholung
    const DEPOSIT_COST = 0; // Kaution
    const INSTALLATION_COST = selectedInstallPrice //  Aus- und Einbau
    // Product options configuration
    const productOptions = {
        installation: { //Aus- und Einbau bzw. Mit Einbau
            isAvailable: true,
            cost: selectedInstallPrice,
            label: "Aus- und Einbau",
            withoutLabel: "No Installation",
        },
        delivery: { //Abholung bzw. Versand
            isAvailable: true,
            cost: selectedDeliveryPrice,
            label: "Abholung",
        },
        deposit: { //Kaution
            isAvailable: false,
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
    const [selectedLand, setSelectedLand] = useState('Berlin');
    const [selectedCity, setSelectedCity] = useState('GREENCAR Berlin');
    const [deliveryDesired, setDeliveryDesired] = useState('yes'); // New state to track delivery selection
    const [selectedDate, setSelectedDate] = useState(() => {
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate());
        // Skip to Monday if tomorrow is a weekend
        if (tomorrow.getDay() === 6) {
            // If it's Saturday, add 2 days to get to Monday
            tomorrow.setDate(tomorrow.getDate() + 2);
        } else if (tomorrow.getDay() === 0) {
            // If it's Sunday, add 1 day to get to Monday
            tomorrow.setDate(tomorrow.getDate() + 1);
        }
        return tomorrow.toISOString().split('T')[0]; // Set initial date to tomorrow in "YYYY-MM-DD" format
    });
    const [nextDay, setNextDay] = useState(() => {
        let dayAfterTomorrow = new Date();
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate());
        dayAfterTomorrow = getNextValidDay(dayAfterTomorrow);
        return formatDateToGerman(dayAfterTomorrow); // Correctly format the initial value
    });


    // Handle changes in installation option
    const handleInstallationChange = (e) => {
        const selectedOption = e.target.value;
        setInstallationOption(selectedOption);

        // Update total price based on installation option
        let newTotalPrice = BASE_PRICE ;

        if (selectedOption === 'with') {
            newTotalPrice += INSTALLATION_COST + DELIVERY_COST;
            setDeliveryDesired('yes'); // Reset delivery desired to 'yes'
            setSelectedLand('Berlin'); // Reset land selection to Berlin
            setSelectedCity('GREENCAR Berlin'); // Reset city selection to GREENCAR Berlin
        } else {
            newTotalPrice += deliveryDesired === 'yes' ? DELIVERY_COST : 0;
            setSelectedLand(''); // Reset land selection to Berlin
            setSelectedCity(''); // Reset city selection to GREENCAR Berlin
        }

        setTotalPrice(newTotalPrice); console.log(newTotalPrice +' new total price');
    };

    // Handle changes in land selection
    const handleLandChange = (e) => {
        setSelectedLand(e.target.value);
    };

    // Handle changes in city selection
    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
    };
    // Handle changes in delivery desired selection
    const handleDeliveryChange = (e) => {
        const selectedDelivery = e.target.value;
        setDeliveryDesired(selectedDelivery);

        // Update total price based on delivery option
        let newTotalPrice = BASE_PRICE ;

        if (installationOption === 'with') {
            newTotalPrice += INSTALLATION_COST + DELIVERY_COST; // Installation always includes delivery cost
        } else {
            if (selectedDelivery === 'yes') {
                newTotalPrice += DELIVERY_COST;
            }
        }
        // Set selected date to null if delivery is not desired
        if (selectedDelivery === 'no') {
            setSelectedDate(null);
            setNextDay(null);
        } else {
            // Set initial date to tomorrow in "YYYY-MM-DD" format if delivery is desired
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate());
            if (tomorrow.getDay() === 6) {
                // If it's Saturday, add 2 days to get to Monday
                tomorrow.setDate(tomorrow.getDate() + 2);
            } else if (tomorrow.getDay() === 0) {
                // If it's Sunday, add 1 day to get to Monday
                tomorrow.setDate(tomorrow.getDate() + 1);
            }
            setSelectedDate(tomorrow.toISOString().split('T')[0]);

            // Set the next day after the selected date, skipping weekends
            let next = new Date(tomorrow);
            next.setDate(next.getDate());
            next = getNextValidDay(next);
            setNextDay(formatDateToGerman(next));
        }

        setTotalPrice(newTotalPrice);
    };
    // Handle changes in the selected date, excluding weekends
    const handleDateChange = (e) => {
        let selected = new Date(e.target.value);

        // If the selected date falls on a weekend, adjust it to the next valid weekday
        if (selected.getDay() === 0 || selected.getDay() === 6) {
            selected = getNextValidDay(selected);
        }

        setSelectedDate(selected.toISOString().split('T')[0]);

        // Set the next day after the selected date, skipping weekends
        let next = new Date(selected);
        next.setDate(selected.getDate());
        next = getNextValidDay(next);
        setNextDay(formatDateToGerman(next));
    };
    // Handle add to cart
    const handleAddToCart = (e) => {
        e.preventDefault();
        if (!product ) {
            alert("Das Produkt ist nicht verfügbar. Bitte versuchen Sie es später erneut.");
            return;
        }

        // Format selected date
        const formattedSelectedDate = selectedDate ? formatDateToGerman(new Date(selectedDate)) : null;
        // Construct the cart item with selected options
        const cartItem = {
            productName: product.product_name,
            productImage: product.product_images[0] || 'beispielphoto.jpg',
            basePrice: formatPrice(BASE_PRICE * (mwSt ? 1 : VAT_SHARE )),
            options: {
                // Aus- und Einbau
                installation: productOptions.installation.isAvailable && installationOption === 'with'
                    ? {
                        label: productOptions.installation.label,
                        cost: formatPrice(productOptions.installation.cost  * (mwSt ? 1 : VAT_SHARE )),
                    }
                    : null,
                // Abholung
                delivery: productOptions.delivery.isAvailable && deliveryDesired === 'yes'
                    ? {
                        label: productOptions.delivery.label,
                        cost: formatPrice(productOptions.delivery.cost  * (mwSt ? 1 : VAT_SHARE )),
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
            landName: selectedLand ? selectedLand : null,
            cityName: selectedCity ? selectedCity : null,
            totalPrice: formatPrice(totalPrice  * (mwSt ? 1 : VAT_SHARE )),
            totalPriceUnformatted: totalPrice  * (mwSt ? 1 : VAT_SHARE ),
            vatShare: VAT_SHARE,
            selectedDate: formattedSelectedDate, // set null wenn nicht verfügbar
            nextDay: nextDay, // set null wenn nicht verfügbar
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
            {product && (
                <div className="row g-0 pb-4">
                    <h1 className={"mb-1"}>{product.product_name}</h1>
                    <h2 className={"display-4 mb-0"}>9h Expressreinigung von der Abholung bis zur Zustellung</h2>
                </div>
            )}
            <div className="row g-0">
                <div className="col-sm-8">
                    <div className="row g-0 p-3 p-sm-4 product-detail-view rounded-4">
                        {product && (
                            <div className="col">
                                <div className="row g-0 ">
                                    <div className="col-12 product-image pb-3">
                                        <ProductImage
                                            className={"img-fluid"}
                                            src={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/${product.product_images[0]}`}
                                            alt={product.product_name}
                                            fallback={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/beispielphoto.jpg`}
                                        />
                                    </div>
                                    <div className="col-12 product-info">
                                        <div>
                                            <span className={"gc-green display-1"}>{formatPrice(BASE_PRICE)}</span><span className={"ps-2"}>pro Stück {mwStWording}</span>
                                        </div>
                                        {mwSt && (
                                            <div className="col-12 col-sm-6 btn-haendlerpreis pt-2">
                                                <Link href={`/pkw-partikelfilter/pkw-filterreinigung/anfrage-haendlerpreis`}>
                                                    <button className="btn btn-primary btn-yellow w-100">Anfrage Händlerpreis</button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    {installationOption === 'with' && <div className={"col-12 pt-2"}>Abholung: {formatPrice(DELIVERY_COST)} {mwStWording}</div>}
                                </div>
                                {mwSt && (
                                    <div className="row g-0 installation-options pt-2">
                                        <div className={"w-100"}>Aus und Einbau</div>
                                        <select value={installationOption} onChange={handleInstallationChange} className={"form-select"} aria-label=".form-select">
                                            <option value="with">GREENCAR Werkstatt ( + {formatPrice(INSTALLATION_COST)} {mwStWording} )</option>
                                            <option value="without">eigene Werkstatt</option>
                                        </select>
                                    </div>
                                )}

                                {installationOption === 'without' && (
                                    <div className="row g-0 delivery-options pt-2">
                                        <div className={"w-100"}>Stadtkurier gewünscht?</div>
                                        <select value={deliveryDesired} onChange={handleDeliveryChange} className={"form-select"} aria-label=".form-select">
                                            <option value="yes">Ja ( + {formatPrice(DELIVERY_COST)} {mwStWording} )</option>
                                            <option value="no">Nein</option>
                                        </select>
                                    </div>
                                )}

                                {installationOption === 'with' && (
                                    <>
                                        <div className={"row g-0 pt-2"}>
                                            <div className="land-selection">
                                                <select value={selectedLand} onChange={handleLandChange} className={"form-select"} aria-label=".form-select">
                                                    <option value="Berlin">- Berlin -</option>
                                                </select>
                                            </div>
                                        </div>


                                            <div className="row g-0 pt-2 city-selection">
                                                <select value={selectedCity} onChange={handleCityChange} className={"form-select"} aria-label=".form-select">
                                                    <option value="">- GREENCAR Berlin -</option>
                                                </select>
                                            </div>

                                    </>
                                )}
                                {deliveryDesired === 'yes' && (
                                    <div className=" row g-0 bg-white rounded-4 p-3 mt-4 date-selection">
                                        <div className={"display-4 pb-2"}>9h Express-Service Rechner!</div>

                                        <div className={"col-12"}>Abholdatum des ausgebauten Partikelfilters:</div>
                                        <div className={"col-sm-6 col-12"}>
                                            <input
                                                type="date"
                                                value={selectedDate || ''}
                                                onChange={handleDateChange}
                                                min={new Date().toISOString().split('T')[0]}
                                                className={"form-control"} aria-label="form-date"
                                            />
                                        </div>
                                        <div>bis 9:00 Uhr</div>
                                        <div className={"w-100 pb-2"}> </div>

                                        <div className="col-sm-6 col-12 next-day">
                                            <div>Zustellung des gereinigten Partikelfilters</div>
                                            <input type="text" value={nextDay || ''} readOnly className={"form-control"} aria-label="form-input"/>
                                            <div>bis 18:00 Uhr garantiert!</div>

                                        </div>
                                    </div>
                                )}
                                <div className="row g-0 total-price mt-4">
                                    <div className={"display-3 gc-green"}>{getTotalPriceLabel()}: {formatPrice(totalPrice)}</div>
                                </div>

                            </div>
                        )}
                    </div>
                    <div className="row g-0 p-4 pb-3">
                        <div className={"col col-sm-6"}>
                            <Link href={`/anfrage`}>
                                <button className="btn btn-primary btn-yellow btn-100">Unverbindliches Angebot anfordern</button>
                            </Link>
                        </div>
                    </div>
                    <div className="row g-0 p-4 pt-3">
                        <div className={"col col-sm-6"}>
                            <button className="btn btn-primary btn-green btn-100" onClick={handleAddToCart}>
                                In den Warenkorb
                            </button>
                        </div>
                    </div>
                </div>
                <div className={"col-sm-4  text-center text-sm-end"}>
                    <Pictos />
                </div>
            </div>
            <div className={"w-100 pt-4"}></div>
            <div className={"row g-0 bg-white rounded-4 p-4"} style={{border:"1px solid green"}}>
                <div className={"col d-flex justify-content-center overflow-hidden"}>
                    <iframe src="https://widgets.shopvote.de/bs-widget.php?shopid=8694"  scrolling={'no'} style={{ position: "relative", height: "280px", width:"100%", maxWidth: "300px", borderStyle: "none", overflow: "hidden"} } ></iframe>
                </div>
            </div>
            <div className={"w-100 pb-4 pt-2"}></div>
            <div className={"row g-0"}>
                <div className={"col"}>
                    {article2?.content && (
                        <div dangerouslySetInnerHTML={{ __html: article2.content}} />
                    )}
                </div>
            </div>
            <div className={"w-100 pb-4 pt-2"}></div>
            <div className={"row g-0"}>
                <div className={"col"}>
                    {article3?.content && (
                        <div dangerouslySetInnerHTML={{ __html: article3.content}} />
                    )}
                </div>
            </div>

        </>
    );
}
