import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export async function getStaticProps({ params }) {
    // Base URL of your Joomla server (adjust this to your Joomla installation URL)
    const joomlaBaseUrl = 'https://joomla2.nazarenko.de';

    // Fetch data for the footer from Joomla API
    const resFooter = await fetch('https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=articleWithModules&id=2&format=json');
    const footerData = await resFooter.json();
    // Extract the footer article from the response
    const footerArticle = footerData.article || null;

    // Convert relative URLs in the footer content to absolute URLs
    if (footerArticle && footerArticle.introtext) {
        footerArticle.introtext = convertRelativeUrls(footerArticle.introtext, joomlaBaseUrl);
    }

    return {
        props: {
            footerArticle,
        },
    };
}
export default function thankYou({footerArticle}){
    const [productUrl, setProductUrl] = useState(null);
    const router = useRouter();
    const {orderNumber} = router.query;
    const { paymentMethod } = router.query; // Get paymentMethod from query parameters
    useEffect(() => {
        const savedUrl = localStorage.getItem('lastVisitedProduct');
        if (savedUrl) {
            setProductUrl(savedUrl);
        }
    }, []);
    const goToProductPage = (u) => {
        if (productUrl) {
            router.push(productUrl);
            localStorage.removeItem('lastVisitedProduct');
        }
    };
    return (
        <>
            <main>
                <div className="container-fluid container-greencar">
                    <div className="row g-0 p-4">
                        <h1>Bestellbestätigung</h1>
                        <div>Ihre Bestellung wurde ausgeführt.</div>
                        {(paymentMethod === 'paypal') && (
                            <div>Wir senden Ihnen in Kürze eine Bestätigungs-E-Mail</div>
                        )}
                        {(paymentMethod === 'advance-payment') && (
                            <div>Wir werden uns in Kürze mit Ihnen in Verbindung setzen, um Ihnen unsere Bankverbindung mitzuteilen.</div>
                        )}
                        <div>Ihre Bestellnummer: {orderNumber} .</div>
                        <div>Herzlichen Dank für Ihren Einkauf!</div>
                    </div>
                    {productUrl && (
                        <div className="row g-0 p-4">
                            <button onClick={goToProductPage} className="btn btn-primary" aria-label="zurück zur Produktseite">zurück zur Produktseite</button>
                        </div>
                    )}
                </div>
            </main>
            <footer>
                <div className="container-fluid container-footer container-greencar">
                    <div className="row g-0 p-4">
                        <div dangerouslySetInnerHTML={{ __html: footerArticle.introtext}} />
                    </div>
                </div>
            </footer>
        </>
    );
}
