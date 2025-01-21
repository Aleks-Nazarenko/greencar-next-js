import { useEffect, useState } from 'react';
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {JOOMLA_URL_BASE} from "@/utils/config";
import {JOOMLA_API_BASE} from "@/utils/config";

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
export async function getStaticProps() {
    // Base URL of your Joomla server (adjust this to your Joomla installation URL)
    const joomlaBaseUrl = JOOMLA_URL_BASE;

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
            footerArticle,
        },
    };
}
export default function CheckoutPage({footerArticle }) {
    const [cartItem, setCartItem] = useState(null);
    const [productOptions, setProductOptions] = useState(null);
    const [vatShare, setVatShare] = useState(0); // State to store the VAT share
    const [displayTotalPrice, setDisplayTotalPrice] = useState(0); // Total price to display
    const [validated, setValidated] = useState(false);
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
        if (form.checkValidity() === false) {
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
            <main>
                <div className="container-fluid container-greencar">
                    {/* Cart Section */}
                    <section>
                        <h2>Warenkorb</h2>
                        {cartItem ? (
                            <>
                                <div className={"row g-0 p-4"}>
                                    {cartItem.productName.toLowerCase().includes('filterreinigung')? (
                                        <ProductImage
                                            src={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/thumbnails/200x200/Filterreinigung-PKW-LKW-BUS-2.jpg`}
                                            alt={cartItem.productName}
                                            fallback={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/thumbnails/200x200/Filterreinigung-PKW-LKW-BUS-2.jpg`}
                                        />
                                    ) : (
                                        <ProductImage
                                            src={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/${cartItem.productImage}`}
                                            alt={cartItem.productName}
                                            fallback={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/beispielphoto.jpg`}
                                        />
                                    )}
                                </div>
                                <div className="cart-item">
                                    <p><strong>Product:</strong> {cartItem.productName}</p>
                                    <p><strong>Price:</strong> {cartItem.basePrice} (inkl. MwSt.)</p>
                                    {/* Conditionally render available options. ProductOptions sind hier absolut unnnötig !!!!!!!!!!!!!!!!!!!!!!!!! */}
                                    {productOptions?.deposit?.isAvailable && (
                                        <div><strong>{cartItem.options.deposit.label}:</strong> {cartItem.options.deposit.cost} (inkl. MwSt.)</div>
                                    )}
                                    {productOptions?.installation?.isAvailable && cartItem.options.installation &&(
                                        <div><strong>{cartItem.options.installation.label}:</strong> {cartItem.options.installation.cost} (inkl. MwSt.)</div>
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
                                            <div>Summe {cartItem.totalPrice} (inkl. MwSt.)</div>
                                            <div>Anteil <b>Vorauszahlung*</b> für Produkte mit Einbau {formatPrice(calculateAdvancePayment(cartItem.totalPriceUnformatted, productOptions.advancePayment.cost))} (inkl. MwSt.)</div>
                                        </>
                                    ) : (
                                        <div>Summe {formatPrice(displayTotalPrice)} (inkl. MwSt.)</div>
                                    )}
                                    <p><strong>MwSt.</strong> {formatPrice(vatShare)}</p>
                                    <p><strong>Gesamtsumme</strong> {formatPrice(displayTotalPrice)}</p>

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
                            <p>Ihr Warenkorb is leer</p>
                        )}
                    </section>

                    {/* Billing Address Section */}
                    <section>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <h2>Ihre Rechnungsadresse</h2>
                            <Row className="mb-3 g-0">
                                <Form.Group as={Col} md="6" controlId="billingSalutation">
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
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} md="6" controlId="billingFullName">
                                    <Form.Label>Full Name <span className="required">*</span></Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Enter your full name"
                                        name="fullName"
                                        value={billingAddress.fullName}
                                        onChange={handleBillingAddressChange}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide your full name.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="6" controlId="billingEmail">
                                    <Form.Label>Email <span className="required">*</span></Form.Label>
                                    <Form.Control
                                        required
                                        type="email"
                                        placeholder="Enter your email"
                                        name="email"
                                        value={billingAddress.email}
                                        onChange={handleBillingAddressChange}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid email address.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} md="6" controlId="billingPhone">
                                    <Form.Label>Phone <span className="required">*</span></Form.Label>
                                    <Form.Control
                                        required
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        name="phone"
                                        value={billingAddress.phone}
                                        onChange={handleBillingAddressChange}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid phone number.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="6" controlId="billingStreet">
                                    <Form.Label>Street Address <span className="required">*</span></Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Enter your street address"
                                        name="street"
                                        value={billingAddress.street}
                                        onChange={handleBillingAddressChange}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid street address.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} md="4" controlId="billingCity">
                                    <Form.Label>City <span className="required">*</span></Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Enter your city"
                                        name="city"
                                        value={billingAddress.city}
                                        onChange={handleBillingAddressChange}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid city.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="billingFirma">
                                    <Form.Label>Firma</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your firma"
                                        name="firma"
                                        value={billingAddress.firma}
                                        onChange={handleBillingAddressChange}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="billingZipCode">
                                    <Form.Label>Zip Code <span className="required">*</span></Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Enter your zip code"
                                        name="zipCode"
                                        value={billingAddress.zipCode}
                                        onChange={handleBillingAddressChange}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid zip code.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Rechnungsadresse entspricht der Abhol- und Zustelladresse"
                                    checked={sameAsBilling}
                                    onChange={() => setSameAsBilling((prev) => !prev)}
                                />
                            </Form.Group>

                            {!sameAsBilling &&(
                                <>
                                    <h2>Abhol- und Zustelladresse</h2>
                                    {/* Repeat shipping address fields, using handleShippingAddressChange */}
                                    <Row className="mb-3 g-0">
                                        <Form.Group as={Col} md="6" controlId="shippingSalutation">
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
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} md="6" controlId="shippingFullName">
                                            <Form.Label>Full Name <span className="required">*</span></Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="Enter your full name"
                                                name="fullName"
                                                value={shippingAddress.fullName}
                                                onChange={handleShippingAddressChange}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide your full name.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6" controlId="shippingEmail">
                                            <Form.Label>Email <span className="required">*</span></Form.Label>
                                            <Form.Control
                                                required
                                                type="email"
                                                placeholder="Enter your email"
                                                name="email"
                                                value={shippingAddress.email}
                                                onChange={handleShippingAddressChange}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid email address.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} md="6" controlId="shippingPhone">
                                            <Form.Label>Phone <span className="required">*</span></Form.Label>
                                            <Form.Control
                                                required
                                                type="tel"
                                                placeholder="Enter your phone number"
                                                name="phone"
                                                value={shippingAddress.phone}
                                                onChange={handleShippingAddressChange}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid phone number.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6" controlId="shippingStreet">
                                            <Form.Label>Street Address <span className="required">*</span></Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="Enter your street address"
                                                name="street"
                                                value={shippingAddress.street}
                                                onChange={handleShippingAddressChange}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid street address.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Col} md="4" controlId="shippingCity">
                                            <Form.Label>City <span className="required">*</span></Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="Enter your city"
                                                name="city"
                                                value={shippingAddress.city}
                                                onChange={handleShippingAddressChange}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid city.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} md="4" controlId="shippingFirma">
                                            <Form.Label>Firma</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter your firma"
                                                name="firma"
                                                value={shippingAddress.firma}
                                                onChange={handleShippingAddressChange}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="4" controlId="shippingZipCode">
                                            <Form.Label>Zip Code <span className="required">*</span></Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="Enter your zip code"
                                                name="zipCode"
                                                value={shippingAddress.zipCode}
                                                onChange={handleShippingAddressChange}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid zip code.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                </>
                            )}
                            <div className="row g-0 ">
                                <div className="w-100">
                                    Felder, die mit einem Stern (<span className={"required"}>*</span>) markiert sind, werden unbedingt benötigt.
                                </div>
                            </div>
                            <h2>Payment Method</h2>
                            <Row className="mb-3">
                                <Col sm={12}>
                                    {/* Advance Payment Option */}
                                    <Form.Check
                                        type="radio"
                                        label="Advance Payment"
                                        name="paymentMethod"
                                        value="advance-payment"
                                        checked={paymentMethod === "advance-payment"}
                                        onChange={handlePaymentChange}
                                        id="advancePaymentOption"
                                    />
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

                            <Button type="submit">weiter</Button>
                        </Form>
                    </section>
                    <div className="row g-0 p-4">
                        <button onClick={() => router.back()} className="btn btn-primary">zurück</button>
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
