import CookieConsent from "react-cookie-consent";
import { useEffect, useState } from 'react';
import TagManager from 'react-gtm-module';
import Cookies from 'js-cookie';

const GoogleAnalyticsID = 'UA-18553182-1'; // Replace with your Google Analytics ID
const GoogleAdsID = 'AW-1039077179'; // Replace with your Google Ads Conversion ID

const CookieBanner = () => {
    const [analyticsSelected, setAnalyticsSelected] = useState(true); // Pre-selected
    const [adsSelected, setAdsSelected] = useState(true); // Pre-selected
    const [cookiesAccepted, setCookiesAccepted] = useState(false);

    useEffect(() => {
        if (cookiesAccepted) {
            // Initialize GTM only after clicking "Accept Selected"
            TagManager.initialize({
                gtmId: GoogleAdsID, // Replace with your GTM ID
                dataLayer: {
                    analyticsConsent: analyticsSelected,
                    adsConsent: adsSelected,
                },
            });

            if (analyticsSelected) {
                // Dynamically add Google Analytics script
                const gaScript = document.createElement('script');
                gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GoogleAnalyticsID}`;
                gaScript.async = true;
                document.head.appendChild(gaScript);

                const gaInitScript = document.createElement('script');
                gaInitScript.innerHTML = `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GoogleAnalyticsID}');
                `;
                document.head.appendChild(gaInitScript);
            }

            if (adsSelected) {
                // Dynamically add Google Ads script
                const adsInitScript = document.createElement('script');
                adsInitScript.innerHTML = `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('config', '${GoogleAdsID}');
                `;
                document.head.appendChild(adsInitScript);
            }
        } else {
            // Remove all cookies if consent is not given
            Cookies.remove('_ga');
            Cookies.remove('_gid');
            Cookies.remove('_gat');
            Cookies.remove('_gac'); // Google Ads cookies
            Cookies.remove('_ga_MN7EPCDL0F');
            Cookies.remove('_gcl_au');
            Cookies.remove('_gat_gtag_UA_18553182_1');
        }
    }, [cookiesAccepted, analyticsSelected, adsSelected]);

    const handleAccept = () => {
        setCookiesAccepted(true);
    };

    return (
        <CookieConsent
            location="bottom"
            buttonText="ausgewählte erlauben"
            declineButtonText="alle ablehnen"
            enableDeclineButton
            onAccept={handleAccept} // Trigger the useEffect to set cookies
            onDecline={() => {
                setCookiesAccepted(false);
                setAnalyticsSelected(false);
                setAdsSelected(false);
            }}
            cookieName="CookieConsent"
            expires={365}
        >
            <div style={{fontSize: '14px' }}>
                <p className={""} style={{fontSize:"18px"}}>
                    Diese Webseite benutzt Cookies, um Ihnen das bestmögliche Nutzererlebnis zu ermöglichen.
                    <a className={"a-cookie-banner"} href={"/datenschutzerklaerung"} style={{color:"initial"}}> Cookie-Richtlinien und Datenschutzerklärung</a>
                </p>
                <div>
                    <label>
                        <input type="checkbox" defaultChecked disabled />
                        notwendige
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={analyticsSelected}
                            onChange={(e) => setAnalyticsSelected(e.target.checked)}
                        />
                        Analytics
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={adsSelected}
                            onChange={(e) => setAdsSelected(e.target.checked)}
                        />
                        Google Ads
                    </label>
                </div>
            </div>
        </CookieConsent>
    );
};

export default CookieBanner;
