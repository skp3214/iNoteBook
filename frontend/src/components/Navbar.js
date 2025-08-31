import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useTheme } from '../context/theme/ThemeContext';
import icon from '../asset/inotebookicon.png';
import Button from 'react-bootstrap/Button';

function NavbarComponents() {
  const { isDarkMode, toggleTheme } = useTheme();
  const token = localStorage.getItem('token');

  let navigate = useNavigate();
  
  const handleLogOut = () => {
    localStorage.removeItem('token');
    navigate('login');
  }

  return (
    <Navbar expand="lg" className="modern-navbar sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center modern-brand">
          <img
            alt="iNoteBook"
            src={icon}
            width="36"
            height="36"
            className="brand-logo"
            style={{ borderRadius: '10px' }}
          />
          <span className="brand-text">iNoteBook</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="modern-navbar-toggle" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <div className="ms-auto d-flex align-items-center gap-3">
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            
            {token ? (
              <Button 
                variant="outline-danger" 
                onClick={handleLogOut}
                className="modern-btn modern-btn-outline"
                size="sm"
              >
                Logout
              </Button>
            ) : (
              <div className="d-flex gap-2">
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-primary"
                  className="modern-btn modern-btn-outline"
                  size="sm"
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/signup" 
                  variant="primary"
                  className="modern-btn modern-btn-solid"
                  size="sm"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponents;