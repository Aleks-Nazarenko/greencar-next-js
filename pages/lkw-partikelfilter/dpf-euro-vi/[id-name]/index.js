import axios from 'axios';
import Link from "next/link";
import { useRouter } from 'next/router';
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import {JOOMLA_API_BASE} from "@/utils/config";
import {JOOMLA_URL_BASE} from "@/utils/config";
import {useEffect, useState} from "react";

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
        const res = await axios.get(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=68&format=json`);
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
    const categories = await axios // ment subcategories of the category_id=68
        .get(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=68&format=json`)
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
            categories,
            categoryId: id,
            categoryName: name,
            products,
            footerArticle,
        },
    };
}


function DpfEuroVIProductListPage({ categories, categoryId, categoryName, footerArticle, products }) {
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
            router.push(`/lkw-partikelfilter/dpf-euro-vi/${selectedCategory}`);
        }
    };
    return (
        <>
            <main>
                <div className="container-fluid container-greencar">
                    <div className="row g-0 p-4">
                        <h1>LKW - DPF EURO VI</h1>
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

                    </div>
                    <div className="row g-0 p-4">
                        {products.length > 0 && (
                            <table>
                                <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Product Name</th>
                                </tr>
                                </thead>
                                <tbody>
                                {products.map((product) => (
                                    <tr key={product.product_id}>
                                        <td>
                                            <ProductImage
                                                src={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/thumbnail_100X100/${product.product_image}`}
                                                alt={product.product_name}
                                                fallback={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/thumbnail_100X100/beispielphoto.jpg`}
                                            />
                                        </td>
                                        <td>
                                            <a href={`/lkw-partikelfilter/dpf-euro-vi/${categoryId}-${categoryName}/${product.product_id}-${product.product_name.toLowerCase().replace(/\s+/g, '-')}`}>
                                                {product.product_name}
                                            </a>
                                        </td>
                                        <td>
                                            {product.modell_liste}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
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

export default DpfEuroVIProductListPage;
