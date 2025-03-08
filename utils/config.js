export const JOOMLA_API_BASE = 'https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi';
export const JOOMLA_URL_BASE = 'https://joomla2.nazarenko.de';
export const GOOGLE_ANALYTICS_ID = 'UA-18553182-1';
export const GOOGLE_ADS_ID = 'AW-1039077179';
export const GOOGLE_CONVERSION_LABEL = "9IEpCLuYaRC7nrzvAw";
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
