import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import NotificationCenter from '../notifications/NotificationCenter';

export default function Navbar({ currentRoute, onNavigate }) {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        <div className="navbar-brand" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
          <span className="brand-logo">🧭</span>
          <span className="brand-name">TravelMate</span>
        </div>

        <nav className="navbar-links">
          <button
            className={`nav-link ${currentRoute === 'explore' ? 'active' : ''}`}
            onClick={() => onNavigate('explore')}
          >
            Explore Trips
          </button>
          {user && (
            <button
              className={`nav-link ${currentRoute === 'matches' ? 'active' : ''}`}
              onClick={() => onNavigate('matches')}
            >
              Partner Matches
            </button>
          )}
        </nav>

        <div className="navbar-actions">
          {user ? (
            <div className="user-nav-group">
              <button
                className="btn-icon notification-bell-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                title="Notifications"
              >
                🔔
              </button>

              {showNotifications && (
                <NotificationCenter onClose={() => setShowNotifications(false)} />
              )}

              <div className="user-profile-badge">
                <span className="user-avatar-circle">
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </span>
                <span className="user-display-name">{user.username}</span>
              </div>

              <button className="btn btn-outline btn-sm" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn btn-outline" onClick={() => onNavigate('login')}>
                Sign In
              </button>
              <button className="btn btn-primary" onClick={() => onNavigate('register')}>
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
