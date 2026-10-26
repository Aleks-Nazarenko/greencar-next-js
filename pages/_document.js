import { Html, Head, Main, NextScript } from "next/document";
import { googleTagsHeadScript } from "@/utils/googleTags";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Ads / Analytics with Consent Mode, loaded only after cookie consent */}
        <script dangerouslySetInnerHTML={{ __html: googleTagsHeadScript }} />
        <link
            rel="preload"
            href="/background/bg_clean.jpg"
            as="fetch"
        />
          <link
              rel="preload"
              href="/background/greencar-lkw-final.png"
              as="fetch"
          />
          <link
              rel="preload"
              href="/background/greencar-bm-final.png"
              as="fetch"
          />
          <link
              rel="preload"
              href="/background/greencar-pkw-final.png"
              as="fetch"
          />
    </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
