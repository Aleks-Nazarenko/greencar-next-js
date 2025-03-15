import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {JOOMLA_API_BASE} from "@/utils/config";



const VerifyPage = () => {
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
                        setError(null);
                    } else {
                        setError(data.message || 'Die Verifizierung ist fehlgeschlagen. Versuchen Sie es bitte erneut');
                        setMessage(null);
                    }
                } catch (err) {
                    setError('Beim Überprüfen Ihres Kontos ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal.');
                    setMessage(null);
                } finally {
                    setLoading(false);
                }
            };

            verifyToken();
        }
    }, [token]);

    return (
        <>

                <div className="row g-0 mb-6">
                <h1>Kontobestätigung</h1>
                    <div className={'col-12'}>
                        {loading && <p>Verifizierung Ihres Kontos...</p>}
                        {message && <p style={{ color: 'green' }}>{message}</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                </div>

                <div className="row g-0">
                    <div className={'col-12'}>
                        Bitte nehmen Sie Kontakt auf, wenn Sie Fragen haben:<br />
                        Fon +49 (0) 30 417 22 08 - 0<br/>
                        info@greencar.eu
                    </div>
                </div>


        </>
    );
};

export default VerifyPage;
