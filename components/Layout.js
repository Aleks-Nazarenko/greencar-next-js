// components/Layout.js
import Navbar from './Navbar';
import Head from "next/head";
import VehicleSwitcher from "@/components/VehicleSwitcher";
import Footer from "@/components/Footer";
import SecondaryMenu from "@/components/SecondaryMenu";
import SearchBar from "@/components/SearchBar";


export default function Layout({ children }) {
    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app and nazarenko" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="google-site-verification" content="WiEomksCMny2d8J2OdPViePvmhxjlIrgEAze-SSyLx0" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header>
                <Navbar />
                <div className={"w-100 pt-4"}/>
                <div className="container-fluid">
                    <div className="container-greencar container-fluid g-0 bg-gc-light-blue rounded-4 shadow">
                        <SearchBar />
                    </div>
                </div>
                <div className={"w-100 pt-4"}/>
                <div className="container-fluid">
                    <div className="container-greencar container-fluid g-0">
                        <SecondaryMenu />
                    </div>
                </div>
            </header>
            <div className={"w-100 pt-4"}/>
            <VehicleSwitcher />
            <main>
                <div className={"container-fluid"}>
                    <div className={"container-greencar container-fluid bg-gc-light-blue rounded-4 g-0 p-4 pt-5 shadow"}>
                        {children}
                    </div>
                </div>
            </main>
            <div className={"w-100 pt-4"}/>
            <div className={"container-fluid"}>
                <footer className={"container-fluid container-greencar g-0 p-4 pt-2 pb-2 bg-gc-light-blue rounded-4 shadow"}>
                    <Footer />
                </footer>
            </div>
            <div className={"w-100 pt-4"}/>

        </>
    );
}
