import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import { useState, useEffect } from 'react';
import Link from 'next/link';
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
export async function getStaticProps() {
    // Base URL of your Joomla server (adjust this to your Joomla installation URL)
    const joomlaBaseUrl = JOOMLA_URL_BASE;

    // Fetch the product details from the Joomla API
    const res = await fetch(`${JOOMLA_API_BASE}&task=getProduct&product_id=8469&format=json`);
    const productData = await res.json();
    const product = productData.product_name ? productData : null;
    if (!productData.product_name) {
        console.error("Invalid product data received:", productData);
    }
    const resArticle = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=27&format=json`);
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

    const productImages = product.product_images;

    return (
        <>
            {product && (
                <div className={"row g-0"}>
                    <h1 className={"pb-0 mb-0"}>{product.product_name} für {product.motorleistung_liste}</h1>
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
                    <Link href={`/anfrage-filterreinigung-bau`}>
                        <button className="btn btn-primary btn-yellow btn-100">Unverbindliches Angebot anfordern</button>
                    </Link>
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
