import Link from "next/link";
import { useRouter } from 'next/router';
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import { useState, useEffect } from 'react';
import {JOOMLA_API_BASE} from "@/utils/config";
import {JOOMLA_URL_BASE} from "@/utils/config";
import NextImage from "next/image"; // Next.js Image is renamed to NextImage to avoid conflicts with the HTML Image element!!!
import Form from 'react-bootstrap/Form';

// Base URL of your Joomla server
const joomlaBaseUrl = JOOMLA_URL_BASE;
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
    try {
        const res = await fetch(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=15&format=json`);
        const categories = await res.json();
        // Step 2: For each category, fetch its subcategories
        for (const category of categories) {
            try {
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
            } catch (error) {
                console.error(`Failed to fetch subcategories for category ID ${category.category_id}:`, error.message);
            }
        }
    } catch (error) {
        console.error("Failed to fetch categories:", error.message);
    }

    return {
        paths,
        fallback: false,
    };
}
export async function getStaticProps({ params }) {
    // Extract and handle multi-word category and subcategory names
    const [categoryId, ...categoryNameParts] = params["id-name"].split('-');
    const categoryName = categoryNameParts.join('-');
    const [subcategoryId, ...subcategoryNameParts] = params["subcategory-id-name"].split('-');
    const subcategoryName = subcategoryNameParts.join('-');

    let products = [];
    let categories = [];
    let subcategories = [];
    // Fetch the products for the specified subcategory
    try {
        const res = await fetch(`${JOOMLA_API_BASE}&task=getProductsBySubcategory&subcategory_id=${subcategoryId}&format=json`);
        products = await res.json();
    } catch (error) {
        console.error(`Failed to fetch products for subcategory ID ${subcategoryId}:`, error.message);
    }
    // Fetch all categories for the main category dropdown
    try {
        const resCategories = await fetch(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=15&format=json`);
        categories = await resCategories.json();
    } catch (error) {
        console.error('Failed to fetch categories:', error.message);
    }
    // Fetch subcategories for the current category for the subcategory dropdown
    try {
        const resSubcategories = await fetch(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=${categoryId}&format=json`);
        subcategories = await resSubcategories.json();
    } catch (error) {
        console.error(`Failed to fetch subcategories for category ID ${categoryId}:`, error.message);
    }
    const resArticle = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=19&format=json`);
    const articleData = await resArticle.json();
    // Extract the footer article from the response
    const article = articleData.article || null;
    if (article) {
        article.content = article.content ? convertRelativeUrls(article.content, joomlaBaseUrl) : '';
        if (!article.content) {
            console.log('footerArticle.content not found');
        }
    }

    return {
        props: {
            products,
            categoryName,
            categoryId,
            subcategoryName,
            subcategoryId,
            article,
            categories,
            subcategories,
        },
    };
}


