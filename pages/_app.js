import '@/styles/custom.scss';
import "@/styles/globals.css";
//import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap.bundle.min';
import Layout from '../components/Layout';
import CookieBanner from "@/components/CookieBanner";

export default function App({ Component, pageProps }) {
    return (
        <Layout>
            <Component {...pageProps} />
            <CookieBanner />
      </Layout>
    );
}
