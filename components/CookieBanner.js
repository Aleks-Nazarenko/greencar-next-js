import CookieConsent from "react-cookie-consent";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { CONSENT_COOKIE, CHOICES_COOKIE } from "@/utils/googleTags";

const ANALYTICS_COOKIES = ['_ga', '_gid', '_gat', '_ga_MN7EPCDL0F', '_gat_gtag_UA_18553182_1'];
const ADS_COOKIES = ['_gac', '_gcl_au'];

// Google sets its cookies on the main domain, so try with and without the domain
const removeCookies = (names) => {
    const domain = typeof window !== "undefined" ? window.location.hostname.replace(/^www\./, '') : undefined;
    for (const name of names) {
        Cookies.remove(name);
        Cookies.remove(name, { domain: `.${domain}` });
    }
};

const savedChoices = () => {
    if (Cookies.get(CONSENT_COOKIE) !== "true") return { analytics: false, ads: false };
    try {
        const saved = JSON.parse(Cookies.get(CHOICES_COOKIE) || "null");
        return saved ? { analytics: !!saved.analytics, ads: !!saved.ads } : { analytics: true, ads: true };
    } catch {
        return { analytics: true, ads: true };
    }
};

// Applies the visitor's choice: Google tags are loaded by window.gcApplyConsent (utils/googleTags.js)
const applyChoices = (choices) => {
    Cookies.set(CHOICES_COOKIE, JSON.stringify(choices), { expires: 365 });
    if (typeof window !== "undefined" && window.gcApplyConsent) window.gcApplyConsent(choices);
    if (!choices.analytics) removeCookies(ANALYTICS_COOKIES);
    if (!choices.ads) removeCookies(ADS_COOKIES);
};

const CookieBanner = () => {
    const [analyticsSelected, setAnalyticsSelected] = useState(true); // Pre-selected
    const [adsSelected, setAdsSelected] = useState(true); // Pre-selected

    // Returning visitor: remove Google cookies they didn't allow (the tags themselves are handled in _document.js)
    useEffect(() => {
        const choices = savedChoices();
        if (!choices.analytics) removeCookies(ANALYTICS_COOKIES);
        if (!choices.ads) removeCookies(ADS_COOKIES);
    }, []);

    return (
        <CookieConsent
            location="bottom"
            buttonText="ausgewählte erlauben"
            declineButtonText="alle ablehnen"
            enableDeclineButton
            onAccept={() => applyChoices({ analytics: analyticsSelected, ads: adsSelected })}
            onDecline={() => {
                setAnalyticsSelected(false);
                setAdsSelected(false);
                applyChoices({ analytics: false, ads: false });
            }}
            cookieName={CONSENT_COOKIE}
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
