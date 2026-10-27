import axios from 'axios';
import Link from "next/link";
import { useRouter } from 'next/router';
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import {JOOMLA_API_BASE} from "@/utils/config";
import {JOOMLA_URL_BASE} from "@/utils/config";
import {useEffect, useState} from "react";
import {FormSelect} from "react-bootstrap";
import NextImage from "next/image";
import {createSlug} from "@/utils/sanitizeProductSlug";
import {EURO_VI_CATEGORY_ID, busCategoryName, busCategorySegment, lkwCategorySegment} from "@/utils/busEuroVi";

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

const fetchCategories = () => axios
    .get(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=${EURO_VI_CATEGORY_ID}&format=json`)
    .then((res) => res.data || []);

export async function getStaticPaths() {
    try {
        const categories = await fetchCategories();
        const paths = categories.map((category) => ({
            params: { "id-name": busCategorySegment(category) },
        }));
        return {
            paths,
            fallback: false,
        };
    } catch (error) {
        console.log('Failed to fetch bus dpf-euro-vi categories:', error.message);
        return {
            paths: [],
            fallback: false,
        };
    }
}

export async function getStaticProps({ params }) {
    const joomlaBaseUrl = JOOMLA_URL_BASE;
    const [id] = params["id-name"].split('-');
    const categories = await fetchCategories()
        .catch((error) => {
            console.log('Failed to fetch categories:', error.message);
            return []; // Return an empty array if the request fails
        });
    const category = categories.find((c) => String(c.category_id) === id) || null;
    const products = await axios
        .get(`${JOOMLA_API_BASE}&task=getProductsBySubcategory&subcategory_id=${id}&format=json`)
        .then((res) => res.data || [])
        .catch((error) => {
            console.log('Failed to fetch products:', error.message);
            return []; // Return an empty array if the request fails
        });

    const resArticle = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=21&format=json`);
    const articleData = await resArticle.json();
    const article = articleData.article || null;
    if (article) {
        article.content = article.content ? convertRelativeUrls(article.content, joomlaBaseUrl) : '';
    }
    return {
        props: {
            categories,
            currentSegment: params["id-name"],
            // Products open the existing LKW product pages, so each product has a single URL
            lkwSegment: category ? lkwCategorySegment(category) : '',
            products,
            article,
        },
    };
}


function BusDpfEuroVIProductListPage({ categories, currentSegment, lkwSegment, article, products }) {
    const router = useRouter();

    const handleCategoryChange = (event) => {
        const selectedCategory = event.target.value;
        if (selectedCategory) {
            router.push(`/bus-partikelfilter/dpf-euro-vi/${selectedCategory}`);
        }
    };
    return (
        <>
            <div className={"row g-0"}>
                <h1 className={"pb-0 mb-1"}>BUS - Nachrüstfilter</h1>
                <h2 className={"display-4 mb-0"}>Bitte wählen Sie den Hersteller Ihres Bus. Anschließend stellen wir Ihnen unsere Produktauswahl an passenden Bus-Nachrüstfiltern vor.</h2>
            </div>
            <div className="w-100 pb-4"></div>
            <div className="row g-0 p-3 p-sm-4 product-detail-view rounded-4 align-items-center">
                <div className={"col"}>
                    {categories.length > 0 && (
                        <FormSelect
                            id="categorySelect"
                            onChange={handleCategoryChange}
                            value={currentSegment}
                        >
                            <option value="" disabled>- Hersteller -</option>
                            {categories.map((category) => (
                                <option key={category.category_id} value={busCategorySegment(category)}>
                                    {busCategoryName(category)}
                                </option>
                            ))}
                        </FormSelect>
                    )}
                </div>
                <div className={"col"}>
                    <div className="col text-end d-none d-sm-block">
                        <NextImage src={"/images/icons/bus-nachruestfilter.png"} alt={"Bus Nachrüstfilter"} width={190} height={190} className={"img-fluid picto-190"}/>
                    </div>
                </div>
            </div>

            <div className="w-100 pb-4"></div>
            <div className="row g-0 p-3 p-sm-4 product-detail-view rounded-4 ">
                {products.length > 0 && (
                    <div className="col table-responsive">
                        <table className={"table table-bordered align-middle"}>
                            <thead>
                                <tr className={"text-center"}>
                                    <th>Produktname</th>
                                    <th>Modell</th>
                                    <th>Hubraum KW/PS</th>
                                    <th>Euronorm</th>
                                    <th className={"text-center"}>OE-Nummer</th>
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
                                        {product.euronorm2_liste}
                                    </td>
                                    <td>
                                        {product.oe_nummer_liste}
                                    </td>
                                    <td>
                                        Auf Anfrage
                                    </td>
                                    <td>
                                        <Link href={`/lkw-partikelfilter/dpf-euro-vi/${lkwSegment}/${product.product_id}-${createSlug(product.product_name)}`}>
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
                                    <Link href={`/bus-partikelfilter/dpf-euro-vi/${busCategorySegment(category)}`}>{busCategoryName(category)}</Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

        </>
    );
}

export default BusDpfEuroVIProductListPage;
