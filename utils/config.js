export const JOOMLA_API_BASE = 'https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi';
export const JOOMLA_URL_BASE = 'https://joomla2.nazarenko.de';
export const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
export const GOOGLE_CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_CONVERSION_LABEL;
export const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
export const PAYPAL_CURRENCY = "EUR";
export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GC_MAPS_API_KEY;

export const trackGoogleConversion= () => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "conversion", {
            send_to: `${GOOGLE_ADS_ID}/${GOOGLE_CONVERSION_LABEL}`, // Replace with your Conversion Label
            value: 1.0, // Optional: Conversion value
            currency: "EUR",
        });
    }else {
        console.warn("Google Ads tracking is not yet available");
    }

}
