import Image from "next/image";
import { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Link from "next/link";
export default function SecondaryMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div className="container-greencar-no-bg container-fluid g-0">

                <div className="row g-0 justify-content-between mt-2 bg-light p-3 border rounded shadow-sm">
                    <Dropdown className={"col-auto"}>
                        {/* 🔹 Dropdown Toggle Button */}
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            <Image src="/images/icons/pkw-partikelfilter.png" alt="PKW Partikelfilter" width={30} height={30} className="me-2" />
                            PKW
                        </Dropdown.Toggle>

                        {/* 🔹 Dropdown Menu */}
                        <Dropdown.Menu>
                            <Dropdown.Item href="/pkw-partikelfilter/pkw-nachruestfilter" className="d-flex align-items-center">
                                <Image src="/images/icons/pkw-nachruestfilter.png" alt="PKW Nachruestfilter" width={30} height={30} className="me-2" />
                                Nachrüstfilter
                            </Dropdown.Item>
                            <Dropdown.Item href="/pkw-partikelfilter/pkw-austauschfilter" className="d-flex align-items-center">
                                <Image src="/images/icons/pkw-austauschfilter.png" alt="PKW Austauschfilter" width={30} height={30} className="me-2" />
                                Austauschfilter
                            </Dropdown.Item>
                            <Dropdown.Item href="/pkw-partikelfilter/pkw-filterreinigung" className="d-flex align-items-center">
                                <Image src="/images/icons/pkw-filterreinigung.png" alt="PKW filterreinigung" width={30} height={30} className="me-2" />
                                Filterreinigung
                            </Dropdown.Item>
                            <Dropdown.Item href="/pkw-partikelfilter/filterreinigung-berlin" className="d-flex align-items-center">
                                <Image src="/images/icons/pkw-filterreinigung.png" alt="PKW Filterreinigung Berlin" width={30} height={30} className="me-2" />
                                PKW Filterreinigung Berlin
                            </Dropdown.Item>

                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className={"col-auto"}>
                        {/* 🔹 Dropdown Toggle Button */}
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            <Image src="/images/icons/lkw-partikelfilter.png" alt="LKW Partikelfilter" width={30} height={30} className="me-2" />
                            LKW
                        </Dropdown.Toggle>

                        {/* 🔹 Dropdown Menu */}
                        <Dropdown.Menu>
                            <Dropdown.Item href="/lkw-partikelfilter/dpf-euro-vi" className="d-flex align-items-center">
                                <Image src="/images/icons/lkw-austauschfilter.png" alt="LKW DPF EURO VI" width={30} height={30} className="me-2" />
                                DPF EURO VI
                            </Dropdown.Item>
                            <Dropdown.Item href="/lkw-partikelfilter/schalldaempfer-euro-vi" className="d-flex align-items-center">
                                <Image src="/images/icons/lkw-austauschfilter.png" alt="LKW Schalldämpfer EURO VI" width={30} height={30} className="me-2" />
                                Schalldämpfer EURO VI
                            </Dropdown.Item>
                            <Dropdown.Item href="/lkw-partikelfilter/lkw-filterreinigung" className="d-flex align-items-center">
                                <Image src="/images/icons/lkw-filterreinigung.png" alt="LKW Filterreinigung" width={30} height={30} className="me-2" />
                                Filterreinigung
                            </Dropdown.Item>

                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className={"col-auto"}>
                        {/* 🔹 Dropdown Toggle Button */}
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            <Image src="/images/icons/bus-partikelfilter.png" alt="BUS Partikelfilter" width={30} height={30} className="me-2" />
                            BUS
                        </Dropdown.Toggle>

                        {/* 🔹 Dropdown Menu */}
                        <Dropdown.Menu>
                            <Dropdown.Item href="/bus-partikelfilter/dpf-euro-vi" className="d-flex align-items-center">
                                <Image src="/images/icons/bus-austauschfilter.png" alt="BUS DPF EURO VI" width={30} height={30} className="me-2" />
                                DPF EURO VI
                            </Dropdown.Item>
                            <Dropdown.Item href="/bus-partikelfilter/bus-filterreinigung" className="d-flex align-items-center">
                                <Image src="/images/icons/pkw-austauschfilter.png" alt="BUS Filterreinigung" width={30} height={30} className="me-2" />
                                Filterreinigung
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className={"col-auto"}>
                        {/* 🔹 Dropdown Toggle Button */}
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            <Image src="/images/icons/bau-partikelfilter.png" alt="BAU Partikelfilter" width={30} height={30} className="me-2" />
                            BAU
                        </Dropdown.Toggle>
                        {/* 🔹 Dropdown Menu */}
                        <Dropdown.Menu>
                            <Dropdown.Item href="/baumaschinen-partikelfilter/baumaschinen-nachruestfilter" className="d-flex align-items-center">
                                <Image src="/images/icons/bau-partikelfilter.png" alt="Baumaschinen Nachruestfilter" width={30} height={30} className="me-2" />
                                Nachrüstfilter
                            </Dropdown.Item>
                            <Dropdown.Item href="/baumaschinen-partikelfilter/baumaschinen-filterreinigung" className="d-flex align-items-center">
                                <Image src="/images/icons/bau-filterreinigung.png" alt="Baumaschinen Filterreinigung" width={30} height={30} className="me-2" />
                                Filterreinigung
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className={"col-auto"}>
                        {/* 🔹 Dropdown Toggle Button */}
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            <Image src="/images/icons/filterreinigung-partikelfilter.png" alt="Reinigung" width={30} height={30} className="me-2" />
                            Reinigung
                        </Dropdown.Toggle>
                        {/* 🔹 Dropdown Menu */}
                        <Dropdown.Menu>
                            <Dropdown.Item href="/partikelfilter-reinigen" className="d-flex align-items-center">
                                <Image src="/images/icons/filterreinigung-partikelfilter.png" alt="Reinigung" width={30} height={30} className="me-2" />
                                Reiningung
                            </Dropdown.Item>
                        </Dropdown.Menu>


                    </Dropdown>
                </div>

        </div>
    );
}
