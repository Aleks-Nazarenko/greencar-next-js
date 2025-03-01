// components/Navbar.js
import Link from 'next/link';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {JOOMLA_URL_BASE} from "@/utils/config";
import Image from "next/image";


export default function NavbarNazarenko() {

    return (
        <Container fluid className="container-fluid bg-gc-light-blue-nav shadow ">
            <Container fluid className="container-greencar g-0">
                <Navbar expand="md" className="an-navbar  g-0">

                    <Navbar.Brand href="/">
                        <Image src={"/logo/logo.png"} alt={"GREENCAR - bundesweite Nachrüstung von Partikelfiltern für PKW und LKW"} width={319} height={66} className={"img-fluid d-none d-sm-inline"}/>
                        <Image src={"/logo/greencar-logo-150.png"} alt={"GREENCAR - bundesweite Nachrüstung von Partikelfiltern für PKW und LKW"} width={150} height={21} className={"img-fluid d-inline d-sm-none"}/>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar" />
                    <Navbar.Collapse id="navbar" className="mt-2 mt-md-0">
                        <Nav className="ms-auto">
                            <Link href="/"  className="nav-link">
                                Home
                            </Link>
                            <Link href="/kfz-werkstatt-filtereinbau-greencar" className="nav-link">
                                Standorte
                            </Link>
                            <NavDropdown title="Produkt und Preisliste">
                                <NavDropdown.Item href="/pkw-partikelfilter/pkw-nachruestfilter" className="nav-link">
                                        Preisliste PKW Nachrüstfilter
                                </NavDropdown.Item>
                                <NavDropdown.Item  href="/pkw-partikelfilter/pkw-austauschfilter" className="nav-link">
                                        Preisliste PKW Austauschfilter
                                </NavDropdown.Item>
                                <NavDropdown.Item  href="/pkw-partikelfilter/pkw-filterreinigung" className="nav-link">
                                        Preisliste PKW Filterreinigung
                                </NavDropdown.Item>
                                <NavDropdown.Item  href="/pkw-partikelfilter/filterreinigung-berlin" className="nav-link">
                                    Preisliste PKW Filterreinigung Berlin
                                </NavDropdown.Item>
                                <NavDropdown.Item  href="/lkw-partikelfilter/dpf-euro-vi"  className="nav-link">
                                        Preisliste LKW DPF EURO VI
                                </NavDropdown.Item>
                                <NavDropdown.Item  href="/lkw-partikelfilter/schalldaempfer-euro-vi" className="nav-link">
                                        Preisliste LKW Schalldämpfer EURO VI
                                </NavDropdown.Item>
                                <NavDropdown.Item  href="/lkw-partikelfilter/lkw-filterreinigung" className="nav-link">
                                    Preisliste LKW Filterreinigung
                                </NavDropdown.Item>
                                <NavDropdown.Item  href="/bus-partikelfilter/dpf-euro-vi" className="nav-link">
                                    Preisliste BUSSE DPF EURO VI
                                </NavDropdown.Item>
                                <NavDropdown.Item  href="/bus-partikelfilter/bus-filterreinigung" className="nav-link">
                                    Preisliste BUSSE Filterreinigung
                                </NavDropdown.Item>
                                <NavDropdown.Item  href="/baumaschinen-partikelfilter/baumaschinen-nachruestfilter" className="nav-link">
                                    Preisliste Baumaschinen Nachrüstfilter
                                </NavDropdown.Item>
                                <NavDropdown.Item  href="/baumaschinen-partikelfilter/baumaschinen-filterreinigung" className="nav-link">
                                    Preisliste Baumaschinen Filterreinigung
                                </NavDropdown.Item>
                            </NavDropdown>

                            <NavDropdown title="Informationen" >
                                <NavDropdown.Item href="/partikelfilter-info/filter-lkw-infos"  className="nav-link">
                                    Über GREENCAR
                                </NavDropdown.Item>
                                <NavDropdown.Item href="/partikelfilter-info/jobs-karriere"  className="nav-link">
                                    Jobs und Karriere
                                </NavDropdown.Item>
                                <NavDropdown.Item href={`${JOOMLA_URL_BASE}/images/Qualitätssicherung.pdf`} className="nav-link" target={'_blank'} rel={'noopener'}>
                                    Qualitätssicherung
                                </NavDropdown.Item>
                            </NavDropdown>

                            <NavDropdown title="Händler">
                                <NavDropdown.Item href="/haendler/login" className="nav-link">
                                        Login
                                </NavDropdown.Item>
                                <NavDropdown.Item href="/haendler/registrierung" className="nav-link">
                                        Registrierung
                                </NavDropdown.Item>
                            </NavDropdown>

                            <Link href="/kontakt-greencar" className="nav-link">
                                Kontakt
                            </Link>
                        </Nav>
                    </Navbar.Collapse>

                </Navbar>

            </Container>
            </Container>

    );
}
