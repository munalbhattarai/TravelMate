import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import NotificationCenter from '../notifications/NotificationCenter';

export default function Navbar({ currentRoute, onNavigate }) {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="floating-navbar-wrapper">
      <div className="floating-navbar-pill">
        <div className="nav-brand" onClick={() => onNavigate('home')}>
          <span className="brand-icon">🧭</span>
          <span className="brand-title">TravelMate</span>
        </div>

        <nav className="nav-menu">
          <button
            className={`nav-item ${currentRoute === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            Home
          </button>
          <button
            className={`nav-item ${currentRoute === 'explore' ? 'active' : ''}`}
            onClick={() => onNavigate('explore')}
          >
            Destinations & Trips
          </button>
          {user && (
            <button
              className={`nav-item ${currentRoute === 'matches' ? 'active' : ''}`}
              onClick={() => onNavigate('matches')}
            >
              Partner Matches
            </button>
          )}
          {user && (
            <button
              className={`nav-item ${currentRoute === 'profile' ? 'active' : ''}`}
              onClick={() => onNavigate('profile')}
            >
              My Profile
            </button>
          )}
        </nav>

        <div className="nav-actions">
          {user ? (
            <div className="user-nav-capsule">
              <div className="nav-notification-wrapper">
                <button
                  className="nav-bell-btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                  title="Notifications"
                  aria-label="Notifications"
                >
                  🔔
                </button>

                {showNotifications && (
                  <NotificationCenter onClose={() => setShowNotifications(false)} />
                )}
              </div>

<<<<<<< HEAD
              <div 
                className="user-profile-pill" 
                onClick={() => onNavigate('profile')} 
                style={{ cursor: 'pointer' }}
                title="View & Edit Travel Profile"
              >
=======
              <div className="user-profile-pill">
>>>>>>> 7c246394e7074765dc469146b61ae7725615cb5f
                <span className="user-avatar-dot">
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </span>
                <span className="user-name-text">{user.username}</span>
              </div>

              <button className="nav-logout-btn" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="guest-nav-capsule">
              <button
                className="nav-link-btn"
                onClick={() => onNavigate('login')}
              >
                Sign In
              </button>
              <button
                className="nav-pill-btn-dark"
                onClick={() => onNavigate('register')}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
