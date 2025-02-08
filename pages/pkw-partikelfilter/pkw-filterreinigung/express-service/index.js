import {JOOMLA_API_BASE, JOOMLA_URL_BASE} from "@/utils/config";
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import Pictos from "@/components/Pictos";
import Link from "next/link";
import Image from "next/image";
import {useState} from "react";
import MapComponent from "@/components/MapComponent";




export async function getStaticProps() {
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
            article2,
            article3
        },
    };
}
export default function AnfrageHaendlerpreis({article2, article3}) {

    // Utility function to format a date to "DD.MM.YYYY"
    const formatDateToGerman = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };
    // Utility function to determine the next valid day (skipping weekends)
    const getNextValidDay = (date) => {
        // If the date falls on Saturday (6) or Sunday (0), adjust it to the next Monday
        while (date.getDay() === 0 || date.getDay() === 6) {
            date.setDate(date.getDate() + 2);
        }
        return date;
    };

    const [togglePictoLos, setTogglePictoLos] = useState(false);
    const [selectedDate, setSelectedDate] = useState(() => {
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        // Skip to Monday if tomorrow is a weekend
        if (tomorrow.getDay() === 6) {
            // If it's Saturday, add 2 days to get to Monday
            tomorrow.setDate(tomorrow.getDate() + 2);
        } else if (tomorrow.getDay() === 0) {
            // If it's Sunday, add 1 day to get to Monday
            tomorrow.setDate(tomorrow.getDate() + 1);
        }
        return tomorrow.toISOString().split('T')[0]; // Set initial date to tomorrow in "YYYY-MM-DD" format
    });
    const [nextDay, setNextDay] = useState(() => {
        let dayAfterTomorrow = new Date();
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 3);
        dayAfterTomorrow = getNextValidDay(dayAfterTomorrow);
        return formatDateToGerman(dayAfterTomorrow); // Correctly format the initial value
    });
    const handleDateChange = (e) => {
        let selected = new Date(e.target.value);

        // If the selected date falls on a weekend, adjust it to the next valid weekday
        if (selected.getDay() === 0 || selected.getDay() === 6) {
            selected = getNextValidDay(selected);
        }

        setSelectedDate(selected.toISOString().split('T')[0]);

        // Set the next day after the selected date, skipping weekends
        let next = new Date(selected);
        next.setDate(selected.getDate() + 2);
        next = getNextValidDay(next);
        setNextDay(formatDateToGerman(next));
    };



    return (
        <>

            <Row className="g-0">
                <Col sm={"8"}>
                    <Row className="g-0 p-3 p-sm-4 product-detail-view rounded-4">
                        <Col sm={"12"} className={"mb-3"}>
                            <Row className={"g-0"}>
                                <Col sm={"12"}>
                                    <h2>1. 48h Express-Service!</h2>
                                    <h4>Der 48h Expressservice wird von uns garantiert. Und zwar inklusive der Transportzeit. Von Abholung bis zur Zustellung!</h4>
                                </Col>
                            </Row>
                            <div className=" row g-0 bg-white rounded-4 p-3 mt-4 date-selection">
                                <div className={"display-4 pb-2"}>48h Express-Service Rechner!</div>

                                <div className={"col-12"}>Abholdatum des ausgebauten Partikelfilters:</div>
                                <div className={"col-sm-6 col-12"}>
                                    <input
                                        type="date"
                                        value={selectedDate || ''}
                                        onChange={handleDateChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className={"form-control"} aria-label="form-date"
                                    />
                                </div>
                                <div>bis 16:00 Uhr</div>
                                <div className={"w-100 pb-2"}> </div>

                                <div className="col-sm-6 col-12 next-day">
                                    <div>Zustellung des gereinigten Partikelfilters</div>
                                    <input type="text" value={nextDay || ''} readOnly className={"form-control"} aria-label="form-input"/>
                                    <div>bis 12:00 Uhr garantiert!</div>

                                </div>
                            </div>
                            <div className={"w-100 pb-4"}></div>
                            <Row className={"g-0"}>
                                <Col>
                                    <h3>2. inkl. Zertifikat, Prüfrotokoll & Garantie</h3>
                                    <div className={"w-100 pb-4"}></div>
                                    <Image src={"/images/filterreinigung/rein_image_protokoll.jpg"} alt={'Filterreinigung Zertifikat'} width={585} height={836} className={"img-fluid"} />
                                </Col>

                            </Row>
                            <div className={"w-100 pb-2"}></div>
                            <Row className={"g-0"}>
                                <Col sm={"12"}>
                                    <div className={"w-100 pb-4"}></div>
                                    <h4>Unter "Unter "Los geht's" können Sie unser unverbindliches Anfrageformular ausfüllen.</h4>
                                    <Link href={"/pkw-partikelfilter/pkw-filterreinigung"} onMouseOver={() =>{if (!togglePictoLos) setTogglePictoLos(true);} } onMouseOut={() => {if (togglePictoLos) setTogglePictoLos(false);}}>
                                        <Image src={togglePictoLos ? "/images/pictos/rein_pikt_los_gehts_over.png" : "/images/pictos/rein_pikt_los_gehts.png"} alt={"Bestellformular"} width={331} height={120} className={"img-fluid picto-product ps-0 ps-sm-2 "} />
                                    </Link>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col sm={"4"} className={"text-center text-sm-end"}>
                    <Pictos />
                </Col>
            </Row>
            <div className={"w-100 pt-4"}></div>
            <div className={"row g-0 bg-white rounded-4 p-4"} style={{border:"1px solid green"}}>
                <div className={"col d-flex justify-content-center"}>
                    <iframe src="https://widgets.shopvote.de/bs-widget.php?shopid=8694" style={{ position: "relative", height: "280px", width:"100%", maxWidth: "300px", borderStyle: "none", overflow: "hidden"} } scrolling="no"></iframe>
                </div>
            </div>
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
