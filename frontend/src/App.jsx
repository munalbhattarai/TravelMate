import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ExploreTrips from './pages/ExploreTrips';
import MatchesPage from './pages/MatchesPage';
import TripDetailPage from './pages/TripDetailPage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import './App.css';

export default function App() {
  const [route, setRoute] = useState('home');
  const [selectedTripId, setSelectedTripId] = useState(null);

  const handleSelectTrip = (id) => {
    setSelectedTripId(id);
    setRoute('trip-detail');
  };

  return (
    <AuthProvider>
      <Layout currentRoute={route} onNavigate={(r) => { setRoute(r); setSelectedTripId(null); }}>
        {route === 'home' && <Home onNavigate={setRoute} />}
        {route === 'explore' && <ExploreTrips onSelectTrip={handleSelectTrip} />}
        {route === 'matches' && <MatchesPage />}
        {route === 'trip-detail' && selectedTripId && (
          <TripDetailPage tripId={selectedTripId} onBack={() => setRoute('explore')} />
        )}
        {route === 'login' && (
          <div className="auth-page-wrap">
            <LoginForm onSuccess={() => setRoute('explore')} onSwitchToRegister={() => setRoute('register')} />
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
