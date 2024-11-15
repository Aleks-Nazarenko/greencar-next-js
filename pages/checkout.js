import { useEffect, useState } from 'react';

export default function CheckoutPage() {
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
        <div>
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
                                <div><strong>{productOptions.deposit.label}:</strong> {cartItem.options.deposit}</div>
                            )}
                            {productOptions?.installation?.isAvailable && cartItem.options.installation &&(
                                <div><strong>{cartItem.options.installation.label}:</strong> {cartItem.options.installation.cost}</div>
                            )}
                            {productOptions?.delivery?.isAvailable && cartItem.options.delivery && (
                                <p><strong>{productOptions.delivery.label}:</strong> {cartItem.options.delivery.cost}</p>

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
    );
}
