// Logged-in dealer ("Händler") from sessionStorage, set by /haendler/login. null when no dealer is logged in.
export function getLoggedInDealer() {
    if (typeof window === "undefined") return null;
    try {
        const token = sessionStorage.getItem("authToken");
        const user = sessionStorage.getItem("user");
        return token && user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
}

// Sent with orders and inquiries so the e-mails to GREENCAR mark them as dealer requests
export function dealerMarker(user = getLoggedInDealer()) {
    return user ? { id: user.id, username: user.username, firma: user.firma || "" } : null;
}

// Fills the empty form fields that exist in formData from the dealer account; returns formData unchanged without a dealer
export function withDealerData(formData) {
    const user = getLoggedInDealer();
    if (!user) return formData;
    const account = {
        name: user.name,
        email: user.email,
        firma: user.firma,
        ort: user.ort,
        strasse: user.strasse,
        plz: user.plz,
    };
    const filled = { ...formData };
    for (const [key, value] of Object.entries(account)) {
        if (key in filled && !filled[key] && value) filled[key] = value;
    }
    return filled;
}
