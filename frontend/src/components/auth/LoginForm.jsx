import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import authBg from '../../assets/auth-bg.jpg';

export default function LoginForm({ onSuccess, onSwitchToRegister }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
                type="password"
                className="pill-input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
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
