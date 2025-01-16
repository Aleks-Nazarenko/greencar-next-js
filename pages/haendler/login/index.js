import {useRouter} from "next/router";
import {useEffect} from "react";
import {useState} from "react";
import { Form, Button, Alert } from "react-bootstrap";
import {JOOMLA_API_BASE, JOOMLA_URL_BASE} from "@/utils/config";
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";

export async function getStaticProps() {
    const joomlaBaseUrl = JOOMLA_URL_BASE;
    // Fetch data for the footer from Joomla API
    const resFooter = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=2&format=json`);
    const footerData = await resFooter.json();
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
const LoginPage = ({ footerArticle} ) => {
    const router = useRouter();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check if the user is logged in
    useEffect(() => {
        const token = sessionStorage.getItem("authToken");
        if (token) {
            setIsLoggedIn(true);
            setSuccessMessage("Sie sind bereits angemeldet. Wählen Sie eine Option aus dem Menü.");
        }
    }, []);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage("");
        try {
            const response = await fetch(`${JOOMLA_API_BASE}&task=login&format=json`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || "Login is fehlgeschlagen. Bitte versuchen Sie es erneut.");
            }

            // Store the user details and token
            sessionStorage.setItem("authToken", data.token);
            sessionStorage.setItem("user", JSON.stringify(data.user));
            // Update state
            setIsLoggedIn(true);
            setSuccessMessage("Sie haben sich als Händler angemeldet. Wählen Sie eine Option aus dem Menü.");
           // router.push("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        /*
    useEffect(() => {
        // Redirect to the desired submenu
        router.push('/haendler/login');
    }, [router]);

    return null; // Optionally return a loading indicator or nothing
         */
    };
    const handleLogout = () => {
        // Clear sessionStorage
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("user");
        // Update state
        setIsLoggedIn(false);
        setFormData({ username: "", password: "" });
        setSuccessMessage("");
    };

    return (
        <>
            <main>
                <div className="container-fluid container-greencar">
                    <div className="row g-0 p-4 mb-6">
                        <h2>Händler - Login</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {successMessage && <Alert variant="success">{successMessage}</Alert>}
                        {isLoggedIn ? (
                            <div>
                                <Button onClick={handleLogout}>Logout</Button>
                            </div>
                        ) : (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </Form>
                        )}
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

export default LoginPage;
