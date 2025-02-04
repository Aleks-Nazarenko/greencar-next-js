import Image from "next/image";
import Link from "next/link";
import {JOOMLA_API_BASE, JOOMLA_URL_BASE} from "@/utils/config";
import {convertRelativeUrls} from "@/utils/convertRelativeUrls";


export async function getStaticProps() {
    const resArticle = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=9&format=json`);
    const articleData = await resArticle.json();
    const article = articleData.article || null;
    if (article) {
        article.content = article.content ? convertRelativeUrls(article.content, JOOMLA_URL_BASE) : '';
        if (!article.content) {
            console.log('Article Händlerpreis not found');
        }
    }
    const resArticle2 = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=10&format=json`);
    const articleData2 = await resArticle2.json();
    const article2 = articleData2.article || null;
    if (article2) {
        article2.content = article2.content ? convertRelativeUrls(article2.content, JOOMLA_URL_BASE) : '';
        if (!article2.content) {
            console.log('Filterreinigungsmaschinen not found');
        }
    }
    const resArticle3 = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=11&format=json`);
    const articleData3 = await resArticle3.json();
    const article3 = articleData3.article || null;
    if (article3) {
        article3.content = article3.content ? convertRelativeUrls(article3.content, JOOMLA_URL_BASE) : '';
        if (!article3.content) {
            console.log('PKW - Filterreinigung UNTEN not found');
        }
    }
    return {
        props: {
            article,
            article2,
            article3
        },
    };
}
 export default function AnfrageHaendlerpreis({article, article2, article3}) {
     return (
            <>
                <div className={"row g-0"}>
                    <div className={"col"}>
                             {article?.content && (
                                 <div dangerouslySetInnerHTML={{ __html: article.content}} />
                             )}
                    </div>
                </div>
                <div className={"w-100 pb-3"}>
                    <div className={"row g-0"}>
                        <div className={"col"}>
                            {article2?.content && (
                                <div dangerouslySetInnerHTML={{ __html: article2.content}} />
                            )}
                        </div>
                    </div>
                </div>
                <div className={"w-100 pb-3"}>
                    <div className={"row g-0"}>
                        <div className={"col"}>
                            {article3?.content && (
                                <div dangerouslySetInnerHTML={{ __html: article3.content}} />
                            )}
                        </div>
                    </div>
                </div>
            </>
     );
 }
