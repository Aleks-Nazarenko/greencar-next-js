import Image from "next/image";
import {useState} from "react";
import {useRouter} from "next/router";


export default function SearchBar() {


    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/suche?query=${encodeURIComponent(searchQuery)}`);
        }
    };
    return (
        <div className="container-fluid">
            <div className="container-greencar container-fluid g-0 bg-gc-light-blue rounded">
                <div className={"row g-0 justify-content-sm-between justify-content-start p-3"}>
                    <div className={"col-auto d-flex justify-content-start"}>
                        <div className={"col-auto pe-4"}>
                            <Image src={"/images/icons/greencar-filter-tel.png"} alt={"telefon"} width={197} height={32} />
                        </div>
                        <div className={"col-auto"}>
                            <Image src={"/images/icons/partikelfilter_anfragen.png"} alt={"telefon"} width={157} height={32} />
                        </div>
                    </div>
                    <div className="search-container col-auto">
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input rounded"
                            />
                            <button type="submit" className="search-button rounded">suchen</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
