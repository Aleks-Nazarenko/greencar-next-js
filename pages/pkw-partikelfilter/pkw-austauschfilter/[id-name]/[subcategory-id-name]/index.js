import axios from 'axios';
import Link from "next/link";
import { useRouter } from 'next/router';
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import { useState, useEffect } from 'react';
import { JOOMLA_API_BASE } from '@/utils/config';
import { JOOMLA_URL_BASE } from '@/utils/config';

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
function replaceSlashesExceptTrailing(str) {
    const hasTrailingSlash = str.endsWith('/');
    // Remove the trailing slash temporarily for processing
    const modifiedStr = hasTrailingSlash ? str.slice(0, -1) : str;
    // Replace all other slashes with hyphens
    const result = modifiedStr.replace(/\//g, '-');
    // Add the trailing slash back if it was present
    return hasTrailingSlash ? result + '/' : result;
}
export async function getStaticPaths() {
    const res = await fetch(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=70&format=json`);
    const categories = await res.json();
    // Step 2: For each category, fetch its subcategories
    const paths = [];

    for (const category of categories) {
        const res = await fetch(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=${category.category_id}&format=json`);
        const subcategories = await res.json();

        // Step 3: Generate paths for each subcategory within the category
        subcategories.forEach((subcategory) => {
            paths.push({
                params: {
                    "id-name": `${category.category_id}-${category.category_name.toLowerCase().replace(/\s+/g, '-')}`,
                    "subcategory-id-name": `${subcategory.category_id}-${subcategory.category_name.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}`
                },
            });
        });
    }

    return {
        paths,
        fallback: false,
    };
}
export async function getStaticProps({ params }) {
    // Base URL of your Joomla server (adjust this to your Joomla installation URL)
    const joomlaBaseUrl = JOOMLA_URL_BASE;

    // Extract and handle multi-word category and subcategory names
    const [categoryId, ...categoryNameParts] = params["id-name"].split('-');
    const categoryName = categoryNameParts.join('-');

    const [subcategoryId, ...subcategoryNameParts] = params["subcategory-id-name"].split('-');
    const subcategoryName = subcategoryNameParts.join('-');

    // Fetch the products for the specified subcategory
    const res = await fetch(`${JOOMLA_API_BASE}&task=getProductsBySubcategory&subcategory_id=${subcategoryId}&format=json`);
    const products = await res.json();

    // Fetch all categories for the main category dropdown
    const resCategories = await fetch(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=70&format=json`);
    const categories = await resCategories.json();

    // Fetch subcategories for the current category for the subcategory dropdown
    const resSubcategories = await fetch(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=${categoryId}&format=json`);
    const subcategories = await resSubcategories.json();

    // Fetch data for the footer from Joomla API
    const resFooter = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=2&format=json`);
    const footerData = await resFooter.json();
    const footerArticle = footerData.article || null;

    // Convert relative URLs in the footer content to absolute URLs
    if (footerArticle) {
        footerArticle.introtext = footerArticle.introtext ? convertRelativeUrls(footerArticle.introtext, joomlaBaseUrl) : '';
        if (!footerArticle.introtext) {
            console.log('footerArticle.introtext not found');
        }
    }

    return {
        props: {
            products,
            categoryName,
            categoryId,
            subcategoryName,
            subcategoryId,
            footerArticle,
            categories,
            subcategories,
        },
    };
}


export default function ProductListPage({ products, categoryName, categoryId, subcategoryName, subcategoryId, footerArticle, categories, subcategories  }) {
    const router = useRouter();
    const handleCategoryChange = (event) => {
        const selectedCategory = event.target.value;
        if (selectedCategory) {
            router.push(`/pkw-partikelfilter/pkw-austauschfilter/${selectedCategory}`);
        }
    };
    const handleSubcategoryChange = (event) => {
        const selectedSubcategory = event.target.value;
        if (selectedSubcategory) {
            router.push(`/pkw-partikelfilter/pkw-austauschfilter/${categoryId}-${categoryName}/${selectedSubcategory}`);
        }
    };
    return (
        <>
            <main>
                <div className="container-fluid container-greencar">
                    <div className="row g-0 p-4">
                        <h1>Products in {subcategoryName}</h1>

                        {/* Category Select */}
                        <div>
                            <select
                                id="categorySelect"
                                onChange={handleCategoryChange}
                                value={`${categoryId}-${categoryName.toLowerCase()}`}
                            >
                                <option value="" disabled>- Hersteller PKW -</option>
                                {categories.map((category) => (
                                    <option
                                        key={category.category_id}
                                        value={`${category.category_id}-${category.category_name.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}`}
                                    >
                                        {category.category_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Subcategory Select */}
                        <div>
                            <select
                                id="subcategorySelect"
                                onChange={handleSubcategoryChange}
                                value={`${subcategoryId}-${subcategoryName.toLowerCase()}`}
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
                        </div>
                    </div>
                    <div className="row g-0 p-4">
                        <h1>Products in {subcategoryName}</h1>
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
                                        <a href={`/pkw-partikelfilter/pkw-austauschfilter/${categoryId}-${categoryName}/${subcategoryId}-${subcategoryName}/${product.product_id}-${product.product_name.toLowerCase().replace(/\s+/g, '-')}`}>
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
