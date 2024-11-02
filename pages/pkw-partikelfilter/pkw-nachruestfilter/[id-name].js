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
    // Fetch categories dynamically from your Joomla API
    const res = await axios.get('https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=getSubcategories&category_id=15&format=json');
    const categories = await res.data;
    // Map the fetched categories to paths with the `id-name` format
    const paths = categories.map((category) => ({
        params: {
            "id-name": `${category.category_id}-${category.category_name.toLowerCase().replace(/\s+/g, '-')}`
        },
    }));

    return {
        paths,
        fallback: false,
    };
}
export async function getStaticProps({ params }) {
    // Base URL of your Joomla server (adjust this to your Joomla installation URL)
    const joomlaBaseUrl = 'https://joomla2.nazarenko.de';
    // Split `id-name` into `id` and `name`
    const [id, name] = params["id-name"].split('-');
    // Fetch data based on the extracted ID
    const res = await axios.get(`https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=getSubcategories&category_id=${id}`);
    const subcategories = await res.data;

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
    return {
        props: {
            subcategories,
            categoryId: id,
            categoryName: name,
            footerArticle,
        },
    };
}


function NachruestfilterSubcategories({ subcategories, categoryId, categoryName, footerArticle }) {
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
                        <h1>{categoryName}</h1>
                        <ul>
                            {subcategories.map((subcategory) => (
                                <li key={subcategory.category_id}>
                                    <h2>{subcategory.category_name}</h2>
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

export default NachruestfilterSubcategories;
