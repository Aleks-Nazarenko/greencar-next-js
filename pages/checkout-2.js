import { useState, useEffect } from "react";
import { useRouter } from "next/router";
//import PayPalButton from "@/components/PayPalButton"; // Your PayPal button component
import { PayPalButtons } from "@paypal/react-paypal-js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
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
export default function CheckoutStep2({footerArticle }) {
    const router = useRouter();
    const [checkoutDetails, setCheckoutDetails] = useState(null);

    useEffect(() => {
        const details = JSON.parse(localStorage.getItem("checkoutDetails"));
        if (!details) {
            router.push("/checkout");
        } else {
            setCheckoutDetails(details);
        }
    }, [router]);

    const handleConfirmOrder = async () => {
        alert("Order placed successfully!");
        localStorage.removeItem("checkoutDetails");
        localStorage.removeItem("cart");
        router.push("/thank-you");
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
                        <h1>Checkout Step 2</h1>
                        {checkoutDetails && (
                            <>
                                <h2>Order Summary</h2>
                                <div>
                                    <h3>Billing Address</h3>
                                    <p>{checkoutDetails.cartItem.totalPrice}</p>
                                    {checkoutDetails.cartItem.options.deposit && (
                                        <div>{checkoutDetails.cartItem.options.deposit.label}: {checkoutDetails.cartItem.options.deposit.cost} (inkl. MwSt.)</div>
                                    )}
                                    {checkoutDetails.cartItem.options.installation &&(
                                        <div>{checkoutDetails.cartItem.options.installation.label}:{checkoutDetails.cartItem.options.installation.cost} (inkl. MwSt.)</div>
                                    )}
                                    {checkoutDetails.cartItem.options.delivery && (
                                        <div>{checkoutDetails.cartItem.options.delivery.label}:{checkoutDetails.cartItem.options.delivery.cost} (inkl. MwSt.)</div>
                                    )}
                                    {/* Other details */}
                                </div>

                                {checkoutDetails.paymentMethod === "paypal" ? (
                                    <PayPalButtons
                                        fundingSource="paypal"
                                        totalAmount={checkoutDetails.cartItem.totalPriceUnformatted.toFixed(2)}
                                        onSuccess={(details) => {
                                            alert("Payment successful!");
                                            handleConfirmOrder()
                                                .then(() => {
                                                    console.log("Order confirmed successfully.");
                                                })
                                                .catch((err) => {
                                                    console.error("Error confirming order:", err);
                                                });
                                        }}
                                        onError={(err) => {
                                            alert("Payment failed!");
                                            console.error(err);
                                        }}
                                    />
                                ) : (
                                    <button onClick={handleConfirmOrder}>Submit Order</button>
                                )}
                            </>
                        )}
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
