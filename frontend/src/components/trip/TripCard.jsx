import React from 'react';

const STYLE_ICONS = {
  adventure: '🎒 Adventure',
  cultural: '🏛️ Cultural',
  nature: '🌲 Nature',
  relaxation: '🌅 Relaxation',
  trekking: '🥾 Trekking',
};

const formatStyle = (style) => {
  if (!style) return null;
  const key = style.toLowerCase();
  return STYLE_ICONS[key] || `🎒 ${style.charAt(0).toUpperCase() + style.slice(1)}`;
};

const formatWord = (word) => {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).replace(/_/g, ' ');
};

export default function TripCard({ trip, onSelect }) {
  const statusColors = {
    open: 'badge-success',
    full: 'badge-warning',
    in_progress: 'badge-primary',
    completed: 'badge-secondary',
    cancelled: 'badge-danger',
    draft: 'badge-secondary',
  };

  const formattedBudget = trip.budget
    ? `NPR ${Number(trip.budget).toLocaleString()}`
    : 'Flexible';

  return (
    <div className="trip-card" onClick={() => onSelect && onSelect(trip.id)}>
      <div className="trip-card-header">
        <span className={`status-badge ${statusColors[trip.status] || ''}`}>
          {trip.status?.toUpperCase()}
        </span>
        <span className="trip-budget-tag">{formattedBudget}</span>
      </div>

      <h3 className="trip-title">{trip.title}</h3>
      <p className="trip-destination">📍 {trip.destination_name || 'Nepal'}</p>

      <div className="trip-meta-row">
        <span>📅 {trip.start_date} → {trip.end_date}</span>
        <span>👥 {trip.current_members || 1} / {trip.max_members} travelers</span>
      </div>

      <div className="trip-tags">
        {trip.travel_style && <span className="tag-chip">{formatStyle(trip.travel_style)}</span>}
        {trip.transport && <span className="tag-chip">🚌 {formatWord(trip.transport)}</span>}
        {trip.accommodation && <span className="tag-chip">🏡 {formatWord(trip.accommodation)}</span>}
      </div>

      <button className="btn btn-outline btn-block mt-3" onClick={(e) => { e.stopPropagation(); onSelect && onSelect(trip.id); }}>
        View Trip & Workspace →
      </button>
    </div>
  );
}
