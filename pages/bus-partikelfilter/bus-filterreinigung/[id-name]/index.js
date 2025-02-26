import axios from 'axios';
import Link from "next/link";
import { useRouter } from 'next/router';
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import {JOOMLA_API_BASE} from "@/utils/config";
import {JOOMLA_URL_BASE} from "@/utils/config";
import {useEffect, useState} from "react";
import {FormSelect} from "react-bootstrap";
import NextImage from "next/image";

function ProductImage({ src, alt, fallback }) {
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setImgSrc(src); // If the image loads, keep the original src
        img.onerror = () => setImgSrc(fallback); // If the image fails to load, use fallback
    }, [src, fallback]);

    return (
        <img src={imgSrc} alt={alt}  />
    );
}
export async function getStaticPaths() {
    // Fetch categories dynamically from your Joomla API
    try {
        const res = await axios.get(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=475&format=json`);
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
        console.log('Failed to fetch dpf-euro-vi categories:', error.message);
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
    // Fetch categories for the main dropdown (assuming you want to navigate between categories)
    const categories = await axios // ment subcategories of the category_id=470
        .get(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=475&format=json`)
        .then((res) => res.data || [])
        .catch((error) => {
            console.log('Failed to fetch categories:', error.message);
            return []; // Return an empty array if the request fails
        });
    const products = await axios
        .get(`${JOOMLA_API_BASE}&task=getProductsBySubcategory&subcategory_id=${id}&format=json`)
        .then((res) => res.data || [])
        .catch((error) => {
            console.log('Failed to fetch products:', error.message);
            return []; // Return an empty array if the request fails
        });

    const resArticle = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=26&format=json`);
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
            categories,
            categoryId: id,
            categoryName: name,
            products,
            article,
        },
    };
}


function BusFilterreinigungProductListPage({ categories, categoryId, categoryName, article, products }) {

    const VAT_SHARE = 1.19; // MwSt.
    const formatPrice = (price) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
        }).format(price);
    };

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
            router.push(`/bus-partikelfilter/bus-filterreinigung/${selectedCategory}`);
        }
    };
    return (
        <>
            <div className={"row g-0"}>
                <h1 className={"mb-1"}>BUS - Filterreinigung</h1>
                <h2 className={"display-4 mb-0"}>Bitte wählen Sie Ihren BUS-Hersteller. Anschließend stellen wir Ihnen unser Angebot zur BUS-Filterreinigung vor.</h2>
            </div>
            <div className="w-100 pb-4"></div>

            <div className="row g-0 p-3 p-sm-4 product-detail-view rounded-4 align-items-center">
                <div className={"col"}>
                    {categories.length > 0 && (
                        <>
                            <FormSelect
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
                            </FormSelect>
                        </>
                    )}
                </div>
                <div className={"col"}>
                    <div className="col text-end d-none d-sm-block">
                        <NextImage src={"/images/icons/bus-filterreinigung.png"} alt={"BUS Filterreinigung"} width={190} height={190} className={"img-fluid picto-190"}/>
                    </div>
                </div>

            </div>

            <div className="w-100 pb-4"></div>
            <div className="row g-0 p-3 p-sm-4 product-detail-view rounded-4 ">
                {products.length > 0 && (
                    <div className="col table-responsive">

                        <table className={"table table-bordered"}>{/*align-middle*/}
                            <thead>
                            <tr className={"text-center"}>
                                <th>Produktname</th>
                                <th>Modell</th>
                                <th>Hubraum KW/PS</th>
                                <th>Preis</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.map((product) => (
                                <tr key={product.product_id} className={"text-center"}>
                                    <td>
                                        <ProductImage
                                            src={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/thumbnail_100X100/${product.product_image}`}
                                            alt={product.product_name}
                                            fallback={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/thumbnail_100X100/beispielphoto.jpg`}
                                        />
                                        <span className={"d-block"}>{product.product_name}</span>
                                    </td>
                                    <td className={"text-center"}>
                                        {product.modell_liste}
                                    </td>
                                    <td>
                                        {product.hubraum_liste}

                                    </td>
                                    <td>
                                        {formatPrice(parseFloat(product.price_value) * VAT_SHARE)} (inkl. MwSt.)
                                    </td>
                                    <td>
                                        <Link href={`/bus-partikelfilter/bus-filterreinigung/${categoryId}-${categoryName}/${product.product_id}-${product.product_name.toLowerCase().replace(/\s+/g, '-')}`}>
                                            <button className="btn btn-primary btn-green btn-100">Details</button>
                                        </Link>
                                    </td>

                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
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
                                    <Link href={`/bus-partikelfilter/bus-filterreinigung/${category.category_id}-${category.category_name.toLowerCase().replace(/\s+/g, '-')}`}>{category.category_name}</Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

        </>
    );
}

export default BusFilterreinigungProductListPage;
