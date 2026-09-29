import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterForm({ onSuccess, onSwitchToLogin }) {
  const { register } = useAuth();
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
    setLoading(true);
    try {
      await register(formData);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join TravelMate to find compatible travel partners</p>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label className="form-label" htmlFor="reg-username">Username</label>
          <input
            id="reg-username"
            name="username"
            type="text"
            className="form-input"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            name="email"
            type="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            name="password"
            type="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="reg-style">Travel Style</label>
            <select
              id="reg-style"
              name="travel_style"
              className="form-select"
              value={formData.travel_style}
              onChange={handleChange}
            >
              <option value="adventure">Adventure</option>
              <option value="cultural">Cultural</option>
              <option value="nature">Nature / Trekking</option>
              <option value="relaxation">Relaxation</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-pace">Travel Pace</label>
            <select
              id="reg-pace"
              name="pace"
              className="form-select"
              value={formData.pace}
              onChange={handleChange}
            >
              <option value="relaxed">Relaxed</option>
              <option value="moderate">Moderate</option>
              <option value="fast">Fast-paced</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Creating Account...' : 'Get Started'}
        </button>
      </form>

      <div className="auth-footer">
        <span>Already have an account? </span>
        <button type="button" onClick={onSwitchToLogin} className="btn-link">
          Sign In
        </button>
      </div>
    </div>
  );
}
