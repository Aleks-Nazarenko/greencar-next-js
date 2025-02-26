import Image from "next/image";
import axios from 'axios';
import Link from "next/link";
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import { useRouter } from 'next/router';
import {JOOMLA_API_BASE} from "@/utils/config";
import {JOOMLA_URL_BASE} from "@/utils/config";
import {FormSelect} from "react-bootstrap";

export async function getStaticProps() {
    // Base URL of your Joomla server (adjust this to your Joomla installation URL)
    const joomlaBaseUrl = JOOMLA_URL_BASE;
    // Fetch data from Joomla API
    const categories = await axios
        .get(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=470&format=json`)
        .then((res) => res.data || []) // actually incorrect, because res.data is always an array d.h. true
        .catch((error) => {
            console.log('Failed to fetch categories:', error.message);
            return []; // Return an empty array if the request fails
        });


    const resArticle = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=25&format=json`);
    const articleData = await resArticle.json();
    // Extract the footer article from the response
    const article = articleData.article || null;
    if (article) {
        article.content = article.content ? convertRelativeUrls(article.content, joomlaBaseUrl) : '';
        if (!article.content) {
            console.log('footerArticle.content not found');
        }
    }
    // Pass data to the page via props
    return { props: { categories, article } };
}


export default function lkwFilterreinigung({ categories, article }) {
    const router = useRouter();

    const handleCategoryChange = (event) => {
        const selectedCategory = event.target.value;
        if (selectedCategory) {
            router.push(`/lkw-partikelfilter/lkw-filterreinigung/${selectedCategory}`);
        }
    };
    return (
        <>

            <div className={"row g-0 pb-0"}>
                <h1 className={"mb-1"}>LKW - Filterreinigung</h1>
                <h2 className={"display-4 mb-0"}>Bitte wählen Sie Ihren LKW-Hersteller. Anschließend stellen wir Ihnen unser Angebot zur LKW-Filterreinigung vor.</h2>
            </div>
            <div className="w-100 pb-4"></div>
            <div className="row g-0 p-3 p-sm-4 product-detail-view rounded-4">
                <div className="col d-flex align-items-center">
                    {categories.length > 0 && (
                        <>
                            <FormSelect
                                id="categorySelect"
                                onChange={handleCategoryChange}
                                defaultValue="" // Add a default option
                            >
                                <option value="" disabled>- Hersteller -</option>
                                {categories.map(category => (
                                    <option
                                        key={category.category_id}
                                        value={`${category.category_id}-${category.category_name.toLowerCase().replace(/\s+/g, '-')}`}
                                    >
                                        {category.category_name}
                                    </option>
                                ))}
                            </FormSelect>
                        </>
                    )}
                </div>
                <div className="col text-end d-none d-sm-block">
                    <Image src={"/images/icons/lkw-filterreinigung.png"} alt={"LKW-Filterreinigung"} width={190} height={190} className={"img-fluid picto-190"}/>
                </div>
            </div>

            <div className="w-100 pb-4"></div>

            <div className="row g-0">
                {article?.content && (
                    <div dangerouslySetInnerHTML={{ __html: article.content}} />
                )}
            </div>
            <div className="w-100 pb-4"></div>
            <div className="row g-0">
                <div className="col">
                    {categories.length > 0 && (
                        <ul className={"arrow-list"}>
                            {categories.map(category => (
                                <li key={category.category_id}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#45CA25"
                                         className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                                        <path
                                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                                    </svg>
                                    <Link href={`/lkw-partikelfilter/dpf-euro-vi/${category.category_id}-${category.category_name.toLowerCase().replace(/\s+/g, '-')}`}>{category.category_name}</Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}
