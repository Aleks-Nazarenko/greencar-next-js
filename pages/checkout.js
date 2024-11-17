import { useEffect, useState } from 'react';
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";

export async function getStaticProps({ params }) {
    // Base URL of your Joomla server (adjust this to your Joomla installation URL)
    const joomlaBaseUrl = 'https://joomla2.nazarenko.de';

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
            footerArticle,
        },
    };
}
export default function CheckoutPage({footerArticle }) {
    const [cartItem, setCartItem] = useState(null);
    const [productOptions, setProductOptions] = useState(null);
    const [address, setAddress] = useState({
        fullName: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phoneNumber: '',
        email: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('pay-on-delivery');

    useEffect(() => {
        const cartData = JSON.parse(localStorage.getItem('cart'));
        const optionsData = JSON.parse(localStorage.getItem('productOptions'));
        console.log(cartData);
        console.log(optionsData);
        if (cartData) {
            setCartItem(cartData);
        }
        if (optionsData) {
            setProductOptions(optionsData);
        }
    }, []);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }));
    };

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!cartItem) {
            alert('Your cart is empty!');
            return;
        }

        // Process the order
        console.log('Order Details:', {
            cartItem,
            address,
            paymentMethod,
        });

        alert('Order has been placed successfully!');
    };
// Function to calculate advance payment cost
    const calculateAdvancePayment = (totalPrice, percentage) => {
        // Remove non-numeric characters from the total price (e.g., '€', commas, dots)
        const cleanPrice = parseFloat(totalPrice);
        // Calculate the advance payment as a percentage of the cleaned price
        const advancePayment = (cleanPrice / 100) * percentage;
        return advancePayment.toFixed(2); // Return the advance payment formatted to 2 decimal places
    };
    const calculateRemainingAmount   = (totalPrice, advancePayment) => {
        const cleanPrice = parseFloat(totalPrice);
        const cleanAdvancePayment = parseFloat(advancePayment);
        const remainingAmount = cleanPrice - cleanAdvancePayment;
        return remainingAmount.toFixed(2);
    }
    const formatPrice = (price) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
        }).format(price);
    };

    return (
        <>
            <main>
                <div className="container-fluid container-greencar">
                    <h1>Checkout Page</h1>

                    {/* Cart Section */}
                    <section>
                        <h2>Cart</h2>
                        {cartItem ? (
                            <>
                                <div className="cart-item">
                                    <p><strong>Product:</strong> {cartItem.productName}</p>
                                    <p><strong>Price:</strong> {cartItem.basePrice}</p>
                                    {/* Conditionally render available options */}
                                    {productOptions?.deposit?.isAvailable && (
                                        <div><strong>{cartItem.options.deposit.label}:</strong> {cartItem.options.deposit.cost}</div>
                                    )}
                                    {productOptions?.installation?.isAvailable && cartItem.options.installation &&(
                                        <div><strong>{cartItem.options.installation.label}:</strong> {cartItem.options.installation.cost}</div>
                                    )}
                                    {productOptions?.delivery?.isAvailable && cartItem.options.delivery && (
                                        <p><strong>{cartItem.options.delivery.label}:</strong> {cartItem.options.delivery.cost}</p>

                                    )}
                                    {cartItem.selectedDate && (
                                        <>
                                            <p><strong>Abholdatum des ausgebauten Partikelfilters:</strong> {cartItem.selectedDate}</p>
                                            <p><strong>Zustellung des gereinigten Partikelfilters:</strong> {cartItem.nextDay}</p>
                                        </>
                                    )}
                                    <p><strong>Total Price:</strong> {cartItem.totalPrice}</p>

                                    {productOptions?.installation?.isAvailable && cartItem.options.installation && (
                                        <div>Anteil <b>Vorauszahlung*</b> für Produkte mit Einbau {formatPrice(calculateAdvancePayment(cartItem.totalPriceUnformatted, productOptions.advancePayment.cost))}</div>
                                    )}
                                </div>
                                {/* Restbetrag wenn Vorauszahlung */}
                                {productOptions?.installation?.isAvailable && cartItem.options.installation && (
                                    <div className="cart-item restbetrag">
                                        <div>
                                            * Vorauszahlung:

                                            Die Vorauszahlung bei Produkten mit Einbau: 10% des Produktpreises bei Pkw und 20% bei LKW.
                                            Den Restbetrag entrichten Sie bitte nach Einbau direkt an die von Ihnen gewählte Einbau-Werkstatt.
                                        </div>
                                        <div>
                                            Restbetrag: {formatPrice(calculateRemainingAmount(cartItem.totalPriceUnformatted, calculateAdvancePayment(cartItem.totalPriceUnformatted, productOptions.advancePayment.cost)))}
                                        </div>
                                    </div>
                                )}
                                {/* Land and City if available */}
                                {productOptions?.installation?.isAvailable && cartItem.options.installation && (
                                    <div className="cart-item cart-werkstatt">
                                        Ihre Werkstatt: {cartItem.cityName} <br/>
                                        (Genaue Angabe folgt, wir setzen uns nach Abschluss der Bestellung mit Ihnen in Verbindung.)

                                    </div>
                                )}
                            </>
                        ) : (
                            <p>Your cart is empty</p>
                        )}
                    </section>

                    {/* Address Section */}
                    <section>
                        <h2>Shipping Address</h2>
                        <form onSubmit={handleSubmit}>
                            {/* Address Form Fields */}
                            <div className="address-section">
                                {/* Form input fields */}
                            </div>

                            {/* Payment Section */}
                            <h2>Payment</h2>
                            <div className="payment-section">
                                <label>
                                    Payment Method:
                                    <select value={paymentMethod} onChange={handlePaymentChange}>
                                        <option value="pay-on-delivery">Pay on Delivery</option>
                                        <option value="credit-card">Credit Card</option>
                                    </select>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button type="submit">Place Order</button>
                        </form>
                    </section>
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
