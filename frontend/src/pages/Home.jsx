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
          <span className="section-eyebrow">Smart Trip Coordination</span>
          <h2 className="section-editorial-heading">Designed for Treks, Road Trips & Backpacking</h2>
          <p className="section-subtext">
            Skip disorganized group chats and misaligned budgets. TravelMate coordinates your group
            from Kathmandu to Pokhara, Mustang, and beyond with complete transparency.
          </p>
        </div>

        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon-box">🧭</div>
            <h3 className="pillar-title">8-Factor Compatibility</h3>
            <p className="pillar-body">
              Match with companions based on trekking pace, daily NPR budget, transport preference 
              (tourist bus, jeep, flight), accommodation style, and verified member trust.
            </p>
            <span className="pillar-link" onClick={() => onNavigate('matches')}>
              See Companion Matches →
            </span>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-box">🗺️</div>
            <h3 className="pillar-title">Day-by-Day Itinerary</h3>
            <p className="pillar-body">
              Collaborate on daily trekking stages, arrival points in Pokhara, teahouse stops, and rest days. 
              The group workspace keeps everyone aligned on the route.
            </p>
            <span className="pillar-link" onClick={() => onNavigate('explore')}>
              Explore Trip Itineraries →
            </span>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-box">⚖️</div>
            <h3 className="pillar-title">NPR Expense Settlement</h3>
            <p className="pillar-body">
              Log shared jeep rentals, permits, and food. The platform automatically calculates exact 
              per-member balances in NPR with deterministic split rules so nobody overpays.
            </p>
            <span className="pillar-link" onClick={() => onNavigate('explore')}>
              View Expense Tracker →
            </span>
          </div>
        </div>

        {/* Banner CTA Section */}
        <div className="curated-banner-cta">
          <div className="cta-banner-content">
            <span className="cta-badge">Planning your next Nepal journey?</span>
            <h3>Connect with fellow travelers heading your way</h3>
            <p>Create a trip in 2 minutes, set your budget in NPR, and let compatible travelers find you.</p>
          </div>
          <div className="cta-banner-actions">
            <button className="btn btn-primary btn-lg" onClick={() => onNavigate('explore')}>
              Explore Nepal Trips
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => onNavigate('register')}>
              Create Free Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
