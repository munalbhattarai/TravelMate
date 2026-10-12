import React from 'react';
import TravelMateLogo from '../ui/TravelMateLogo';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div className="footer-brand-section">
          <div style={{ marginBottom: '0.85rem' }}>
            <TravelMateLogo size="md" />
          </div>
          <p>Connecting compatible travel companions across Nepal with verified trust, shared expenses, and collaborative itineraries.</p>
        </div>
        <div className="footer-links-group">
          <h4>Platform</h4>
          <span>Verified Profiles</span>
          <span>Compatibility Algorithm</span>
          <span>Group Expenses</span>
        </div>
        <div className="footer-links-group">
          <h4>Safety & Trust</h4>
          <span>Peer Reviews</span>
          <span>Community Guidelines</span>
          <span>Report Moderation</span>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 TravelMate Platform. Built according to TravelMate SRS specifications.</p>
      </div>
    </footer>
  );
}
