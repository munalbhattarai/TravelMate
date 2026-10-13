import React from 'react';
import TravelMateLogo from '../ui/TravelMateLogo';

export default function Footer({ onNavigate }) {
  const handleNav = (route) => {
    if (onNavigate) {
      onNavigate(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer-container">
      <div className="footer-inner">
        {/* Brand Column */}
        <div className="footer-brand-section">
          <div className="footer-logo-wrap" onClick={() => handleNav('home')}>
            <TravelMateLogo size="md" />
          </div>
          <p className="footer-brand-desc">
            Nepal’s dedicated companion platform for treks, road trips, and mountain expeditions.
            Connecting compatible travelers with algorithmic matching, collaborative itineraries, and transparent NPR expense settlements.
          </p>
          <div className="footer-trust-chips">
            <span className="footer-chip">
              <span className="chip-dot"></span> Verified Travelers
            </span>
            <span className="footer-chip">Himalayan Routes</span>
            <span className="footer-chip">Fair NPR Splits</span>
          </div>
        </div>

        {/* Explore Links */}
        <div className="footer-links-group">
          <h4>Explore Nepal</h4>
          <button type="button" className="footer-link-btn" onClick={() => handleNav('explore')}>
            Browse Nepal Trips
          </button>
          <button type="button" className="footer-link-btn" onClick={() => handleNav('matches')}>
            Find Companion Matches
          </button>
          <button type="button" className="footer-link-btn" onClick={() => handleNav('explore')}>
            Annapurna Circuit
          </button>
          <button type="button" className="footer-link-btn" onClick={() => handleNav('explore')}>
            Pokhara & Lakeside
          </button>
          <button type="button" className="footer-link-btn" onClick={() => handleNav('explore')}>
            Everest Region
          </button>
        </div>

        {/* Platform Capabilities */}
        <div className="footer-links-group">
          <h4>Platform</h4>
          <button type="button" className="footer-link-btn" onClick={() => handleNav('matches')}>
            8-Factor Matching
          </button>
          <button type="button" className="footer-link-btn" onClick={() => handleNav('explore')}>
            Day-by-Day Itineraries
          </button>
          <button type="button" className="footer-link-btn" onClick={() => handleNav('explore')}>
            NPR Expense Settlement
          </button>
          <button type="button" className="footer-link-btn" onClick={() => handleNav('profile')}>
            Traveler Profiles & Trust
          </button>
        </div>

        {/* Safety & Guidelines */}
        <div className="footer-links-group">
          <h4>Safety & Trust</h4>
          <span className="footer-static-item">Verified Identity & Badges</span>
          <span className="footer-static-item">Trekker Peer Reviews</span>
          <span className="footer-static-item">Trail Safety Standards</span>
          <span className="footer-static-item">Active Moderation</span>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="footer-copyright">
            © {new Date().getFullYear()} TravelMate Nepal. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <span className="footer-legal-tag">Nepal Tourism Companion Portal</span>
            <span className="footer-separator">•</span>
            <span className="footer-legal-tag">Community Guidelines</span>
            <span className="footer-separator">•</span>
            <span className="footer-legal-tag">Privacy & Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
