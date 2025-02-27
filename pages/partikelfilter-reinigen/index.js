
import Image from "next/image";
import Link from "next/link";
import {useEffect} from "react";
import {useState} from "react";
import {JOOMLA_API_BASE} from "@/utils/config";
import {fixRelativeUrls} from "@/utils/fixRelativeUrl";

export async function getStaticProps({ params }) {

    const resPortal = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=28&format=json`);
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
    const [isHoveredRein, setIsHoveredRein] = useState(false);
    const [isHoveredAus, setIsHoveredAus] = useState(false);
    const [isHoveredNach, setIsHoveredNach] = useState(false);
    const [isHoveredBus, setIsHoveredBus] = useState(false);
    const [isHoveredBau, setIsHoveredBau] = useState(false);

    return (
        <>

            <div className={"row g-0"}>
                <h1 className={"pb-0 mb-1"}>Diesel Rußpartikelfilter reigen</h1>
                <h2 className={"display-4 mb-0"}>Bitte wählen Sie Ihren Fahrzeugtyp: PKW, LKW, Bus oder Baumaschinen.</h2>

            </div>
            <div className="w-100 pb-4"></div>
            <div className="d-flex p-3 product-detail-view rounded-4 align-items-center justify-content-evenly">
                <div className={"d-inline text-center p-3"} >
                    <Link className={"d-block"} href="/pkw-partikelfilter/pkw-filterreinigung" onMouseEnter={() => setIsHoveredRein(true)} onMouseLeave={() => setIsHoveredRein(false)}>
                        <h6>PKW</h6>
                        <Image className={"picto-170"} src={isHoveredRein ? "/images/icons/pkw-filterreinigung.png" : "/images/icons/pkw-rein-portal-mi.png"} alt={"PKW Filterreinigung"} width={170} height={170} layout="responsive"/>
                    </Link>
                </div>
                <div className={"d-inline text-center p-3"} >
                    <Link className={"d-block"} href="/pkw-partikelfilter/filterreinigung-berlin" onMouseEnter={() => setIsHoveredAus(true)} onMouseLeave={() => setIsHoveredAus(false)}>
                        <h6>PKW Berlin</h6>
                        <Image className={"picto-170"} src={isHoveredAus ? "/images/icons/pkw-filterreinigung.png" : "/images/icons/pkw-rein-portal-mi.png"} alt={"PKW Filterreinigung Berlin"} width={170} height={170} layout="responsive"/>
                    </Link>
                </div>
                <div className={"d-inline text-center p-3"} >
                    <Link className={"d-block"} href="/lkw-partikelfilter/lkw-filterreinigung" onMouseEnter={() => setIsHoveredNach(true)} onMouseLeave={() => setIsHoveredNach(false)}>
                        <h6>LKW</h6>
                        <Image className={"picto-170"} src={isHoveredNach ? "/images/icons/lkw-filterreinigung.png" : "/images/icons/lkw-filterreinigung.png"} alt={"LKW Filterreinigung"} width={170} height={170} layout="responsive"/>
                    </Link>
                </div>
                <div className={"d-inline text-center p-3"} >
                    <Link className={"d-block"} href="/bus-partikelfilter/bus-filterreinigung" onMouseEnter={() => setIsHoveredBus(true)} onMouseLeave={() => setIsHoveredBus(false)}>
                        <h6>BUS</h6>
                        <Image className={"picto-170"} src={isHoveredBus ? "/images/icons/bus-filterreinigung.png" : "/images/icons/bus-filterreinigung.png"} alt={"BUS Filterreinigung"} width={170} height={170} layout="responsive"/>
                    </Link>
                </div>
                <div className={"d-inline text-center p-3"} >
                    <Link className={"d-block"} href="/baumaschinen-partikelfilter/baumaschinen-filterreinigung" onMouseEnter={() => setIsHoveredBau(true)} onMouseLeave={() => setIsHoveredBau(false)}>
                        <h6>BAU</h6>
                        <Image className={"picto-170"} src={isHoveredBau ? "/images/icons/bau-filterreinigung.png" : "/images/icons/bau-filterreinigung.png"} alt={"BAU Filterreinigung"} width={170} height={170} layout="responsive"/>
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
