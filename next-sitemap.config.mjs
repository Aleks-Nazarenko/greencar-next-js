export default {
    siteUrl: 'https://www.dieselpartikelfilter.net', // Change this to your actual domain
    generateRobotsTxt: true, // Automatically generates robots.txt
    outDir: 'out', // Static export: write into out/, public/ was already copied before postbuild runs
    exclude: ['/500', '/products','/api/*'], // Exclude private pages from the sitemap
    changefreq: 'weekly', // Set how often Google should check for updates
    priority: 0.8, // Set the importance of URLs (1.0 = highest, 0.0 = lowest)
};
