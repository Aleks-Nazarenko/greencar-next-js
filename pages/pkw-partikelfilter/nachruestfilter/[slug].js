import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import axios from 'axios';
import Link from "next/link";
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ["latin"] });

export async function getStaticPaths() {
    // Fetch the list of products
    const res = await axios.get('https://joomla.nazarenko.de/index.php?option=com_nazarenkoapi&view=products&format=json');
    const products = res.data;

    // Generate paths with `id` param
    const paths = products.map(product => ({
        params: { slug: product.product_code},
    }));
    return { paths, fallback: false };
}
export async function getStaticProps({ params }) {
    // Fetch data from Joomla API
    const res = await axios.get(`https://joomla.nazarenko.de/index.php?option=com_nazarenkoapi&view=product&code=${params.slug}&format=json`);
    const product = res.data;
   // console.log(product);

    // Pass data to the page via props
    return { props: { product } };
}


function Product({ product }) {
    const router = useRouter();

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{product.product_name}</h1>

        </div>
    );
}

export default Product;
