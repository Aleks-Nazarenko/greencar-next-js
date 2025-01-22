import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
            rel="preload"
            href="/background/bg_clean.jpg"
            as="image"
        />
          <link
              rel="preload"
              href="/background/greencar-lkw-final.png"
              as="image"
          />
          <link
              rel="preload"
              href="/background/greencar-bm-final.png"
              as="image"
          />
          <link
              rel="preload"
              href="/background/greencar-pkw-final.png"
              as="image"
          />
    </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
