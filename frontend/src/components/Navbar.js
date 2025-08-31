import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useTheme } from '../context/theme/ThemeContext';
import icon from '../asset/inotebookicon.png';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function NavbarComponents() {
  const location = useLocation();
  const [activeNavItem, setActiveNavItem] = useState('');
  const { isDarkMode, toggleTheme } = useTheme();
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
        <Navbar.Brand as={Link} to="/"><img
              alt=""
              src={icon}
              width="30"
              height="30"
              style={{ borderRadius: '50%' }}
              className="d-inline-block align-top"
            />{' '}
            iNoteBook</Navbar.Brand>
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
          <div className="d-flex align-items-center gap-2">
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            
            {token ? (
              <Button variant="outline-secondary" onClick={handleLogOut}>
                Logout
              </Button>
            ) : (
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
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponents;
