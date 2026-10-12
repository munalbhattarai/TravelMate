import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import authBg from '../../assets/auth-bg.jpg';
import CustomSelect from '../ui/CustomSelect';
import TravelMateLogo from '../ui/TravelMateLogo';

const STYLE_OPTIONS = [
  { value: 'adventure', label: 'Adventure' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'nature', label: 'Nature / Trekking' },
  { value: 'relaxation', label: 'Relaxation' },
];

const PACE_OPTIONS = [
  { value: 'relaxed', label: 'Relaxed' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'fast', label: 'Fast-paced' },
];

export default function RegisterForm({ onSuccess, onSwitchToLogin }) {
  const { register, login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    travel_style: 'adventure',
    pace: 'moderate',
    budget_level: 'moderate',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      await login(formData.username, formData.password);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your inputs.');
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
            <div className="auth-brand-badge">
              <TravelMateLogo size="sm" />
            </div>
            <h2 className="auth-paper-title">Create Account</h2>
            <p className="auth-paper-subtitle">Join TravelMate to find companions across Nepal</p>
          </div>

          {error && <div className="auth-error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-paper-fields">
            <div className="auth-field-group">
              <label className="auth-field-label">Username</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <input
                  id="reg-username"
                  name="username"
                  type="text"
                  className="auth-input-field"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. wanderer"
                  required
                />
              </div>
            </div>

            <div className="auth-field-group">
              <label className="auth-field-label">Email Address</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  className="auth-input-field"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="auth-field-group">
              <label className="auth-field-label">Password</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  minLength={8}
                  className="auth-input-field"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="23" x2="23" y2="1"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="auth-double-fields">
              <div className="auth-select-field-box">
                <label className="auth-field-label">Travel Style</label>
                <CustomSelect
                  value={formData.travel_style}
                  options={STYLE_OPTIONS}
                  onChange={(val) => setFormData((prev) => ({ ...prev, travel_style: val }))}
                  placeholder="Travel Style"
                  icon="🎒"
                />
              </div>

              <div className="auth-select-field-box">
                <label className="auth-field-label">Trek Pace</label>
                <CustomSelect
                  value={formData.pace}
                  options={PACE_OPTIONS}
                  onChange={(val) => setFormData((prev) => ({ ...prev, pace: val }))}
                  placeholder="Pace"
                  icon="⚡"
                />
              </div>
            </div>

            <button type="submit" className="btn-auth-primary" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Social Divider */}
          <div className="auth-divider">
            <span className="auth-divider-text">or sign up with</span>
          </div>

          {/* Modern Clean Social Row */}
          <div className="auth-social-row">
            <button type="button" className="auth-social-btn" title="Sign up with Google">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google</span>
            </button>
            <button type="button" className="auth-social-btn" title="Sign up with Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </button>
          </div>

          <div className="auth-switch-caption">
            <span>Already have an account? </span>
            <button type="button" onClick={onSwitchToLogin} className="btn-link-action">
              Sign In
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
