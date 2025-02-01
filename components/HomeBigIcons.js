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
                    <div className={"col-auto bg-gc-light-blue p-3 rounded-4 shadow"}>
                        <Link href={"/pkw-partikelfilter/pkw-filterreinigung"}>
                            <Image src={"/images/icons/PKW_Reinigung_mouse.png"} alt={"PKW Filterreinigung"} width={230} height={253} onMouseEnter={() => setIsHoveredReinPkw(true)} onMouseLeave={() => setIsHoveredReinPkw(false)} />
                        </Link>
                    </div>
                    <div className={"col-auto bg-gc-light-blue p-3 rounded-4 shadow"}>
                        <Link href={"/lkw-partikelfilter/lkw-filterreinigung"}>
                            <Image src={"/images/icons/LKW_Reinigung_mouse.png"} alt={"LKW Filterreinigung"} width={230} height={253} onMouseEnter={() => setIsHoveredReinLKW(true)} onMouseLeave={() => setIsHoveredReinLKW(false)} />
                        </Link>
                    </div>
                    <div className={"col-auto bg-gc-light-blue p-3 rounded-4 shadow"}>
                        <Link href={"/lkw-partikelfilter/schalldaempfer-euro-vi"}>
                            <Image src={"/images/icons/lkw-austauschfilter_in.png"} alt={"LKW Schalldämpfer"} width={196} height={255} />
                        </Link>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
}
