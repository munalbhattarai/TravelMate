import React from 'react';

export default function Home({ onNavigate }) {
  return (
    <div className="home-page-container">
      <section className="hero-banner glass-panel">
        <div className="hero-content">
          <span className="hero-tag">🌟 Travel Together, Experience More</span>
          <h1 className="hero-heading">
            Find Your Ideal Travel Companion with Compatibility Matching
          </h1>
          <p className="hero-subtext">
            TravelMate connects travelers based on shared travel styles, budgets, pace, and verified trust.
            Plan itineraries, split costs fairly, and explore the world securely.
          </p>
          <div className="hero-cta-group">
            <button className="btn btn-primary btn-lg" onClick={() => onNavigate('explore')}>
              Explore Open Trips
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => onNavigate('matches')}>
              Calculate Matches
            </button>
          </div>
        </div>
      </section>

      <section className="features-grid">
        <div className="feature-card glass-panel">
          <span className="feature-icon">🎯</span>
          <h3>8-Factor Compatibility</h3>
          <p>Multi-dimensional algorithm analyzing travel style, pace, budget alignment, language, and verified reputation.</p>
        </div>
        <div className="feature-card glass-panel">
          <span className="feature-icon">💬</span>
          <h3>Collaborative Workspace</h3>
          <p>Group chat, day-by-day itinerary timeline planning, and transparent deterministic expense splitting.</p>
        </div>
        <div className="feature-card glass-panel">
          <span className="feature-icon">🛡️</span>
          <h3>Safety & Verification</h3>
          <p>Strict ID verifications, peer review network, safety blocking, and real-time moderation protection.</p>
        </div>
      </section>
    </div>
  );
}
