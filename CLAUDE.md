# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A headless Next.js 14 (Pages Router, plain JavaScript) frontend for the GreenCar diesel particulate filter shop at https://www.dieselpartikelfilter.net. Content and products come from a Joomla/HikaShop backend through a custom API component (`com_nazarenkoapi`). Site content and URLs are in German.

## Commands

```bash
npm run dev        # dev server at http://localhost:3000
npm run build      # static export to out/, then postbuild runs next-sitemap
npm run lint       # next lint
node scripts/generateRedirects.mjs   # writes out/.htaccess with Joomla→Next 301 redirects (run after build)
node scripts/fetch-footer.mjs        # refreshes data/footer-data.json from Joomla
npm run deploy:dry   # starts .github/workflows/deploy-manual.yaml on GitHub as a dry run (needs gh CLI, logged in)
npm run deploy       # same, real deploy to static.dpfclean.de
gh run watch         # follow the run just started
```

Deploys build from `master` on GitHub, so local changes must be pushed first.

There is no test suite.

## Architecture

**Fully static export.** `next.config.mjs` sets `output: 'export'`, `trailingSlash: true`, and `images.unoptimized`. That means:
- No SSR, no ISR, no runtime API routes (`pages/api/hello.js` is a leftover and is not deployed). Don't use `getServerSideProps`, `revalidate`, middleware, or `next/image` optimization.
- Every dynamic route must enumerate all of its paths in `getStaticPaths` with `fallback: false`.
- Content changes in Joomla only reach the site on rebuild. `.github/workflows/deploy.yaml` rebuilds nightly (cron 02:00 UTC) and rsyncs `out/` to a LAMP/Apache server. `deploy-old.yaml` and `compare.yaml` are not the active pipeline.
- `staticPageGenerationTimeout` is 120s because builds make many sequential calls to the Joomla API.

**Data fetching.** All backend calls go to `JOOMLA_API_BASE` + `&task=<name>&...&format=json`.
- At build time (`getStaticProps`/`getStaticPaths`): `articleWithModules&id=N` for CMS page content, plus `getSubcategories&category_id=N`, `getProductsByCategory`, `getProductsBySubcategory`, and `getProduct&product_id=N`.
- At runtime from the browser (client-side `fetch`): `login`, `register`, `confirmOrder`, `getLands`/`getCities`, and the inquiry forms (`anfrageHaendlerPreis`, `anfrageFilterreinigungBau`, …).
- Joomla article HTML is rendered with `dangerouslySetInnerHTML`. Relative image and link URLs in it are rewritten to point at `JOOMLA_URL_BASE` via `utils/convertRelativeUrls.js` / `utils/fixRelativeUrl.js`. Product images load from `${JOOMLA_URL_BASE}/media/com_hikashop/upload/`.
- Some category, product and article IDs are hardcoded in the pages. For example, 70 is PKW-Austauschfilter, and products 3259/3258/14794 hold the installation, delivery and deposit add-ons.

**Routing and slugs.** Product sections follow the pattern `pages/<vehicle>-partikelfilter/<section>/[id-name]/[product-id-name].js`. The PKW sections add a `[subcategory-id-name]` level. Segments are `<joomlaId>-<slug>`: pages parse the ID with `params[...].split('-')[0]`, and the slug comes from `createSlug()`. Vehicle types are pkw (cars), lkw (trucks), bus and baumaschinen (construction machinery).

**Duplicate config/util files.** These pairs must stay in sync:
- `utils/config.js` is used by the app and reads `NEXT_PUBLIC_*` env vars.
- `utils/config.mjs` is used by the Node scripts in `scripts/` and has hardcoded values.
- `utils/sanitizeProductSlug.js` and `.mjs` are the same pair. Slug logic must match between them, or the redirects in `generateRedirects.mjs` won't line up with the generated pages.

**Env vars** (in `.env.local` locally, GitHub secrets in CI): `NEXT_PUBLIC_GC_MAPS_API_KEY`, `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_GOOGLE_CONVERSION_LABEL`. They are inlined at build time.

**Client state (sessionStorage, no global store).** The checkout flow goes product page → `checkout.js` → `checkout-2.js` (PayPal, then `confirmOrder`) → `bestellbestaetigung.js`. It passes data through the sessionStorage keys `cart`, `productOptions`, `checkoutDetails` and `lastVisitedProduct`. Dealer ("Händler") login stores `authToken` and `user` in sessionStorage, and pages check these to show dealer pricing.

**PayPal.** `PAYPAL_MODE` in `utils/config.js` picks the method. `'redirect'` (current) sends the order e-mail, then posts a PayPal Standard form to `PAYPAL_STANDARD_URL` with `PAYPAL_BUSINESS_EMAIL` and the `GC-…` order number as `invoice`. `'buttons'` uses the `@paypal/react-paypal-js` buttons and needs a Live client ID in `NEXT_PUBLIC_PAYPAL_CLIENT_ID` (the current one is a sandbox app).

**Dealers.** `components/DealerNotice.js` (in `Layout`) shows the logged-in dealer and sets `body.haendler-angemeldet`. `styles/custom.scss` then hides everything with class `is-haendler`, the same rule as the old Joomla template. Use that class in menus/banners, and in Joomla article HTML, to hide things from dealers. `checkout.js` sends `checkoutDetails.dealer` so `confirmOrder` can mark dealer orders.

**Joomla API component.** Its source is not in this repo: `C:\xampp\htdocs\greencar\components\com_nazarenkoapi\controller.php` (CRLF line endings), uploaded to joomla2 by hand. `confirmOrder` only sends e-mails (shop `SHOP_EMAIL` + customer); it saves no order.

**Layout and styling.** `pages/_app.js` wraps every page in `components/Layout.js` (Navbar, VehicleSwitcher, SecondaryMenu, SearchBar, Footer) and adds the cookie banner and Google Ads gtag. Styling is Bootstrap 5 / react-bootstrap with SCSS overrides in `styles/custom.scss`. Use the `@/` import alias for the repo root.

**Apache specifics.** The production server uses `.htaccess` for the 404 page (`ErrorDocument 404 /404.html`) and for legacy Joomla URL redirects. The sitemap and robots.txt are generated by `next-sitemap.config.mjs` into `public/` (copied to `out/`).

**Switched-off sections.** PKW Nachrüstfilter are not offered at the moment. Their pages are parked in `disabled-pages/pkw-partikelfilter/pkw-nachruestfilter/` (outside `pages/`, so they are not built), and `PKW_NACHRUESTFILTER_ENABLED = false` in `utils/config.js` and `utils/config.mjs` hides the menu entries and the PKW overview tile and makes `generateRedirects.mjs` send every Nachrüstfilter URL to `/pkw-partikelfilter/`. To re-enable: set both flags to true and move the folder back to `pages/pkw-partikelfilter/`.

## Repo hygiene

Untracked `.js` files in the repo root (for example `checkout-mit-pictos.js`, `[product-id-name].js`, `*-before-haendler.js`) are manual backups of older page versions. They are not part of the build, so don't edit them as if they were live code.
