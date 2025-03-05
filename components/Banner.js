import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Banner () {
    const router = useRouter();
    // Ensure the router is ready before accessing `router.pathname`
  //  if (!router.isReady) return null;
    return (
        <>
            { router.pathname === "/pkw-partikelfilter/pkw-filterreinigung"  && (
                <>
                    <div className={"container-greencar container-fluid bg-gc-light-blue rounded-4 g-0 p-sm-4 p-3 pt-2 pb-2  shadow"}>
                        <div className={"row g-0"}>
                            <div className={"col d-flex justify-content-center"}>
                                <Image src={"/images/banner/filterreinigung_pkw_header_161222.png"} alt={"PKW Filterreinigung"} width={885} height={221} className={"img-fluid"} priority={true} />
                            </div>
                        </div>
                    </div>
                    <div className={"w-100 pt-4"}/>
                </>
            )}
            { router.pathname === "/pkw-partikelfilter/filterreinigung-berlin"  && (
                <>
                    <div className={"container-greencar container-fluid bg-gc-light-blue rounded-4 g-0 p-sm-4 p-3 pt-2 pb-2  shadow"}>
                        <div className={"row g-0"}>
                            <div className={"col d-flex justify-content-center"}>
                                <Image src={"/images/banner/filterreinigung_pkw_berlin_header_neu.png"} alt={"PKW Filterreinigung"} width={885} height={175} className={"img-fluid"} priority={true} />
                            </div>
                        </div>
                    </div>
                    <div className={"w-100 pt-4"}/>
                </>
            )}
            { (router.pathname.startsWith( "/lkw-partikelfilter/lkw-filterreinigung") || router.pathname.startsWith("/bus-partikelfilter/bus-filterreinigung") || router.pathname.startsWith("/baumaschinen-partikelfilter/baumaschinen-filterreinigun"))  && (
                <>
                    <div className={"container-greencar container-fluid bg-gc-light-blue rounded-4 g-0 p-sm-4 p-3 pt-2 pb-2 shadow"}>
                        <div className={"row g-0"}>
                            <div className={"col d-flex justify-content-center"}>
                                <Image src={"/images/banner/240712_filterreinigung_lkw_header_be.png"} alt={"LKW Schalldämpfer"} width={885} height={221} className={"img-fluid"} priority={true}/>
                            </div>
                        </div>
                    </div>
                    <div className={"w-100 pt-4"}/>
                </>
            )}
        </>
    );
}
