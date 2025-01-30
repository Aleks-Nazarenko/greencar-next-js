import { convertRelativeUrls } from '@/utils/convertRelativeUrls';
import footerData from '@/data/footer-data.json';
import { JOOMLA_URL_BASE } from '@/utils/config';

export default function Footer() {
    const footerArticle = footerData.article || null;
    // Convert relative URLs in the footer content to absolute URLs
    if (footerArticle) {
        footerArticle.content = footerArticle.content? convertRelativeUrls(footerArticle.content, JOOMLA_URL_BASE) : '';
        if (!footerArticle.introtext) {
            console.log('footerArticle.content not found');
        }
    }
    return (
        <footer className={"container-fluid container-greencar g-0 bg-gc-light-blue rounded"}>
            <div className="row g-0 p-4">
                <div dangerouslySetInnerHTML={{ __html:  footerArticle.content}} />
            </div>
        </footer>
    );
}
