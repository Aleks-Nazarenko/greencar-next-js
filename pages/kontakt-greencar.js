import {convertRelativeUrls} from "@/utils/convertRelativeUrls";

export async function getStaticProps() {
    // Base URL of your Joomla server (adjust this to your Joomla installation URL)
    const joomlaBaseUrl = 'https://joomla2.nazarenko.de';
    // Fetch data from Joomla API
    const res = await fetch('https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=articleWithModules&id=4&format=json');
    const data= await res.json();
    // Extract article from the response
    const article = data.article || null;
    // Convert relative URLs in the footer content to absolute URLs
    if (article && article.introtext) {
        article.introtext = convertRelativeUrls(article.introtext, joomlaBaseUrl);
    }
    // Fetch data for the footer from Joomla API
    const resFooter = await fetch('https://joomla2.nazarenko.de/index.php?option=com_nazarenkoapi&task=articleWithModules&id=2&format=json');
    const footerData = await resFooter.json();
    console.log("API Response:", footerData);
    // Extract the footer article from the response
    const footerArticle = footerData.article || null;

    // Convert relative URLs in the footer content to absolute URLs
    if (footerArticle && footerArticle.introtext) {
        footerArticle.introtext = convertRelativeUrls(footerArticle.introtext, joomlaBaseUrl);
    }
    // Return the expected props structure
    return { props: { article, footerArticle} };
}
export default function KontaktGreencar({article, footerArticle}) {
    if (!article) {
        return (
            <div className="row g-0 justify-content-center">
                <div className="col-auto">No article found</div>
            </div>
        );

    }
    return (
        <>
            <main>
                <div className="container-fluid container-greencar">
                    <div className="row g-0 p-4">
                        <div dangerouslySetInnerHTML={{ __html: article.introtext}} />
                    </div>
                </div>
            </main>
            <footer>
                <div className="container-fluid container-greencar container-footer">
                    <div className="row g-0 p-4">
                        <div dangerouslySetInnerHTML={{ __html: footerArticle.introtext}} />
                    </div>
                </div>
            </footer>
        </>
    );
}
