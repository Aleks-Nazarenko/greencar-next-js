import Form from 'react-bootstrap/Form';
import Image from "next/image";
import axios from 'axios';
import Link from "next/link";
import { useRouter } from 'next/router';
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import {JOOMLA_API_BASE} from "@/utils/config";
import {JOOMLA_URL_BASE} from "@/utils/config";

//const inter = Inter({ subsets: ["latin"] });

export async function getStaticPaths() {
    // Fetch categories dynamically from your Joomla API
    try {
        const res = await axios.get(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=70&format=json`);
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
        console.log('Failed to fetch austauschfilter categories:', error.message);
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
    const subcategories = await axios.get(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=${id}&format=json`)
        .then((res) => res.data || []) // actually incorrect, because res.data is always an array d.h. true
        .catch((error) => {
            console.log('Failed to fetch austauschfilter subcategories:', error.message);
            return []; // Return an empty array if the request fails
        });

    // Fetch categories for the main dropdown (assuming you want to navigate between categories)
    const categories = await axios.get(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=70&format=json`)
        .then((res) => res.data || []) // actually incorrect, because res.data is always an array d.h. true
        .catch((error) => {
            console.log('Failed to fetch austauschfilter categories:', error.message);
            return []; // Return an empty array if the request fails
        });

    const resArticle = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=18&format=json`);
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
    return {
        props: {
            subcategories,
            categories,
            categoryId: id,
            categoryName: name,
            article,
        },
    };
}


function AustauschfilterSubcategories({ subcategories, categories, categoryId, categoryName, article }) {
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
            router.push(`/pkw-partikelfilter/pkw-austauschfilter/${selectedCategory}`);
        }
    };
    const handleSubcategoryChange = (event) => {
        const selectedSubcategory = event.target.value;
        if (selectedSubcategory) {
            router.push(`/pkw-partikelfilter/pkw-austauschfilter/${categoryId}-${categoryName.toLowerCase()}/${selectedSubcategory}`);
        }
    };
    return (
        <>


            <div className={"row g-0"}>
                <h1 className={"pb-0 mb-1"}>PKW - Austauschfilter</h1>
                <h4>Bitte wählen Sie zunächst den Hersteller Ihres Pkw und danach ggf. das Modell. Anschließend stellen wir Ihnen unsere Produktauswahl an passenden Austaustauschfiltern vor.</h4>
            </div>
            <div className="w-100 pb-4"></div>
            <div className="row g-0 p-3 p-sm-4 product-detail-view rounded-4 align-items-center">
                {/* Category Select */}
                <div className={"col"}>
                    <div className={"row g-0 "}>
                        <div className={"col-12"}>
                            {categories.length > 0 && (
                                <Form.Select
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
                                </Form.Select>
                            )}
                        </div>
                        <div className={"w-100 pb-3"}></div>
                        {/* Subcategory Select */}
                        <div className={"col-12"}>
                            {subcategories.length > 0 && (
                                <Form.Select
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
                                </Form.Select>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col text-end d-none d-sm-block">
                    <Image src={"/images/icons/pkw-austauschfilter.png"} alt={"austauchfilter"} width={190} height={190} className={"img-fluid"}/>
                </div>

            </div>


            <div className="w-100 pb-4"></div>


            <div className="row g-0">
                {article?.content && (
                    <div dangerouslySetInnerHTML={{ __html: article.content}} />
                )}
            </div>
            {/* Subcategory Links */}
            {subcategories.length > 0 && (
                <>
                    <div className="w-100 pb-4"></div>
                    <div className="row g-0">
                        <div className="col">
                            <ul className={"arrow-list"}>
                                {subcategories.map((subcategory) => (
                                    <li key={subcategory.category_id}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#45CA25"
                                             className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                                            <path
                                                d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                                        </svg>
                                        <Link href={`/pkw-partikelfilter/pkw-austauschfilter/${categoryId}-${categoryName.toLowerCase()}/${subcategory.category_id}-${subcategory.category_name.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}`}>{subcategory.category_name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default AustauschfilterSubcategories;
