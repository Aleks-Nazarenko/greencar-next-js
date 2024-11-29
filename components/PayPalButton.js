import React, { useEffect } from "react";

export default function PayPalButton({ totalAmount }) {
    useEffect(() => {
        // Initialize PayPal Buttons
        if (window.paypal) {
            window.paypal
                .Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: totalAmount, // Total amount for the transaction
                                    },
                                },
                            ],
                        });
                    },
                    onApprove: (data, actions) => {
                        return actions.order.capture().then((details) => {
                            alert(`Transaction completed by ${details.payer.name.given_name}`);
                            // Handle successful payment (e.g., save order to database)
                        });
                    },
                    onError: (err) => {
                        console.error("PayPal Checkout Error:", err);
                        alert("An error occurred during the payment process.");
                    },
                })
                .render("#paypal-button-container");
        }
    }, [totalAmount]);

    return <div id="paypal-button-container"></div>;
}
