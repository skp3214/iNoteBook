import { Link, useNavigate, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import { useTheme } from '../context/theme/ThemeContext';
import icon from '../asset/inotebookicon.png';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faRightFromBracket, faRightToBracket, faSun } from '@fortawesome/free-solid-svg-icons';
import { clearOfflineData } from '../utils/offlineUtils';

function NavbarComponents({ searchQuery, setSearchQuery }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const token = localStorage.getItem('token');
  const location = useLocation();

  let navigate = useNavigate();
  
  const handleLogOut = () => {
    localStorage.removeItem('token');
    // Clear all user-specific offline data on logout
    clearOfflineData();
    navigate('/');
  }

  const handleLogin=()=>{
    navigate('/login');
  }

  const isHomePage = location.pathname === '/home';

  return (
    <Navbar className="modern-navbar sticky-top">
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to={token ? "/home" : "/"} className="d-flex align-items-center modern-brand">
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
        
        <div className="d-flex align-items-center gap-3 ms-auto">
          {/* Search Bar - Desktop Only, shown on home page */}
          {token && isHomePage && (
            <div className="d-none d-lg-block" style={{ width: '400px' }}>
              <div className="position-relative">
                <i className="fas fa-search position-absolute" style={{
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  zIndex: 5,
                  fontSize: '0.9rem',
                }}></i>
                <Form.Control
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery || ''}
                  onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                  style={{
                    paddingLeft: '2.75rem',
                    paddingRight: '1rem',
                    height: '44px',
                    fontSize: '0.95rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '12px',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>
          )}
          
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <FontAwesomeIcon icon={faSun} />
            ) : (
              <FontAwesomeIcon icon={faMoon} />
            )}
          </button>
          
          {token ? (
            <Button 
              variant="outline-danger" 
              onClick={handleLogOut}
              className="modern-btn modern-btn-outline d-lg-none"
              size="sm"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.25rem' }}
            >
              <FontAwesomeIcon
                icon={faRightFromBracket}
                style={{
                  fontSize: '14px',
                  cursor: 'pointer'
                }} />
            </Button>
          ) : (
            <div className="d-flex gap-2 d-lg-none">
              <Button 
              variant="outline-danger" 
              onClick={handleLogin}
              className="modern-btn modern-btn-outline d-lg-none"
              size="sm"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.25rem' }}
            >
              <FontAwesomeIcon
                icon={faRightToBracket}
                style={{
                  fontSize: '14px',
                  cursor: 'pointer'
                }} />
            </Button>
            </div>
          )}
          
          {/* Desktop buttons */}
          {token ? (
            <Button 
              variant="outline-danger" 
              onClick={handleLogOut}
              className="modern-btn modern-btn-outline d-none d-lg-block"
              size="sm"
            >
              Logout
            </Button>
          ) : (
            <div className="d-none d-lg-flex gap-2">
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
      </Container>
    </Navbar>
  );
}

export default NavbarComponents;