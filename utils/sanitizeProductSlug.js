// utils/sanitizeProductSlug.js

export function createSlug(name) {
    return name
        .toLowerCase()
        .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss") // Convert umlauts first!
        .normalize("NFD") // Normalize after converting special cases
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics safely
        .replace(/\//g, '') // Joomla removes slashes, doesn’t replace
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '') // Remove special characters except "-"
        .replace(/-+/g, '-') // Remove duplicate hyphens
        .replace(/^-+|-+$/g, ''); // Trim leading & trailing hyphens
}

