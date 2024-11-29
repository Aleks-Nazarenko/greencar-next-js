import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
            {/* Add PayPal SDK Script */}
                <script
                    src="https://www.paypal.com/sdk/js?client-id=AWlnu3flylsdsc5dJ4jLnYEyOpzqgeWE_XPAag7TfJhINzC6KnXW9RQteB9LJvE5vpbXNfzBcrI9rQ1s&currency=EUR"
                    strategy="afterInteractive"
                ></script>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
  );
}
