import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ExploreTrips from './pages/ExploreTrips';
import MatchesPage from './pages/MatchesPage';
import TripDetailPage from './pages/TripDetailPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import './App.css';

export default function App() {
  const [route, setRoute] = useState('home');
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [toast, setToast] = useState(null);

  const handleSelectTrip = (id) => {
    setSelectedTripId(id);
    setRoute('trip-detail');
  };

  React.useEffect(() => {
    const handleLogout = () => {
      setRoute('login');
      setSelectedTripId(null);
      setToast({
        title: 'Logged Out Successfully',
        message: 'You have been safely signed out. See you on the trails! 👋',
        type: 'success',
      });
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  React.useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <AuthProvider>
      {toast && (
        <div className="global-toast-container" role="alert">
          <div className={`global-toast-pill toast-${toast.type || 'success'}`}>
            <div className="toast-icon-badge">✓</div>
            <div className="toast-body-text">
              <span className="toast-title">{toast.title}</span>
              <span className="toast-desc">{toast.message}</span>
            </div>
            <button
              className="toast-close-btn"
              onClick={() => setToast(null)}
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <Layout 
        currentRoute={route} 
        onNavigate={(r, tripId = null) => { 
          if (tripId) {
            setSelectedTripId(tripId);
            setRoute('trip-detail');
          } else {
            setRoute(r);
            setSelectedTripId(null);
          }
        }}
      >
        {route === 'home' && <Home onNavigate={setRoute} />}
        {route === 'explore' && <ExploreTrips onSelectTrip={handleSelectTrip} />}
        {route === 'matches' && <MatchesPage />}
        {route === 'profile' && (
          <ProfilePage onNavigateTrip={handleSelectTrip} onNavigate={setRoute} />
        )}
        {route === 'admin' && (
          <AdminDashboard onNavigate={setRoute} onSelectTrip={handleSelectTrip} />
        )}
        {route === 'trip-detail' && selectedTripId && (
          <TripDetailPage tripId={selectedTripId} onBack={() => setRoute('explore')} onNavigate={setRoute} />
        )}
        {route === 'login' && (
          <div className="auth-page-wrap">
            <LoginForm 
              onSuccess={() => setRoute('explore')} 
              onSwitchToRegister={() => setRoute('register')}
              logoutNotice={Boolean(toast)}
            />
          </div>
        )}
        {route === 'register' && (
          <div className="auth-page-wrap">
            <RegisterForm onSuccess={() => setRoute('explore')} onSwitchToLogin={() => setRoute('login')} />
          </div>
        )}
      </Layout>
    </AuthProvider>
  );
}
