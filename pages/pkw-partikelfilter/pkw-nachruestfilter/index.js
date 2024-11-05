import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import axios from 'axios';
import Link from "next/link";
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ["latin"] });

export async function getStaticProps() {
    // Base URL of your Joomla server (adjust this to your Joomla installation URL)
    const joomlaBaseUrl = 'https://joomla2.nazarenko.de';
    // Fetch data from Joomla API
    const res = await axios.get('https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=getSubcategories&category_id=15&format=json');
    const categories = await res.data;
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
    return { props: { categories, footerArticle } };
}


export default function NachruestfilterCategories({ categories, footerArticle }) {
    const router = useRouter();

    const handleCategoryChange = (event) => {
        const selectedCategory = event.target.value;
        if (selectedCategory) {
            router.push(`/pkw-partikelfilter/pkw-nachruestfilter/${selectedCategory}`);
        }
    };
    return (
        <>
            <main>
                <div className="container-fluid container-greencar">
                    <div className="row g-0 p-4">
                        <h1>PKW - Nachrüstfilter</h1>
                        <ul>
                            {categories.map(category => (
                                <li key={category.category_id}>
                                    <Link href={`/pkw-partikelfilter/pkw-nachruestfilter/${category.category_id}-${category.category_name.toLowerCase()}`}>{category.category_name}</Link>
                                </li>
                            ))}
                        </ul>
                        <select
                            id="categorySelect"
                            onChange={handleCategoryChange}
                            defaultValue="" // Add a default option
                        >
                            <option value="" disabled>- Hersteller PKW -</option>
                            {categories.map(category => (
                                <option
                                    key={category.category_id}
                                    value={`${category.category_id}-${category.category_name.toLowerCase().replace(/\s+/g, '-')}`}
                                >
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
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
