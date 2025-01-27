import CookieConsent from "react-cookie-consent";
import { useEffect, useState } from 'react';
import TagManager from 'react-gtm-module';
import Cookies from 'js-cookie';
const GoogleAnalyticsID = 'UA-18553182-1'; // Replace with your Google Analytics ID
const GoogleAdsID = 'AW-1039077179'; // Replace with your Google Ads Conversion ID

const CookieBanner = () => {
    const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
    const [adsEnabled, setAdsEnabled] = useState(false);

    // Initialize Google Tag Manager, Analytics, and Ads when consent is given
    useEffect(() => {
        if (analyticsEnabled || adsEnabled) {
            // Initialize GTM with custom dataLayer settings
            TagManager.initialize({
                gtmId: GoogleAdsID, // Replace with your GTM ID
                dataLayer: {
                    analyticsConsent: analyticsEnabled,
                    adsConsent: adsEnabled,
                },
            });

            if (analyticsEnabled) {
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

            if (adsEnabled) {
                // Dynamically add Google Ads Conversion Tracking
                const adsInitScript = document.createElement('script');
                adsInitScript.innerHTML = `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('config', '${GoogleAdsID}');
                `;
                document.head.appendChild(adsInitScript);
            }
        } else {
            // Remove Google Analytics and Ads cookies
            Cookies.remove('_ga');
            Cookies.remove('_gid');
            Cookies.remove('_gat');
            Cookies.remove('_gac'); // Google Ads cookies
        }
    }, [analyticsEnabled, adsEnabled]);

    return (
        <CookieConsent
            location="bottom"
            buttonText="Accept Selected"
            declineButtonText="Decline All"
            enableDeclineButton
            onAccept={() => {
                setAnalyticsEnabled(true);
                setAdsEnabled(true);
            }}
            onDecline={() => {
                setAnalyticsEnabled(false);
                setAdsEnabled(false);
            }}
            cookieName="CookieConsent"
            expires={365}
        >
            <div style={{ padding: '10px', fontSize: '14px' }}>
                <h4>Cookie Preferences</h4>
                <p>
                    We use cookies to enhance your experience. Necessary cookies are required for
                    the website to function. Analytics and marketing cookies help us understand user
                    behavior and optimize advertisements.
                </p>
                <div>
                    <label>
                        <input type="checkbox" defaultChecked disabled />
                        Necessary Cookies (Always Enabled)
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                            checked={analyticsEnabled}
                        />
                        Analytics Cookies
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            onChange={(e) => setAdsEnabled(e.target.checked)}
                            checked={adsEnabled}
                        />
                        Marketing & Google Ads Cookies
                    </label>
                </div>
            </div>
        </CookieConsent>
    );
};

export default CookieBanner;
