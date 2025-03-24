// components/Layout.js
import Navbar from './Navbar';
import Head from "next/head";
import VehicleSwitcher from "@/components/VehicleSwitcher";
import Footer from "@/components/Footer";
import SecondaryMenu from "@/components/SecondaryMenu";
import SearchBar from "@/components/SearchBar";
import HomeBigIcons from "@/components/HomeBigIcons";
import Banner from "@/components/Banner";


export default function Layout({ children }) {
    return (
        <>
            <Head>
                <title>GREENCAR - Nachrüstung und Reinigung von Partikelfiltern</title>
                <meta name="description" content="GREENCAR - bundesweite Nachrüstung und Reinigung von Partikelfiltern für Pkw und Lkw" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="google-site-verification" content="WiEomksCMny2d8J2OdPViePvmhxjlIrgEAze-SSyLx0" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header>
                <Navbar />
                <div className={"w-100 pt-4"}/>
                <div className="container-fluid">
                    <div className="container-greencar container-fluid g-0 p-2 ps-3 pe-3 bg-gc-light-blue rounded-4 shadow">
                        <SearchBar />
                    </div>
                </div>
                <div className={"w-100 pt-4"}/>
                <div className="container-fluid">
                    <div className="container-greencar container-fluid g-0 home-big-icons">
                        <HomeBigIcons/>
                    </div>
                </div>
                <div className="container-fluid">
                        <Banner />
                </div>
                <div className="container-fluid">
                    <div className="container-greencar container-fluid g-0">
                        <SecondaryMenu />
                    </div>
                </div>
            </header>
            <div className={"w-100 pt-4"}/>
            <VehicleSwitcher />
            <main>
                <div className={"container-fluid container-main"}>
                    <div className={"container-greencar container-fluid bg-gc-light-blue rounded-4 g-0 p-3 p-sm-4 shadow"}>
                        {children}
                    </div>
                </div>
            </main>
            <div className={"w-100 pt-4"}/>
            <div className={"container-fluid container-footer"}>
                <footer className={"container-fluid container-greencar g-0 p-3 p-sm-4 pt-2 pb-2 pb-sm-2 pt-sm-2 bg-gc-light-blue rounded-4 shadow"}>
                    <Footer />
                </footer>
            </div>
            <div className={"w-100 pt-4"}/>

        </>
    );
}
