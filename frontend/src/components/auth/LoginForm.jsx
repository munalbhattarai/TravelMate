import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import authBg from '../../assets/auth-bg.jpg';

export default function LoginForm({ onSuccess, onSwitchToRegister, logoutNotice }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-paper-container">
      <div className="auth-paper-card">
        {/* Left: Clean Form Side */}
        <div className="auth-paper-form">
          <div className="auth-paper-header">
            <h2 className="auth-paper-title">SIGN IN</h2>
            <p className="auth-paper-subtitle">Welcome back to TravelMate</p>
          </div>

          {logoutNotice && (
            <div className="auth-logout-success-banner">
              <span className="logout-success-icon">✓</span>
              <span>You have been safely logged out. Safe travels!</span>
            </div>
          )}

          {error && <div className="auth-error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-paper-fields">
            <div className="pill-input-group">
              <span className="pill-input-icon">👤</span>
              <input
                id="login-username"
                type="text"
                className="pill-input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username or email"
                required
              />
            </div>

            <div className="pill-input-group">
              <span className="pill-input-icon">🔒</span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="pill-input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button
                type="button"
                className="pill-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="23" x2="23" y2="1"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>

            <button type="submit" className="btn-paper-cyan" disabled={loading}>
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          {/* Social Icons matching Image 1 */}
          <div className="auth-social-row">
            <button type="button" className="social-circle-btn fb" title="Facebook" aria-label="Sign in with Facebook">f</button>
            <button type="button" className="social-circle-btn ggl" title="Google" aria-label="Sign in with Google">G</button>
            <button type="button" className="social-circle-btn tw" title="Twitter" aria-label="Sign in with Twitter">𝕏</button>
          </div>

          <div className="auth-switch-caption">
            <span>Don't have an account? </span>
            <button type="button" onClick={onSwitchToRegister} className="btn-link-action">
              Sign Up
            </button>
          </div>
        </div>

        {/* Torn Paper Organic Divider */}
        <div className="torn-edge-divider" aria-hidden="true" />

        {/* Right: Immersive Ocean Kayak Visual (Directly from Image 1) */}
        <div className="auth-paper-imagery">
          <img src={authBg} alt="Aerial view of crystal clear lagoon with kayak" className="paper-img-media" />
          <div className="paper-img-overlay">
            <div className="paper-overlay-text">
              <h3 className="paper-headline">TRAVEL COMPANIONS</h3>
              <p className="paper-tagline">EXPLORE THE WORLD TOGETHER</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
