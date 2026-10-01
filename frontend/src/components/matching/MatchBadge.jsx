import React from 'react';

export default function MatchBadge({ score }) {
  const percentage = Math.round(score * 100);
  let colorClass = 'badge-affinity-low';

  if (percentage >= 80) {
    colorClass = 'badge-affinity-high';
  } else if (percentage >= 60) {
    colorClass = 'badge-affinity-medium';
  }

  return (
    <div className={`match-badge-pill ${colorClass}`}>
      <span className="match-icon">⚡</span>
      <span className="match-score-text">{percentage}% Match</span>
    </div>
  );
}
