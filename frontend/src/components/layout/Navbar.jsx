import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import NotificationCenter from '../notifications/NotificationCenter';
import SafetyCenterModal from '../moderation/SafetyCenterModal';
import ReportModal from '../moderation/ReportModal';
import { notificationApi } from '../../services/notificationApi';

export default function Navbar({ currentRoute, onNavigate }) {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  const fetchUnreadCount = async () => {
    if (!user) return;
    try {
      const res = await notificationApi.getNotifications(true);
      const items = res.results || res || [];
      setUnreadCount(Array.isArray(items) ? items.length : 0);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 12000);
    return () => clearInterval(interval);
  }, [user]);

  // Click outside to close notifications dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showNotifications]);

  const isAdmin = Boolean(user && (user.role === 'admin' || user.is_staff || user.is_superuser));

  return (
    <header className="top-site-navbar">
      <div className="top-site-navbar-container">
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
          {isAdmin && (
            <button
              className={`nav-item nav-admin-nav-item ${currentRoute === 'admin' ? 'active' : ''}`}
              onClick={() => onNavigate('admin')}
              title="TravelMate Administration Console"
            >
              🛡️ Admin Console
            </button>
          )}
          <button
            className="nav-item nav-safety-pill"
            onClick={() => setSafetyModalOpen(true)}
            title="Nepal Travel Safety Directory & Protocols"
          >
            🛡️ Safety
          </button>
        </nav>

        <div className="nav-actions">
          {user ? (
            <div className="user-nav-capsule">
              <div className="nav-notification-wrapper" ref={notifRef}>
                <button
                  className="nav-bell-btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                  title="Notifications"
                  aria-label="Notifications"
                >
                  🔔
                  {unreadCount > 0 && (
                    <span className="notif-badge-pill">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  )}
                </button>

                {showNotifications && (
                  <NotificationCenter 
                    onClose={() => setShowNotifications(false)} 
                    onUpdateCount={fetchUnreadCount}
                    onNavigateTrip={(tripId) => {
                      if (onNavigate) onNavigate('trip-detail', tripId);
                      setShowNotifications(false);
                    }}
                  />
                )}
              </div>

              <div 
                className="user-profile-pill" 
                onClick={() => onNavigate('profile')} 
                style={{ cursor: 'pointer' }}
                title="View & Edit Travel Profile"
              >
                <span className="user-avatar-dot">
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </span>
                <span className="user-name-text">{user.username}</span>
                {user.role === 'guide' && (
                  <span className="nav-role-badge" title="Licensed Trek Guide" style={{ fontSize: '0.68rem', background: '#dcfce7', color: '#15803d', padding: '0.15rem 0.45rem', borderRadius: '10px', fontWeight: 700, marginLeft: '0.2rem' }}>
                    🏔️ Guide
                  </span>
                )}
                {isAdmin && (
                  <span 
                    className="nav-role-badge" 
                    title="System Administrator" 
                    style={{ fontSize: '0.68rem', background: '#ede9fe', color: '#6d28d9', padding: '0.15rem 0.45rem', borderRadius: '10px', fontWeight: 700, marginLeft: '0.2rem' }}
                  >
                    ⚙️ Admin
                  </span>
                )}
              </div>

              <button 
                className="nav-logout-btn" 
                onClick={() => {
                  logout();
                  if (onNavigate) onNavigate('login');
                }}
              >
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

      {/* Safety Center Modal */}
      <SafetyCenterModal
        isOpen={safetyModalOpen}
        onClose={() => setSafetyModalOpen(false)}
        onOpenReport={() => setReportModalOpen(true)}
      />

      {/* General Moderation Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        targetType="general"
        targetId={null}
        targetName="Safety & Moderation Issue"
      />
    </header>
  );
}
