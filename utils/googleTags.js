import { GOOGLE_ADS_ID, GOOGLE_ANALYTICS_ID } from "@/utils/config";

// Cookie set by react-cookie-consent ("true" after "ausgewählte erlauben", "false" after "alle ablehnen")
export const CONSENT_COOKIE = "CookieConsent";
// Our own cookie with the checkboxes the visitor chose: {"analytics": bool, "ads": bool}
export const CHOICES_COOKIE = "CookieConsentChoices";

// Inline script for the <head> (pages/_document.js). It runs before React, so conversions
// fired by a page (e.g. /bestellbestaetigung/) already see the visitor's consent.
// Google Consent Mode: everything is denied by default, and gtag.js is only loaded
// once the visitor allowed Google Ads or Analytics. window.gcApplyConsent is called by
// components/CookieBanner.js when the visitor decides during the visit.
export const googleTagsHeadScript = `
(function () {
    var ADS_ID = ${JSON.stringify(GOOGLE_ADS_ID || "")};
    var ANALYTICS_ID = ${JSON.stringify(GOOGLE_ANALYTICS_ID || "")};
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag("consent", "default", {
        ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied"
    });
    gtag("js", new Date());

    var configured = {};
    var scriptLoaded = false;
    window.gcAdsAllowed = false;
    window.gcApplyConsent = function (choices) {
        var ads = !!choices.ads, analytics = !!choices.analytics;
        var ad = ads ? "granted" : "denied";
        gtag("consent", "update", {
            ad_storage: ad, ad_user_data: ad, ad_personalization: ad, analytics_storage: analytics ? "granted" : "denied"
        });
        window.gcAdsAllowed = ads && !!ADS_ID;
        if (ads && ADS_ID && !configured[ADS_ID]) { gtag("config", ADS_ID); configured[ADS_ID] = true; }
        if (analytics && ANALYTICS_ID && !configured[ANALYTICS_ID]) { gtag("config", ANALYTICS_ID); configured[ANALYTICS_ID] = true; }
        var id = ads && ADS_ID ? ADS_ID : (analytics && ANALYTICS_ID ? ANALYTICS_ID : "");
        if (id && !scriptLoaded) {
            scriptLoaded = true;
            var s = document.createElement("script");
            s.async = true;
            s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
            document.head.appendChild(s);
        }
    };

    // Returning visitor: apply the decision stored in the cookies
    function cookie(name) {
        var m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
        return m ? decodeURIComponent(m[1]) : null;
    }
    if (cookie(${JSON.stringify(CONSENT_COOKIE)}) === "true") {
        // Visitors who accepted before the choices cookie existed had both boxes ticked
        var choices = { analytics: true, ads: true };
        try {
            var saved = JSON.parse(cookie(${JSON.stringify(CHOICES_COOKIE)}));
            if (saved) choices = { analytics: !!saved.analytics, ads: !!saved.ads };
        } catch (e) {}
        window.gcApplyConsent(choices);
    }
})();
`;
