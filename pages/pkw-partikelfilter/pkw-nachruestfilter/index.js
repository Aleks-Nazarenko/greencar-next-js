import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import axios from 'axios';
import Link from "next/link";
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";

const inter = Inter({ subsets: ["latin"] });

export async function getStaticProps() {
    // Base URL of your Joomla server (adjust this to your Joomla installation URL)
    const joomlaBaseUrl = 'https://joomla2.nazarenko.de';
    // Fetch data from Joomla API
    const res = await axios.get('https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&view=products&format=json');
    const products = await res.data;
  //  console.log(products);

    // Fetch data for the footer from Joomla API
    const resFooter = await fetch('https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=articleWithModules&id=2&format=json');
    const footerData = await resFooter.json();
    // Extract the footer article from the response
    const footerArticle = footerData.article || null;

    // Convert relative URLs in the footer content to absolute URLs
    if (footerArticle && footerArticle.introtext) {
        footerArticle.introtext = convertRelativeUrls(footerArticle.introtext, joomlaBaseUrl);
    }
    // Pass data to the page via props
    return { props: { products, footerArticle } };
}


export default function Products({ products, footerArticle }) {
    return (
        <>
            <main>
                <div className="container-fluid container-greencar">
                    <div className="row g-0 p-4">
                        <h1>PKW - Nachrüstfilter</h1>
                        <ul>
                            {products.map(product => (
                                <li key={product.product_id}>
                                    <Link href={`/pkw-partikelfilter/pkw-nachruestfilter/${product.product_code}`}>{product.product_name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
            <footer>
                <div className="container-fluid container-footer container-greencar">
                    <div className="row g-0 p-4">
                        <div dangerouslySetInnerHTML={{ __html: footerArticle.introtext}} />
                    </div>
                </div>
            </footer>
        </>
    );
}
