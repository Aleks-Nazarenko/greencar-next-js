import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import axios from 'axios';
import Link from "next/link";
import { useRouter } from 'next/router';
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import {JOOMLA_API_BASE} from "@/utils/config";
import {JOOMLA_URL_BASE} from "@/utils/config";

const inter = Inter({ subsets: ["latin"] });

export async function getStaticPaths() {
    // Fetch categories dynamically from your Joomla API
    try {
        const res = await axios.get(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=15&format=json`);
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
    } catch (error) {
        console.log('Failed to fetch nachruestfilter categories:', error.message);
        return {
            paths: [],
            fallback: false,
        };
    }
}
export async function getStaticProps({ params }) {
    // Base URL of your Joomla server (adjust this to your Joomla installation URL)
    const joomlaBaseUrl = JOOMLA_URL_BASE;
    // Split `id-name` into `id` and `name`
    const [id, ...nameParts] = params["id-name"].split('-');
    const name = nameParts.join('-');
    // Fetch data based on the extracted ID
    const subcategories= await axios
        .get(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=${id}&format=json`)
        .then((res) => res.data || [])
        .catch((error) => {
            console.log('Failed to fetch subcategories:', error.message);
            return []; // Return an empty array if the request fails
        });
    // Fetch categories for the main dropdown (assuming you want to navigate between categories)
    const categories = await axios
        .get(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=15&format=json`)
        .then((res) => res.data || [])
        .catch((error) => {
            console.log('Failed to fetch categories:', error.message);
            return []; // Return an empty array if the request fails
        });
    // Fetch data for the footer from Joomla API
    const resFooter = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=2&format=json`);
    const footerData = await resFooter.json();
    // Extract the footer article from the response
    const footerArticle = footerData.article || null;
    if (footerArticle) {
        footerArticle.introtext = footerArticle.introtext ? convertRelativeUrls(footerArticle.introtext, joomlaBaseUrl) : '';
        if (!footerArticle.introtext) {
            console.log('footerArticle.introtext not found');
        }
    }
    // Pass data to the page via props
    return {
        props: {
            subcategories,
            categories,
            categoryId: id,
            categoryName: name,
            footerArticle,
        },
    };
}


function NachruestfilterSubcategories({ subcategories, categories, categoryId, categoryName, footerArticle }) {
    const router = useRouter();

    if (router.isFallback) {
        return (
            <div className="row g-0 justify-content-center">
               <div className="col-auto">Loading...</div>
            </div>
        );
    }
    const handleCategoryChange = (event) => {
        const selectedCategory = event.target.value;
        if (selectedCategory) {
            router.push(`/pkw-partikelfilter/pkw-nachruestfilter/${selectedCategory}`);
        }
    };
    const handleSubcategoryChange = (event) => {
        const selectedSubcategory = event.target.value;
        if (selectedSubcategory) {
            router.push(`/pkw-partikelfilter/pkw-nachruestfilter/${categoryId}-${categoryName.toLowerCase()}/${selectedSubcategory}`);
        }
    };
    return (
        <>
            <main>
                <div className="container-fluid container-greencar">
                    <div className="row g-0 p-4">
                        {subcategories.length > 0 && (
                            <>
                                <h1>{categoryName}</h1>
                                <ul>
                                    {subcategories.map((subcategory) => (
                                        <li key={subcategory.category_id}>
                                            <Link href={`/pkw-partikelfilter/pkw-nachruestfilter/${categoryId}-${categoryName.toLowerCase()}/${subcategory.category_id}-${subcategory.category_name.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}`}>{subcategory.category_name}</Link>

                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                        <div>
                            {categories.length > 0 && (
                                <>
                                    <select
                                        id="categorySelect"
                                        onChange={handleCategoryChange}
                                        value={`${categoryId}-${categoryName.toLowerCase()}`}
                                    >
                                        <option value="" disabled>- Hersteller -</option>
                                        {categories.map((category) => (
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
                        {/* Subcategory Select */}
                        <div>
                            {subcategories.length > 0 && (
                                <>
                                    <select
                                        id="subcategorySelect"
                                        onChange={handleSubcategoryChange}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>- Modellreihe -</option>
                                        {subcategories.map((subcategory) => (
                                            <option
                                                key={subcategory.category_id}
                                                value={`${subcategory.category_id}-${subcategory.category_name.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}`}
                                            >
                                                {subcategory.category_name}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            )}
                        </div>

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

export default NachruestfilterSubcategories;
