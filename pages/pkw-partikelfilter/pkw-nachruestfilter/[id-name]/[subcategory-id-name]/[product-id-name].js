import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { JOOMLA_API_BASE } from '@/utils/config';
import { JOOMLA_URL_BASE } from '@/utils/config';
function ProductImage({ src, alt, fallback, className }) {
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setImgSrc(src); // If the image loads, keep the original src
        img.onerror = () => setImgSrc(fallback); // If the image fails to load, use fallback
    }, [src, fallback]);

    return (
        <img src={imgSrc} alt={alt} className={className} />
    );
}
export async function getStaticPaths() {
    const paths = [];

    // Step 1: Fetch all categories
    const categoryRes = await fetch(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=15&format=json`);
    const categories = await categoryRes.json();

    // Step 2: Fetch subcategories for each category
    for (const category of categories) {
        const subcategoryRes = await fetch(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=${category.category_id}&format=json`);
        const subcategories = await subcategoryRes.json();

        // Step 3: Fetch products for each subcategory
        for (const subcategory of subcategories) {
            const productRes = await fetch(`${JOOMLA_API_BASE}&task=getProductsBySubcategory&subcategory_id=${subcategory.category_id}&format=json`);
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
    const joomlaBaseUrl = JOOMLA_URL_BASE;
    // Extract product ID from `product-id-name`
    const [productId] = params["product-id-name"].split('-');

    // Fetch the product details from the Joomla API
    const res = await fetch(`${JOOMLA_API_BASE}&task=getProduct&product_id=${productId}&format=json`);
    const product = await res.json();

    // Fetch data for the footer from Joomla API
    const resFooter = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=2&format=json`);
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
    const formatPrice = (price) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
        }).format(price);
    };
    const router = useRouter();
    return (
        <>
            <main>
                <div className="container-fluid container-greencar">
                    <div className="row g-0 p-4">
                        <h1>{product.product_name}</h1>
                        <p>
                            <ProductImage
                                className={"img-fluid"}
                                src={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/${product.product_image}`}
                                alt={product.product_name}
                                fallback={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/beispielphoto.jpg`}
                        />
                        </p>
                        <p>{product.product_description}</p>
                        <p>Price: {formatPrice(product.price_value)}</p>
                        {/* Additional product details */}
                    </div>
                    <div className="row g-0 p-4">
                        <Link href={`/anfrage`}>
                            <button className="btn btn-primary">Unverbindliches Angebot anfordern</button>
                        </Link>
                    </div>
                    <div className="row g-0 p-4">
                        <button onClick={() => router.back()} className="btn btn-primary">Zurück zur Listenansicht</button>
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
