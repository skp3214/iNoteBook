import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function NavbarComponents() {
  const location = useLocation();
  const [activeNavItem, setActiveNavItem] = useState('');
  const token = localStorage.getItem('token');

  let navigate = useNavigate();
  useEffect(() => {
    const { pathname } = location;

    if (pathname === '/') {
      setActiveNavItem('home');
    } else {
      setActiveNavItem('');
    }
  }, [location]);
  const handleLogOut = () => {
    localStorage.removeItem('token');
    navigate('login');
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/">iNoteBook</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={NavLink}
              to="/"
              className={`nav-link ${activeNavItem === 'home' ? 'active' : ''} ${activeNavItem === 'home' ? 'custom-color' : ''}`}
            >
              Home
            </Nav.Link>
          </Nav>
          {token ? (
            // If token is present, show logout button
            <Button variant="outline-secondary" onClick={handleLogOut}>
              Logout
            </Button>
          ) : (
            // If token is not present, show login and signup buttons
            <Form inline>
              <Row>
                <Col xs="auto">
                  <Button as={Link} to="/login" variant="outline-danger">
                    Login
                  </Button>
                </Col>
                <Col xs="auto">
                  <Button as={Link} to="/signup" variant="outline-primary">
                    Sign Up
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponents;
