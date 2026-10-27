// Bus DPF Euro VI shows the LKW Euro VI products: the bus categories in Joomla (category 69) have no products
export const EURO_VI_CATEGORY_ID = 68;

// "LKW DAF" -> "DAF"
export const busCategoryName = (category) => category.category_name.replace(/^LKW\s+/i, '');

// Bus manufacturer page segment, e.g. "250-daf"
export const busCategorySegment = (category) =>
    `${category.category_id}-${busCategoryName(category).toLowerCase().replace(/\s+/g, '-')}`;

// LKW manufacturer page segment, e.g. "250-lkw-daf" (same format as pages/lkw-partikelfilter/dpf-euro-vi)
export const lkwCategorySegment = (category) =>
    `${category.category_id}-${category.category_name.toLowerCase().replace(/\s+/g, '-')}`;
