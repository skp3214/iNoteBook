import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import NavbarComponents from './components/Navbar';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import NoteState from './context/notes/NoteState';
import ThemeProvider from './context/theme/ThemeProvider';
import LoginForm from './pages/LoginForm';
import SignUpForm from './pages/SignUpForm';
import AiAssistant from './pages/AiAssistant';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ThemeProvider>
      <NoteState>
        <Router>
          <div className="min-vh-100" style={{ background: 'var(--bg-primary)' }}>
            <NavbarComponents searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<Home searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
              <Route path="/ai-assistant" element={<AiAssistant />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </div>
        </Router>
      </NoteState>
    </ThemeProvider>
  );
}

export default App;
