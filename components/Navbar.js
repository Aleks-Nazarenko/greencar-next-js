// components/Navbar.js
import Link from 'next/link';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';

export default function NavbarNazarenko() {
    return (
        <Navbar expand="lg" className="an-navbar">
            <Container fluid>
                <Navbar.Brand href="/">Navbar</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar" />
                <Navbar.Collapse id="navbar">
                    <Nav className="me-auto">
                        <Link href="/" passHref legacyBehavior>
                            <a className="nav-link">Home</a>
                        </Link>
                        <Link href="/about" passHref legacyBehavior>
                            <a className="nav-link">Home</a>
                        </Link>
                        <Link href="/contact" passHref legacyBehavior>
                            <a className="nav-link">Home</a>
                        </Link>
                    </Nav>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    );
}
