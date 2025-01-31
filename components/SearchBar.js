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

                <div className={"row g-0 justify-content-sm-between justify-content-start p-2 align-items-center"}>
                    <div className={"col-auto d-flex justify-content-start flex-column flex-md-row"}>
                        <div className={"col-auto pe-4 pb-2 pb-md-0"}>
                            <Image src={"/images/icons/greencar-filter-tel.png"} alt={"telefon"} width={197} height={32} />
                        </div>
                        <div className={"col-auto"}>
                            <Image src={"/images/icons/partikelfilter_anfragen.png"} alt={"telefon"} width={157} height={32} />
                        </div>
                    </div>
                    <div className="search-container col-auto">
                        <form onSubmit={handleSearch} className={"d-flex justify-content-end"}>
                            <input
                                type="text"
                                placeholder="OE-Nummer eingeben"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input rounded form-control"
                                aria-label="Suche"
                            />
                            <button type="submit" className="search-button rounded btn ms-2">suchen</button>
                        </form>
                    </div>
                </div>

    );
}
