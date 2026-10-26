import {getLoggedInDealer} from "@/utils/dealer";

export const JOOMLA_API_BASE ='https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi';
export const JOOMLA_URL_BASE = 'https://joomla2.nazarenko.de';
export const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
export const GOOGLE_CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_CONVERSION_LABEL;
export const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
export const PAYPAL_CURRENCY = "EUR";
// 'redirect': send the customer to paypal.com (PayPal Standard, like the HikaShop shop), payment goes to PAYPAL_BUSINESS_EMAIL.
// 'buttons': PayPal JS buttons, needs a Live client ID in NEXT_PUBLIC_PAYPAL_CLIENT_ID.
export const PAYPAL_MODE = 'redirect';
export const PAYPAL_BUSINESS_EMAIL = 'info@greencar.eu';
// For tests: https://www.sandbox.paypal.com/cgi-bin/webscr together with a sandbox business e-mail
export const PAYPAL_STANDARD_URL = 'https://www.paypal.com/cgi-bin/webscr';
export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GC_MAPS_API_KEY;

// Google Ads conversion. Only sent when the visitor allowed Google Ads in the cookie banner
// (window.gcAdsAllowed, utils/googleTags.js), and never for logged-in dealers: their orders
// and inquiries don't come from ads.
export const trackGoogleConversion= () => {
    if (getLoggedInDealer()) return;
    if (typeof window !== "undefined" && window.gtag && window.gcAdsAllowed) {
        window.gtag("event", "conversion", {
            send_to: `${GOOGLE_ADS_ID}/${GOOGLE_CONVERSION_LABEL}`, // Replace with your Conversion Label
            value: 1.0, // Optional: Conversion value
            currency: "EUR",
        });
    }

}
