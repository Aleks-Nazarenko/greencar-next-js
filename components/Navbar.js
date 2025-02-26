// components/Navbar.js
import Link from 'next/link';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


export default function NavbarNazarenko() {

    return (
        <Navbar expand="md" className="an-navbar bg-gc-light-blue-nav shadow">
            <Container fluid className="">
                <Container fluid className="container-greencar justify-content-between d-flex g-0">
                <Navbar.Brand href="/"><img src="https://www.dieselpartikelfilter.net/templates/jsn_metro_pro/images/colors/image/logo.png" alt={"Logo"}/></Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar" />
                <Navbar.Collapse id="navbar" className="">
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

                        <NavDropdown title="Informationen">
                            <NavDropdown.Item href="/partikelfilter-info/filter-lkw-infos"  className="nav-link">
                                    Über GREENCAR
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



            </Container>
            </Container>
        </Navbar>
    );
}
