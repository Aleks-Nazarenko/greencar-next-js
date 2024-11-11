import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";

export async function getStaticProps() {
    // Base URL of your Joomla server (adjust this to your Joomla installation URL)
    const joomlaBaseUrl = 'https://joomla2.nazarenko.de';
    // Extract product ID from `product-id-name`

    // Fetch the product details from the Joomla API
    const res = await fetch(`https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=getProduct&product_id=14435&format=json`);
    const product = await res.json();

    // Fetch data for the footer from Joomla API
    const resFooter = await fetch('https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=articleWithModules&id=2&format=json');
    const footerData = await resFooter.json();
    // Extract the footer article from the response
    const footerArticle = footerData.article || null;

    // Convert relative URLs in the footer content to absolute URLs
    if (footerArticle && footerArticle.introtext) {
        footerArticle.introtext = convertRelativeUrls(footerArticle.introtext, joomlaBaseUrl);
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
            date.setDate(date.getDate() + 1);
        }
        return date;
    };

    const BASE_PRICE = 359.00; // Base product price
    const DELIVERY_COST = 47.36; // Delivery cost
    const INSTALLATION_COST = 240.00; // Cost for installation

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
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
        dayAfterTomorrow = getNextValidDay(dayAfterTomorrow);
        return formatDateToGerman(dayAfterTomorrow); // Correctly format the initial value
    });
    // Fetch lands when the component loads
    useEffect(() => {
        const fetchLands = async () => {
            try {
                const response = await fetch('https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=getLands&format=json');
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
                    const response = await fetch(`https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=getCities&land_id=${selectedLand}&format=json'`);
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
        next.setDate(selected.getDate() + 1);
        next = getNextValidDay(next);
        setNextDay(formatDateToGerman(next));
    };

    return (
        <>
            <main>
                <div className="container-fluid container-greencar">
                    <div className="row g-0 p-4">
                        <h1>{product.product_name}</h1>
                        <p>48h Expressreinigung von der Abholung bis zur Zustellung</p>
                        <p>Price: ${product.price_value}</p>
                        {/* Additional product details */}
                    </div>
                    <div className="row g-0 p-4">
                        <div className="product-info">
                            <p>{formatPrice(BASE_PRICE)} pro Stück (inkl. MwSt.)</p>
                            {installationOption === 'with' && <p>Abholung: {formatPrice(DELIVERY_COST)}</p>}
                        </div>

                        <div className="installation-options">
                            <label>
                                Aus und Einbau
                                <select value={installationOption} onChange={handleInstallationChange}>
                                    <option value="with">GREENCAR Werkstatt ( + {formatPrice(INSTALLATION_COST)} (inkl. MwSt.) )</option>
                                    <option value="without">eigene Werkstatt</option>
                                </select>
                            </label>
                        </div>
                        {installationOption === 'without' && (
                            <div className="delivery-options">
                                <label>
                                    Abholung gewünscht?
                                    <select value={deliveryDesired} onChange={handleDeliveryChange}>
                                        <option value="yes">Ja ( + {formatPrice(DELIVERY_COST)} (inkl. MwSt.) )</option>
                                        <option value="no">No</option>
                                    </select>
                                </label>
                            </div>
                        )}

                        {installationOption === 'with' && (
                            <>
                                <div>Bitte wählen Sie Ihren gewünschten Einbauort.</div>
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
                        <div className="date-selection">
                            <div>48h Express-Service Rechner!</div>

                            <div>Abholdatum des ausgebauten Partikelfilters:</div>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            <div>bis 16:00 Uhr</div>
                        </div>

                        <div className="next-day">
                            <div>Zustellung des gereinigten Partikelfilters</div>
                            <input type="text" value={nextDay} readOnly />
                            <div>bis 12:00 Uhr garantiert!</div>

                        </div>
                        <div className="total-price">
                            <h2>{getTotalPriceLabel()}: {formatPrice(totalPrice)}</h2>
                        </div>
                    </div>
                    <div className="row g-0 p-4">
                        <Link href={`/anfrage`}>
                            <button className="btn btn-primary">Unverbindliches Angebot anfordern</button>
                        </Link>
                    </div>
                </div>
            </main>
            <footer>
                <div className="container-fluid container-footer container-greencar">
                    <div className="row g-0 p-4">
                        <div dangerouslySetInnerHTML={{ __html: footerArticle.introtext}} />
                    </div>
                </div>
            </footer>
        </>
    );
}
