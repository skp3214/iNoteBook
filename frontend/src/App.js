import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavbarComponents from './components/Navbar';
import Home from './components/Home';
import NoteState from './context/notes/NoteState';
import ThemeProvider from './context/theme/ThemeProvider';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';

function App() {
  return (
    <>
      <ThemeProvider>
        <NoteState>
          <Router>
            <div className="min-vh-100" style={{ background: 'var(--bg-primary)' }}>
              <NavbarComponents />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<SignUpForm />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </div>
          </Router>
        </NoteState>
      </ThemeProvider>
    </>
  );
}

export default App;