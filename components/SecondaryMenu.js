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


                <div className="row g-0 justify-content-sm-between justify-content-start">
                    <Dropdown className={"col-auto  pe-sm-0 pe-2 pb-2 pb-sm-0 "}>
                        {/* 🔹 Dropdown Toggle Button */}
                        <Dropdown.Toggle variant="primary" id="dropdown-basic" className={"bg-gc-light-blue dropdown-gc gc-green-light gc-bold shadow rounded-4  border-0"}>
                            <Image src="/images/icons/pkw-partikelfilter.png" alt="PKW Partikelfilter" width={50} height={50} className="me-2 picto-50" />
                            <span>PKW</span>
                        </Dropdown.Toggle>

                        {/* 🔹 Dropdown Menu */}
                        <Dropdown.Menu className={"shadow"}>
                            <Dropdown.Item href="/pkw-partikelfilter/pkw-nachruestfilter" className="d-flex align-items-center">
                                <Image src="/images/icons/pkw-nachruestfilter.png" alt="PKW Nachruestfilter" width={50} height={50} className="me-2  picto-50" />
                                Nachrüstfilter
                            </Dropdown.Item>
                            <Dropdown.Item href="/pkw-partikelfilter/pkw-austauschfilter" className="d-flex align-items-center">
                                <Image src="/images/icons/pkw-austauschfilter.png" alt="PKW Austauschfilter" width={50} height={50} className="me-2 picto-50" />
                                Austauschfilter
                            </Dropdown.Item>
                            <Dropdown.Item href="/pkw-partikelfilter/pkw-filterreinigung" className="d-flex align-items-center">
                                <Image src="/images/icons/pkw-filterreinigung.png" alt="PKW filterreinigung" width={50} height={50} className="me-2 picto-50" />
                                Filterreinigung
                            </Dropdown.Item>
                            <Dropdown.Item href="/pkw-partikelfilter/filterreinigung-berlin" className="d-flex align-items-center">
                                <Image src="/images/icons/pkw-filterreinigung.png" alt="PKW Filterreinigung Berlin" width={50} height={50} className="me-2 picto-50" />
                                PKW Filterreinigung Berlin
                            </Dropdown.Item>

                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className={"col-auto  pe-sm-0 pe-2 pb-2 pb-sm-0 "}>
                        {/* 🔹 Dropdown Toggle Button */}
                        <Dropdown.Toggle variant="primary" id="dropdown-basic" className={"bg-gc-light-blue dropdown-gc gc-green-light gc-bold shadow rounded-4 border-0"}>
                            <Image src="/images/icons/lkw-partikelfilter.png" alt="LKW Partikelfilter" width={50} height={50} className="me-2 picto-50" />
                            LKW
                        </Dropdown.Toggle>

                        {/* 🔹 Dropdown Menu */}
                        <Dropdown.Menu>
                            <Dropdown.Item href="/lkw-partikelfilter/dpf-euro-vi" className="d-flex align-items-center">
                                <Image src="/images/icons/lkw-austauschfilter.png" alt="LKW DPF EURO VI" width={50} height={50} className="me-2 picto-50" />
                                DPF EURO VI
                            </Dropdown.Item>
                            <Dropdown.Item href="/lkw-partikelfilter/schalldaempfer-euro-vi" className="d-flex align-items-center">
                                <Image src="/images/icons/lkw-austauschfilter.png" alt="LKW Schalldämpfer EURO VI" width={50} height={50} className="me-2 picto-50" />
                                Schalldämpfer EURO VI
                            </Dropdown.Item>
                            <Dropdown.Item href="/lkw-partikelfilter/lkw-filterreinigung" className="d-flex align-items-center">
                                <Image src="/images/icons/lkw-filterreinigung.png" alt="LKW Filterreinigung" width={50} height={50} className="me-2 picto-50" />
                                Filterreinigung
                            </Dropdown.Item>

                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className={"col-auto  pe-sm-0 pe-2 pb-2 pb-sm-0 "}>
                        {/* 🔹 Dropdown Toggle Button */}
                        <Dropdown.Toggle variant="primary" id="dropdown-basic" className={"bg-gc-light-blue dropdown-gc gc-green-light gc-bold shadow rounded-4 border-0"}>
                            <Image src="/images/icons/bus-partikelfilter.png" alt="BUS Partikelfilter" width={50} height={50} className="me-2 picto-50" />
                            BUS
                        </Dropdown.Toggle>
                        {/* 🔹 Dropdown Menu */}
                        <Dropdown.Menu>
                            <Dropdown.Item href="/bus-partikelfilter/dpf-euro-vi" className="d-flex align-items-center">
                                <Image src="/images/icons/bus-austauschfilter.png" alt="BUS DPF EURO VI" width={50} height={50} className="me-2 picto-50" />
                                DPF EURO VI
                            </Dropdown.Item>
                            <Dropdown.Item href="/bus-partikelfilter/bus-filterreinigung" className="d-flex align-items-center">
                                <Image src="/images/icons/bus-filterreinigung.png" alt="BUS Filterreinigung" width={50} height={50} className="me-2 picto-50" />
                                Filterreinigung
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className={"col-auto  pe-sm-0 pe-2 pb-2 pb-sm-0 "}>
                        {/* 🔹 Dropdown Toggle Button */}
                        <Dropdown.Toggle variant="primary" id="dropdown-basic" className={"bg-gc-light-blue dropdown-gc gc-green-light gc-bold shadow rounded-4 border-0"}>
                            <Image src="/images/icons/bau-partikelfilter.png" alt="BAU Partikelfilter" width={50} height={50} className="me-2 picto-50" />
                            BAU
                        </Dropdown.Toggle>
                        {/* 🔹 Dropdown Menu */}
                        <Dropdown.Menu>
                            <Dropdown.Item href="/baumaschinen-partikelfilter/baumaschinen-nachruestfilter" className="d-flex align-items-center">
                                <Image src="/images/icons/bau-partikelfilter.png" alt="Baumaschinen Nachruestfilter" width={50} height={50} className="me-2 picto-50" />
                                Nachrüstfilter
                            </Dropdown.Item>
                            <Dropdown.Item href="/baumaschinen-partikelfilter/baumaschinen-filterreinigung" className="d-flex align-items-center">
                                <Image src="/images/icons/bau-filterreinigung.png" alt="Baumaschinen Filterreinigung" width={50} height={50} className="me-2 picto-50" />
                                Filterreinigung
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className={"col-auto  pe-sm-0 pe-2 pb-2 pb-sm-0 "}>
                        {/* 🔹 Dropdown Toggle Button */}
                        <Dropdown.Toggle variant="primary" id="dropdown-basic" className={"bg-gc-light-blue dropdown-gc gc-green-light gc-bold shadow rounded-4 border-0"}>
                            <Image src="/images/icons/filterreinigung-partikelfilter.png" alt="Reinigung" width={50} height={50} className="me-2 picto-50" />
                            Reinigung
                        </Dropdown.Toggle>
                        {/* 🔹 Dropdown Menu */}
                        <Dropdown.Menu>
                            <Dropdown.Item href="/partikelfilter-reinigen" className="d-flex align-items-center">
                                <Image src="/images/icons/filterreinigung-partikelfilter.png" alt="Reinigung" width={50} height={50} className="me-2 picto-50" />
                                Reiningung
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

    );
}
