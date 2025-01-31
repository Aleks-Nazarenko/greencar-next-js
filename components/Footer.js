import Image from "next/image";
import Link from "next/link";

export default function Footer() {

    return (
        <>
            <div className="row g-0 justify-content-end pb-1 gc-green">
                <div className={"col-auto me-4"}>
                    <Link href={"/impressum"}>AGB & Impressum</Link>
                </div>
                <div className={"col-auto"}>
                    <Link href={"/datenschutzerklaerung"}>Datenschutzerklärung</Link>
                </div>
            </div>
            <div className="row g-0">
                <div className={"col d-flex justify-content-between align-items-center"}>
                    <Image src={"/images/footer/winkler-logo_RGB_grau.png"} alt={"Winkler Logo"} width={100} height={65} />
                    <Image src={"/images/footer/ATU_Logo_2021_RGB_grau.png"} alt={"ATU Logo"} width={100} height={50} />
                    <Image src={"/images/footer/kraft_neu_jpg_grau-01.png"} alt={"Kraft Logo"} width={100} height={33} />
                    <Image src={"/images/footer/Premio_Reifenservice_Logo_grau_svg-01.png"} alt={"Premio Logo"} width={100} height={31} />
                    <Image src={"/images/footer/Euromaster_Logo_jpg_grau-01.png"} alt={"Euromaster Logo"} width={100} height={23} />
                    <Image src={"/images/footer/Vergoelst_grau_logo_BW.png"} alt={"Vergoelst Logo"} width={100} height={25} />
                    <Image src={"/images/footer/logo_techno_png_grau-01.png"} alt={"Techno Logo"} width={100} height={33} />
                    <Image src={"/images/footer/logo_reifenhelm_png_grau-01.png"} alt={"Reifenhelm Logo"} width={100} height={23} />
                </div>
            </div>
        </>

    );
}
