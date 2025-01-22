
import Image from "next/image";
import axios from 'axios';
import Link from "next/link";
import {useEffect} from "react";
import {useState} from "react";
import {JOOMLA_API_BASE, JOOMLA_URL_BASE} from "@/utils/config";
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import {fixRelativeUrls} from "@/utils/fixRelativeUrl";

export async function getStaticProps({ params }) {
    // Base URL of your Joomla server (adjust this to your Joomla installation URL)
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
    const resPortal = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=6&format=json`);
    const portalData = await resPortal.json();
    // Extract the footer article from the response
    const portalArticle = portalData.article || null;
    // Convert relative URLs in the footer content to absolute URLs
    if (portalArticle) {
        portalArticle.introtext = portalArticle.introtext ? fixRelativeUrls(portalArticle.introtext) : '';
        if (!portalArticle.introtext) {
            console.log('portalArticle.introtext not found');
        }
    }
    return {
        props: {
            footerArticle,
            portalArticle,
        },
    };
}
export default function Pkw({ footerArticle, portalArticle }) {
    const[haendler, setHaendler] = useState(false);
    const [isHoveredRein, setIsHoveredRein] = useState(false);
    const [isHoveredAus, setIsHoveredAus] = useState(false);
    const [isHoveredNach, setIsHoveredNach] = useState(false);

    useEffect(() => {
        const authToken = typeof window !== "undefined" && sessionStorage.getItem("authToken");
        if(authToken){
            setHaendler(true);
        }

    } , []);
    return (
        <>
            <main>
                <div className="container-fluid container-greencar">
                    <div className="row g-0 p-4 mb-4">
                        <h4 className={"pb-4"}>PKW Partikelfilter</h4>
                        {haendler
                            ? (
                                <div className={"col"}>
                                    Bitte wählen Sie:<br/>
                                    Partikelfilter austauschen oder Reinigung von Partikelfiltern.
                                </div>
                            ):
                            (
                                <div className={"col"}>
                                    Bitte wählen Sie:<br/>
                                    Partikelfilter nachrüsten, austauschen oder Reinigung von Partikelfiltern.
                                </div>
                            )
                        }
                    </div>
                    <div className="row g-0 p-4">
                            {haendler
                                ? (
                                    <>
                                        <div className={"col-sm-4"} >
                                            <Link href="/pkw-partikelfilter/pkw-filterreinigung" passHref legacyBehavior>
                                                <a className={""}  onMouseEnter={() => setIsHoveredRein(true)} onMouseLeave={() => setIsHoveredRein(false)}>
                                                    <h6>PKW Filterreinigung</h6>
                                                    <Image className={"picto-170"} src={isHoveredRein ? "/images/icons/pkw-filterreinigung.png" : "/images/icons/pkw-rein-portal-mi.png"} alt={"PKW Filterreinigung"} width={170} height={170} layout="responsive"
                                                    />
                                                </a>
                                            </Link>
                                        </div>
                                        <div className={"col-sm-4"} >
                                            <Link href="/pkw-partikelfilter/pkw-austauschfilter" passHref legacyBehavior>
                                                <a className={""} onMouseEnter={() => setIsHoveredAus(true)} onMouseLeave={() => setIsHoveredAus(false)}>
                                                    <h6>PKW Austauschfilter</h6>
                                                    <Image className={"picto-170"} src={isHoveredAus ? "/images/icons/pkw-austauschfilter.png" : "/images/icons/pkw-austausch-portal-mi.png"} alt={"PKW Austauschfilter"} width={170} height={170} layout="responsive"/>
                                                </a>
                                            </Link>
                                        </div>
                                    </>
                                ):
                                (
                                <>
                                    <div className={"col-sm-4"} >
                                        <Link href="/pkw-partikelfilter/pkw-filterreinigung" passHref legacyBehavior>
                                            <a className={""}  onMouseEnter={() => setIsHoveredRein(true)} onMouseLeave={() => setIsHoveredRein(false)}>
                                                <h6>PKW Filterreinigung</h6>
                                                <Image className={"picto-170"} src={isHoveredRein ? "/images/icons/pkw-filterreinigung.png" : "/images/icons/pkw-rein-portal-mi.png"} alt={"PKW Filterreinigung"} width={170} height={170} layout="responsive"
                                                />
                                            </a>
                                        </Link>
                                    </div>
                                    <div className={"col-sm-4"} >
                                        <Link href="/pkw-partikelfilter/pkw-austauschfilter" passHref legacyBehavior>
                                            <a className={""} onMouseEnter={() => setIsHoveredAus(true)} onMouseLeave={() => setIsHoveredAus(false)}>
                                                <h6>PKW Austauschfilter</h6>
                                                <Image className={"picto-170"} src={isHoveredAus ? "/images/icons/pkw-austauschfilter.png" : "/images/icons/pkw-austausch-portal-mi.png"} alt={"PKW Austauschfilter"} width={170} height={170} layout="responsive"/>
                                            </a>
                                        </Link>
                                    </div>
                                    <div className={"col-sm-4"} >
                                        <Link href="/pkw-partikelfilter/pkw-nachruestfilter" passHref legacyBehavior>
                                            <a className={""} onMouseEnter={() => setIsHoveredNach(true)} onMouseLeave={() => setIsHoveredNach(false)}>
                                                <h6>PKW Nachruestfilter</h6>
                                                <Image className={"picto-170"} src={isHoveredNach ? "/images/icons/pkw-nachruestfilter.png" : "/images/icons/pkw-nachruest-portal-mi.png"} alt={"PKW Austauschfilter"} width={170} height={170} layout="responsive"/>
                                            </a>
                                        </Link>
                                    </div>
                                </>
                                )
                            }
                    </div>
                    {!haendler
                        ? (
                            <div className="row g-0 pb-4">
                                <div className={"col"}>
                                    {portalArticle.introtext && (
                                        <div dangerouslySetInnerHTML={{ __html: portalArticle.introtext}} />
                                    )}
                                </div>
                            </div>
                        )
                        :
                        ""
                    }
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
}
