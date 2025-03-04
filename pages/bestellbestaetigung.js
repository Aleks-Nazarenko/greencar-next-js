import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';



export default function bestellBestaetigung(){
    const [productUrl, setProductUrl] = useState(null);
    const router = useRouter();
    const {orderNumber} = router.query;
    const { paymentMethod } = router.query; // Get paymentMethod from query parameters
    useEffect(() => {
        const savedUrl = sessionStorage.getItem('lastVisitedProduct');
        if (savedUrl) {
            setProductUrl(savedUrl);
        }
    }, []);
    const goToProductPage = () => {
        if (productUrl) {
            router.push(productUrl);
            sessionStorage.removeItem('lastVisitedProduct');
        }
    };
    return (
        <>


                    <div className="row g-0">
                        <h1 className={"mb-0"}>Bestell&shy;bestätigung</h1>
                    </div>
                    <div className={"w-100 pb-4"}></div>
                    <div className="row g-0">
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
                        <div className="row g-0 pt-4">
                            <div className={"col-sm-6"}>
                                <button onClick={goToProductPage} className="btn btn-primary btn-green w-100" aria-label="zurück zur Produktseite">zurück zur Produktseite</button>
                            </div>
                        </div>
                    )}




        </>
    );
}
