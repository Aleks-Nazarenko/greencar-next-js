import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { JOOMLA_API_BASE, JOOMLA_URL_BASE } from '@/utils/config';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

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

    try {
        const categoryRes = await fetch(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=454&format=json`);
        //404 500 http errors
        //  if (!categoryRes.ok) throw new Error(`Failed to fetch categories: ${categoryRes.status}`);
        const categories = await categoryRes.json();
        // Step 2: Fetch subcategories for each category
        for (const category of categories) {
            try {
                const productRes = await fetch(`${JOOMLA_API_BASE}&task=getProductsBySubcategory&subcategory_id=${category.category_id}&format=json`);
                //        if (!productRes.ok) throw new Error(`Failed to fetch products for subcategory ${subcategory.category_id}: ${productRes.status}`);
                const products = await productRes.json();
                // Generate paths for each product in the subcategory
                products.forEach((product) => {
                    paths.push({
                        params: {
                            "id-name": `${category.category_id}-${category.category_name.toLowerCase().replace(/\s*\/\s*/g, '-').replace(/\./g, '').replace(/\s+/g, '-').replace(/-+/g, '-')}`,
                            "product-id-name": `${product.product_id}-${product.product_name.toLowerCase().replace(/\s+/g, '-')}`,
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
    // Base URL of your Joomla server (adjust this to your Joomla installation URL)
    const joomlaBaseUrl = JOOMLA_URL_BASE;
    // Extract product ID from `product-id-name`
    const [productId] = params["product-id-name"].split('-');
    // Fetch the product details from the Joomla API
    const res = await fetch(`${JOOMLA_API_BASE}&task=getProduct&product_id=${productId}&format=json`);
    const productData = await res.json();
    const product = productData.product_name ? productData : null;
    if (!productData.product_name) {
        console.error("Invalid product data received:", productData);
    }
    const resArticle = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=22&format=json`);
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
            product,
            article,
        },
    };
}

export default function BauNachruestFilterProductPage({ product, article }) {

    const router = useRouter();
    const productImages = product.product_images;

    return (
        <>
            {product && (
                <div className={"row g-0"}>
                    <h1 className={"pb-0 mb-0"}>{product.product_name} für {product.modell_liste}</h1>
                </div>
            )}
            <div className="w-100 pb-4"></div>
            <div className="row g-0 p-3 p-sm-4 product-detail-view rounded-4 align-items-center">
                {product && (
                    <>
                        <div className={"col"}>
                            <div className={"row"}>
                                <div className="col-sm-6">

                                    {productImages && productImages.length > 1 ? (
                                        <Swiper spaceBetween={10} slidesPerView={1} navigation modules={[Navigation]}>
                                            {productImages.map((image, index) => (
                                                <SwiperSlide key={index}>
                                                    <ProductImage
                                                        className={"img-fluid"}
                                                        src={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/${image}`}
                                                        alt={product.product_name}
                                                        fallback={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/beispielphoto.jpg`}
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    ):(
                                        <ProductImage
                                            className={"img-fluid"}
                                            src={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/${productImages[0]}`}
                                            alt={product.product_name}
                                            fallback={`${JOOMLA_URL_BASE}/media/com_hikashop/upload/beispielphoto.jpg`}
                                        />
                                    )}
                                </div>
                                <div className="col-sm-6">
                                    <div className={"row g-0 pt-3 pt-sm-0"}>
                                        <div className={"col-12"}>
                                            <p className={""}><strong>Hersteller: </strong> {product.hersteller}</p>
                                            <p><strong>Modell: </strong> {product.modell_liste} </p>
                                            <p><strong>Euronorm vor Umrüstung: </strong> {product.euronorm_liste}</p>
                                            <p><strong>Hubraum KW/PS: </strong> {product.hubraum_liste} </p>
                                            <p><strong>Bestellnr.:</strong> {product.bestellnr}</p>
                                            <p><strong>OE-Nummer:</strong> {product.oe_nummer_liste}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </>
                )}
            </div>


            <div className="row g-0 p-4 pb-3">
                <div className={"col col-sm-6"}>
                    <Link href={`/anfrage`}>
                        <button className="btn btn-primary btn-yellow btn-100">Unverbindliches Angebot anfordern</button>
                    </Link>
                </div>
            </div>

            <div className="row g-0 p-4 pt-3">
                <div className={"col col-sm-6"}>
                    <button onClick={() => router.back()} className="btn btn-primary btn-green btn-100">Zurück zur Listenansicht</button>
                </div>
            </div>



            <div className="w-100 pb-4"></div>
            <div className="row g-0">
                {article?.content && (
                    <div dangerouslySetInnerHTML={{ __html: article.content}} />
                )}
            </div>

        </>
    );
}
