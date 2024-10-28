
// utils/convertRelativeUrls.js

export function convertRelativeUrls(content, joomlaBaseUrl) {
    // Use a regular expression to find all relative URLs in img tags
    const regex = /<img\s+[^>]*src="([^"]+)"[^>]*>/g;

    // Replace relative URLs with absolute URLs based on Joomla base URL
    const modifiedContent = content.replace(regex, (match, src) => {
        // If the src is already an absolute URL, do nothing
        if (src.startsWith('http://') || src.startsWith('https://')) {
            return match;
        }

        // Convert to absolute URL using the Joomla base URL
        const absoluteUrl = `${joomlaBaseUrl}${src.startsWith('/') ? src : '/' + src}`;
        return match.replace(src, absoluteUrl);
    });

    return modifiedContent;
}
