
import Image from "next/image";
import axios from 'axios';
import Link from "next/link";
import {useEffect} from "react";
import {useState} from "react";
import {JOOMLA_API_BASE, JOOMLA_URL_BASE} from "@/utils/config";
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import {fixRelativeUrls} from "@/utils/fixRelativeUrl";

export async function getStaticProps({ params }) {

    const resPortal = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=21&format=json`);
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
export default function Lkw({ portalArticle }) {
    const [isHoveredRein, setIsHoveredRein] = useState(false);
    const [isHoveredAus, setIsHoveredAus] = useState(false);

    return (
        <>

            <div className={"row g-0"}>
                <h1 className={"pb-0 mb-1"}>Bus Partikelfilter</h1>
                <h2 className={"display-4 mb-0"}>Bitte wählen Sie: Partikelfilter nachrüsten oder Reinigung von Partikelfiltern.</h2>
            </div>
            <div className="w-100 pb-4"></div>
            <div className="row p-3 product-detail-view rounded-4 align-items-center justify-content-evenly ">
                <div className={"col-auto text-center"} >
                    <Link href="/bus-partikelfilter/dpf-euro-vi" onMouseEnter={() => setIsHoveredRein(true)} onMouseLeave={() => setIsHoveredRein(false)}>
                        <h6>DPF EURO VI</h6>
                        <Image className={"picto-170"} src={isHoveredRein ? "/images/icons/bus-austauschfilter.png" : "/images/icons/bus-austauschfilter.png"} alt={"Bus DPF Euro VI"} width={170} height={170} layout="responsive"/>
                    </Link>
                </div>
                <div className={"col-auto text-center"} >
                    <Link href="/bus-partikelfilter/bus-filterreinigung" onMouseEnter={() => setIsHoveredAus(true)} onMouseLeave={() => setIsHoveredAus(false)}>
                            <h6>Filterreinigung</h6>
                            <Image className={"picto-170"} src={isHoveredAus ? "/images/icons/bus-filterreinigung.png" : "/images/icons/bus-filterreinigung.png"} alt={"Bus Filterreinigung"} width={170} height={170} layout="responsive"/>
                    </Link>
                </div>
            </div>
            <div className="w-100 pb-4"></div>
            <div className="row g-0 pb-4">
                <div className={"col"}>
                    {portalArticle.introtext && (
                        <div dangerouslySetInnerHTML={{ __html: portalArticle.introtext}} />
                    )}
                </div>
            </div>

        </>
    );
}
