
// pages/categories/[id-name]/[subcategory-id-name]/[product-id-name].js

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
    // Extract product ID from `product-id-name`
    const [productId] = params["product-id-name"].split('-');

    // Fetch the product details from the Joomla API
    const res = await fetch(`https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=getProduct&product_id=${productId}&format=json`);
    const product = await res.json();

    return {
        props: {
            product,
        },
    };
}

export default function ProductPage({ product }) {
    return (
        <>
            <main>
                <div className="container-fluid container-greencar">
                    <div className="row g-0 p-4">
                        <h1>{product.product_name}</h1>
                        <p>{product.product_description}</p>
                        <p>Price: ${product.price_value}</p>
                        {/* Additional product details */}
                    </div>
                </div>
            </main>
        </>
    );
}
