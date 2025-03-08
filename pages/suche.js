import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { JOOMLA_API_BASE, JOOMLA_URL_BASE } from '@/utils/config';

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

const SearchResults = () => {
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

                    <div className="row g-0 ">
                        <h1>Suchergebnisse für "{query}"</h1>
                        {/* Display the number of hits */}
                        <p>
                            {products.length > 0
                                ? `Insgesamt ${products.length} Ergebnisse gefunden!`
                                : `Keine Ergebnisse für "${query}".`}
                        </p>
                        {products.length > 0 && (
                            <table className="table table-bordered align-middle">
                                <thead>
                                    <tr className={"text-center align-middle"}>
                                        <th>Produktname</th>
                                        <th>Hersteller</th>
                                        <th>Modell</th>
                                        <th>OE Nummer</th>
                                        <th></th>
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
                                    /*
                                    In HikaShop scheinen die Möglichkeiten, die defundenen Produkte (anhand von OE-Nummern) mit ihren orig. URL zu verlinken, sehr begrenzt zu sein (und Prodkut-Detailansicht hat ne andere URL in search results).
                                    Außerdem sind Product-URLS ein Misch-Masch aus der Kategorien-Struktur und Menü-Struktur.
                                    Ich habe die Suche im Controller anders gelöst. Der JSON-Response beinhaltet immer 3 Kategorien, da Momentan sind die Produkte mit OE-Nummern immer in 2 oder 3 Kategorien.
                                    Deshalb wird 'manuell' anhand von Kategorien_IDs die Slugs für die Kategorien bestimmt.
                                     */
                                    const category = product.categories[0] || {};
                                    let firstSlug = "";
                                    let productUrl = "";
                                    if(category.parent_parent_category_id === 2) { //Produkt is in 2 Kategorien
                                        if (category.parent_category_id === 68) {
                                            firstSlug = "lkw-partikelfilter/dpf-euro-vi/"; //Kategorie: LKW Nachrüstfilter
                                        }
                                        if(category.parent_category_id === 69){
                                            firstSlug = "bus-partikelfilter/dpf-euro-vi/"; //Kategorie: Bus Nachrüstfilter
                                        }
                                        if(category.parent_category_id === 444 ){
                                            firstSlug = "lkw-partikelfilter/schalldaempfer-euro-vi/"; //Kategorie: LKW Austauschfilter
                                        }
                                        if(category.parent_category_id === 470 ){
                                            firstSlug = "lkw-partikelfilter/lkw-filterreinigung/"; //Kategorie: LKW Filterreiningung
                                        }
                                        productUrl = `/${firstSlug}/${category.category_id || "unknown"}-${(category.category_name || "unknown").trim().toLowerCase().replace(/\s+/g, '-')}/${product.product_id}-${product.product_name.trim().toLowerCase().replace(/\s+/g, '-')}`;

                                    }else{
                                        firstSlug = "pkw-partikelfilter/pkw-austauschfilter/";
                                        productUrl = `/${firstSlug}/${category.parent_category_id || "unknown"}-${(category.parent_category_name || "unknown").trim().toLowerCase().replace(/\s+/g, '-')}/${category.category_id || "unknown"}-${(category.category_name || "unknown").trim().toLowerCase().replace(/\s+/g, '-')}/${product.product_id}-${product.product_name.trim().toLowerCase().replace(/\s+/g, '-')}`;
                                    }

                                    return (
                                        <tr key={product.product_id} className={"text-center"}>
                                            {/* Cell 1: Product Name and Image */}
                                            <td>
                                                {product.file_path && (
                                                    <ProductImage
                                                        src={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/thumbnail_100X100/${product.file_path}`}
                                                        alt={product.product_name}
                                                        fallback={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/thumbnail_100X100/beispielphoto.jpg`}
                                                    />
                                                )}
                                                <Link href={productUrl} className={"d-block"}>
                                                    {product.product_name}
                                                </Link>
                                            </td>

                                            {/* Cell 2: Hersteller */}
                                            <td>{product.hersteller || "N/A"}</td>

                                            {/* Cell 3: Modell List */}
                                            <td>{product.modell_liste || "N/A"}</td>

                                            {/* Cell 4: OE Nummer */}
                                            <td>{oeNumber}</td>

                                            {/* Cell 5: Actions (Button to the product page) */}
                                            <td>
                                                <Link href={productUrl} >
                                                    <button className="btn btn-primary btn-green btn-100">Details</button>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        )}
                    </div>

        </>
    );
};

export default SearchResults;
