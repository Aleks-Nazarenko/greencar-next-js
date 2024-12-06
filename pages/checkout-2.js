import { useState, useEffect } from "react";
import { useRouter } from "next/router";
//import PayPalButton from "@/components/PayPalButton"; // Your PayPal button component
import { PayPalButtons } from "@paypal/react-paypal-js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import Form from 'react-bootstrap/Form';

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
export default function CheckoutStep2({footerArticle }) {
    const router = useRouter();
    const [checkoutDetails, setCheckoutDetails] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);

    useEffect(() => {
        const details = JSON.parse(localStorage.getItem("checkoutDetails"));
        if (!details) {
            router.push("/checkout");
        } else {
            setCheckoutDetails(details);
        }
    }, [router]);

    const handleConfirmOrder = async () => {
        if (!termsAccepted) {
            alert("Bitte akzeptieren Sie die allgemeinen Geschäftsbedingungen, um fortzufahren.");
            return;
        }
        function generateOrderNumber() {
            const prefix = "GC";
            const now = Date.now(); // Current timestamp in milliseconds
            const randomPart = Math.floor(Math.random() * 1000000); // Random number
            const uniquePart = (now + randomPart).toString(36).toUpperCase(); // Convert to Base36
            return `${prefix}-${uniquePart}`;
        }

        const orderNumber = generateOrderNumber();
        const orderData = JSON.parse(localStorage.getItem("checkoutDetails"));
        if (!orderData) {
            alert("Order data is missing. Please try again.");
            return;
        }
        orderData.orderNumber = orderNumber;
        // Send the request to Joomla controller
        const response = await fetch('https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=confirmOrder&format=json', {
            method: "POST", // Use POST for sending data securely
            headers: {
                "Content-Type": "application/json", // Ensure the server knows it's JSON
            },
            body: JSON.stringify(orderData), // Convert the data to JSON string
        });
        // Check if the response is OK
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error from server:", errorData);
            alert("Bestellung konnte nicht bestätigt werden. Bitte versuchen Sie es erneut.");
            return;
        }

        // Process the server response
        const result = await response.json();
        console.log("Order confirmation successful:", result);

        // Clear localStorage and navigate to Thank You page
       // alert("Order placed successfully!");
        localStorage.removeItem("checkoutDetails");
        localStorage.removeItem("cart");
        localStorage.removeItem("productOptions");
        router.push( {pathname: '/thank-you', query: { paymentMethod: checkoutDetails.paymentMethod, orderNumber: orderNumber, }});
    };
    const formatPrice = (price) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
        }).format(price);
    };

    return (
        <PayPalScriptProvider
            options={{
                "client-id": "AWlnu3flylsdsc5dJ4jLnYEyOpzqgeWE_XPAag7TfJhINzC6KnXW9RQteB9LJvE5vpbXNfzBcrI9rQ1s",
                currency: "EUR",
            }}
        >
            <main>
                <div className="container-fluid container-greencar">
                    <div className="row g-0 p-4">
                        {checkoutDetails && (
                            <>
                                <h2>Bestellzusammenfassung</h2>
                                <div>
                                    <div>{ checkoutDetails.cartItem.productName} {checkoutDetails.cartItem.basePrice} (inkl. MwSt.)</div>
                                    {checkoutDetails.cartItem.options.deposit && (
                                        <div>{checkoutDetails.cartItem.options.deposit.label}: {checkoutDetails.cartItem.options.deposit.cost} (inkl. MwSt.)</div>
                                    )}
                                    {checkoutDetails.cartItem.options.installation &&(
                                        <div>{checkoutDetails.cartItem.options.installation.label}:{checkoutDetails.cartItem.options.installation.cost} (inkl. MwSt.)</div>
                                    )}
                                    {checkoutDetails.cartItem.options.delivery && (
                                        <div>{checkoutDetails.cartItem.options.delivery.label}:{checkoutDetails.cartItem.options.delivery.cost} (inkl. MwSt.)</div>
                                    )}
                                    {checkoutDetails.cartItem.selectedDate && (
                                        <>
                                            <div>Abholdatum des ausgebauten Partikelfilters: {checkoutDetails.cartItem.selectedDate}</div>
                                            <div>Zustellung des gereinigten Partikelfilters: {checkoutDetails.cartItem.nextDay}</div>
                                        </>
                                    )}
                                    {checkoutDetails.cartItem.options.installation ? (
                                        <>
                                            <div>Summe {checkoutDetails.cartItem.totalPrice} (inkl. MwSt.)</div>
                                            <div>Anteil <b>Vorauszahlung*</b> für Produkte mit Einbau {formatPrice(checkoutDetails.cartItem.advancePayment)} (inkl. MwSt.)</div>
                                        </>
                                    ) : (
                                        <div>Summe {formatPrice(checkoutDetails.cartItem.totalPriceUnformatted)} (inkl. MwSt.)</div>
                                    )}
                                    <p><strong>MwSt.</strong> {checkoutDetails.cartItem.vatShare}</p>
                                    <p><strong>Gesamtsumme</strong> {checkoutDetails.cartItem.advancePayment ? formatPrice(checkoutDetails.cartItem.advancePayment) : formatPrice(checkoutDetails.cartItem.totalPriceUnformatted)}</p>
                                </div>
                                <div>
                                    <Form.Check
                                        type="checkbox"
                                        label="Ich akzeptiere die allgemeinen Geschäftsbedingungen (AGB)"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        className="my-3"
                                    />
                                </div>

                                {checkoutDetails.paymentMethod === "paypal" ? (
                                    termsAccepted ? (
                                     <>
                                        <div>Bitte klicken Sie auf den Button unten, um Ihre Bestellung zu bestätigen und mit PayPal zu bezahlen.</div>
                                         <PayPalButtons
                                             fundingSource="paypal"
                                             createOrder={(data, actions) => {
                                                 // Define the order details
                                                 return actions.order.create({
                                                     purchase_units: [
                                                         {
                                                             amount: {
                                                                 value: checkoutDetails.cartItem.advancePayment
                                                                     ? checkoutDetails.cartItem.advancePayment.toFixed(2)
                                                                     : checkoutDetails.cartItem.totalPriceUnformatted.toFixed(2),
                                                                 currency_code: "EUR",
                                                             },
                                                             description: `Order for ${checkoutDetails.cartItem.productName}`,
                                                         },
                                                     ],
                                                 });
                                             }}
                                             onApprove={(data, actions) => {
                                                 return actions.order.capture().then((details) => {
                                                     console.log("Transaction details:", details);
                                                     handleConfirmOrder()
                                                         .then(() => {
                                                             console.log("Order confirmed successfully.");
                                                         })
                                                         .catch((err) => {
                                                             console.error("Error confirming order:", err);
                                                         });
                                                 });
                                             }}
                                             onError={(err) => {
                                                 alert("Zahlung fehlgeschlagen! Bitte versuchen Sie es erneut.");
                                                 console.error(err);
                                             }}
                                         />
                                     </>
                                    ) : (
                                        <>
                                        <div>Bitte akzeptieren Sie die allgemeinen Geschäftsbedingungen, um fortzufahren.</div>
                                        </>
                                    )
                                ) : (
                                    <>
                                        <div>Zahlungsmethode Vorauskasse / Banküberweisung </div>
                                        <div>Durch Anklicken des Buttons 'Kaufen' geben Sie eine verbindliche Bestellung der oben aufgelisteten Waren ab.
                                            Die Auftragsbestätigung erhalten Sie per E-Mail unmittelbar nach dem Absenden der Bestellung. Damit ist der Kaufvertrag geschlossen.</div>
                                        <button className="btn btn-primary" onClick={handleConfirmOrder}  disabled={!termsAccepted}>Kaufen</button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    <div className="row g-0 p-4">
                        <div className={"col col-sm-4"}>
                            <button onClick={() => router.back()} className="btn btn-primary">zurück</button>
                        </div>
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
        </PayPalScriptProvider>
    );
}
