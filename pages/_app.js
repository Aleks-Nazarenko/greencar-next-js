import "@fontsource/source-sans-pro";
import '@/styles/custom.scss';
import "@/styles/globals.css";
//import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap.bundle.min';
import Layout from '../components/Layout';
import CookieBanner from "@/components/CookieBanner";

// Google Ads / Analytics are set up in pages/_document.js (utils/googleTags.js) and only load after cookie consent
export default function App({ Component, pageProps }) {
    return (
        <Layout>
            <Component {...pageProps} />
            <CookieBanner />
        </Layout>
    );
}
