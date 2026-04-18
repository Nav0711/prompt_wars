import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Landing from './Landing';
import { Login } from './Login';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  const handleLoginSuccess = (credential: string) => {
    try {
      if (credential === "DEMO_ACCOUNT") {
        setUserProfile({ email: 'operator@venueos.demo', name: 'Demo Operator' });
      } else {
        const decoded = jwtDecode(credential);
        setUserProfile(decoded);
      }
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Invalid token', err);
      alert('Login verification failed. Please try again.');
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <Login onSuccess={handleLoginSuccess} onError={() => alert('Login failed.')} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
              <Dashboard userProfile={userProfile} /> : 
              <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
