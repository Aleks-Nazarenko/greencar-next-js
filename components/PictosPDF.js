import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import {JOOMLA_URL_BASE} from "@/utils/config";

export default function Pictos() {

    const [togglePictoDirect, setTogglePictoDirect] = useState(false);
    const [togglePictoDeWeit, setTogglePictoDeWeit] = useState(false);
    const [togglePictoSofort, setTogglePictoSofort] = useState(false);
    const [togglePictoIndustrie, setTogglePictoIndustrie] = useState(false);
    const [togglePictoExpress, setTogglePictoExpress] = useState(false);
    const [togglePictoHaendler, setTogglePictoHaendler] = useState(false);


    return (
        <>
            <Link href={`${JOOMLA_URL_BASE}/images/kundenflyer_neu.pdf`}  onMouseOver={() => setTogglePictoDirect(true)} onMouseOut={() => setTogglePictoDirect(false)}>
                <Image src={togglePictoDirect ? "/images/pictos/rein_pikt_direct_over.png" : "/images/pictos/rein_pikt_direct.png"} alt={"direkter Draht"}
                       width={331} height={120}
                       className={"img-fluid picto-product ps-0 ps-sm-2"} />
            </Link>

            <Link href={`${JOOMLA_URL_BASE}/images/kundenflyer_neu.pdf`} onMouseOver={() => setTogglePictoSofort(true)} onMouseOut={() => setTogglePictoSofort(false)} target={'_blank'} rel={'noopener'}>
                <Image src={togglePictoSofort ? "/images/pictos/rein_pikt_sofortabholung_over.png" : "/images/pictos/rein_pikt_sofortabholung.png"} alt={"Sofortabholung"} width={331} height={120} className={"img-fluid ps-0 ps-sm-2 picto-product "} />
            </Link>
            <Link href={`${JOOMLA_URL_BASE}/images/kundenflyer_neu.pdf`}  onMouseOver={() => setTogglePictoExpress(true)} onMouseOut={() => setTogglePictoExpress(false)} target={'_blank'} rel={'noopener'}>
                <Image src={togglePictoExpress ? "/images/pictos/rein_pikt_express_over.png" : "/images/pictos/rein_pikt_express.png"} alt={"Express-Service"} width={331} height={120} className={"img-fluid ps-0 ps-sm-2 picto-product "} />
            </Link>
            <Link href={`${JOOMLA_URL_BASE}/images/kundenflyer_neu.pdf`} onMouseOver={() => setTogglePictoDeWeit(true)} onMouseOut={() => setTogglePictoDeWeit(false)} target={'_blank'} rel={'noopener'}>
                <Image src={togglePictoDeWeit ? "/images/pictos/rein_pikt_de_weit_over.png" : "/images/pictos/rein_pikt_de_weit.png"} alt={"Einbau deutschlandweit"} width={331} height={120} className={"img-fluid ps-0 ps-sm-2 picto-product "} />
            </Link>
            <Link href={`${JOOMLA_URL_BASE}/images/kundenflyer_neu.pdf`}  onMouseOver={() => setTogglePictoIndustrie(true)} onMouseOut={() => setTogglePictoIndustrie(false)} target={'_blank'} rel={'noopener'}>
                <Image src={togglePictoIndustrie ? "/images/pictos/rein_pikt_industrie_over.png" : "/images/pictos/rein_pikt_industrie.png"} alt={"Industriereinigung"} width={331} height={120} className={"img-fluid ps-0 ps-sm-2 picto-product "} />
            </Link>

            <Link href={`${JOOMLA_URL_BASE}/images/kundenflyer_neu.pdf`}  onMouseOver={() => setTogglePictoHaendler(true)} onMouseOut={() => setTogglePictoHaendler(false)} target={'_blank'} rel={'noopener'}>
                <Image src={togglePictoHaendler ? "/images/pictos/filterreinigung-mobilitaet.png" : "/images/pictos/filterreinigung-mobilitaet.png"} alt={"Mobilitätsgsrantie"} width={331} height={120} className={"img-fluid ps-0 ps-sm-2 picto-product "} />
            </Link>

        </>
    );
}
