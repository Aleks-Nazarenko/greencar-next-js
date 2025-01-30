import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch'; // Modern ES Module syntax
import { JOOMLA_API_BASE } from "../utils/config.mjs";
async function fetchFooterData() {
    try {
        const res = await fetch(`${JOOMLA_API_BASE}&task=articleWithModules&id=2&format=json`);
        const footerData = await res.json();

        // Save the data to a file in the public directory
        const filePath = path.join(process.cwd(), 'data', 'footer-data.json');
        fs.writeFileSync(filePath, JSON.stringify(footerData, null, 2));
        console.log('Footer data saved successfully!');
    } catch (err) {
        console.error('Error fetching footer data:', err);
        process.exit(1); // Exit with an error code if the fetch fails
    }
}
// Run the function
fetchFooterData();