export default function ProductListPage({ products, categoryName, categoryId, subcategoryName, subcategoryId, article, categories, subcategories  }) {
    const router = useRouter();
    if (router.isFallback || !products) {
        return <p>Loading...</p>;
    }
    const handleCategoryChange = (event) => {
        const selectedCategory = event.target.value;
        if (selectedCategory) {
            router.push(`/pkw-partikelfilter/pkw-nachruestfilter/${selectedCategory}`);
        }
    };
    const handleSubcategoryChange = (event) => {
        const selectedSubcategory = event.target.value;
        if (selectedSubcategory) {
            router.push(`/pkw-partikelfilter/pkw-nachruestfilter/${categoryId}-${categoryName}/${selectedSubcategory}`);
        }
    };
    return (
        <>

            <div className={"row g-0"}>
                <h1 className={"pb-0 mb-1"}>PKW - Austauschfilter</h1>
                <h2 className={"display-4 mb-0"}>Bitte wählen Sie zunächst den Hersteller Ihres Pkw und danach ggf. das Modell. Anschließend stellen wir Ihnen unsere Produktauswahl an passenden Austaustauschfiltern vor.</h2>
            </div>
            <div className="w-100 pb-4"></div>
            <div className="row g-0 p-3 p-sm-4 product-detail-view rounded-4 align-items-center">
                <div className={"col"}>
                    {/* Category Select */}
                    <div className={"row g-0 "}>
                        <div className={"col-12"}>
                            {categories.length > 0 && (
                                <Form.Select
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
                                </Form.Select>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col text-end d-none d-sm-block">
                    <NextImage src={"/images/icons/pkw-austauschfilter.png"} alt={"austauchfilter"} width={190} height={190} className={"img-fluid picto-190"}/>
                </div>
            </div>


            {products.length > 0 && (
                <>
                <div className="w-100 pb-4"></div>
                <div className="row g-0 p-3 p-sm-4 product-detail-view rounded-4 ">
                    <div className="col-12 table-responsive">
                            <table className={"table table-bordered align-middle"}>
                                <thead>
                                <tr className={"text-center align-middle"}>
                                    <th >Produktname</th>
                                    <th>Modell</th>
                                    <th>Euronorm vor Umrüstung</th>
                                    <th>Hubraum KW/PS</th>
                                    <th>Getr. Art</th>
                                    <th>HSN</th>
                                    <th>TSN</th>
                                    <th>System</th>
                                    <th>Bauzeit</th>
                                    <th>Price</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {products.map((product) => (
                                    <tr key={product.product_id} className={"text-center"}>
                                        <td className={""}>
                                            <ProductImage
                                                src={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/thumbnail_100X100/${product.product_image}`}
                                                alt={product.product_name}
                                                fallback={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/thumbnail_100X100/beispielphoto.jpg`}
                                            />
                                            <span className={"d-block"}>{product.product_name}</span>
                                        </td>
                                        <td className={"text-center"}>{product.modell_liste}</td>
                                        <td>{product.euronorm_liste}</td>
                                        <td>{product.hubraum_liste}</td>
                                        <td>{product.getriebe_liste}</td>
                                        <td className={"text-center"}>{product.hsn_liste}</td>
                                        <td className={"text-center"}>{product.tsn_liste}</td>
                                        <td>{product.system_liste}*</td>
                                        <td>{product.bauzeit_liste}</td>
                                        <td>auf Anfrage</td>

                                        <td>
                                            <Link href={`/pkw-partikelfilter/pkw-nachruestfilter/${categoryId}-${categoryName}/${subcategoryId}-${subcategoryName}/${product.product_id}-${product.product_alias.toLowerCase().replace(/\s+/g, '-')}`}>
                                                <button className="btn btn-primary btn-green btn-100">Details</button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                    </div>
                    <div className={"w-100 pb-3"}></div>
                    <div className={"col-12  pb-1"}>
                        <strong className={"pe-2"}>ATS*:</strong>
                        Dieses System enthält bereits einen Katalysator, der für den Erhalt der grünen Umweltplakette vorgeschrieben ist.
                    </div>
                    <div className={"col-12"}>
                        <strong className={"pe-2"}>ZUS*</strong>
                        Achtung: Dieser Partikelfilter enthält keinen Katalysator! Zur Erlangung der grünen Umweltplakette schreibt der Gesetzgeber die zusätzliche Erneuerung des Katalysators vor. Diese Regelung trifft für Fahrzeuge zu, die bereits älter als fünf Jahre sind oder mehr als 80.000 KM Laufleistung haben.
                    </div>
                </div>
                </>
            )}





            <div className="w-100 pb-4"></div>
            <div className="row g-0">
                {article?.content && (
                    <div dangerouslySetInnerHTML={{ __html: article.content}} />
                )}
            </div>

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
                                        <Link href={`/pkw-partikelfilter/pkw-nachruestfilter/${categoryId}-${categoryName.toLowerCase()}/${subcategory.category_id}-${subcategory.category_name.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}`}>{subcategory.category_name}</Link>
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
