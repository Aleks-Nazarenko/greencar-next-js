import {JOOMLA_API_BASE} from "@/utils/config";
import {fixRelativeUrls} from "@/utils/fixRelativeUrl";


export async function getStaticProps() {


    const resPortal = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=8&format=json`);
    const portalData = await resPortal.json();
    // Extract the footer article from the response
    const portalArticle = portalData.article || null;
    // Convert relative URLs in the footer content to absolute URLs
    if (portalArticle) {
        portalArticle.introtext = portalArticle.introtext ? fixRelativeUrls(portalArticle.introtext) : '';
        if (!portalArticle.introtext) {
            console.log('portalArticle.introtext not found');
        }
    }
    return {
        props: {
            portalArticle,
        },
    };
}
export default function Datenschutzerklaerung({portalArticle}) {
    return (
        <>

                    <div className="row g-0">
                        <div className={"col"}>
                            {portalArticle.introtext && (
                                <div dangerouslySetInnerHTML={{ __html: portalArticle.introtext}} />
                            )}
                        </div>
                    </div>


        </>
    );
}
