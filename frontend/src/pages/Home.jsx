import React, { useState } from 'react';
import heroBg from '../assets/hero-bg.jpg';
import destPokhara from '../assets/dest-pokhara.jpg';
import destAnnapurna from '../assets/dest-annapurna.jpg';
import destEverest from '../assets/dest-everest.jpg';
import destMustang from '../assets/dest-mustang.jpg';

const NEPAL_DESTINATIONS = [
  {
    id: 1,
    name: 'Pokhara Lakeside',
    location: 'Gandaki Province, Nepal',
    image: destPokhara,
    tag: 'Lakeside & Adventure'
  },
  {
    id: 2,
    name: 'Annapurna Base Camp',
    location: 'Sanctuary Trek, Nepal',
    image: destAnnapurna,
    tag: 'Himalayan Trekking'
  },
  {
    id: 3,
    name: 'Everest Region',
    location: 'Namche Bazaar, Khumbu',
    image: destEverest,
    tag: 'High Altitude Trek'
  },
  {
    id: 4,
    name: 'Upper Mustang',
    location: 'Lo Manthang, Nepal',
    image: destMustang,
    tag: 'Heritage & Desert Valleys'
  }
];

export default function Home({ onNavigate }) {
  const [activeDestIndex, setActiveDestIndex] = useState(0);

  return (
    <div className="home-container">
      {/* Hero Section — Grounded in Nepal Travel per SRS Specifications */}
      <section className="hero-showcase">
        <div className="hero-bg-wrapper">
          <img src={heroBg} alt="Phewa Lake Pokhara with Annapurna reflection" className="hero-bg-media" />
          <div className="hero-scenic-overlay" />
        </div>

        <div className="hero-layout-grid">
          {/* Left Column: Nepal Editorial Headline & Actions */}
          <div className="hero-narrative">
            <div className="hero-pill-badge">
              <span className="badge-new-chip">Nepal</span>
              <span>Find Travel Buddies for Treks & Road Trips</span>
            </div>

            <h1 className="hero-editorial-title">
              <span className="script-word">Explore</span> the Himalayas Together
            </h1>

            <p className="hero-editorial-lead">
              Find verified, compatible travel companions for trips across Nepal. 
              From Pokhara’s lakeside to the mountain sanctuaries of Annapurna and Everest — 
              plan itineraries, split expenses fairly in NPR, and build lasting travel friendships.
            </p>

            <div className="hero-button-cluster">
              <button 
                className="btn-hero-glass" 
                onClick={() => onNavigate('explore')}
              >
                Browse Nepal Trips <span className="btn-arrow">↗</span>
              </button>
              <button 
                className="btn-hero-solid" 
                onClick={() => onNavigate('matches')}
              >
                Find Companion Matches <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>

          {/* Right Column: Circular Nepal Destinations Preview (Image 2 style) */}
          <div className="hero-destinations-stack">
            <div className="destinations-circles-list">
              {NEPAL_DESTINATIONS.map((dest, idx) => (
                <div 
                  key={dest.id}
                  className={`dest-circle-item ${idx === activeDestIndex ? 'active' : ''}`}
                  onClick={() => {
                    setActiveDestIndex(idx);
                    onNavigate('explore');
                  }}
                  onMouseEnter={() => setActiveDestIndex(idx)}
                >
                  <div className="dest-text-caption">
                    <span className="dest-name-label">{dest.name}</span>
                    <span className="dest-loc-sub">{dest.location}</span>
                  </div>
                  <div className="dest-circle-frame">
                    <img src={dest.image} alt={dest.name} />
                  </div>
                </div>
              ))}
            </div>

            {/* Vertical Pagination Dots */}
            <div className="vertical-pagination-indicator" aria-hidden="true">
              {NEPAL_DESTINATIONS.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`v-dot ${idx === activeDestIndex ? 'active' : ''}`}
                  onClick={() => setActiveDestIndex(idx)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Pill Indicator (Image 3 style) */}
        <div 
          className="hero-scroll-indicator" 
          onClick={() => document.getElementById('features-preview')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="scroll-pill-text">SCROLL ↓</span>
        </div>
      </section>

      {/* Main Features & Value Grid — Clean Editorial Layout */}
      <section id="features-preview" className="curated-section">
        <div className="section-header-centered">
          <div className="section-badge-chip">
            <span className="badge-sparkle">✦</span>
            <span>SMART TRIP COORDINATION</span>
          </div>
          <h2 className="section-editorial-heading">
            Designed for Treks, Road Trips & Backpacking
          </h2>
          <p className="section-subtext">
            Skip disorganized group chats and misaligned budgets. TravelMate coordinates your group
            from Kathmandu to Pokhara, Mustang, and beyond with complete transparency.
          </p>
        </div>

        {/* 3 Modern Value Pillar Cards */}
        <div className="pillars-grid">
          {/* Card 1: 8-Factor Compatibility */}
          <div className="pillar-card pillar-card-emerald">
            <div className="pillar-top-row">
              <div className="pillar-icon-box icon-box-emerald">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fillOpacity="0.2" />
                </svg>
              </div>
              <span className="pillar-badge-tag tag-emerald">MATCHING ENGINE</span>
            </div>

            <h3 className="pillar-title">8-Factor Compatibility</h3>
            <p className="pillar-body">
              Match with companions based on trekking pace, daily NPR budget, transport preference 
              (tourist bus, jeep, flight), accommodation style, and verified member trust.
            </p>

            <div className="pillar-chips-row">
              <span className="pillar-mini-chip">⚡ Trek Pace</span>
              <span className="pillar-mini-chip">💰 NPR Budget</span>
              <span className="pillar-mini-chip">🚙 Transport</span>
              <span className="pillar-mini-chip">🛡️ Trust Score</span>
            </div>

            <button 
              type="button" 
              className="pillar-action-btn" 
              onClick={() => onNavigate('matches')}
            >
              <span>See Companion Matches</span>
              <span className="action-arrow">→</span>
            </button>
          </div>

          {/* Card 2: Day-by-Day Itinerary */}
          <div className="pillar-card pillar-card-amber">
            <div className="pillar-top-row">
              <div className="pillar-icon-box icon-box-amber">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" fill="currentColor" fillOpacity="0.1" />
                  <line x1="8" y1="2" x2="8" y2="18" />
                  <line x1="16" y1="6" x2="16" y2="22" />
                </svg>
              </div>
              <span className="pillar-badge-tag tag-amber">ROUTE PLANNING</span>
            </div>

            <h3 className="pillar-title">Day-by-Day Itinerary</h3>
            <p className="pillar-body">
              Collaborate on daily trekking stages, arrival points in Pokhara, teahouse stops, and rest days. 
              The group workspace keeps everyone aligned on the route.
            </p>

            <div className="pillar-chips-row">
              <span className="pillar-mini-chip">📍 Teahouse Stops</span>
              <span className="pillar-mini-chip">🏔️ Rest Days</span>
              <span className="pillar-mini-chip">📅 Daily Stages</span>
            </div>

            <button 
              type="button" 
              className="pillar-action-btn" 
              onClick={() => onNavigate('explore')}
            >
              <span>Explore Trip Itineraries</span>
              <span className="action-arrow">→</span>
            </button>
          </div>

          {/* Card 3: NPR Expense Settlement */}
          <div className="pillar-card pillar-card-teal">
            <div className="pillar-top-row">
              <div className="pillar-icon-box icon-box-teal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="3" fill="currentColor" fillOpacity="0.1" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                  <path d="M12 14v4" />
                  <path d="M9 16h6" />
                </svg>
              </div>
              <span className="pillar-badge-tag tag-teal">TRANSPARENT COST</span>
            </div>

            <h3 className="pillar-title">NPR Expense Settlement</h3>
            <p className="pillar-body">
              Log shared jeep rentals, permits, and food. The platform automatically calculates exact 
              per-member balances in NPR with deterministic split rules so nobody overpays.
            </p>

            <div className="pillar-chips-row">
              <span className="pillar-mini-chip">🚙 Shared Jeeps</span>
              <span className="pillar-mini-chip">📋 ACAP / TIMS</span>
              <span className="pillar-mini-chip">⚖️ Fair Splits</span>
            </div>

            <button 
              type="button" 
              className="pillar-action-btn" 
              onClick={() => onNavigate('explore')}
            >
              <span>Browse Group Trips</span>
              <span className="action-arrow">→</span>
            </button>
          </div>
        </div>

        {/* 3-Step Journey Timeline Strip */}
        <div className="how-it-works-strip">
          <div className="how-step-card">
            <div className="step-number-badge">01</div>
            <div className="step-body">
              <h4 className="step-title">Discover or Create</h4>
              <p className="step-desc">Pick your destination in Nepal, set your target dates, and outline your budget in NPR.</p>
            </div>
          </div>

          <div className="how-step-connector" aria-hidden="true">
            <span className="connector-dot"></span>
            <span className="connector-line"></span>
            <span className="connector-arrow">›</span>
          </div>

          <div className="how-step-card">
            <div className="step-number-badge">02</div>
            <div className="step-body">
              <h4 className="step-title">Match & Coordinate</h4>
              <p className="step-desc">Review 8-factor compatibility ratings, connect with companions, and finalize the trail stages.</p>
            </div>
          </div>

          <div className="how-step-connector" aria-hidden="true">
            <span className="connector-dot"></span>
            <span className="connector-line"></span>
            <span className="connector-arrow">›</span>
          </div>

          <div className="how-step-card">
            <div className="step-number-badge">03</div>
            <div className="step-body">
              <h4 className="step-title">Trek & Split Fairly</h4>
              <p className="step-desc">Journey together across the Himalayas with real-time shared expenses tracked effortlessly.</p>
            </div>
          </div>
        </div>

        {/* Elevated Curated Banner CTA Section */}
        <div className="curated-banner-cta">
          <div className="cta-banner-content">
            <div className="cta-badge-chip">
              <span className="cta-sparkle">✦</span>
              <span>READY FOR YOUR NEXT ADVENTURE?</span>
            </div>
            <h3 className="cta-headline">Connect with Fellow Travelers Heading Your Way</h3>
            <p className="cta-lead">
              Create a trip in 2 minutes, set your budget in NPR, and let verified, compatible companions find you.
            </p>
            <div className="cta-trust-row">
              <span className="cta-trust-item">
                <span className="trust-check">✓</span> 100% Free for Travelers
              </span>
              <span className="cta-trust-item">
                <span className="trust-check">✓</span> Verified Identity Trust
              </span>
              <span className="cta-trust-item">
                <span className="trust-check">✓</span> Transparent NPR Splits
              </span>
            </div>
          </div>
          <div className="cta-banner-actions">
            <button className="btn-cta-primary" onClick={() => onNavigate('explore')}>
              <span>Explore Nepal Trips</span>
              <span className="btn-arrow-icon">↗</span>
            </button>
            <button className="btn-cta-outline" onClick={() => onNavigate('register')}>
              <span>Create Free Account</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
