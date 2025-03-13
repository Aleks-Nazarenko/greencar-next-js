import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { JOOMLA_API_BASE, JOOMLA_URL_BASE } from '@/utils/config';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import Pictos from "@/components/PictosLKW";
import { createSlug } from '@/utils/sanitizeProductSlug';

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
        const categoryRes = await fetch(`${JOOMLA_API_BASE}&task=getSubcategories&category_id=470&format=json`);
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
                    const productName = createSlug(product.product_name);
                    paths.push({
                        params: {
                            "id-name": `${category.category_id}-${category.category_name.toLowerCase().replace(/\s+/g, '-')}`,
                            "product-id-name": `${product.product_id}-${productName}`,
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
    const resArticle = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=25&format=json`);
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

export default function LkwReinigungProductPage({ product, article }) {

    const router = useRouter();
    const productImages = product.product_images;

    // Utility function to format a date to "DD.MM.YYYY"
    const formatDateToGerman = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };
    // Utility function to determine the next valid day (skipping weekends)
    const getNextValidDay = (date) => {
        // If the date falls on Saturday (6) or Sunday (0), adjust it to the next Monday
        while (date.getDay() === 0 || date.getDay() === 6) {
            date.setDate(date.getDate() + 2);
        }
        return date;
    };
    const [selectedDate, setSelectedDate] = useState(() => {
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        // Skip to Monday if tomorrow is a weekend
        if (tomorrow.getDay() === 6) {
            // If it's Saturday, add 2 days to get to Monday
            tomorrow.setDate(tomorrow.getDate() + 2);
        } else if (tomorrow.getDay() === 0) {
            // If it's Sunday, add 1 day to get to Monday
            tomorrow.setDate(tomorrow.getDate() + 1);
        }
        return tomorrow.toISOString().split('T')[0]; // Set initial date to tomorrow in "YYYY-MM-DD" format
    });
    const [nextDay, setNextDay] = useState(() => {
        let dayAfterTomorrow = new Date();
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 3);
        dayAfterTomorrow = getNextValidDay(dayAfterTomorrow);
        return formatDateToGerman(dayAfterTomorrow); // Correctly format the initial value
    });
    const handleDateChange = (e) => {
        let selected = new Date(e.target.value);

        // If the selected date falls on a weekend, adjust it to the next valid weekday
        if (selected.getDay() === 0 || selected.getDay() === 6) {
            selected = getNextValidDay(selected);
        }

        setSelectedDate(selected.toISOString().split('T')[0]);

        // Set the next day after the selected date, skipping weekends
        let next = new Date(selected);
        next.setDate(selected.getDate() + 2);
        next = getNextValidDay(next);
        setNextDay(formatDateToGerman(next));
    };

    return (
        <>
            {product && (
                <div className={"row g-0"}>
                    <h1 className={"pb-0 mb-0"}>{product.product_name}</h1>
                </div>
            )}
            <div className="w-100 pb-4"></div>

            <div className="row g-0">
                <div className="col-sm-8">

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
                                                    <p><strong>Euronorm: </strong> {product.euronorm2_liste}</p>
                                                    <p><strong>Hubraum KW/PS: </strong> {product.hubraum_liste} </p>
                                                    <p><strong>Bauzeit: </strong> {product.bauzeit_liste}</p>
                                                    <p><strong>Service: </strong> {product.service_liste}</p>
                                                    <p><strong>OE-Nr. - alte OE-Nr.:</strong> {product.oe_nr}</p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </>
                        )}
                    </div>

                    <div className=" row g-0 bg-white rounded-4 p-3 p-sm-4 mt-4 date-selection">
                        <div className={"display-4 pb-2"}>48h Express-Service Rechner!</div>

                        <div className={"col-12"}>Abholdatum des ausgebauten Partikelfilters:</div>
                        <div className={"col-sm-6 col-12"}>
                            <input
                                type="date"
                                value={selectedDate || ''}
                                onChange={handleDateChange}
                                min={new Date().toISOString().split('T')[0]}
                                className={"form-control"} aria-label="form-date"
                            />
                        </div>
                        <div>bis 16:00 Uhr</div>
                        <div className={"w-100 pb-2"}> </div>

                        <div className="col-sm-6 col-12 next-day">
                            <div>Zustellung des gereinigten Partikelfilters</div>
                            <input type="text" value={nextDay || ''} readOnly className={"form-control"} aria-label="form-input"/>
                            <div>bis 12:00 Uhr garantiert!</div>

                        </div>
                    </div>

                    <div className="row g-0 p-4 pb-3">
                        <div className={"col col-sm-6"}>
                            <Link href={`/anfrage-filterreinigung`}>
                                <button className="btn btn-primary btn-yellow btn-100">Unverbindliches Angebot anfordern</button>
                            </Link>
                        </div>
                    </div>

                    <div className="row g-0 p-4 pt-3">
                        <div className={"col col-sm-6"}>
                            <button onClick={() => router.back()} className="btn btn-primary btn-green btn-100">Zurück zur Listenansicht</button>
                        </div>
                    </div>

                </div>
                <div className={"col-sm-4  text-center text-sm-end"}>
                    <Pictos />
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
