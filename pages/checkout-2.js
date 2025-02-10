import { useState, useEffect } from "react";
import { useRouter } from "next/router";
//import PayPalButton from "@/components/PayPalButton"; // Your PayPal button component
import { PayPalButtons } from "@paypal/react-paypal-js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import Form from 'react-bootstrap/Form';
import PayPalPlaceholder from "@/pages/PayPalPlaceholder";
import { Modal, Button } from "react-bootstrap";
import {JOOMLA_API_BASE} from "@/utils/config";
import {JOOMLA_URL_BASE} from "@/utils/config";
import Pictos from "@/components/Pictos";

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

export async function getStaticProps({ params }) {
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
    // Fetch data for the footer from Joomla API
    const resTerms = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=5&format=json`);
    const termsData = await resTerms.json();
    // Extract the footer article from the response
    const termsArticle = termsData.article || null;
    // Convert relative URLs in the footer content to absolute URLs
    if (termsArticle) {
        termsArticle.introtext = termsArticle.introtext ? convertRelativeUrls(termsArticle.introtext, joomlaBaseUrl) : '';
        if(!termsArticle.introtext) {
            console.log('termsArticle.introtext not found');
        }
    }
    return {
        props: {
            footerArticle,
            termsArticle,
        },
    };
}
export default function CheckoutStep2({footerArticle, termsArticle})   {
    const router = useRouter();
    const [checkoutDetails, setCheckoutDetails] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const handleModalOpen = () => {
        setShowModal(true);
    };
    const handleModalClose = () => {
        setShowModal(false);
    };

    useEffect(() => {
        const details = JSON.parse(sessionStorage.getItem("checkoutDetails"));
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
        const orderData = JSON.parse(sessionStorage.getItem("checkoutDetails"));
        if (!orderData) {
            alert("Order data is missing. Please try again.");
            return;
        }
        orderData.orderNumber = orderNumber;
        // Send the request to Joomla controller
        const response = await fetch(`${JOOMLA_API_BASE}&task=confirmOrder&format=json`, {
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

        // Clear sessionStorage and navigate to Thank You page
       // alert("Order placed successfully!");
        sessionStorage.removeItem("checkoutDetails");
        sessionStorage.removeItem("cart");
        sessionStorage.removeItem("productOptions");
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
                    <div className={"row g-0"}>
                        <h1 className={"pb-0 mb-0"}>Bestellzusammenfassung</h1>
                    </div>
                    <div className="w-100 pb-4"></div>
                    <div className="row g-0">
                        <div className="col-sm-8">
                            <div className="row g-0">
                                {checkoutDetails && (
                                    <div className={"col"}>
                                        <div className={"row g-0 p-3 p-sm-4 product-detail-view rounded-4"}>
                                            <div className={"col"}>
                                                <div className={"row g-0"}>
                                                    <h2 className={" mb-3"}>{checkoutDetails.cartItem.productName}</h2>
                                                </div>
                                                <div className={"row g-0 "}>
                                                    {checkoutDetails.cartItem.productName.toLowerCase().includes('filterreinigung')? (
                                                        <ProductImage
                                                            src={`${JOOMLA_URL_BASE}/images/Filterreinigung-PKW-LKW-BUS-2.jpg`}
                                                            alt={checkoutDetails.cartItem.productName}
                                                            fallback={`${JOOMLA_URL_BASE}/images/Filterreinigung-PKW-LKW-BUS-2.jpg`}
                                                        />
                                                    ) : (
                                                        <ProductImage
                                                            src={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/${checkoutDetails.cartItem.productImage}`}
                                                            alt={checkoutDetails.cartItem.productName}
                                                            fallback={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/beispielphoto.jpg`}
                                                        />
                                                    )}

                                                </div>
                                                <div className={"w-100 pb-3"}></div>
                                                <div className={"row pb-2"}>
                                                    <div className={"col-sm-6"}>
                                                        { checkoutDetails.cartItem.productName}
                                                    </div>
                                                    <div className={"col-sm-6"}>
                                                        {checkoutDetails.cartItem.basePrice} (inkl. MwSt.)
                                                    </div>
                                                </div>
                                                    {checkoutDetails.cartItem.options.deposit && (
                                                       <div className={"row  pb-2"}>
                                                           <div className={"col-sm-6"}>
                                                               {checkoutDetails.cartItem.options.deposit.label}
                                                           </div>
                                                           <div className={"col-sm-6"}>
                                                               {checkoutDetails.cartItem.options.deposit.cost} (inkl. MwSt.)
                                                           </div>
                                                       </div>
                                                   )}
                                                    {checkoutDetails.cartItem.options.installation &&(
                                                       <div className={"row  pb-2"}>
                                                           <div className={"col-sm-6"}>
                                                               {checkoutDetails.cartItem.options.installation.label}
                                                           </div>
                                                           <div className={"col-sm-6"}>
                                                               {checkoutDetails.cartItem.options.installation.cost} (inkl. MwSt.)
                                                           </div>
                                                       </div>
                                                    )}
                                                    {checkoutDetails.cartItem.options.delivery && (
                                                       <div className={"row  pb-2"}>
                                                           <div className={"col-sm-6"}>
                                                               {checkoutDetails.cartItem.options.delivery.label}
                                                           </div>
                                                           <div className={"col-sm-6"}>
                                                               {checkoutDetails.cartItem.options.delivery.cost} (inkl. MwSt.)
                                                           </div>
                                                       </div>
                                                    )}
                                                    {checkoutDetails.cartItem.selectedDate && (
                                                        <>
                                                        <div className={"row  pb-2"}>
                                                            <div className={"col-sm-6"}>
                                                                Abholdatum des ausgebauten Partikelfilters
                                                            </div>
                                                            <div className={"col-sm-6"}>
                                                                {checkoutDetails.cartItem.selectedDate}
                                                            </div>
                                                        </div>
                                                        <div className={"row  pb-2"}>
                                                            <div className={"col-sm-6"}>
                                                                Zustellung des gereinigten Partikelfilters
                                                            </div>
                                                            <div className={"col-sm-6"}>
                                                                {checkoutDetails.cartItem.nextDay}
                                                            </div>
                                                        </div>
                                                        </>
                                                    )}

                                                { /*
                                                     <div className={"row g-0"}>
                                                        <div className={"col-sm-4"}>
                                                            {checkoutDetails.cartItem.options.installation ? (
                                                                <>
                                                                    <div className={"w-100"}>Einzelpreis</div>
                                                                    <div className={"w-100"}>{checkoutDetails.cartItem.totalPrice} (inkl. MwSt.)</div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className={"w-100"}>Einzelpreis</div>
                                                                    <div className={"w-100"}>{formatPrice(checkoutDetails.cartItem.totalPriceUnformatted)} (inkl. MwSt.)</div>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className={"col-sm-4"}>
                                                            {checkoutDetails.cartItem.options.installation ? (
                                                                <>
                                                                    <div className={"w-100"}>Gesamtpreis</div>
                                                                    <div className={"w-100"}>{checkoutDetails.cartItem.totalPrice} (inkl. MwSt.)</div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className={"w-100"}>Gesamtpreis</div>
                                                                    <div className={"w-100"}>{formatPrice(checkoutDetails.cartItem.totalPriceUnformatted)} (inkl. MwSt.)</div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    */
                                                }


                                                {checkoutDetails.cartItem.options.installation ? (
                                                    <>
                                                        <div className={"row row-cols-2 pb-2"}>
                                                            <div className={"col "}>Summe </div>
                                                            <div className={"col"}>
                                                                    {checkoutDetails.cartItem.totalPrice} (inkl. MwSt.)
                                                            </div>
                                                        </div>
                                                        <div className={"row row-cols-2 pb-2"}>
                                                            <div className={"col "}>
                                                                Anteil <b>Vorauszahlung*</b> für Produkte mit Einbau
                                                            </div>
                                                            <div className={"col"}>
                                                                {formatPrice(checkoutDetails.cartItem.advancePayment)} (inkl. MwSt.)
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className={"row row-cols-2 pb-2"}>
                                                        <div className={"col "}>Summe </div>
                                                        <div className={"col"}>
                                                            {formatPrice(checkoutDetails.cartItem.totalPriceUnformatted)} (inkl. MwSt.)
                                                        </div>
                                                    </div>
                                                )}
                                                <div className={"row pb-2"}>
                                                    <div className={"col"}>MwSt.</div>
                                                    <div className={"col"}>{checkoutDetails.cartItem.vatShare}</div>
                                                </div>
                                                <div className={"row pt-3"}>
                                                    <div className={"col"}><h4 className={"gc-green"}>Gesamtsumme {checkoutDetails.cartItem.advancePayment ? formatPrice(checkoutDetails.cartItem.advancePayment) : formatPrice(checkoutDetails.cartItem.totalPriceUnformatted)}</h4></div>
                                                </div>
                                                {checkoutDetails.cartItem.options.installation && (
                                                    <>
                                                        <div className={"row pt-2 pb-2"}>
                                                            <div className={"col"}>
                                                                <strong><span className={""}>* Vorauszahlung:</span></strong><br/>
                                                                Die Vorauszahlung bei Produkten mit Einbau: 10% des Produktpreises bei Pkw und 20% bei LKW.
                                                                Den Restbetrag entrichten Sie bitte nach Einbau direkt an die von Ihnen gewählte Einbau-Werkstatt.
                                                            </div>
                                                        </div>
                                                        <div className={"row pt-2 "}>
                                                            <div className={"col"}>
                                                                Restbetrag: {checkoutDetails.cartItem.remainingAmount ?? "nicht verfügbar"}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className={"w-100 pb-4"}></div>
                                        <div className={"row g-0 p-3 p-sm-4 product-detail-view rounded-4"}>
                                            {checkoutDetails.billingAddress && (
                                                <div className={"col-sm-6"}>
                                                    <h3>Rechnungsadresse</h3>
                                                    <div>{checkoutDetails.billingAddress.anrede } {checkoutDetails.billingAddress.fullName} </div>
                                                    <div>{checkoutDetails.billingAddress.street}</div>
                                                    <div>{checkoutDetails.billingAddress.zipCode} {checkoutDetails.billingAddress.city}</div>
                                                    <div>{checkoutDetails.billingAddress.firma}</div>
                                                    <div>{checkoutDetails.billingAddress.email}</div>
                                                    <div>{checkoutDetails.billingAddress.phone}</div>
                                                </div>
                                            )}
                                            {checkoutDetails.shippingAddress && (
                                                <div className={"col-sm-6"}>
                                                    <h3>Lieferadresse</h3>
                                                    <div>{checkoutDetails.shippingAddress.anrede} {checkoutDetails.shippingAddress.fullName} </div>
                                                    <div>{checkoutDetails.shippingAddress.street}</div>
                                                    <div>{checkoutDetails.shippingAddress.zipCode} {checkoutDetails.shippingAddress.city}</div>
                                                    <div>{checkoutDetails.shippingAddress.firma}</div>
                                                    <div>{checkoutDetails.shippingAddress.email}</div>
                                                    <div>{checkoutDetails.shippingAddress.phone}</div>
                                                </div>
                                            )}
                                        </div>
                                        <div className={"w-100 pb-4"}></div>
                                        <div className={"row g-0 p-3 p-sm-4 product-detail-view rounded-4"}>
                                            <div className={"w-100"}>
                                               <h3>Datenschutzhinweise. Widerrufs- und Rückgaberecht</h3>
                                            </div>
                                            <div className={"w-100"}>
                                                <Form.Check
                                                    type="checkbox"
                                                    label={
                                                        <>
                                                            Ich habe die Allgemeinen{" "}
                                                            <a className={"gc-green"}
                                                                href="#"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleModalOpen();
                                                                }}
                                                            >
                                                                allgemeinen Geschäftsbedingungen (AGB)
                                                            </a>
                                                            {" "}gelesen und bin mit deren Geltung einverstanden.
                                                        </>
                                                    }
                                                    checked={termsAccepted}
                                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                                />
                                            </div>
                                        </div>
                                        {/* Bootstrap Modal */}
                                        <Modal show={showModal} onHide={handleModalClose} size="lg" centered>
                                            <Modal.Header closeButton>
                                            </Modal.Header>
                                            <Modal.Body>
                                                {/* Render Joomla Article Content if available*/}
                                                {termsArticle?.introtext && (
                                                    <div dangerouslySetInnerHTML={{ __html: termsArticle.introtext}} />
                                                )}
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={handleModalClose}>
                                                    Schließen
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>

                                        {checkoutDetails.paymentMethod === "paypal" ? (termsAccepted ? (
                                            <>
                                            <div className={"w-100 pt-4"}></div>
                                            <div className={"row g-0 p-3 p-sm-4 product-detail-view rounded-4"}>
                                                <div>Bitte klicken Sie auf den Button unten, um Ihre Bestellung zu bestätigen und mit PayPal zu bezahlen.</div>
                                                <div className={"w-100 pt-3"}></div>
                                                 <div className={"col"}>
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
                                                 </div>
                                            </div>
                                                <div className={"w-100 pb-3"}></div>
                                            </>
                                        ) : (

                                                <div className={"row g-0 p-4 pb-3"}>
                                                    <div style={{ display: !termsAccepted ? "none" : "block" }}>Bitte akzeptieren Sie die allgemeinen Geschäftsbedingungen, um fortzufahren.</div>
                                                    <div className={"paypal-button-label-container col-sm-6 d-flex flex-column align-items-center"}>
                                                        <PayPalPlaceholder />
                                                    </div>

                                                </div>
                                            )
                                        ) : (
                                            <>
                                                <div className={"w-100 pt-4"}></div>
                                                <div className={"row g-0 p-3 p-sm-4 product-detail-view rounded-4"}>
                                                    <div className={"col"}>
                                                        <h3>Zahlungsmethode Vorauskasse / Banküberweisung</h3>
                                                        <div>Durch Anklicken des Buttons 'Kaufen' geben Sie eine verbindliche Bestellung der oben aufgelisteten Waren ab.
                                                        Die Auftragsbestätigung erhalten Sie per E-Mail unmittelbar nach dem Absenden der Bestellung. Damit ist der Kaufvertrag geschlossen.</div>
                                                        <div className={"row g-0 pt-4"}>
                                                            <div className={"col-sm-6"}>
                                                                <button className="btn btn-primary btn-green btn-100" onClick={handleConfirmOrder}  disabled={!termsAccepted}>Kaufen</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={"w-100 pt-3"}></div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="row g-0 p-4 pt-3">
                                <div className={"col col-sm-6"}>
                                    <button onClick={() => router.back()} className="btn btn-primary btn-green btn-100" >
                                        zurück
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className={"col-sm-4  text-center text-sm-end"}>
                            <Pictos />
                        </div>
                    </div>

        </PayPalScriptProvider>
    );
}
