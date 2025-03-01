import {useRouter} from "next/router";
import {useEffect} from "react";
import {useState} from "react";
import { Form, Button, Alert } from "react-bootstrap";
import {JOOMLA_API_BASE} from "@/utils/config";
import Link from "next/link";


const LoginPage = () => {
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
           router.push("/pkw-partikelfilter");
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
            <div className="row g-0 pb-4">
                <h1 className={"mb-1"}>Händler - Login</h1>
                <div className={"w-100"}>Wenn Sie bei uns als Händler registriert sind, können Sie sich hier einloggen und zu besonderen Konditionen bestellen.
                    Wenn Sie sich als Händler bei uns registrieren lassen wollen, können Sie das unter dem Menüpunkt <Link className={"gc-green-light"} href={"/haendler/registrierung"}>"Registrierung"</Link> machen.
                </div>
            </div>
            <div className="row g-0">
                        {error && <div className={"col-12 pb-4 form-danger"}>{error}</div>}
                        {successMessage && <div className={"col-12 gc-green-light"}>{successMessage}</div>}
                        {isLoggedIn ? (
                            <div className={"col-12 col-sm-6"}>
                                <Button className="btn btn-primary btn-light-green btn-100 mt-4"  onClick={handleLogout}>Logout</Button>
                            </div>
                        ) : (
                            <div className={"col-12 col-sm-6"}>
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
                                    <div className="w-100 pb-2"></div>
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
                                    <Button className="btn btn-primary btn-light-green btn-100 mt-4" type="submit" disabled={loading}>
                                        {loading ? "Logging in..." : "Login"}
                                    </Button>
                                </Form>
                            </div>
                        )}
                    </div>


       </>
    );
};

export default LoginPage;
