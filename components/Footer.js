import { convertRelativeUrls } from '@/utils/convertRelativeUrls';

export async function getStaticProps() {
    // Fetch data from Joomla API
    const res = await fetch('https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=articleWithModules&id=2&format=json');
    const data= await res.json();
    console.log("API Response FOOTER:", data);

    // Extract article from the response
    const article = data.article || null;

    // Base URL of your Joomla server (adjust this to your Joomla installation URL)
    const joomlaBaseUrl = 'https://joomla2.nazarenko.de';

    // Convert relative URLs in the article content to absolute URLs
    if (article && article.introtext) {
        article.introtext = convertRelativeUrls(article.introtext, joomlaBaseUrl);
    }

    // Return the expected props structure
    return { props: { article } };
}
export default function FooterNazarenko({article}) {
    if (!article) {
        return (
            <div className="row g-0 justify-content-center">
                <div className="col-auto">No article found</div>
            </div>
            );

    }
    return (
        <>
            <div className="row g-0 p-4">
                <div dangerouslySetInnerHTML={{ __html: article.introtext}} />
            </div>
        </>
    );
}
