import "@fontsource/source-sans-pro";
import '@/styles/custom.scss';
import "@/styles/globals.css";
//import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap.bundle.min';
import Layout from '../components/Layout';
import CookieBanner from "@/components/CookieBanner";
import { useEffect } from "react";
import Script from "next/script";
import {GOOGLE_ADS_ID} from "@/utils/config";

export default function App({ Component, pageProps }) {
    useEffect(() => {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
            window.dataLayer.push(arguments);
        };
        window.gtag("js", new Date());
        window.gtag("config", GOOGLE_ADS_ID); // Replace with your Google Ads Conversion ID
    }, []);
    return (
        <Layout>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
            />
            <Script id="google-ads">
                {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GOOGLE_ADS_ID}');`}
            </Script>
            <Component {...pageProps} />
            <CookieBanner />
        </Layout>
    );
}
