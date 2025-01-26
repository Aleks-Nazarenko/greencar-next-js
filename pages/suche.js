import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { JOOMLA_API_BASE, JOOMLA_URL_BASE } from '@/utils/config';
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";

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
export async function getStaticProps({ params }) {
    // Base URL of your Joomla server (adjust this to your Joomla installation URL)
    const joomlaBaseUrl = JOOMLA_URL_BASE;
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

    return {
        props: {
            footerArticle,
        },
    };
}
const SearchResults = ({footerArticle}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Get the search query from the URL
    const { query } = router.query;

    // Fetch products from Joomla API dynamically
    useEffect(() => {
        if (query) {
            fetchProducts(query);
        }
    }, [query]);

    const fetchProducts = async (searchQuery) => {
        try {
            const response = await fetch(`${JOOMLA_API_BASE}&task=search&query=${encodeURIComponent(searchQuery)}&format=json`);
            const data = await response.json();
            // Convert the object response to an array of products
            const productArray = Object.values(data);
            setProducts(productArray);
        } catch (err) {
            console.error("Error fetching search results:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading search results...</p>;

    return (
        <>
            <main>
                <div className="container-fluid container-greencar">
                    <div className="row g-0 p-4">
                        <h1>Search Results for "{query}"</h1>
                        {/* Display the number of hits */}
                        <p>
                            {products.length > 0
                                ? `Insgesamt ${products.length} Ergebnisse gefunden!`
                                : `Keine Ergebnisse für "${query}".`}
                        </p>
                        {products.length > 0 ? (
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Hersteller</th>
                                    <th>Modell List</th>
                                    <th>OE Nummer</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {products.map((product) => {
                                    // Determine the first available OE number value
                                    const oeNumber =
                                        product.oe_nummer ||
                                        product.oe_nr ||
                                        product.oe_nr_liste ||
                                        product.oe_nummer_liste ||
                                        "N/A";

                                    // Extract the first category hierarchy from the product's categories
                                    const category = product.categories[0] || {};
                                    let firstSlug = "pkw-partikelfilter";
                                    if(category.parent_parent_category_id === 68 || category.parent_parent_category_id === 444 || category.parent_parent_category_id === 470){
                                        firstSlug = "lkw-partikelfilter";
                                    }
                                    if(category.parent_parent_category_id === 69){
                                        firstSlug = "bus-partikelfilter";
                                    }

                                    const productUrl = `/${firstSlug}/${category.parent_parent_category_name?.toLowerCase().trim().replace(/\s+/g, '-') || "unknown"}/${
                                        category.parent_category_id || "unknown"
                                    }-${category.parent_category_name?.toLowerCase().trim().replace(/\s+/g, '-') || "unknown"}/${
                                        category.category_id || "unknown"
                                    }-${category.category_name?.toLowerCase().trim().replace(/\s+/g, '-') || "unknown"}/${
                                        product.product_id
                                    }-${product.product_name.toLowerCase().trim().replace(/\s+/g, '-')}`;

                                    return (
                                        <tr key={product.product_id}>
                                            {/* Cell 1: Product Name and Image */}
                                            <td>
                                                <Link href={productUrl} passHref legacyBehavior>
                                                    <a>
                                                        <strong>{product.product_name}</strong>
                                                    </a>
                                                </Link>
                                                <br />
                                                {product.file_path && (
                                                    <ProductImage
                                                    src={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/thumbnail_100X100/${product.file_path}`}
                                                    alt={product.product_name}
                                                    fallback={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/thumbnail_100X100/beispielphoto.jpg`}
                                                    />
                                                )}
                                            </td>

                                            {/* Cell 2: Hersteller */}
                                            <td>{product.hersteller || "N/A"}</td>

                                            {/* Cell 3: Modell List */}
                                            <td>{product.modell_liste || "N/A"}</td>

                                            {/* Cell 4: OE Nummer */}
                                            <td>{oeNumber}</td>

                                            {/* Cell 5: Actions (Button to the product page) */}
                                            <td>
                                                <Link href={productUrl} passHref legacyBehavior>
                                                    <button className="btn btn-primary">View Product</button>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        ) : (
                            <p>No products found for "{query}".</p>
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
};

export default SearchResults;
