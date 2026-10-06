import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import authBg from '../../assets/auth-bg.jpg';
import CustomSelect from '../ui/CustomSelect';

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
            <h2 className="auth-paper-title">SIGN UP</h2>
            <p className="auth-paper-subtitle">Find your ideal travel partners</p>
          </div>

          {error && <div className="auth-error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-paper-fields">
            <div className="pill-input-group">
              <span className="pill-input-icon">👤</span>
              <input
                id="reg-username"
                name="username"
                type="text"
                className="pill-input-field"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username (e.g. wanderer)"
                required
              />
            </div>

            <div className="pill-input-group">
              <span className="pill-input-icon">✉️</span>
              <input
                id="reg-email"
                name="email"
                type="email"
                className="pill-input-field"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                required
              />
            </div>

            <div className="pill-input-group">
              <span className="pill-input-icon">🔒</span>
              <input
                id="reg-password"
                name="password"
                type="password"
                minLength={8}
                className="pill-input-field"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password (min. 8 chars)"
                required
              />
            </div>

            <div className="form-double-pills">
              <div className="pill-select-wrap">
                <CustomSelect
                  value={formData.travel_style}
                  options={STYLE_OPTIONS}
                  onChange={(val) => setFormData((prev) => ({ ...prev, travel_style: val }))}
                  placeholder="Travel Style"
                  icon="🎒"
                />
              </div>

              <div className="pill-select-wrap">
                <CustomSelect
                  value={formData.pace}
                  options={PACE_OPTIONS}
                  onChange={(val) => setFormData((prev) => ({ ...prev, pace: val }))}
                  placeholder="Pace"
                  icon="⚡"
                />
              </div>
            </div>

            <button type="submit" className="btn-paper-cyan" disabled={loading}>
              {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
            </button>
          </form>

          {/* Social Icons matching Image 1 */}
          <div className="auth-social-row">
            <button type="button" className="social-circle-btn fb" title="Facebook" aria-label="Sign up with Facebook">f</button>
            <button type="button" className="social-circle-btn ggl" title="Google" aria-label="Sign up with Google">G</button>
            <button type="button" className="social-circle-btn tw" title="Twitter" aria-label="Sign up with Twitter">𝕏</button>
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
