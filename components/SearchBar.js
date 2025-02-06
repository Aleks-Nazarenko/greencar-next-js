import Image from "next/image";
import {useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";


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

                <div className={"row g-0 justify-content-sm-between align-items-center"}>
                    <div className={"col-auto d-flex justify-content-start flex-column flex-md-row"}>
                        <div className={"col-auto pe-4 pb-2 pb-md-0"}>
                            <Image src={"/images/icons/greencar-filter-tel.png"} alt={"telefon"} width={197} height={32} />
                        </div>
                        <div className={"col-auto"}>
                            <Link href={`/anfrage`}>
                                <button className="btn btn-primary btn-yellow btn-100" style={{maxWidth:"194px"}}>Jetzt anfragen</button>
                            </Link>
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
                                style={{width:"194px"}}
                            />
                            <button type="submit" className="search-button rounded btn ms-2">suchen</button>
                        </form>
                    </div>
                </div>

    );
}
