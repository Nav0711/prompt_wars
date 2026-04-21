import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Landing from './Landing';
import { Login } from './Login';
import Dashboard from './Dashboard';
import './App.css';

const AUTH_STORAGE_KEY = 'venueOS_auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasLanded, setHasLanded] = useState<boolean>(false);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const { profile, credential } = JSON.parse(stored);
        // Validate that the stored data is still usable
        if (profile && (credential === 'DEMO_ACCOUNT' || credential)) {
          setUserProfile(profile);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLoginSuccess = useCallback((credential: string) => {
    try {
      let profile: any;
      if (credential === "DEMO_ACCOUNT") {
        profile = { email: 'operator@venueos.demo', name: 'Demo Operator' };
      } else {
        profile = jwtDecode(credential);
      }
      
      // Save to localStorage for persistence across reloads
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ profile, credential }));
      
      setUserProfile(profile);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Invalid token', err);
      alert('Login verification failed. Please try again.');
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUserProfile(null);
    setIsAuthenticated(false);
    setHasLanded(false);
  }, []);

  // Show nothing while checking stored auth to prevent flash
  if (isLoading) {
    return (
      <div style={{
        width: '100vw', height: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-base, #06080f)', color: 'var(--text-muted, #666)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            border: '3px solid rgba(0, 229, 255, 0.2)',
            borderTopColor: 'var(--accent-primary, #00e5ff)',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Loading VenueOS...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AppRoutes
        isAuthenticated={isAuthenticated}
        userProfile={userProfile}
        hasLanded={hasLanded}
        setHasLanded={setHasLanded}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />
    </Router>
  );
}

/**
 * Separate component inside Router so it can use useLocation().
 * On every fresh page load / reload, the user is redirected to "/"
 * (the Landing page) first. Once they've seen the landing page in
 * this component instance, in-app navigation works normally.
 */
function AppRoutes({
  isAuthenticated,
  userProfile,
  hasLanded,
  setHasLanded,
  onLoginSuccess,
  onLogout,
}: {
  isAuthenticated: boolean;
  userProfile: any;
  hasLanded: boolean;
  setHasLanded: (val: boolean) => void;
  onLoginSuccess: (credential: string) => void;
  onLogout: () => void;
}) {
  const location = useLocation();

  // Mark that the user has visited the landing page
  useEffect(() => {
    if (location.pathname === '/') {
      setHasLanded(true);
    }
  }, [location.pathname, setHasLanded]);

  // If this is a fresh load and user hasn't seen the landing page yet,
  // redirect them to "/" first (e.g. direct /dashboard URL or reload on /login)
  if (!hasLanded && location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Landing isAuthenticated={isAuthenticated} />} />
      <Route
        path="/login"
        element={
          isAuthenticated ?
            <Navigate to="/dashboard" replace /> :
            <Login onSuccess={onLoginSuccess} onError={() => alert('Login failed.')} />
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ?
            <Dashboard userProfile={userProfile} onLogout={onLogout} /> :
            <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default App;
