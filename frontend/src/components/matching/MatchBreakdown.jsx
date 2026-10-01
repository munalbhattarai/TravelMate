import React from 'react';

export default function MatchBreakdown({ breakdown }) {
  if (!breakdown) return null;

  const factors = [
    { label: 'Travel Style & Personality', key: 'travel_style', weight: '20%' },
    { label: 'Pace Compatibility', key: 'pace', weight: '15%' },
    { label: 'Budget Alignment', key: 'budget', weight: '15%' },
    { label: 'Accommodation Style', key: 'accommodation', weight: '10%' },
    { label: 'Preferred Transport', key: 'transport', weight: '10%' },
    { label: 'Language Overlap', key: 'languages', weight: '10%' },
    { label: 'Destination History', key: 'destinations', weight: '10%' },
    { label: 'Safety & Verification', key: 'verification', weight: '10%' },
  ];

  return (
    <div className="match-breakdown-card glass-panel">
      <h4 className="breakdown-title">8-Factor Compatibility Analysis</h4>
      <div className="breakdown-grid">
        {factors.map((f) => {
          const val = breakdown[f.key] !== undefined ? Math.round(breakdown[f.key] * 100) : 75;
          return (
            <div key={f.key} className="breakdown-factor">
              <div className="factor-header">
                <span className="factor-name">{f.label}</span>
                <span className="factor-val">{val}%</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${val}%`, backgroundColor: val >= 75 ? '#10b981' : val >= 50 ? '#0d9488' : '#f59e0b' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
