import React from 'react';

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
    <div className="trip-card" onClick={() => onSelect(trip.id)}>
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
        {trip.travel_style && <span className="tag-chip">{trip.travel_style}</span>}
        {trip.transport && <span className="tag-chip">🚌 {trip.transport}</span>}
        {trip.accommodation && <span className="tag-chip">🏡 {trip.accommodation}</span>}
      </div>

      <button className="btn btn-outline btn-block mt-3" onClick={(e) => { e.stopPropagation(); onSelect(trip.id); }}>
        View Trip & Workspace →
      </button>
    </div>
  );
}
