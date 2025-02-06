import Image from "next/image";
import Link from "next/link";
import {useState} from "react";

export default function Pictos() {

    const [togglePictoDirect, setTogglePictoDirect] = useState(false);
    const [togglePictoLos, setTogglePictoLos] = useState(false);
    const [togglePictoAblauf, setTogglePictoAblauf] = useState(false);
    const [togglePictoDeWeit, setTogglePictoDeWeit] = useState(false);
    const [togglePictoSofort, setTogglePictoSofort] = useState(false);
    const [togglePictoIndustrie, setTogglePictoIndustrie] = useState(false);
    const [togglePictoExpress, setTogglePictoExpress] = useState(false);
    const [togglePictoFlyer, setTogglePictoFlyer] = useState(false);
    const [togglePictoFragen, setTogglePictoFragen] = useState(false);
    const [togglePictoHaendler, setTogglePictoHaendler] = useState(false);


    return (
        <>
            <a href="https://www.shopvote.de/bewertung_dieselpartikelfilter_net_8694.html" target="_blank">
                <img  className={"pb-2 pe-3"} src="https://widgets.shopvote.de/view.php?shopid=8694&amp;bn=51" id="svimage-51" alt="Shopbewertung - dieselpartikelfilter.net" border="0" align="bottom" hspace="1"/>
            </a>
            <Link href="/pkw-partikelfilter/pkw-filterreinigung/direkter-draht-zur-filterreinigung" onMouseOver={() => setTogglePictoDirect(true)} onMouseOut={() => setTogglePictoDirect(false)}>
                <Image src={togglePictoDirect ? "/images/pictos/rein_pikt_direct_over.png" : "/images/pictos/rein_pikt_direct.png"} alt={"direkter Draht"}
                       width={331} height={120}
                       className={"img-fluid picto-product ps-0 ps-sm-2"} />
            </Link>
            <Link href={"/pkw-partikelfilter/pkw-filterreinigung"} onMouseOver={() =>{if (!togglePictoLos) setTogglePictoLos(true);} } onMouseOut={() => {if (togglePictoLos) setTogglePictoLos(false);}}>
                <Image src={togglePictoLos ? "/images/pictos/rein_pikt_los_gehts_over.png" : "/images/pictos/rein_pikt_los_gehts.png"} alt={"Bestellformular"} width={331} height={120} className={"img-fluid picto-product ps-0 ps-sm-2 "} />
            </Link>
            <Link href={"/pkw-partikelfilter/pkw-filterreinigung/ablauf-filterreinigung"} onMouseOver={() => setTogglePictoAblauf(true)} onMouseOut={() => setTogglePictoAblauf(false)}>
                <Image src={togglePictoAblauf ? "/images/pictos/rein_pikt_ablauf_over.png" : "/images/pictos/rein_pikt_ablauf.png"} alt={"Ablauf Filterreinigung"} width={331} height={120} className={"img-fluid ps-0 ps-sm-2 picto-product "} />
            </Link>
            <Link href={"/pkw-partikelfilter/pkw-filterreinigung/aus-und-einbau-deutschlandweit"} onMouseOver={() => setTogglePictoDeWeit(true)} onMouseOut={() => setTogglePictoDeWeit(false)}>
                <Image src={togglePictoDeWeit ? "/images/pictos/rein_pikt_de_weit_over.png" : "/images/pictos/rein_pikt_de_weit.png"} alt={"Einbau deutschlandweit"} width={331} height={120} className={"img-fluid ps-0 ps-sm-2 picto-product "} />
            </Link>
            <Link href={"/pkw-partikelfilter/pkw-filterreinigung/sofortabholung"} onMouseOver={() => setTogglePictoSofort(true)} onMouseOut={() => setTogglePictoSofort(false)}>
                <Image src={togglePictoSofort ? "/images/pictos/rein_pikt_sofortabholung_over.png" : "/images/pictos/rein_pikt_sofortabholung.png"} alt={"Sofortabholung"} width={331} height={120} className={"img-fluid ps-0 ps-sm-2 picto-product "} />
            </Link>
            <Link href={"/pkw-partikelfilter/pkw-filterreinigung/industriereinigung"} onMouseOver={() => setTogglePictoIndustrie(true)} onMouseOut={() => setTogglePictoIndustrie(false)}>
                <Image src={togglePictoIndustrie ? "/images/pictos/rein_pikt_industrie_over.png" : "/images/pictos/rein_pikt_industrie.png"} alt={"Industriereinigung"} width={331} height={120} className={"img-fluid ps-0 ps-sm-2 picto-product "} />
            </Link>
            <Link href={"/pkw-partikelfilter/pkw-filterreinigung/express-service"} onMouseOver={() => setTogglePictoExpress(true)} onMouseOut={() => setTogglePictoExpress(false)}>
                <Image src={togglePictoExpress ? "/images/pictos/rein_pikt_express_over.png" : "/images/pictos/rein_pikt_express.png"} alt={"Express-Service"} width={331} height={120} className={"img-fluid ps-0 ps-sm-2 picto-product "} />
            </Link>
            <Link href={"/pkw-partikelfilter/pkw-filterreinigung/greencar-flyer"} onMouseOver={() => setTogglePictoFlyer(true)} onMouseOut={() => setTogglePictoFlyer(false)}>
                <Image src={togglePictoFlyer ? "/images/pictos/rein_pikt_flyer_over.png" : "/images/pictos/rein_pikt_flyer.png"} alt={"Greencar-Flyer"} width={331} height={120} className={"img-fluid ps-0 ps-sm-2 picto-product "} />
            </Link>
            <Link href={"/pkw-partikelfilter/pkw-filterreinigung/fragenkatalog"} onMouseOver={() => setTogglePictoFragen(true)} onMouseOut={() => setTogglePictoFragen(false)}>
                <Image src={togglePictoFragen ? "/images/pictos/rein_pikt_fragen_over.png" : "/images/pictos/rein_pikt_fragen.png"} alt={"Fragenkatalog"} width={331} height={120} className={"img-fluid ps-0 ps-sm-2 picto-product "} />
            </Link>
            <Link href={"/pkw-partikelfilter/pkw-filterreinigung/anfrage-haendlerpreis"} onMouseOver={() => setTogglePictoHaendler(true)} onMouseOut={() => setTogglePictoHaendler(false)}>
                <Image src={togglePictoHaendler ? "/images/pictos/rein_pikt_haendler_over.png" : "/images/pictos/rein_pikt_haendler.png"} alt={"Händlerpreis"} width={331} height={120} className={"img-fluid ps-0 ps-sm-2 picto-product "} />
            </Link>

        </>
    );
}
