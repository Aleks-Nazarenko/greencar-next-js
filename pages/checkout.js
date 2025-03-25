import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {JOOMLA_URL_BASE} from "@/utils/config";


function ProductImage({ src, alt, fallback }) {
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setImgSrc(src); // If the image loads, keep the original src
        img.onerror = () => setImgSrc(fallback); // If the image fails to load, use fallback
    }, [src, fallback]);

    return (
        <img src={imgSrc} alt={alt}  />
    );
}

export default function CheckoutPage() {
    const [cartItem, setCartItem] = useState(null);
    const [productOptions, setProductOptions] = useState(null);
    const [vatShare, setVatShare] = useState(0); // State to store the VAT share
    const [displayTotalPrice, setDisplayTotalPrice] = useState(0); // Total price to display
    const [validated, setValidated] = useState(false);
    const [errorEmail, setErrorEmail] = useState('');
    const [billingAddress, setBillingAddress] = useState({
        salutation: 'Herr',
        fullName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        firma: '',
        zipCode: '',
    });
    const [shippingAddress, setShippingAddress] = useState({
        salutation: 'Herr',
        fullName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        firma: '',
        zipCode: '',
    });
    const [sameAsBilling, setSameAsBilling] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('advance-payment');
    const router = useRouter();


    useEffect(() => {
        const cartData = JSON.parse(sessionStorage.getItem('cart'));
        const optionsData = JSON.parse(sessionStorage.getItem('productOptions'));
        if (cartData && optionsData){
            setCartItem(cartData);
            setProductOptions(optionsData);
            // Calculate VAT share
            const totalPriceUnformatted = cartData.totalPriceUnformatted || 0;
            let calculatedTotalPrice = totalPriceUnformatted;
            if (optionsData.installation?.isAvailable && cartData.options.installation) {
                // Calculate advance payment based on total price and advance payment percentage
                calculatedTotalPrice = calculateAdvancePayment(totalPriceUnformatted, optionsData.advancePayment.cost);
                cartData.advancePayment = calculatedTotalPrice;
                cartData.remainingAmount = formatPrice(calculateRemainingAmount(totalPriceUnformatted, calculatedTotalPrice));
            }else{
                cartData.advancePayment = null;
                cartData.remainingAmount = null;
            }
            setDisplayTotalPrice(calculatedTotalPrice);
            const netPrice = calculatedTotalPrice / cartData.vatShare; // Calculate net price
            const calculatedVatShare = calculatedTotalPrice - netPrice; // VAT is the difference
            setVatShare(calculatedVatShare);
            cartData.vatShare = calculatedVatShare ? formatPrice(calculatedVatShare) : null;
        }
        //preserve the form field values
        const savedDetails = JSON.parse(sessionStorage.getItem("checkoutDetails"));
        if (savedDetails) {
            setBillingAddress(savedDetails.billingAddress || {});
            setShippingAddress(savedDetails.shippingAddress || {});
            setSameAsBilling(JSON.stringify(savedDetails.billingAddress) === JSON.stringify(savedDetails.shippingAddress));
            setPaymentMethod(savedDetails.paymentMethod || "advance-payment");
        }
        const storedUser = typeof window !== "undefined" && sessionStorage.getItem("user");
        const authToken = typeof window !== "undefined" && sessionStorage.getItem("authToken");
        if(!savedDetails && (storedUser && authToken)){
            const user = JSON.parse(storedUser);
            // Update billingAddress with user data
            setBillingAddress({
                fullName: user.name || "",
                email: user.email || "",
                phone: "", // Add phone if it's part of the user object, otherwise leave it empty
                street: user.strasse || "",
                city: user.ort || "",
                firma: user.firma || "",
                zipCode: user.plz || "",
                anrede: user.anrede || "Herr",
            });
        }
    }, []);

    const validateEmail = (value) => {
        const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;
        if (!strictEmailRegex.test(value)) {
            setErrorEmail("Ihre E-Mail-Adresse ist ungültig");
            return false;  // Invalid email
        } else {
            setErrorEmail("");
            return true;  // Valid email
        }
    };
    // Handle changes for shipping address fields
    const handleShippingAddressChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle changes for billing address fields
    const handleBillingAddressChange = (e) => {
        const { name, value } = e.target;
        setBillingAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (name === "email") {
            validateEmail(value); // Check validation on every keystroke
        }
    };

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);

    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!cartItem) {
            alert('Ihr Warenkorb is leer!');
            return;
        }
        const form = event.currentTarget;
        if (form.checkValidity() === false || !validateEmail(billingAddress.email)) {
            event.stopPropagation();
            setValidated(true);
            return;
        }
        // Save data to sessionStorage for Step 2
        sessionStorage.setItem(
            "checkoutDetails",
            JSON.stringify({
                cartItem,
                billingAddress,
                shippingAddress: sameAsBilling ? billingAddress : shippingAddress,
                paymentMethod,
            })
        );

        // Navigate to Step 2
        router.push("/checkout-2");

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
            <div className={"row g-0"}>
                <h1 className={"pb-0 mb-0"}>Kasse</h1>
            </div>
            <div className="w-100 pb-4"></div>
            <div className="row g-0">

                <div className="col">
                        {cartItem ? (
                            <>
                                {/* Cart Section */}
                                <section>

                                    <div className="row g-0 p-3 p-sm-4 product-detail-view rounded-4">
                                        <div className={"col"}>
                                            <div className={"row g-0"}>
                                                <h2 className={"mb-3"}>Warenkorb</h2>
                                            </div>
                                            <div className={"row "}>
                                                <div className={"col-sm-6"}>
                                                    <div className={"row g-0"}>
                                                        {cartItem.productName.toLowerCase().includes('filterreinigung')? (
                                                            <ProductImage
                                                                src={`${JOOMLA_URL_BASE}/images/Filterreinigung-PKW-LKW-BUS-2.jpg`}
                                                                alt={cartItem.productName}
                                                                fallback={`${JOOMLA_URL_BASE}/images/Filterreinigung-PKW-LKW-BUS-2.jpg`}
                                                            />
                                                        ) : (
                                                            <ProductImage
                                                                src={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/${cartItem.productImage}`}
                                                                alt={cartItem.productName}
                                                                fallback={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/beispielphoto.jpg`}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={"col-sm-6"}>
                                                    <div className={"w-100 pb-3 pb-sm-0"}></div>
                                                    <div className="cart-item">
                                                        <p><strong>Produkt:</strong> {cartItem.productName}</p>
                                                        <p><strong>Preis:</strong> {cartItem.basePrice} (inkl. MwSt.)</p>
                                                        {/* Conditionally render available options. ProductOptions sind hier absolut unnnötig !!!!!!!!!!!!!!!!!!!!!!!!! */}
                                                        {productOptions?.deposit?.isAvailable && (
                                                            <p><strong>{cartItem.options.deposit.label}:</strong> {cartItem.options.deposit.cost} (inkl. MwSt.)</p>
                                                        )}
                                                        {productOptions?.installation?.isAvailable && cartItem.options.installation &&(
                                                            <p><strong>{cartItem.options.installation.label}:</strong> {cartItem.options.installation.cost} (inkl. MwSt.)</p>
                                                        )}
                                                        {productOptions?.delivery?.isAvailable && cartItem.options.delivery && (
                                                            <p><strong>{cartItem.options.delivery.label}:</strong> {cartItem.options.delivery.cost} (inkl. MwSt.)</p>

                                                        )}
                                                        {cartItem.selectedDate && (
                                                            <>
                                                                <p><strong>Abholdatum des ausgebauten Partikelfilters:</strong> {cartItem.selectedDate}</p>
                                                                <p><strong>Zustellung des gereinigten Partikelfilters:</strong> {cartItem.nextDay}</p>
                                                            </>
                                                        )}

                                                        {productOptions?.installation?.isAvailable && cartItem.options.installation ? (
                                                            <>
                                                                <p><strong>Summe:</strong> {cartItem.totalPrice} (inkl. MwSt.)</p>
                                                                <p>Anteil <strong>Vorauszahlung*</strong> für Produkte mit Einbau: {formatPrice(calculateAdvancePayment(cartItem.totalPriceUnformatted, productOptions.advancePayment.cost))} (inkl. MwSt.)</p>
                                                            </>
                                                        ) : (
                                                            <p><strong>Summe:</strong> {formatPrice(displayTotalPrice)} (inkl. MwSt.)</p>
                                                        )}
                                                        <p><strong>MwSt.</strong> {formatPrice(vatShare)}</p>
                                                        <h3 className={"gc-green pt-3"}>Gesamtsumme: {formatPrice(displayTotalPrice)}</h3>
                                                    </div>
                                                    {/* Restbetrag wenn Vorauszahlung */}
                                                    {productOptions?.installation?.isAvailable && cartItem.options.installation && (
                                                        <div className="cart-item restbetrag pt-2">
                                                            <div>
                                                                <strong><span className={""}>* Vorauszahlung:</span></strong><br/>

                                                                Die Vorauszahlung bei Produkten mit Einbau: 10% des Produktpreises bei Pkw und 20% bei LKW.
                                                                Den Restbetrag entrichten Sie bitte nach Einbau direkt an die von Ihnen gewählte Einbau-Werkstatt.
                                                            </div>
                                                            <div className={"w-100 pb-3"}></div>
                                                            <div>
                                                                <p><strong>Restbetrag: </strong><span className={""}> {formatPrice(calculateRemainingAmount(cartItem.totalPriceUnformatted, calculateAdvancePayment(cartItem.totalPriceUnformatted, productOptions.advancePayment.cost)))}</span></p>
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
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </section>
                                <div className={"w-100 pb-4"}></div>
                                {/* Billing Address Section */}
                                <section>

                                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                        <div className="row g-0 p-3 p-sm-4 product-detail-view rounded-4">
                                            <div className={"col"}>
                                                    <h2 className={"mb-3"}>Ihre Rechnungsadresse</h2>
                                                    <Row className="mb-md-3">
                                                        <Form.Group as={Col} md="6" className={"mb-3 mb-md-0"} controlId="billingSalutation">
                                                            <Form.Label>Anrede <span className="required">*</span></Form.Label>
                                                            <Form.Select
                                                                required
                                                                name="salutation"
                                                                value={billingAddress.salutation}
                                                                onChange={handleBillingAddressChange}
                                                            >
                                                                <option value="Herr">Herr</option>
                                                                <option value="Frau">Frau</option>
                                                                <option value="Firma">Firma</option>
                                                            </Form.Select>
                                                        </Form.Group>
                                                        <Form.Group as={Col} md="6" className={"mb-3 mb-md-0"} controlId="billingFirma">
                                                            <Form.Label>Firma</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="firma"
                                                                value={billingAddress.firma}
                                                                onChange={handleBillingAddressChange}
                                                            />
                                                        </Form.Group>
                                                    </Row>
                                                    <Row className="mb-md-3">
                                                        <Form.Group as={Col} md="6" className={"mb-3 mb-md-0"} controlId="billingFullName">
                                                            <Form.Label>Name <span className="required">*</span></Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="text"
                                                                name="fullName"
                                                                value={billingAddress.fullName}
                                                                onChange={handleBillingAddressChange}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Bitte geben Sie Ihren vollständigen Namen ein
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                        <Form.Group as={Col} md="6" className={"mb-3 mb-md-0"} controlId="billingEmail">
                                                            <Form.Label>Email <span className="required">*</span></Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="email"
                                                                name="email"
                                                                value={billingAddress.email}
                                                                onChange={handleBillingAddressChange}
                                                                isInvalid={!!errorEmail}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                { errorEmail || 'Bitte geben Sie Ihre E-Mail-Adresse ein' }
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Row>

                                                    <Row className="mb-md-3">
                                                        <Form.Group as={Col} md="6" className={"mb-3 mb-md-0"} controlId="billingPhone">
                                                            <Form.Label>Telefon <span className="required">*</span></Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="tel"
                                                                name="phone"
                                                                value={billingAddress.phone}
                                                                onChange={handleBillingAddressChange}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Bitte geben Sie Ihre Telefonnummer ein
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                        <Form.Group as={Col} md="6" className={"mb-3 mb-md-0"} controlId="billingStreet">
                                                            <Form.Label>Straße <span className="required">*</span></Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="text"
                                                                name="street"
                                                                value={billingAddress.street}
                                                                onChange={handleBillingAddressChange}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                               Bitte geben Sie die Straße ein
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Row>

                                                    <Row className="mb-md-3">
                                                        <Form.Group as={Col} md="6" className={"mb-3 mb-md-0"} controlId="billingCity">
                                                            <Form.Label>Ort <span className="required">*</span></Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="text"
                                                                name="city"
                                                                value={billingAddress.city}
                                                                onChange={handleBillingAddressChange}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Bitte geben Sie den Ort ein
                                                            </Form.Control.Feedback>
                                                        </Form.Group>

                                                        <Form.Group as={Col} md="6" controlId="billingZipCode">
                                                            <Form.Label>PLZ <span className="required">*</span></Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="text"
                                                                name="zipCode"
                                                                value={billingAddress.zipCode}
                                                                onChange={handleBillingAddressChange}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                               Bitte geben Sie die Postleitzahl ein
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Row>

                                                    <Form.Group className="mb-3 mt-4">
                                                        <Form.Check
                                                            type="checkbox"
                                                            label="Rechnungsadresse entspricht der Abhol- und Zustelladresse"
                                                            checked={sameAsBilling}
                                                            onChange={() => setSameAsBilling((prev) => !prev)}
                                                        />
                                                    </Form.Group>

                                                    {!sameAsBilling &&(
                                                        <>
                                                            <h2 className={"pb-3 pt-2"}>Abhol- und Zustelladresse</h2>
                                                            {/* Repeat shipping address fields, using handleShippingAddressChange */}
                                                            <Row className="mb-md-3">
                                                                <Form.Group as={Col} md="6" className={"mb-3 mb-md-0"} controlId="shippingSalutation">
                                                                    <Form.Label>Anrede <span className="required">*</span></Form.Label>
                                                                    <Form.Select
                                                                        required
                                                                        name="salutation"
                                                                        value={shippingAddress.salutation}
                                                                        onChange={handleShippingAddressChange}
                                                                    >
                                                                        <option value="Herr">Herr</option>
                                                                        <option value="Frau">Frau</option>
                                                                        <option value="Firma">Firma</option>
                                                                    </Form.Select>
                                                                </Form.Group>
                                                                <Form.Group as={Col} className={"mb-3 mb-md-0"} controlId="shippingFirma">
                                                                    <Form.Label>Firma</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        name="firma"
                                                                        value={shippingAddress.firma}
                                                                        onChange={handleShippingAddressChange}
                                                                    />
                                                                </Form.Group>
                                                            </Row>
                                                            <Row className="mb-md-3">
                                                                <Form.Group as={Col} md="6" className={"mb-3 mb-md-0"} controlId="shippingFullName">
                                                                    <Form.Label>Name <span className="required">*</span></Form.Label>
                                                                    <Form.Control
                                                                        required
                                                                        type="text"
                                                                        name="fullName"
                                                                        value={shippingAddress.fullName}
                                                                        onChange={handleShippingAddressChange}
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">
                                                                        Bitte geben Sie den vollständigen Namen ein
                                                                    </Form.Control.Feedback>
                                                                </Form.Group>
                                                                <Form.Group as={Col} md="6" className={"mb-3 mb-md-0"} controlId="shippingEmail">
                                                                    <Form.Label>Email <span className="required">*</span></Form.Label>
                                                                    <Form.Control
                                                                        required
                                                                        type="email"
                                                                        name="email"
                                                                        value={shippingAddress.email}
                                                                        onChange={handleShippingAddressChange}
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">
                                                                        Bitte geben Sie die E-Mail-Adresse ein
                                                                    </Form.Control.Feedback>
                                                                </Form.Group>
                                                            </Row>
                                                            <Row className="mb-md-3">
                                                                <Form.Group as={Col} md="6" className={"mb-3 mb-md-0"} controlId="shippingPhone">
                                                                    <Form.Label>Telefon <span className="required">*</span></Form.Label>
                                                                    <Form.Control
                                                                        required
                                                                        type="tel"
                                                                        name="phone"
                                                                        value={shippingAddress.phone}
                                                                        onChange={handleShippingAddressChange}
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">
                                                                        Bitte geben Sie die Telefonnummer ein
                                                                    </Form.Control.Feedback>
                                                                </Form.Group>
                                                                <Form.Group as={Col} md="6" className={"mb-3 mb-md-0"} controlId="shippingStreet">
                                                                    <Form.Label>Straße <span className="required">*</span></Form.Label>
                                                                    <Form.Control
                                                                        required
                                                                        type="text"
                                                                        name="street"
                                                                        value={shippingAddress.street}
                                                                        onChange={handleShippingAddressChange}
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">
                                                                        Bitte geben Sie die Straße ein
                                                                    </Form.Control.Feedback>
                                                                </Form.Group>
                                                            </Row>

                                                            <Row className="mb-md-3">
                                                                <Form.Group as={Col} md="6" className={"mb-3 mb-md-0"}  controlId="shippingCity">
                                                                    <Form.Label>Ort <span className="required">*</span></Form.Label>
                                                                    <Form.Control
                                                                        required
                                                                        type="text"
                                                                        name="city"
                                                                        value={shippingAddress.city}
                                                                        onChange={handleShippingAddressChange}
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">
                                                                        Bitte geben Sie den Ort ein
                                                                    </Form.Control.Feedback>
                                                                </Form.Group>
                                                                <Form.Group as={Col} md="6" className={"mb-3 mb-md-0"}  controlId="shippingZipCode">
                                                                    <Form.Label>ZIP <span className="required">*</span></Form.Label>
                                                                    <Form.Control
                                                                        required
                                                                        type="text"
                                                                        name="zipCode"
                                                                        value={shippingAddress.zipCode}
                                                                        onChange={handleShippingAddressChange}
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">
                                                                        Bitte geben Sie die Postleitzahl ein
                                                                    </Form.Control.Feedback>
                                                                </Form.Group>
                                                            </Row>
                                                        </>
                                                    )}
                                                    <div className="row g-0 pt-2">
                                                        <div className="w-100">
                                                            Felder, die mit einem Stern (<span className={"required"}>*</span>) markiert sind, werden unbedingt benötigt.
                                                        </div>
                                                    </div>
                                            </div>
                                        </div>
                                        <div className={"w-100 pb-4"}></div>
                                        <div className="row g-0 p-3 p-sm-4 product-detail-view rounded-4">
                                            <div className={"col"}>
                                                    <h2>Zahlungsmethode</h2>
                                                    <Row className="mb-md-3">
                                                        <Col sm={12}>
                                                            {/* Advance Payment Option */}
                                                            <Form.Check
                                                                type="radio"
                                                                label="Vorauskasse / Banküberweisung"
                                                                name="paymentMethod"
                                                                value="advance-payment"
                                                                checked={paymentMethod === "advance-payment"}
                                                                onChange={handlePaymentChange}
                                                                id="advancePaymentOption"
                                                            />
                                                            <div className={"w-100 pb-2"}></div>
                                                            {/* PayPal Option */}
                                                            <Form.Check
                                                                type="radio"
                                                                label="PayPal"
                                                                name="paymentMethod"
                                                                value="paypal"
                                                                checked={paymentMethod === "paypal"}
                                                                onChange={handlePaymentChange}
                                                                id="paypalOption"
                                                            />
                                                        </Col>
                                                    </Row>
                                                </div>
                                        </div>
                                        <div className="row g-0 p-4 pb-3">
                                            <div className={"col col-sm-6"}>
                                                <Button type="submit" className="btn btn-primary btn-light-green btn-100">weiter</Button>
                                            </div>
                                        </div>
                                    </Form>

                                </section>

                            </>
                        ) : (
                            <div className={"row g-0 p-3 p-sm-4 product-detail-view rounded-4"}>
                                <h1>Ihr Warenkorb ist leer</h1>
                            </div>
                        )}

                        <div className="row g-0 p-4 pt-3">
                            <div className={"col col-sm-6"}>
                                <button onClick={() => router.back()} className="btn btn-primary btn-green btn-100" >
                                    zurück
                                </button>
                            </div>
                        </div>
                    </div>

            </div>
        </>
    );
}
