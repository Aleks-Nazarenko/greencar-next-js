import {useRouter} from "next/router";
import {useEffect} from "react";
import {useState} from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { JOOMLA_API_BASE } from "@/utils/config";

const LoginPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

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
                throw new Error(data?.message || "Login failed. Please try again.");
            }

            // Store the user details and token
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect to a protected page or dashboard
            router.push("/");
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

    return (
        <>
            <main>
                <div className="container-fluid container-greencar">
                    <div className="row g-0 p-4 mb-6">
                        <h2>Login</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
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
                    </div>
                </div>
            </main>
       </>
    );
};

export default LoginPage;
