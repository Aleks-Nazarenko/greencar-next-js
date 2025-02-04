import {convertRelativeUrls} from "@/utils/convertRelativeUrls";
import {JOOMLA_API_BASE} from "@/utils/config";
import {JOOMLA_URL_BASE} from "@/utils/config";

export async function getStaticProps() {
    // Base URL of your Joomla server (adjust this to your Joomla installation URL)
    const joomlaBaseUrl = JOOMLA_URL_BASE;
    // Fetch data from Joomla API
    const res = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=4&format=json`);
    const data= await res.json();
    // Extract article from the response
    const article = data.article || null;
    // Convert relative URLs in the footer content to absolute URLs
    if (article) {
        article.content = article.content ? convertRelativeUrls(article.content, joomlaBaseUrl) : '';
        if(!article.content) {
            console.log('article.content not found');
        }
    }
    // Return the expected props structure
    return { props: { article} };
}
export default function KontaktGreencar({article, footerArticle}) {

    return (
        <>
            <div className="row g-0">
                {article?.content && (
                    <div dangerouslySetInnerHTML={{ __html: article.content}} />
                )}
            </div>

        </>
    );
}
