
import Image from "next/image";
import axios from 'axios';
import Link from "next/link";
import {useEffect} from "react";
import {useState} from "react";
import {JOOMLA_API_BASE, JOOMLA_URL_BASE} from "@/utils/config";
import {fixRelativeUrls} from "@/utils/fixRelativeUrl";

export async function getStaticProps({ params }) {

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
            portalArticle,
        },
    };
}
export default function Pkw({ portalArticle }) {
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

            <div className={"row g-0"}>
                <h1 className={"pb-0 mb-1"}>PKW Partikelfilter</h1>
                {haendler
                    ? (
                        <h2 className={"display-4 mb-0"}>Bitte wählen Sie: Partikelfilter austauschen oder Reinigung von Partikelfiltern.</h2>
                    ):
                    (
                        <h2 className={"display-4 mb-0"}>Bitte wählen Sie: Partikelfilter nachrüsten, austauschen oder Reinigung von Partikelfiltern.</h2>
                    )
                }
            </div>
            <div className="w-100 pb-4"></div>
            <div className="row p-3 product-detail-view rounded-4 align-items-center justify-content-evenly">
                            {haendler
                                ? (
                                    <>
                                        <div className={"col-auto text-center p-3"} >
                                            <Link className={"d-block"} href="/pkw-partikelfilter/pkw-filterreinigung" onMouseEnter={() => setIsHoveredRein(true)} onMouseLeave={() => setIsHoveredRein(false)}>
                                                <h6>PKW Filterreinigung</h6>
                                                <Image className={"picto-170"} src={isHoveredRein ? "/images/icons/pkw-filterreinigung.png" : "/images/icons/pkw-rein-portal-mi.png"} alt={"PKW Filterreinigung"} width={170} height={170} layout="responsive"
                                                    />
                                            </Link>
                                        </div>
                                        <div className={"col-auto text-center p-3"} >
                                            <Link className={"d-block"} href="/pkw-partikelfilter/pkw-austauschfilter" onMouseEnter={() => setIsHoveredAus(true)} onMouseLeave={() => setIsHoveredAus(false)}>
                                                <h6>PKW Austauschfilter</h6>
                                                <Image className={"picto-170"} src={isHoveredAus ? "/images/icons/pkw-austauschfilter.png" : "/images/icons/pkw-austausch-portal-mi.png"} alt={"PKW Austauschfilter"} width={170} height={170} layout="responsive"/>
                                            </Link>
                                        </div>
                                    </>
                                ):
                                (
                                <>
                                    <div className={"col-auto text-center p-3"} >
                                        <Link className={"d-block"} href="/pkw-partikelfilter/pkw-filterreinigung" onMouseEnter={() => setIsHoveredRein(true)} onMouseLeave={() => setIsHoveredRein(false)}>
                                            <h6>PKW Filterreinigung</h6>
                                            <Image className={"picto-170"} src={isHoveredRein ? "/images/icons/pkw-filterreinigung.png" : "/images/icons/pkw-rein-portal-mi.png"} alt={"PKW Filterreinigung"} width={170} height={170} layout="responsive"
                                            />
                                        </Link>
                                    </div>
                                    <div className={"col-auto text-center p-3"} >
                                        <Link className={"d-block"} href="/pkw-partikelfilter/pkw-austauschfilter" onMouseEnter={() => setIsHoveredAus(true)} onMouseLeave={() => setIsHoveredAus(false)}>
                                            <h6>PKW Austauschfilter</h6>
                                            <Image className={"picto-170"} src={isHoveredAus ? "/images/icons/pkw-austauschfilter.png" : "/images/icons/pkw-austausch-portal-mi.png"} alt={"PKW Austauschfilter"} width={170} height={170} layout="responsive"/>
                                        </Link>
                                    </div>
                                    <div className={"col-auto text-center p-3"} >
                                        <Link className={"d-block"} href="/pkw-partikelfilter/pkw-nachruestfilter" onMouseEnter={() => setIsHoveredNach(true)} onMouseLeave={() => setIsHoveredNach(false)}>
                                            <h6>PKW Nachruestfilter</h6>
                                            <Image className={"picto-170"} src={isHoveredNach ? "/images/icons/pkw-nachruestfilter.png" : "/images/icons/pkw-nachruest-portal-mi.png"} alt={"PKW Austauschfilter"} width={170} height={170} layout="responsive"/>
                                        </Link>
                                    </div>
                                </>
                                )
                            }
            </div>
            <div className="w-100 pb-4"></div>
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

        </>
    );
}
