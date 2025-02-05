import {JOOMLA_API_BASE, JOOMLA_URL_BASE} from "@/utils/config";
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import {useState} from "react";
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import Pictos from "@/components/Pictos";




export async function getStaticProps() {
    const resArticle = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=9&format=json`);
    const articleData = await resArticle.json();
    const article = articleData.article || null;
    if (article) {
        article.content = article.content ? convertRelativeUrls(article.content, JOOMLA_URL_BASE) : '';
        if (!article.content) {
            console.log('Article Händlerpreis not found');
        }
    }
    const resArticle2 = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=10&format=json`);
    const articleData2 = await resArticle2.json();
    const article2 = articleData2.article || null;
    if (article2) {
        article2.content = article2.content ? convertRelativeUrls(article2.content, JOOMLA_URL_BASE) : '';
        if (!article2.content) {
            console.log('Filterreinigungsmaschinen not found');
        }
    }
    const resArticle3 = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=11&format=json`);
    const articleData3 = await resArticle3.json();
    const article3 = articleData3.article || null;
    if (article3) {
        article3.content = article3.content ? convertRelativeUrls(article3.content, JOOMLA_URL_BASE) : '';
        if (!article3.content) {
            console.log('PKW - Filterreinigung UNTEN not found');
        }
    }
    return {
        props: {
            article,
            article2,
            article3
        },
    };
}
 export default function AnfrageHaendlerpreis({article, article2, article3}) {

     const [formData, setFormData] = useState({
         name: "",
         firma: "",
         email: "",
         strasse: "",
         plz: "",
         ort: "",
         telefon: "",
     });
     const [validated, setValidated] = useState(false);
     const [errors, setErrors] = useState({});
     const [successMessage, setSuccessMessage] = useState('');

     const handleInputChange = (e) => {
         const { name, value } = e.target;
         setFormData((prevData) => ({ ...prevData, [name]: value }));
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
         if (form.checkValidity() === false ) {
             e.stopPropagation();
             setValidated(true);
             return;
         }
         try {
             const payload = {
                 name: formData.name,
                 firma: formData.firma,
                 email: formData.email,
                 ort: formData.ort,
                 strasse: formData.strasse,
                 plz: formData.plz,
                 telefon: formData.telefon,

             };
             const response = await fetch(`${JOOMLA_API_BASE}&task=anfrageHaendlerPreis&format=json`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(payload),
             });
             const data = await response.json();

             if (!response.ok) {
                 console.log('Registration Error', data);
                 setErrors({ apiError: data?.message || 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.'});
                 scrollToTop();
             } else {
                 if (data.status === 'success') {
                     setSuccessMessage(data.message);

                     setFormData({
                         name: '',
                         email: '',
                         firma: '',
                         strasse: '',
                         plz: '',
                         ort: '',
                         telefon: '',
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
             scrollToTop();
         }
     }

     return (
            <>

                <Row className="mb-3 g-0">
                    <Col md={"12"}>
                        {errors.apiError && <Alert variant="danger">{errors.apiError}</Alert>}
                        {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    </Col>
                </Row>
                <Row className="g-0">
                    <Col sm={"8"}>
                        <Row className="g-0 p-4 product-detail-view rounded-4">
                            <Col sm={"12"} className={"mb-3"}>
                                <Row className="g-0 pb-3">
                                    <h1 className={"mb-1"}>Anfrage Händlerpreis</h1>
                                    <h4>Bitte das Formular ausfüllen und absenden</h4>
                                </Row>
                                <Row className={"g-0"}>
                                    <Col sm={"col"}>
                                        {article?.content && (
                                            <div dangerouslySetInnerHTML={{ __html: article.content}} />
                                        )}
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={"12"}>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Row className="mb-3 g-0">
                                        <Form.Group as={Col} sm="12" md={"6"} controlId="regName">
                                            <Form.Label>Name <span className="required">*</span></Form.Label>
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
                                        <Form.Group as={Col} sm="12" md={"6"} controlId="regPTelefon">
                                            <Form.Label>PLZ <span className="required">*</span></Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="Telefon"
                                                name="telefon"
                                                value={formData.telefon}
                                                onChange={handleInputChange}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Bitte geben Sie die Telefonnummer ein
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3 g-0">
                                        <Col md={"12"}><span className="required">*</span> Benötigtes Feld</Col>
                                    </Row>
                                    <Row className="mb-3 pt-3 justify-content-start">
                                        <Col sm={"4"} className={"pb-3 pb-sm-0"}>
                                            <Button className={"btn btn-primary btn-green w-100"} type="submit">senden</Button>
                                        </Col>
                                        <Col sm={"4"}>
                                            <Button className={"btn btn-primary btn-green w-100"} type="button" onClick={() => router.push('/')}>abbrechen</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                    </Col>
                    <Col sm={"4"} className={"text-center text-sm-end"}>
                        <Pictos />
                    </Col>
                </Row>



                <div className={"w-100 pb-4"}></div>
                <Row className={"g-0"}>
                    <Col sm={"12"}>
                        {article2?.content && (
                            <div dangerouslySetInnerHTML={{ __html: article2.content}} />
                        )}
                    </Col>
                </Row>
                <div className={"w-100 pb-3"}></div>
                <Row className={"g-0"}>
                    <Col sm={"12"}>
                        {article3?.content && (
                            <div dangerouslySetInnerHTML={{ __html: article3.content}} />
                        )}
                    </Col>
                </Row>

            </>
     );
 }
