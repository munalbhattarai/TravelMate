import React, { useState } from 'react';

const EMERGENCY_CONTACTS = [
  {
    org: 'Nepal Tourist Police (National Hotline)',
    phone: '1144',
    alt: '+977-1-4247041',
    coverage: 'Nationwide (Kathmandu, Pokhara, Trek Checkpoints)',
    desc: 'Assistance for lost trekkers, permit disputes, and travel safety.',
    badge: '24/7 Hotline'
  },
  {
    org: 'Himalayan Rescue Association (HRA)',
    phone: '+977-1-4440292',
    alt: '+977-1-4440293',
    coverage: 'Everest (Pheriche) & Annapurna (Manang)',
    desc: 'Specialized high altitude medical clinics and medevac coordination.',
    badge: 'Altitude Specialist'
  },
  {
    org: 'Nepal Police Emergency Control',
    phone: '100',
    alt: '+977-1-4228435',
    coverage: 'Nationwide Police Dispatch',
    desc: 'Immediate law enforcement emergency response across Nepal.',
    badge: 'Toll-Free'
  },
  {
    org: 'Nepal Tourism Board (TIMS Counter)',
    phone: '+977-1-4256909',
    alt: 'tims@ntb.org.np',
    coverage: 'Bhrikutimandap, Kathmandu / Damside, Pokhara',
    desc: 'Permit verification, trail status alerts, and weather advisories.',
    badge: 'Official NTB'
  }
];

export default function SafetyCenterModal({ isOpen, onClose, onOpenReport }) {
  const [activeTab, setActiveTab] = useState('sos');

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content modal-lg safety-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="safety-modal-title-group">
            <span className="safety-shield-icon">🛡️</span>
            <div>
              <h3>Nepal Travel Safety & Emergency Directory</h3>
              <p className="text-muted text-sm">Verified emergency protocols, alpine safety, and traveler protection.</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Navigation Tabs */}
        <div className="safety-tabs-row">
          <button
            className={`safety-tab-btn ${activeTab === 'sos' ? 'active' : ''}`}
            onClick={() => setActiveTab('sos')}
          >
            🚨 Emergency Contacts
          </button>
          <button
            className={`safety-tab-btn ${activeTab === 'ams' ? 'active' : ''}`}
            onClick={() => setActiveTab('ams')}
          >
            🏔️ High Altitude / AMS
          </button>
          <button
            className={`safety-tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            🤝 Companion Trust Rules
          </button>
        </div>

        <div className="modal-body safety-modal-body">
          {/* Tab 1: Emergency SOS Directory */}
          {activeTab === 'sos' && (
            <div className="safety-sos-section">
              <div className="safety-alert-box mb-3">
                <strong>⚡ Save These Numbers Offline:</strong> Mobile reception is patchy in remote mountain valleys (Khumbu, Langtang, Upper Mustang). Note these contacts before starting your trek.
              </div>

              <div className="safety-contacts-grid">
                {EMERGENCY_CONTACTS.map((c, i) => (
                  <div key={i} className="safety-contact-card">
                    <div className="contact-card-top">
                      <h4>{c.org}</h4>
                      <span className="badge-sos">{c.badge}</span>
                    </div>
                    <p className="contact-desc">{c.desc}</p>
                    <div className="contact-meta">
                      <span>📍 Coverage: {c.coverage}</span>
                    </div>
                    <div className="contact-phone-row">
                      <a href={`tel:${c.phone}`} className="btn-call-link">
                        📞 Dial {c.phone}
                      </a>
                      {c.alt && <span className="text-muted text-xs">Alt: {c.alt}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: High Altitude Safety & AMS Guidelines */}
          {activeTab === 'ams' && (
            <div className="safety-ams-section">
              <div className="ams-golden-rules">
                <h4>🏔️ The 4 Golden Rules of High Altitude Sickness (AMS)</h4>
                <ol className="ams-rules-list">
                  <li>
                    <strong>Recognize Symptoms Early:</strong> Headache, nausea, dizziness, fatigue, or loss of appetite above 2,500m are AMS until proven otherwise.
                  </li>
                  <li>
                    <strong>Never Ascend with Symptoms:</strong> If you or your companion feel unwell, rest at the same altitude for at least 24 hours.
                  </li>
                  <li>
                    <strong>Descend Immediately if Worsening:</strong> If symptoms don't resolve or if signs of HAPE/HACE appear (confusion, ataxia, breathlessness at rest), descend 500m–1000m immediately. <em>Descent is the definitive cure.</em>
                  </li>
                  <li>
                    <strong>Stay Hydrated:</strong> Drink 3–4 liters of purified water daily. Avoid alcohol and sedatives above 3,000m.
                  </li>
                </ol>
              </div>

              <div className="ams-medication-tip mt-3">
                <strong>💊 Acetazolamide (Diamox):</strong> Used for acclimatization aid (125mg–250mg twice daily). Consult a medical physician before departure. Keep oral rehydration salts handy.
              </div>
            </div>
          )}

          {/* Tab 3: Companion Trust & Safety Rules */}
          {activeTab === 'rules' && (
            <div className="safety-rules-section">
              <div className="trust-guidelines-grid">
                <div className="trust-card">
                  <h5>👥 Meet in Public First</h5>
                  <p>Meet prospective companions in populated hubs (Lakeside Pokhara, Thamel Kathmandu) before remote mountain segments.</p>
                </div>
                <div className="trust-card">
                  <h5>📝 Share Your Itinerary</h5>
                  <p>Leave a copy of your planned route, daily teahouse targets, and companion contact names with family or hotel reception.</p>
                </div>
                <div className="trust-card">
                  <h5>💰 Fair Expense Transparency</h5>
                  <p>Log all shared expenses in the TravelMate workspace ledger so all members see equal split accountability.</p>
                </div>
                <div className="trust-card">
                  <h5>🛡️ Trust Your Instincts</h5>
                  <p>If a companion acts inappropriately or compromises trail safety, report them to TravelMate moderators immediately.</p>
                </div>
              </div>

              <div className="report-cta-box mt-4">
                <div>
                  <strong>Need to report a community safety concern?</strong>
                  <p className="text-muted text-xs mb-0">Help keep the Nepal trekking community safe and accountable.</p>
                </div>
                {onOpenReport && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      onClose();
                      onOpenReport();
                    }}
                  >
                    🛡️ Submit Moderation Report
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions safety-modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Close Safety Directory
          </button>
        </div>
      </div>
    </div>
  );
}
