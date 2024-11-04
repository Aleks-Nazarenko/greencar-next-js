import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import { useState, useEffect } from 'react';

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
    const paths = [];

    // Step 1: Fetch all categories
    const categoryRes = await fetch(`https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=getSubcategories&category_id=15&format=json`);
    const categories = await categoryRes.json();

    // Step 2: Fetch subcategories for each category
    for (const category of categories) {
        const subcategoryRes = await fetch(`https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=getSubcategories&category_id=${category.category_id}&format=json`);
        const subcategories = await subcategoryRes.json();

        // Step 3: Fetch products for each subcategory
        for (const subcategory of subcategories) {
            const productRes = await fetch(`https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=getProductsBySubcategory&subcategory_id=${subcategory.category_id}&format=json`);
            const products = await productRes.json();

            // Generate paths for each product in the subcategory
            products.forEach((product) => {
                paths.push({
                    params: {
                        "id-name": `${category.category_id}-${category.category_name.toLowerCase().replace(/\s+/g, '-')}`,
                        "subcategory-id-name": `${subcategory.category_id}-${subcategory.category_name.toLowerCase().replace(/\s+/g, '-')}`,
                        "product-id-name": `${product.product_id}-${product.product_name.toLowerCase().replace(/\s+/g, '-')}`,
                    },
                });
            });
        }
    }

    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    // Base URL of your Joomla server (adjust this to your Joomla installation URL)
    const joomlaBaseUrl = 'https://joomla2.nazarenko.de';
    // Extract product ID from `product-id-name`
    const [productId] = params["product-id-name"].split('-');

    // Fetch the product details from the Joomla API
    const res = await fetch(`https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=getProduct&product_id=${productId}&format=json`);
    const product = await res.json();

    // Fetch data for the footer from Joomla API
    const resFooter = await fetch('https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=articleWithModules&id=2&format=json');
    const footerData = await resFooter.json();
    // Extract the footer article from the response
    const footerArticle = footerData.article || null;

    // Convert relative URLs in the footer content to absolute URLs
    if (footerArticle && footerArticle.introtext) {
        footerArticle.introtext = convertRelativeUrls(footerArticle.introtext, joomlaBaseUrl);
    }

    return {
        props: {
            product,
            footerArticle,
        },
    };
}

export default function ProductPage({ product, footerArticle }) {
    return (
        <>
            <main>
                <div className="container-fluid container-greencar">
                    <div className="row g-0 p-4">
                        <h1>{product.product_name}</h1>
                        <p>
                            <ProductImage
                            src={`https://joomla2.nazarenko.de/media/com_hikashop/upload/${product.product_image}`}
                            alt={product.product_name}
                            fallback="https://joomla2.nazarenko.de/media/com_hikashop/upload/beispielphoto.jpg"
                        />
                        </p>
                        <p>{product.product_description}</p>
                        <p>Price: ${product.price_value}</p>
                        {/* Additional product details */}
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
