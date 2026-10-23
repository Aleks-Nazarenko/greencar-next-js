import fs from 'fs';
import fetch from 'node-fetch';
import { JOOMLA_API_BASE } from "../utils/config.mjs";
import { createSlug } from "../utils/sanitizeProductSlug.mjs";

const PKW_AUSTAUSCHFILTER = JOOMLA_API_BASE+"&task=getProductsByCategory&category_id=70&format=json";
const PKW_NACHRUESTFILTER = JOOMLA_API_BASE+"&task=getProductsByCategory&category_id=15&format=json";
const LKW_DPF_EURO_VI = JOOMLA_API_BASE+"&task=getProductsByCategory&category_id=68&format=json";
const LKW_SCHALLDAEMFER_EURO_VI = JOOMLA_API_BASE+"&task=getProductsByCategory&category_id=444&format=json";
const LKW_FILTERREINIGUNG = JOOMLA_API_BASE+"&task=getProductsByCategory&category_id=470&format=json";
const BUS_FILTERREINIGUNG = JOOMLA_API_BASE+"&task=getProductsByCategory&category_id=475&format=json";
const BAU_NACHRUESTFILTER = JOOMLA_API_BASE+"&task=getProductsByCategory&category_id=454&format=json";
const HTACCESS_FILE = "./out/.htaccess"; // Apache uses .htaccess for redirects


