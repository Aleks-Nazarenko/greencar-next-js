import React, { useEffect } from "react";

export default function PayPalButton({ totalAmount, onSuccess, onError }) {
    useEffect(() => {
        if (!window.paypal) {
            console.error("PayPal SDK not loaded.");
            return;
        }
        const buttonContainerId = "paypal-button-container";
        // Ensure the container is not already rendered
        const container = document.getElementById(buttonContainerId);
        if (container?.childElementCount > 0) {
            container.innerHTML = ""; // Clear previous buttons
        }
        // Initialize PayPal Buttons
        if (window.paypal) {
            window.paypal
                .Buttons({
                    fundingSource: window.paypal.FUNDING.PAYPAL,
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: totalAmount.toFixed(2), // Total amount for the transaction
                                        currency_code: "EUR",
                                    },
                                },
                            ],
                        });
                    },
                    onApprove: (data, actions) => {
                        return actions.order.capture().then((details) => {
                            onSuccess(details); // Pass transaction details to parent
                        });
                    },
                    onError: (err) => {
                        console.error("PayPal Checkout Error:", err);
                        onError(err); // Notify parent about the error
                    },
                })
                .render(`#${buttonContainerId}`);
        }
    }, [totalAmount, onSuccess, onError]);

    return <div id="paypal-button-container"></div>;
}
