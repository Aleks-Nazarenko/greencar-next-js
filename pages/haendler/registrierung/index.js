import {useRouter} from "next/router";
import {useState} from "react";
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import {JOOMLA_API_BASE} from "@/utils/config";
import {JOOMLA_URL_BASE} from "@/utils/config";
import {useEffect} from "react";
import Link from "next/link";
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
const RegisterPage = ({footerArticle}) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        benutzername: "",
        email: "",
        email2: "",
        passwort: "",
        passwort2: "",
        name: "",
        anrede: "",
        firma: "",
        strasse: "",
        plz: "",
        ort: "",
    });
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
    const validatePassEmail = () => {
        const customErrors = {};

        if (formData.email !== formData.email2) {
            customErrors.confirmEmail = 'Die E-Mail-Adressen stimmen nicht überein';
        }

        if (formData.passwort !== formData.passwort2) {
            customErrors.confirmPassword = 'Die Passwörter stimmen nicht überein';
        }

        setErrors(customErrors);
        return Object.keys(customErrors).length === 0; // Returns true if no custom errors
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false || !validatePassEmail()) {
            e.stopPropagation();
            setValidated(true);
            return;
        }
        try {
            const payload = {
                username: formData.benutzername,
                name: formData.name,
                email1: formData.email,
                password1: formData.passwort,
                password2: formData.passwort2,
                customFields: {
                    user_ort: formData.ort,
                    user_anrede: formData.anrede,
                    user_firma: formData.firma,
                    user_strasse: formData.strasse,
                    user_plz: formData.plz,
                },
            };
            const response = await fetch(`${JOOMLA_API_BASE}&task=register&format=json`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (!response.ok) {
                console.log('Registration Error', data);
                setErrors({ apiError: data?.message || 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.'});

            } else {
                if (data.status === 'success') {
                    setSuccessMessage(data.message);

                    setFormData({
                        anrede: '',
                        name: '',
                        benutzername: '',
                        email: '',
                        email2: '',
                        passwort: '',
                        passwort2: '',
                        firma: '',
                        strasse: '',
                        plz: '',
                        ort: '',
                    });
                    setValidated(false);
                } else {
                    setErrors({ apiError: 'Ein Fehler ist aufgetreten. Versuchen Sie es später noch einmal.' });
                }
            }
        } catch (error) {
            setErrors({ apiError: 'Ein Fehler ist aufgetreten. Versuchen Sie es später noch einmal.' });
        }
    }

    return (
        <>
            <main>
                <div className="container-fluid container-greencar">
                    {errors.apiError && <Alert variant="danger">{errors.apiError}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    <Row className="mb-3 g-0">
                        <Col md={"12"}>
                            <h4>Händler - Registrierung</h4>
                        </Col>
                        <Col md={"12"}>
                            Bitte registrieren Sie sich hier, wenn Sie bei GREENCAR als Händler zu besonderen Konditionen einkaufen möchten.
                            Wenn Sie sich bereits bei uns registriert haben, können Sie sich über den Menüpunkt
                            <Link href="/haendler/login" passHref legacyBehavior>
                                <a className="nav-link">"Login"</a>
                            </Link>als Händler einloggen
                        </Col>
                    </Row>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row className="mb-3 g-0">
                            <Col md={"12"}><h4>Login</h4></Col>
                        </Row>
                        <Row className="mb-3 g-0">
                            <Form.Group as={Col} sm="12" md={"6"} controlId="regBenutzername">
                                    <Form.Label>Benutzername <span className="required">*</span></Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Benutzername"
                                        name="benutzername"
                                        value={formData.benutzername}
                                        onChange={handleInputChange}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Bitte geben Sie Ihren Benutzernamen ein
                                    </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3 g-0">
                            <Form.Group as={Col} md="6" sm={"12"} controlId="regPasswort">
                                <Form.Label>Passwort <span className="required">*</span></Form.Label>
                                <Form.Control
                                    required
                                    type="password"
                                    placeholder="Passwort"
                                    name="passwort"
                                    value={formData.passwort}
                                    onChange={handleInputChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Bitte geben Sie Ihr Passwort ein
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3 g-0">
                            <Form.Group as={Col} md="6" sm={"12"} controlId="regPasswort2">
                                <Form.Label>Passwort bestätigen <span className="required">*</span></Form.Label>
                                <Form.Control
                                    required
                                    type="password"
                                    placeholder="Passwort bestätigen"
                                    name="passwort2"
                                    value={formData.passwort2}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.confirmPassword}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.confirmPassword || 'Bitte bestätigen Sie Ihr Passwort'}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3 g-0">
                            <Col md={"12"}><h4>Ansprechpartner</h4></Col>
                        </Row>
                        <Row className="mb-3 g-0">
                            <Form.Group as={Col} md="2" controlId="regAnrede">
                                <Form.Label>Anrede <span className="required">*</span></Form.Label>
                                <Form.Select
                                    required
                                    name="anrede"
                                    value={formData.anrede}
                                    onChange={handleInputChange}
                                >
                                    <option value="Herr">Herr</option>
                                    <option value="Frau">Frau</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3 g-0">
                            <Form.Group as={Col} sm="12" md={"6"} controlId="regName">
                                <Form.Label>Benutzername <span className="required">*</span></Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Bitte geben Sie Ihren Namen ein
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3 g-0">
                            <Form.Group as={Col} md="6" sm="12" controlId="regEmail">
                                <Form.Label>E-Mail-Adresse <span className="required">*</span></Form.Label>
                                <Form.Control
                                    required
                                    type="email"
                                    placeholder="E-Mail"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Bitte geben Sie Ihre E-Mail-Adresse ein
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3 g-0">
                            <Form.Group as={Col} md="6" sm={"12"} controlId="regEmail2">
                                <Form.Label>E-Mail-Adresse bestätigen <span className="required">*</span></Form.Label>
                                <Form.Control
                                    required
                                    type="email"
                                    placeholder="E-Mail bestätigen"
                                    name="email2"
                                    value={formData.email2}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.confirmEmail}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.confirmEmail || 'Bitte bestätigen Sie Ihre E-Mail-Adresse'}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3 g-0">
                            <Col md={"12"}><h4>Unternehmen</h4></Col>
                        </Row>
                        <Row className="mb-3 g-0">
                            <Form.Group as={Col} sm="12" md={"6"} controlId="regFirma">
                                <Form.Label>Firma <span className="required">*</span></Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="firma"
                                    name="firma"
                                    value={formData.firma}
                                    onChange={handleInputChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Bitte geben Sie Ihre Firma ein
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3 g-0">
                            <Form.Group as={Col} sm="12" md={"6"} controlId="regOrt">
                                <Form.Label>Ort <span className="required">*</span></Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="ort"
                                    name="ort"
                                    value={formData.ort}
                                    onChange={handleInputChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Bitte geben Sie den Ort ein
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3 g-0">
                            <Form.Group as={Col} sm="12" md={"6"} controlId="regStrasse">
                                <Form.Label>Straße <span className="required">*</span></Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="strasse"
                                    name="strasse"
                                    value={formData.strasse}
                                    onChange={handleInputChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Bitte geben Sie die Straße ein
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3 g-0">
                            <Form.Group as={Col} sm="12" md={"6"} controlId="regPlz">
                                <Form.Label>PLZ <span className="required">*</span></Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="plz"
                                    name="plz"
                                    value={formData.plz}
                                    onChange={handleInputChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Bitte geben Sie die PLZ ein
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3 g-0">
                            <Col md={"12"}><span className="required">*</span> Benötigtes Feld</Col>
                        </Row>
                        <Row className="mb-3 g-0 justify-content-start">
                            <Col md={"12"}>
                                <Button type="submit">Registrieren</Button>
                                <Button type="button" className={"ms-4"} onClick={() => router.push('/')}>Abbrechen</Button>
                            </Col>
                        </Row>
                    </Form>
                    <Row className="mb-3 g-0">
                        <Col md={"12"}>
                            Bitte nehmen Sie Kontakt auf, wenn Sie Fragen haben:<br/>
                            Fon +49 (0) 30 417 22 08 - 0<br/>
                            info@greencar.eu
                        </Col>
                    </Row>

                </div>
            </main>
        </>
    );
};
export default RegisterPage;
