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
                <Navbar.Brand href="/"><img src="https://www.dieselpartikelfilter.net/templates/jsn_metro_pro/images/colors/image/logo.png"/></Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar" />
                <Navbar.Collapse id="navbar" className="">
                    <Nav className="ms-auto">
                        <Link href="/" passHref legacyBehavior>
                            <a className="nav-link">Home</a>
                        </Link>
                        <Link href="/kfz-werkstatt-filtereinbau-greencar" passHref legacyBehavior>
                            <a className="nav-link">Standorte</a>
                        </Link>
                        <NavDropdown title="Produkt und Preisliste">
                            <NavDropdown.Item >
                                <Link href="/pkw-partikelfilter/pkw-nachruestfilter" passHref legacyBehavior>
                                    <a className="nav-link">Preisliste PKW Nachrüstfilter</a>
                                </Link>
                                <Link href="/pkw-partikelfilter/pkw-austauschfilter" passHref legacyBehavior>
                                    <a className="nav-link">Preisliste PKW Austauschfilter</a>
                                </Link>
                                <Link href="/pkw-partikelfilter/pkw-filterreinigung" passHref legacyBehavior>
                                    <a className="nav-link">Preisliste PKW Filterreinigung</a>
                                </Link>
                                <Link href="/lkw-partikelfilter/dpf-euro-vi" passHref legacyBehavior>
                                    <a className="nav-link">Preisliste LKW DPF EURO VI</a>
                                </Link>
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Informationen">
                            <NavDropdown.Item >
                                <Link href="/partikelfilter-info/filter-lkw-infos" passHref legacyBehavior>
                                    <a className="nav-link">Über GREENCAR</a>
                                </Link>
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Händler">
                            <NavDropdown.Item >
                                <Link href="/haendler/login" passHref legacyBehavior>
                                    <a className="nav-link">Login</a>
                                </Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item >
                                <Link href="/haendler/registrierung" passHref legacyBehavior>
                                    <a className="nav-link">Registrierung</a>
                                </Link>
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Link href="/kontakt-greencar" passHref legacyBehavior>
                            <a className="nav-link">Kontakt</a>
                        </Link>
                    </Nav>
                </Navbar.Collapse>



            </Container>
            </Container>
        </Navbar>
    );
}
