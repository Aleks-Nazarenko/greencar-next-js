import axios from 'axios';
import Link from "next/link";
import { useRouter } from 'next/router';
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
export async function getStaticPaths() {
    const res = await fetch(`https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=getSubcategories&category_id=15&format=json`);
    const categories = await res.json();
    // Step 2: For each category, fetch its subcategories
    const paths = [];

    for (const category of categories) {
        const res = await fetch(`https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=getSubcategories&category_id=${category.category_id}&format=json`);
        const subcategories = await res.json();

        // Step 3: Generate paths for each subcategory within the category
        subcategories.forEach((subcategory) => {
            paths.push({
                params: {
                    "id-name": `${category.category_id}-${category.category_name.toLowerCase().replace(/\s+/g, '-')}`,
                    "subcategory-id-name": `${subcategory.category_id}-${subcategory.category_name.toLowerCase().replace(/\s+/g, '-')}`
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
    // Extract subcategory ID from `subcategory-id-name`
    const [subcategoryId] = params["subcategory-id-name"].split('-');

    // Fetch the products for the specified subcategory
    const res = await fetch(`https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=getProductsBySubcategory&subcategory_id=${subcategoryId}&format=json`);
    const products = await res.json();

    return {
        props: {
            products,
            subcategoryName: params["subcategory-id-name"].split('-').slice(1).join('-'), // Display-friendly name
            subcategoryId,
        },

    };
}

export default function ProductListPage({ products, subcategoryName, subcategoryId }) {
    return (
        <>
            <main>
                <div className="container-fluid container-greencar">
                    <div className="row g-0 p-4">
                        <h1>Products in {subcategoryName}</h1>
                        <ul>
                            {products.map((product) => (
                                <li key={product.product_id}>
                                    <a href={`/pkw-partikelfilter/pkw-nachruestfilter/${subcategoryId}-${subcategoryName}/${product.product_id}-${product.product_name.toLowerCase().replace(/\s+/g, '-')}`}>
                                        {product.product_name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
        </>
    );
}
