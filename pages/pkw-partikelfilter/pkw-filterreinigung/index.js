import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import { JOOMLA_API_BASE } from '@/utils/config';
import { JOOMLA_URL_BASE } from '@/utils/config';

export async function getStaticProps() {
    // Base URL of your Joomla server (adjust this to your Joomla installation URL)
    const joomlaBaseUrl = JOOMLA_URL_BASE;
    // Extract product ID from `product-id-name`

    // Fetch the product details from the Joomla API
    const res = await fetch(`${JOOMLA_API_BASE}&task=getProduct&product_id=14435&format=json`);
    const productData = await res.json();
    const product = productData.product_id ? productData : null;
    if (!productData.product_id) {
        console.error("Invalid product data received:", productData);
    }

    // Fetch data for the footer from Joomla API
    const resFooter = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=244&format=json`);
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
export default function FilterreinigungPage({ product, footerArticle }) {
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
            date.setDate(date.getDate() + 2);
        }
        return date;
    };

    const BASE_PRICE = 359.00; // Base product price
    const DELIVERY_COST = 47.36; // Abholung
    const DEPOSIT_COST = 0; // Kaution
    const INSTALLATION_COST = 240.00; //  Aus- und Einbau
    const VAT_SHARE = 1.19; // VAT share
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
    const [selectedLand, setSelectedLand] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [lands, setLands] = useState([]);
    const [cities, setCities] = useState([]);
    const [deliveryDesired, setDeliveryDesired] = useState('yes'); // New state to track delivery selection
    const [totalPrice, setTotalPrice] = useState(BASE_PRICE + DELIVERY_COST  + INSTALLATION_COST);
    const [selectedDate, setSelectedDate] = useState(() => {
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
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
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 3);
        dayAfterTomorrow = getNextValidDay(dayAfterTomorrow);
        return formatDateToGerman(dayAfterTomorrow); // Correctly format the initial value
    });
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
        let newTotalPrice = BASE_PRICE ;

        if (selectedOption === 'with') {
            newTotalPrice += INSTALLATION_COST + DELIVERY_COST;
            setDeliveryDesired('yes'); // Reset delivery desired to 'yes'
        } else {
            newTotalPrice += deliveryDesired === 'yes' ? DELIVERY_COST : 0;
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
            tomorrow.setDate(tomorrow.getDate() + 1);
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
            next.setDate(next.getDate() + 2);
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
        next.setDate(selected.getDate() + 2);
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

        if (installationOption === 'with' && (!selectedLand || !selectedCity)) {
            alert('Einbauort-Wahl unvollständig');
            return;
        }
        // Format selected date
        const formattedSelectedDate = selectedDate ? formatDateToGerman(new Date(selectedDate)) : null;
        // Construct the cart item with selected options
        const cartItem = {
            productName: product.product_name,
            basePrice: formatPrice(BASE_PRICE),
            options: {
                // Aus- und Einbau
                installation: productOptions.installation.isAvailable && installationOption === 'with'
                    ? {
                        label: productOptions.installation.label,
                        cost: formatPrice(productOptions.installation.cost),
                    }
                    : null,
                // Abholung
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
            <main>
                <div className="container-fluid container-greencar">
                    <div className="row g-0 p-4">
                        {product && (
                            <div className="col">
                                <div className="row g-0">
                                    <h1>{product.product_name}</h1>
                                    <p>48h Expressreinigung von der Abholung bis zur Zustellung</p>
                                    <p>Price: {formatPrice(product.price_value)}</p>
                                    {/* Additional product details */}
                                </div>
                                <div className="row g-0 ">
                                    <div className="product-info">
                                        <p>{formatPrice(BASE_PRICE)} pro Stück (inkl. MwSt.)</p>
                                        {installationOption === 'with' && <p>Abholung: {formatPrice(DELIVERY_COST)}</p>}
                                    </div>

                                    <div className="installation-options">
                                        <div>Aus und Einbau</div>
                                        <select value={installationOption} onChange={handleInstallationChange}>
                                            <option value="with">GREENCAR Werkstatt ( + {formatPrice(INSTALLATION_COST)} (inkl. MwSt.) )</option>
                                            <option value="without">eigene Werkstatt</option>
                                        </select>
                                    </div>
                                    {installationOption === 'without' && (
                                        <div className="delivery-options">
                                            <div>Abholung gewünscht?</div>
                                            <select value={deliveryDesired} onChange={handleDeliveryChange}>
                                                <option value="yes">Ja ( + {formatPrice(DELIVERY_COST)} (inkl. MwSt.) )</option>
                                                <option value="no">Nein</option>
                                            </select>
                                        </div>
                                    )}

                                    {installationOption === 'with' && (
                                        <>
                                            <div>Bitte wählen Sie Ihren gewünschten Einbauort.</div>
                                            <div className="land-selection">
                                                <select value={selectedLand} onChange={handleLandChange}>
                                                    <option value="">- Bundesland -</option>
                                                    {lands.map((land) => (
                                                        <option key={land.id} value={land.id}>
                                                            {land.title}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {selectedLand && (
                                                <div className="city-selection">
                                                    <select value={selectedCity} onChange={handleCityChange}>
                                                        <option value="">- Ort -</option>
                                                        {cities.map((city) => (
                                                            <option key={city.id} value={city.id}>
                                                                {city.title}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {deliveryDesired === 'yes' && (
                                        <>
                                            <div className="date-selection">
                                                <div>48h Express-Service Rechner!</div>

                                                <div>Abholdatum des ausgebauten Partikelfilters:</div>
                                                    <input
                                                        type="date"
                                                        value={selectedDate || ''}
                                                        onChange={handleDateChange}
                                                        min={new Date().toISOString().split('T')[0]}
                                                    />
                                                <div>bis 16:00 Uhr</div>
                                            </div>

                                            <div className="next-day">
                                                <div>Zustellung des gereinigten Partikelfilters</div>
                                                <input type="text" value={nextDay || ''} readOnly />
                                                <div>bis 12:00 Uhr garantiert!</div>

                                            </div>
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
