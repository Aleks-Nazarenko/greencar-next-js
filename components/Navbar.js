// components/Navbar.js
import Link from 'next/link';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

export default function NavbarNazarenko() {
    return (
        <Navbar expand="sm" className="an-navbar">
            <Container fluid className="">
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
                                    <a className="nav-link">Products</a>
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
                        <Link href="/kontakt-greencar" passHref legacyBehavior>
                            <a className="nav-link">Kontakt</a>
                        </Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
