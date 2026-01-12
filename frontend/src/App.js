import { Routes, Route } from 'react-router-dom';
import { useState, lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import NavbarComponents from './components/Navbar';
import NoteState from './context/notes/NoteState';
import ThemeProvider from './context/theme/ThemeProvider';

// Lazy load routes for better performance
const Home = lazy(() => import('./pages/Home'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginForm = lazy(() => import('./pages/LoginForm'));
const SignUpForm = lazy(() => import('./pages/SignUpForm'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// Loading component
const LoadingFallback = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
    <div className="modern-ring-spinner"></div>
  </div>
);

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ThemeProvider>
      <NoteState>
          <div className="min-vh-100" style={{ background: 'var(--bg-primary)' }}>
            <NavbarComponents searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<Home searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<SignUpForm />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Routes>
            </Suspense>
            <Analytics />
          </div>
      </NoteState>
    </ThemeProvider>
  );
}

export default App;
