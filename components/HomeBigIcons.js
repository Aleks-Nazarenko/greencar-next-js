import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import {useState} from "react";

export default function HomeBigIcons () {
    const [isHoveredReinPkw, setIsHoveredReinPkw] = useState(false);
    const [isHoveredReinLKW, setIsHoveredReinLKW] = useState(false);

    const router = useRouter();
    return (
        <>
            {router.pathname === "/" ? (
                <div className="row g-0 justify-content-between">
                    <div className={"col bg-gc-light-blue p-2 pb-3 rounded-4 shadow gc-max-width me-1"}>
                        <Link href={"/pkw-partikelfilter/pkw-filterreinigung"} className={"d-block"}>
                            <div className={"d-flex justify-content-center gc-green-light gc-bold"}>
                                PKW Filter&shy;reinigung
                            </div>
                            <Image  onMouseEnter={() => setIsHoveredReinPkw(true)} onMouseLeave={() => setIsHoveredReinPkw(false)}
                                   src={isHoveredReinPkw ? "/images/icons/PKW_Reinigung_mouse_in.png" : "/images/icons/PKW_Reinigung_mouse.png"} alt={"PKW Filterreinigung"} width={230} height={253}
                                   style={{maxWidth:"230px",width:"100%",height:"auto"}}
                            />
                        </Link>
                    </div>
                    <div className={"col bg-gc-light-blue p-2 pb-3 rounded-4 shadow gc-max-width  me-1"}>
                        <Link href={"/lkw-partikelfilter/lkw-filterreinigung"} className={"d-block"}>
                            <div className={"d-flex justify-content-center gc-green-light gc-bold"}>
                                LKW Filter&shy;reinigung
                            </div>
                            <Image  onMouseEnter={() => setIsHoveredReinLKW(true)} onMouseLeave={() => setIsHoveredReinLKW(false)}
                                   src={isHoveredReinLKW ? "/images/icons/LKW_Reinigung_mouse_in.png" : "/images/icons/LKW_Reinigung_mouse.png"} alt={"PKW Filterreinigung"} width={230} height={253}
                                   style={{maxWidth:"230px",width:"100%",height:"auto"}}
                            />
                        </Link>
                    </div>
                    <div className={"col bg-gc-light-blue p-2 rounded-4 shadow gc-max-width d-flex justify-content-center "}>
                        <Link href={"/lkw-partikelfilter/schalldaempfer-euro-vi"} className={"d-block"}>
                            <div className={"d-flex justify-content-center gc-green-light gc-bold"} style={{paddingBottom:"26px"}}>
                                LKW Schall&shy;dämpfer
                            </div>
                            <Image src={"/images/icons/lkw-austauschfilter_in.png"} alt={"LKW Schalldämpfer"} width={196} height={255} style={{maxWidth:"188px",width:"100%",height:"auto"}}/>
                        </Link>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
}