async function fetchRedirects() {
    try {
        const response_pkw_austauschfilter = await fetch(PKW_AUSTAUSCHFILTER);
        const response_pkw_nachruestfilter = await fetch(PKW_NACHRUESTFILTER);
        const response_lkw_dpf_euro_vi = await fetch(LKW_DPF_EURO_VI);
        const response_lkw_schalldaempfer_euro_vi = await fetch(LKW_SCHALLDAEMFER_EURO_VI);
        const response_lkw_filterreinigung = await fetch(LKW_FILTERREINIGUNG);
        const response_bus_filterreinigung = await fetch(BUS_FILTERREINIGUNG);
        const response_bau_nachruestfilter = await fetch(BAU_NACHRUESTFILTER);
        if (!response_pkw_austauschfilter.ok) throw new Error("Failed to fetch PKW AUSTAUSCHFILTER data");
        if (!response_pkw_nachruestfilter.ok) throw new Error("Failed to fetch PKW NACHRUESTFILTER data");
        if (!response_lkw_dpf_euro_vi.ok) throw new Error("Failed to fetch LKW DPF EURO VI data");
        if (!response_lkw_schalldaempfer_euro_vi.ok) throw new Error("Failed to fetch LKW SCHALLDAEMFER EURO VI data");
        if (!response_lkw_filterreinigung.ok) throw new Error("Failed to fetch LKW FILTERREINIGUNG data");
        if (!response_bus_filterreinigung.ok) throw new Error("Failed to fetch BUS FILTERREINIGUNG data");
        if (!response_bau_nachruestfilter.ok) throw new Error("Failed to fetch BAU NACHRUESTFILTER data");

        // Track categories and subcategories that have already been processed
        const processedCategories = new Set();
        const processedSubcategories = new Set();

        const pkw_austauschfilter = await response_pkw_austauschfilter.json();
        const pkw_nachruestfilter = await response_pkw_nachruestfilter.json();
        const lkw_dpf_euro_vi = await response_lkw_dpf_euro_vi.json();
        const lkw_schalldaempfer_euro_vi = await response_lkw_schalldaempfer_euro_vi.json();
        const lkw_filterreinigung = await response_lkw_filterreinigung.json();
        const bus_filterreinigung = await response_bus_filterreinigung.json();
        const bau_nachruestfilter = await response_bau_nachruestfilter.json();

        let htaccessContent = `# Apache .htaccess file for Joomla to Next.js redirects\n`;
        // Add ErrorDocument directive before redirects
        htaccessContent += `\n# Custom 404 Page\n`;
        htaccessContent += `ErrorDocument 404 /404.html\n\n`;
        // Keep the staging domain out of Google; stops matching once dieselpartikelfilter.net points here
        htaccessContent += `# No indexing on staging domain\n`;
        htaccessContent += `<IfModule mod_headers.c>\n`;
        htaccessContent += `Header set X-Robots-Tag "noindex, nofollow" "expr=%{HTTP_HOST} =~ /dpfclean\\.de$/"\n`;
        htaccessContent += `</IfModule>\n\n`;
        // Add Redirect Rules
        htaccessContent += `# Redirect old Joomla URLs to new Next.js structure\n`;
        htaccessContent += `RewriteEngine On\n\n`;
        htaccessContent += `Redirect 301 /pkw-partikelfilter/pkw-filterreinigung.html /pkw-partikelfilter/pkw-filterreinigung/\n`;
        htaccessContent += `Redirect 301 /pkw-partikelfilter/filterreinigung-berlin.html /pkw-partikelfilter/filterreinigung-berlin/\n`;
        htaccessContent += `Redirect 301 /pkw-partikelfilter.html /pkw-partikelfilter/\n`;
        htaccessContent += `Redirect 301 /pkw-partikelfilter/pkw-nachruestfilter.html /pkw-partikelfilter/pkw-nachruestfilter/\n`;
        htaccessContent += `Redirect 301 /pkw-partikelfilter/pkw-austauschfilter.html /pkw-partikelfilter/pkw-austauschfilter/\n`;
        htaccessContent += `Redirect 301 /lkw-partikelfilter.html /lkw-partikelfilter/\n`;
        htaccessContent += `Redirect 301 /lkw-partikelfilter/dpf-euro-vi.html /lkw-partikelfilter/dpf-euro-vi/\n`;
        htaccessContent += `Redirect 301 /lkw-partikelfilter/schalldaempfer-euro-vi.html /lkw-partikelfilter/schalldaempfer-euro-vi/\n`;
        htaccessContent += `Redirect 301 /lkw-partikelfilter/filterreinigung.html /lkw-partikelfilter/filterreinigung/\n`;
        htaccessContent += `Redirect 301 /bus-partikelfilter.html /bus-partikelfilter/\n`;
        htaccessContent += `Redirect 301 /bus-partikelfilter/bus-filterreinigung.html /bus-partikelfilter/bus-filterreinigung/\n`;
        htaccessContent += `Redirect 301 /bus-partikelfilter/dpf-euro-vi.html /bus-partikelfilter/dpf-euro-vi/\n`;
        htaccessContent += `Redirect 301 /baumaschinen-partikelfilter.html /baumaschinen-partikelfilter/\n`;
        htaccessContent += `Redirect 301 /baumaschinen-partikelfilter/baumaschinen-nachruestfilter.html /baumaschinen-partikelfilter/baumaschinen-nachruestfilter/\n`;
        htaccessContent += `Redirect 301 /baumaschinen-partikelfilter/baumaschinen-filterreinigung.html /baumaschinen-partikelfilter/baumaschinen-filterreinigung/\n`;
        htaccessContent += `Redirect 301 /partikelfilter-reinigen.html /partikelfilter-reinigen/\n\n`;


        pkw_austauschfilter.forEach(product => {
            // Convert category names and product names to URL-friendly slugs
            const parentCategorySlug = product.parent_category_name.toLowerCase().replace(/\s+/g, '-');
            const subcategorySlug = product.subcategory_name.toLowerCase().replace(/\s+/g, '-');
            const productSlug = createSlug(product.product_name);

            const oldUrl = `/pkw-partikelfilter/pkw-austauschfilter/produkt/${product.product_id}-${productSlug}.html`;
            const newUrl = `/pkw-partikelfilter/pkw-austauschfilter/${product.parent_category_id}-${parentCategorySlug}/${product.subcategory_id}-${subcategorySlug}/${product.product_id}-${productSlug}/`;
            // Add redirect to .htaccess
            htaccessContent += `Redirect 301 ${oldUrl} ${newUrl}\n`;
            // Process Category Redirects only once
            const categoryKey = `${product.parent_category_id}-${parentCategorySlug}`;
            if (!processedCategories.has(categoryKey)) {
                const oldCatUrl = `/pkw-partikelfilter/pkw-austauschfilter/${product.parent_category_id}-${parentCategorySlug}.html`;
                const newCatUrl = `/pkw-partikelfilter/pkw-austauschfilter/${product.parent_category_id}-${parentCategorySlug}/`;
                htaccessContent += `Redirect 301 ${oldCatUrl} ${newCatUrl}\n`;
                processedCategories.add(categoryKey);
            }
            // Process Subcategory Redirects only once
            const subcategoryKey = `${product.subcategory_id}-${subcategorySlug}`;
            if (!processedSubcategories.has(subcategoryKey)) {
                const oldSubCatUrl = `/pkw-partikelfilter/pkw-austauschfilter/${product.subcategory_id}-${subcategorySlug}.html`;
                const newSubCatUrl = `/pkw-partikelfilter/pkw-austauschfilter/${product.parent_category_id}-${parentCategorySlug}/${product.subcategory_id}-${subcategorySlug}/`;
                htaccessContent += `Redirect 301 ${oldSubCatUrl} ${newSubCatUrl}\n`;
                processedSubcategories.add(subcategoryKey);
            }
        });
        pkw_nachruestfilter.forEach(product => {
            const parentCategorySlug = product.parent_category_name.toLowerCase().replace(/\s+/g, '-');
            const subcategorySlug = product.subcategory_name.toLowerCase().replace(/\s+/g, '-');
            const productSlug = createSlug(product.product_alias ?? product.product_name);

            const oldUrl = `/pkw-partikelfilter/pkw-nachruestfilter/produkt/${product.product_id}-${productSlug}.html`;
            const newUrl = `/pkw-partikelfilter/pkw-nachruestfilter/${product.parent_category_id}-${parentCategorySlug}/${product.subcategory_id}-${subcategorySlug}/${product.product_id}-${productSlug}/`;

            htaccessContent += `Redirect 301 ${oldUrl} ${newUrl}\n`;

            const categoryKey = `${product.parent_category_id}-${parentCategorySlug}`;
            if (!processedCategories.has(categoryKey)) {
                const oldCatUrl = `/pkw-partikelfilter/pkw-nachruestfilter/${product.parent_category_id}-${parentCategorySlug}.html`;
                const newCatUrl = `/pkw-partikelfilter/pkw-nachruestfilter/${product.parent_category_id}-${parentCategorySlug}/`;
                htaccessContent += `Redirect 301 ${oldCatUrl} ${newCatUrl}\n`;
                processedCategories.add(categoryKey);
            }
            const subcategoryKey = `${product.subcategory_id}-${subcategorySlug}`;
            if (!processedSubcategories.has(subcategoryKey)) {
                const oldSubCatUrl = `/pkw-partikelfilter/pkw-nachruestfilter/${product.subcategory_id}-${subcategorySlug}.html`;
                const newSubCatUrl = `/pkw-partikelfilter/pkw-nachruestfilter/${product.parent_category_id}-${parentCategorySlug}/${product.subcategory_id}-${subcategorySlug}/`;
                htaccessContent += `Redirect 301 ${oldSubCatUrl} ${newSubCatUrl}\n`;
                processedSubcategories.add(subcategoryKey);
            }
        });
        lkw_dpf_euro_vi.forEach(product => {
            const subcategorySlug = product.subcategory_name.toLowerCase().replace(/\s+/g, '-');
            const productSlug = createSlug(product.product_name);

            const oldUrl = `/lkw-partikelfilter/dpf-euro-vi/produkt/${product.product_id}-${productSlug}.html`;
            const newUrl = `/lkw-partikelfilter/dpf-euro-vi/${product.subcategory_id}-${subcategorySlug}/${product.product_id}-${productSlug}/`;

            htaccessContent += `Redirect 301 ${oldUrl} ${newUrl}\n`;

            const subcategoryKey =  `${product.subcategory_id}-${subcategorySlug}`;
            if (!processedSubcategories.has(subcategoryKey)) {
                const oldCatUrl = `/lkw-partikelfilter/dpf-euro-vi/${product.subcategory_id}-${subcategorySlug}.html`;
                const newCatUrl = `/lkw-partikelfilter/dpf-euro-vi/${product.subcategory_id}-${subcategorySlug}/`;
                htaccessContent += `Redirect 301 ${oldCatUrl} ${newCatUrl}\n`;
                processedSubcategories.add(subcategoryKey);
            }
        });
        lkw_schalldaempfer_euro_vi.forEach(product => {
            const subcategorySlug = product.subcategory_name.toLowerCase().replace(/\s+/g, '-');
            const productSlug = createSlug(product.product_name);
            const oldUrl = `/lkw-partikelfilter/schalldaempfer-euro-vi/produkt/${product.product_id}-${productSlug}.html`;
            const newUrl = `/lkw-partikelfilter/schalldaempfer-euro-vi/${product.subcategory_id}-${subcategorySlug}/${product.product_id}-${productSlug}/`;

            htaccessContent += `Redirect 301 ${oldUrl} ${newUrl}\n`;

            const subcategoryKey =  `${product.subcategory_id}-${subcategorySlug}`;
            if (!processedSubcategories.has(subcategoryKey)) {
                const oldCatUrl = `/lkw-partikelfilter/schalldaempfer-euro-vi/${product.subcategory_id}-${subcategorySlug}.html`;
                const newCatUrl = `/lkw-partikelfilter/schalldaempfer-euro-vi/${product.subcategory_id}-${subcategorySlug}/`;
                htaccessContent += `Redirect 301 ${oldCatUrl} ${newCatUrl}\n`;
                processedSubcategories.add(subcategoryKey);
            }
        });
        lkw_filterreinigung.forEach(product => {
            const subcategorySlug = product.subcategory_name.toLowerCase().replace(/\s+/g, '-');
            const productSlug = createSlug(product.product_name);
            const oldUrl = `/lkw-partikelfilter/lkw-filterreinigung/produkt/${product.product_id}-${productSlug}.html`;
            const newUrl = `/lkw-partikelfilter/lkw-filterreinigung/${product.subcategory_id}-${subcategorySlug}/${product.product_id}-${productSlug}/`;

            htaccessContent += `Redirect 301 ${oldUrl} ${newUrl}\n`;

            const subcategoryKey =  `${product.subcategory_id}-${subcategorySlug}`;
            if (!processedSubcategories.has(subcategoryKey)) {
                const oldCatUrl = `/lkw-partikelfilter/lkw-filterreinigung/${product.subcategory_id}-${subcategorySlug}.html`;
                const newCatUrl = `/lkw-partikelfilter/lkw-filterreinigung/${product.subcategory_id}-${subcategorySlug}/`;
                htaccessContent += `Redirect 301 ${oldCatUrl} ${newCatUrl}\n`;
                processedSubcategories.add(subcategoryKey);
            }
        });
        bus_filterreinigung.forEach(product => {
            const subcategorySlug = product.subcategory_name.toLowerCase().replace(/\s+/g, '-');
            const productSlug = createSlug(product.product_name);
            const oldUrl = `/bus-partikelfilter/bus-filterreinigung/produkt/${product.product_id}-${productSlug}.html`;
            const newUrl = `/bus-partikelfilter/bus-filterreinigung/${product.subcategory_id}-${subcategorySlug}/${product.product_id}-${productSlug}/`;

            htaccessContent += `Redirect 301 ${oldUrl} ${newUrl}\n`;

            const subcategoryKey =  `${product.subcategory_id}-${subcategorySlug}`;
            if (!processedSubcategories.has(subcategoryKey)) {
                const oldCatUrl = `/bus-partikelfilter/bus-filterreinigung/${product.subcategory_id}-${subcategorySlug}.html`;
                const newCatUrl = `/bus-partikelfilter/bus-filterreinigung/${product.subcategory_id}-${subcategorySlug}/`;
                htaccessContent += `Redirect 301 ${oldCatUrl} ${newCatUrl}\n`;
                processedSubcategories.add(subcategoryKey);
            }
        });
        bau_nachruestfilter.forEach(product => {
            const subcategorySlug = createSlug(product.subcategory_name);
            const productSlug = createSlug(product.product_name);
            const oldUrl = `/baumaschinen-partikelfilter/baumaschinen-nachruestfilter/produkt/${product.product_id}-${productSlug}.html`;
            const newUrl = `/baumaschinen-partikelfilter/baumaschinen-nachruestfilter/${product.subcategory_id}-${subcategorySlug}/${product.product_id}-${productSlug}/`;

            htaccessContent += `Redirect 301 ${oldUrl} ${newUrl}\n`;

            const subcategoryKey =  `${product.subcategory_id}-${subcategorySlug}`;
            if (!processedSubcategories.has(subcategoryKey)) {
                const oldCatUrl = `/baumaschinen-partikelfilter/baumaschinen-nachruestfilter/${product.subcategory_id}-${subcategorySlug}.html`;
                const newCatUrl = `/baumaschinen-partikelfilter/baumaschinen-nachruestfilter/${product.subcategory_id}-${subcategorySlug}/`;
                htaccessContent += `Redirect 301 ${oldCatUrl} ${newCatUrl}\n`;
                processedSubcategories.add(subcategoryKey);
            }
        });

        // Save .htaccess file
        fs.writeFileSync(HTACCESS_FILE, htaccessContent);
        console.log(`✅ .htaccess file generated at ${HTACCESS_FILE}`);
    } catch (error) {
        console.error("❌ Error fetching redirects:", error);
        process.exit(1); // Fail the deploy instead of shipping without redirects
    }
}

// Run the function
fetchRedirects();
