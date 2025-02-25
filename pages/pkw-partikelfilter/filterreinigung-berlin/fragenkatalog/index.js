import {JOOMLA_API_BASE, JOOMLA_URL_BASE} from "@/utils/config";
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import Pictos from "@/components/PictosBerlin";
import Link from "next/link";
import Image from "next/image";
import {useState} from "react";




export async function getStaticProps() {
    const resArticle = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=17&format=json`);
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

    const [togglePictoLos, setTogglePictoLos] = useState(false);

    return (
        <>

            <Row className="g-0">
                <Col sm={"8"}>
                    <Row className="g-0 p-3 p-sm-4 product-detail-view rounded-4">
                        <Col sm={"12"} className={"mb-3"}>
                            <Row className={"g-0"}>
                                <Col sm={"12"}>
                                    {article?.content && (
                                        <div dangerouslySetInnerHTML={{ __html: article.content}} />
                                    )}
                                </Col>
                            </Row>
                            <div className={"w-100 pb-2"}></div>
                            <Row className={"g-0"}>
                                <Col sm={"12"}>
                                    <div className={"w-100 pb-4"}></div>
                                    <h4>Unter "Los geht's" können Sie unser unverbindliches Anfrageformular ausfüllen oder eine ökologische Industriereinigung beauftragen.</h4>
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
