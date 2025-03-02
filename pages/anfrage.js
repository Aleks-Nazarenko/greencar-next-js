import {JOOMLA_API_BASE} from "@/utils/config";
import { Form, Button, Row, Col} from 'react-bootstrap';
import {useState} from "react";
import {useRouter} from "next/router";

export default function Anfrage() {

    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        strasse: '',
        ort: '',
        plz: '',
        telefon: '',
        einbau: 'ja',
        einbauort: '',
        hersteller: '',
        modell: '',
        baujahr: '',
        euro_norm: '',
        message: '',
    });

    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorEmail, setErrorEmail] = useState('');

    const validateEmail = (value) => {
        const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;
        if (!strictEmailRegex.test(value)) {
            setErrorEmail("Ihre E-Mail-Adresse ist ungültig");
            return false;  // Invalid email
        } else {
            setErrorEmail("");
            return true;  // Valid email
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        if (name === "email") {
            validateEmail(value); // Check validation on every keystroke
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Optional: Adds smooth scrolling effect
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false || !validateEmail(formData.email) ) {
            e.stopPropagation();
            setValidated(true);
            return;
        }
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                strasse: formData.strasse,
                ort: formData.ort,
                plz: formData.plz,
                telefon: formData.telefon,
                einbau: formData.einbau,
                einbauort: formData.einbauort,
                hersteller: formData.hersteller,
                modell: formData.modell,
                baujahr: formData.baujahr,
                euro_norm: formData.euro_norm,
                message: formData.message,

            };
            const response = await fetch(`${JOOMLA_API_BASE}&task=anfrage&format=json`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (!response.ok) {
                console.log('Anfrage Error', data);
                setErrors({ apiError: data?.message || 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.'});
                scrollToTop();
            } else {
                if (data.status === 'success') {
                    setSuccessMessage(data.message);
                    setFormData({
                        name: '',
                        email: '',
                        strasse: '',
                        ort: '',
                        plz: '',
                        telefon: '',
                        einbau: '',
                        einbauort: '',
                        hersteller: '',
                        modell: '',
                        baujahr: '',
                        euro_norm: '',
                        message: '',
                    });
                    setValidated(false);
                    scrollToTop();
                } else {
                    setErrors({ apiError: 'Ein Fehler ist aufgetreten. Versuchen Sie es später noch einmal.' });
                    scrollToTop();
                }
            }
        } catch (error) {
            setErrors({ apiError: 'Ein Fehler ist aufgetreten. Versuchen Sie es später noch einmal.' });
            console.log('Anfrage Error', error);
            scrollToTop();
        }
    };

    return (
        <>
            <Row className="g-0">
                <Col md={"12"}>
                    {errors.apiError && <div className={"w-100 form-danger pb-4"}>{errors.apiError}</div>}
                    {successMessage && <div className={"w-100 gc-green-light pb-4"}>{successMessage}</div>}
                </Col>
            </Row>
            <Row className="pb-4 g-0">
                <h1 className={"mb-1"}>Anfrage</h1>
                <Col>
                    <h4 className={"mb-0"}>Das Formular einfach ausfüllen und absenden.</h4>
                </Col>
            </Row>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3 g-0">
                    <Form.Group as={Col} sm={"6"} controlId="regName">
                        <Form.Label>Vorname / Name <span className="required">*</span></Form.Label>
                        <Form.Control
                            required
                            type="text"
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
                    <Form.Group as={Col} sm="6" controlId="regEmail">
                        <Form.Label>E-Mail-Adresse <span className="required">*</span></Form.Label>
                        <Form.Control
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            isInvalid={!!errorEmail}
                        />
                        <Form.Control.Feedback type="invalid">
                            { errorEmail || 'Bitte geben Sie Ihre E-Mail-Adresse ein' }
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3 g-0">
                    <Form.Group as={Col}  sm={"6"} controlId="regStrasse">
                        <Form.Label>Straße</Form.Label>
                        <Form.Control
                            type="text"
                            name="strasse"
                            value={formData.strasse}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Row>
                <Row className="mb-3 g-0">
                    <Form.Group as={Col}  sm={"6"} controlId="regOrt">
                        <Form.Label>Ort <span className="required">*</span></Form.Label>
                        <Form.Control
                            required
                            type="text"
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
                    <Form.Group as={Col} sm={"6"} controlId="regPlz">
                        <Form.Label>PLZ <span className="required">*</span></Form.Label>
                        <Form.Control
                            required
                            type="text"
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
                    <Form.Group as={Col}  sm={"6"} controlId="regTelefon">
                        <Form.Label>Telefon</Form.Label>
                        <Form.Control
                            type="text"
                            name="telefon"
                            value={formData.telefon}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Row>
                <Row className="mb-3 g-0">
                    <Form.Group as={Col} sm="6" controlId="regEinabu">
                        <Form.Label>Einbau gewünscht?</Form.Label>
                        <Form.Select
                            name="einbau"
                            value={formData.einbau}
                            onChange={handleInputChange}
                        >
                            <option value="ja">ja</option>
                            <option value="nein">nein</option>
                        </Form.Select>
                    </Form.Group>
                </Row>
                <Row className="mb-3 g-0">
                    <Form.Group as={Col} sm={"6"} controlId="regEinbauort">
                        <Form.Label>Einbauort</Form.Label>
                        <Form.Control
                            type="text"
                            name="einbauort"
                            value={formData.einbauort}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Row>
                <Row className="mb-3 g-0">
                    <Form.Group as={Col} sm={"6"} controlId="regHersteller">
                        <Form.Label>Hersteller</Form.Label>
                        <Form.Control
                            type="text"
                            name="hersteller"
                            value={formData.hersteller}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Row>
                <Row className="mb-3 g-0">
                    <Form.Group as={Col} sm={"6"} controlId="regModell">
                        <Form.Label>Modell</Form.Label>
                        <Form.Control
                            type="text"
                            name="modell"
                            value={formData.modell}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Row>
                <Row className="mb-3 g-0">
                    <Form.Group as={Col} sm={"6"} controlId="regBaujahr">
                        <Form.Label>Baujahr</Form.Label>
                        <Form.Control
                            type="text"
                            name="baujahr"
                            value={formData.baujahr}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Row>
                <Row className="mb-3 g-0">
                    <Form.Group as={Col} sm={"6"} controlId="regNorm">
                        <Form.Label>Euro-Norm</Form.Label>
                        <Form.Control
                            type="text"
                            name="euro_norm"
                            value={formData.euro_norm}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Row>
                <Row className="g-0">
                    <Form.Group as={Col}  sm={"6"} controlId="regMessage">
                        <Form.Label>Fragen offen?</Form.Label>
                        <Form.Control as="textarea" rows={3}
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Row>
                <div className={"w-100 pb-4"}></div>
                <Row className="g-0 justify-content-start">
                    <Col sm={"6"}>
                        <Button className="btn btn-primary btn-light-green btn-100 " type="submit">senden</Button>
                    </Col>
                    <div className={"w-100 pb-4"}></div>
                    <Col sm={"6"}>
                        <Button className="btn btn-primary btn-green btn-100" type="button" onClick={() => router.push('/')}>abbrechen</Button>
                    </Col>
                </Row>
            </Form>

        </>
    );
}
