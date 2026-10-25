import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Shown on every page while a dealer ("Händler") is logged in (sessionStorage authToken + user, see haendler/login)
export default function DealerNotice() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    // Re-read on every route change: login and logout happen without a full page reload
    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        setUser(sessionStorage.getItem("authToken") && storedUser ? JSON.parse(storedUser) : null);
    }, [router.asPath]);

    const handleLogout = () => {
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("user");
        // The cart holds dealer prices, so it must not survive the logout
        sessionStorage.removeItem("cart");
        sessionStorage.removeItem("productOptions");
        sessionStorage.removeItem("checkoutDetails");
        window.location.assign("/haendler/login/");
    };

    if (!user) {
        return null;
    }

    return (
        <>
            <div className={"w-100 pt-4"}/>
            <div className="container-fluid">
                <div className="container-greencar container-fluid g-0 p-2 ps-3 pe-3 bg-gc-light-blue rounded-4 shadow">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                        <div>
                            <strong>Sie sind als Händler angemeldet:</strong>{" "}
                            {user.firma ? `${user.firma} (${user.username})` : user.username}.
                            {" "}Es werden Händlerpreise (ohne MwSt.) angezeigt.
                        </div>
                        <button onClick={handleLogout} className="btn btn-primary btn-green btn-sm" aria-label="Als Händler abmelden">
                            Abmelden
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
