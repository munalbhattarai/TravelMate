import React from 'react';

const FACTORS = [
  { key: 'destination', label: 'Destination Alignment', weight: '25%', icon: '📍', desc: 'Preferred trekking & travel regions in Nepal' },
  { key: 'dates', label: 'Dates & Duration', weight: '20%', icon: '📅', desc: 'Trip duration vs available days' },
  { key: 'budget', label: 'Budget Alignment', weight: '15%', icon: '💰', desc: 'Trip budget vs traveler min-max budget' },
  { key: 'interests', label: 'Activities & Interests', weight: '15%', icon: '🎯', desc: 'Shared trekking, photo, and trail interests' },
  { key: 'travel_style', label: 'Travel Style Synergy', weight: '10%', icon: '🎒', desc: 'Adventure, cultural, or relaxation styles' },
  { key: 'transport', label: 'Transport Mode', weight: '5%', icon: '🚗', desc: 'Tourist Bus, 4x4 Jeep, or Flight fit' },
  { key: 'accommodation', label: 'Accommodation Style', weight: '5%', icon: '🏡', desc: 'Teahouse, hostel, or hotel fit' },
  { key: 'language', label: 'Language Overlap', weight: '5%', icon: '🗣️', desc: 'Common languages spoken' },
];

export default function MatchBreakdown({ breakdown, candidateName = 'Travel Companion', overallScore = null }) {
  if (!breakdown) {
    return (
      <div className="match-breakdown-card">
        <h4 className="breakdown-title">8-Factor Compatibility Analysis</h4>
        <p className="text-muted text-sm">No detailed factor metrics available for this companion.</p>
      </div>
    );
  }

  const scoreNum = overallScore !== null && overallScore !== undefined 
    ? (overallScore > 1 ? Math.round(overallScore) : Math.round(overallScore * 100))
    : null;

  return (
    <div className="match-breakdown-card">
      <div className="breakdown-modal-header">
        <div>
          <h3 className="breakdown-title">8-Factor Compatibility Analysis</h3>
          <p className="breakdown-subtitle">
            Algorithm breakdown for <strong>{candidateName}</strong>
          </p>
        </div>
        {scoreNum !== null && (
          <div className="breakdown-overall-badge">
            <span className="badge-icon">⚡</span>
            <span>{scoreNum}% Overall Match</span>
          </div>
        )}
      </div>

      <div className="breakdown-factors-list">
        {FACTORS.map((f) => {
          const raw = breakdown[f.key];
          let val = 0;
          if (raw !== undefined && raw !== null) {
            const num = typeof raw === 'number' ? raw : parseFloat(raw) || 0;
            // Normalize: if num is already on 0-100 scale (e.g. 100, 80, 40), clamp 0-100.
            // If fractional <= 1 (e.g. 0.85), scale by 100.
            val = num > 1 
              ? Math.max(0, Math.min(100, Math.round(num))) 
              : Math.max(0, Math.min(100, Math.round(num * 100)));
          }

          let barColor = '#94a3b8'; // gray for 0%
          if (val >= 75) barColor = '#059669'; // emerald
          else if (val >= 45) barColor = '#0d9488'; // teal
          else if (val > 0) barColor = '#d97706'; // amber

          return (
            <div key={f.key} className="breakdown-factor-row">
              <div className="factor-top-info">
                <div className="factor-title-box">
                  <span className="factor-icon">{f.icon}</span>
                  <div>
                    <span className="factor-name">{f.label}</span>
                    <span className="factor-weight-tag">{f.weight} Weight</span>
                  </div>
                </div>
                <span className="factor-score-val" style={{ color: barColor }}>
                  {val}%
                </span>
              </div>

              <div className="factor-progress-track">
                <div
                  className="factor-progress-fill"
                  style={{ 
                    width: `${val}%`, 
                    backgroundColor: barColor,
                    minWidth: val > 0 ? '4px' : '0px'
                  }}
                />
              </div>

              <div className="factor-subtext">{f.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
