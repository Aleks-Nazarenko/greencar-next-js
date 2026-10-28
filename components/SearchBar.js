import {useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";

// Green contact bar at the very top of every page: OE search, phone, inquiry button (design "Suchleiste Optionen", variant 1a)
export default function SearchBar() {

    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/suche?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };
    return (
        <div className="gc-topbar">
            <div className="container-greencar container-fluid gc-topbar-inner">
                <a href="https://karriere-greencar.de/" target="_blank" rel="noopener" className="gc-topbar-link">
                    Karriere <span aria-hidden="true">↗</span>
                </a>
                <form onSubmit={handleSearch} className="gc-topbar-search" role="search">
                    <input
                        type="text"
                        placeholder="OE-Nummer suchen"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="OE-Nummer suchen"
                    />
                    <button type="submit" className="gc-topbar-search-button" aria-label="Suchen" title="Suchen">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" aria-hidden="true">
                            <circle cx="10.5" cy="10.5" r="6.5"/>
                            <path d="M15.5 15.5L21 21"/>
                        </svg>
                    </button>
                </form>
                <a href="tel:+493041722080" className="gc-topbar-phone" aria-label="Anrufen: 030-417 220 80">
                    <span aria-hidden="true">☎</span><span className="gc-topbar-phone-number"> 030-417 220 80</span>
                </a>
                <Link href="/anfrage-partikelfilter" className="gc-topbar-cta">
                    Jetzt anfragen
                </Link>
            </div>
        </div>
    );
}
