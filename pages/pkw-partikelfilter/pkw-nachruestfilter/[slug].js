import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import axios from 'axios';
import Link from "next/link";
import { useRouter } from 'next/router';
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";

const inter = Inter({ subsets: ["latin"] });

export async function getStaticPaths() {
    // Fetch the list of products
    const res = await axios.get('https://joomla.nazarenko.de/index.php?option=com_nazarenkoapi&view=products&format=json');
    const products = res.data;

    // Generate paths with `id` param
    const paths = products.map(product => ({
        params: { slug: product.product_code},
    }));
    return { paths, fallback: false };
}
export async function getStaticProps({ params }) {
    // Base URL of your Joomla server (adjust this to your Joomla installation URL)
    const joomlaBaseUrl = 'https://joomla.nazarenko.de';
    // Fetch data from Joomla API
    const res = await axios.get(`https://joomla.nazarenko.de/index.php?option=com_nazarenkoapi&view=product&code=${params.slug}&format=json`);
    const product = res.data;
   // console.log(product);
    // Fetch data for the footer from Joomla API
    const resFooter = await fetch('https://joomla.nazarenko.de/index.php?option=com_nazarenkoapi&task=articleWithModules&id=4&format=json');
    const footerData = await resFooter.json();
    // Extract the footer article from the response
    const footerArticle = footerData.article || null;

    // Convert relative URLs in the footer content to absolute URLs
    if (footerArticle && footerArticle.introtext) {
        footerArticle.introtext = convertRelativeUrls(footerArticle.introtext, joomlaBaseUrl);
    }
    // Pass data to the page via props
    return { props: { product, footerArticle } };
}


function Product({ product, footerArticle }) {
    const router = useRouter();

    if (router.isFallback) {
        return (
            <div className="row g-0 justify-content-center">
               <div className="col-auto">Loading...</div>
            </div>
        );
    }
    return (
        <>
            <main>
                <div className="container-fluid container-greencar">
                    <div className="row g-0 p-4">
                        <h1>{product.product_name}</h1>
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

export default Product;
