import Image from "next/image";
import { Inter } from "next/font/google";
import axios from 'axios';
import Link from "next/link";
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import { useRouter } from 'next/router';
import {JOOMLA_API_BASE} from "@/utils/config";
import {JOOMLA_URL_BASE} from "@/utils/config";

export async function getStaticProps() {
    // Base URL of your Joomla server (adjust this to your Joomla installation URL)
    const joomlaBaseUrl = JOOMLA_URL_BASE;
    // Fetch data from Joomla API
    const categories = await axios
        .get(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=68&format=json`)
        .then((res) => res.data || []) // actually incorrect, because res.data is always an array d.h. true
        .catch((error) => {
            console.log('Failed to fetch categories:', error.message);
            return []; // Return an empty array if the request fails
        });


    // Fetch data for the footer from Joomla API
    const resFooter = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=2&format=json`);
    const footerData = await resFooter.json();
    // Extract the footer article from the response
    const footerArticle = footerData.article || null;
    // Convert relative URLs in the footer content to absolute URLs
    if (footerArticle) {
        footerArticle.introtext = footerArticle.introtext ? convertRelativeUrls(footerArticle.introtext, joomlaBaseUrl) : '';
        if (!footerArticle.introtext) {
            console.log('footerArticle.introtext not found');
        }
    }
    // Pass data to the page via props
    return { props: { categories, footerArticle } };
}


export default function dpfEuroVi({ categories, footerArticle }) {
    const router = useRouter();

    const handleCategoryChange = (event) => {
        const selectedCategory = event.target.value;
        if (selectedCategory) {
            router.push(`/lkw-partikelfilter/dpf-euro-vi/${selectedCategory}`);
        }
    };
    return (
        <>
            <main>
                <div className="container-fluid container-greencar">
                    <div className="row g-0 p-4">
                        <h1>LKW - DPF EURO VI</h1>
                        {categories.length > 0 && (
                            <>
                                <ul>
                                    {categories.map(category => (
                                        <li key={category.category_id}>
                                            <Link href={`/lkw-partikelfilter/dpf-euro-vi/${category.category_id}-${category.category_name.toLowerCase().replace(/\s+/g, '-')}`}>{category.category_name}</Link>
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
                            </>
                        )}
                    </div>
                </div>
            </main>
            <footer>
                <div className="container-fluid container-footer container-greencar">
                    <div className="row g-0 p-4">
                        {footerArticle?.introtext && (
                            <div dangerouslySetInnerHTML={{ __html: footerArticle.introtext}} />
                        )}
                    </div>
                </div>
            </footer>
        </>
    );
}
