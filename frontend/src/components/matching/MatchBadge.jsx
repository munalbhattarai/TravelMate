import React from 'react';

export default function MatchBadge({ score }) {
  const num = typeof score === 'number' ? score : parseFloat(score) || 0;
  // If score is already on a 0-100 scale (e.g. 15, 30, 85, 94), clamp to 0-100.
  // If score is fractional <= 1 (e.g. 0.85), multiply by 100.
  const percentage = num > 1 
    ? Math.max(0, Math.min(100, Math.round(num))) 
    : Math.max(0, Math.min(100, Math.round(num * 100)));

  let colorClass = 'badge-affinity-low';
  if (percentage >= 75) {
    colorClass = 'badge-affinity-high';
  } else if (percentage >= 45) {
    colorClass = 'badge-affinity-medium';
  }

  return (
    <div className={`match-badge-pill ${colorClass}`}>
      <span className="match-icon">⚡</span>
      <span className="match-score-text">{percentage}% Match</span>
    </div>
  );
}
