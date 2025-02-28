import {JOOMLA_API_BASE, JOOMLA_URL_BASE} from "@/utils/config";
import {fixRelativeUrls} from "@/utils/fixRelativeUrl";


export async function getStaticProps() {

    const resArticle = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=29&format=json`);
    const articleData = await resArticle.json();
    const article = articleData.article || null;
    // Convert relative URLs in the footer content to absolute URLs
    if (article) {
        article.content = article.content ? fixRelativeUrls(article.content, JOOMLA_URL_BASE) : '';
        if (!article.content) {
            console.log('article.content not found');
        }
    }
    return {
        props: {
            article,
        },
    };
}
export default function JobsKarriere({ article }) {

    // Convert HTML entities to actual HTML
    const decodedContent = article.content
        .replace(/&lt;/g, "<")  // Convert `<`
        .replace(/&gt;/g, ">")  // Convert `>`
        .replace(/{source}/g, "")  // Remove `{source}`
        .replace(/{\/source}/g, "");  // Remove `{/source}`

    return (
        <div className="container mt-4">
            <h1>Article</h1>
            <div dangerouslySetInnerHTML={{ __html: decodedContent }} />
        </div>
    );
}
