import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {JOOMLA_API_BASE} from "@/utils/config";
import {JOOMLA_URL_BASE} from "@/utils/config";
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";

export async function getStaticProps() {
    const joomlaBaseUrl = JOOMLA_URL_BASE;
    // Fetch data for the footer from Joomla API
    const resFooter = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=2&format=json`);
    const footerData = await resFooter.json();
    console.log("API Response:", footerData);
    // Extract the footer article from the response
    const footerArticle = footerData.article || null;

    // Convert relative URLs in the footer content to absolute URLs
    if (footerArticle) {
        footerArticle.introtext = footerArticle.introtext ? convertRelativeUrls(footerArticle.introtext, joomlaBaseUrl) : '';
        if (!footerArticle.introtext) {
            console.log('footerArticle.introtext not found');
        }
    }
    // Return the expected props structure
    return { props: { footerArticle} };
}

const VerifyPage = ({footerArticle}) => {
    const router = useRouter();
    const { token } = router.query; // Get the token from the URL
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Make a request to Joomla's verify endpoint
            const verifyToken = async () => {
                try {
                    const response = await fetch(`${JOOMLA_API_BASE}&task=verify&format=json`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        setMessage(data.message || 'Die E-Mail-Adresse wurde verifiziert. Sobald der Administrator das Konto aktiviert hat, wird automatisch eine weitere E-Mail verschickt.');
                    } else {
                        setError(data.message || 'Die Verifizierung ist fehlgeschlagen. Versuchen Sie es bitte erneut');
                    }
                } catch (err) {
                    setError('Beim Überprüfen Ihres Kontos ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal.');
                } finally {
                    setLoading(false);
                }
            };

            verifyToken();
        }
    }, [token]);

    return (
        <>
        <main>
            <div className="container-fluid container-greencar">
                <div className="row g-0 p-4 mb-6">
                <h1>Account Verification</h1>
                    <div className={'col-12'}>
                        {loading && <p>Verifizierung Ihres Kontos...</p>}
                        {message && <p style={{ color: 'green' }}>{message}</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                </div>

                <div className="row g-0 p-4">
                    <div className={'col-12'}>
                        Bitte nehmen Sie Kontakt auf, wenn Sie Fragen haben:<br />
                        Fon +49 (0) 30 417 22 08 - 0<br/>
                        info@greencar.eu
                    </div>
                </div>
            </div>
        </main>
        <footer>
            <div className="container-fluid container-footer container-greencar">
                <div className="row g-0 p-4">
                    {footerArticle?.introtext && (
                        <div dangerouslySetInnerHTML={{ __html: footerArticle.introtext}} />
                    )}
                </div>
            </div>
        </footer>
        </>
    );
};

export default VerifyPage;
