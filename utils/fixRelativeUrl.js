export const fixRelativeUrls = (htmlContent) => {
    return htmlContent.replace(/href="(?!http|\/)([^"]*)"/g, 'href="/$1"');
};
