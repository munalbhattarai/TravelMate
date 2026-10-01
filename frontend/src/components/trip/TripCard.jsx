import React from 'react';

export default function TripCard({ trip, onSelect }) {
  const statusColors = {
    open: 'badge-success',
    full: 'badge-warning',
    in_progress: 'badge-primary',
    completed: 'badge-muted',
    cancelled: 'badge-danger',
    draft: 'badge-secondary',
  };

  return (
    <div className="trip-card glass-panel" onClick={() => onSelect(trip.id)}>
      <div className="trip-card-header">
        <span className={`status-badge ${statusColors[trip.status] || ''}`}>
          {trip.status?.toUpperCase()}
        </span>
        <span className="trip-budget-tag">${trip.budget}</span>
      </div>

      <h3 className="trip-title">{trip.title}</h3>
      <p className="trip-destination">📍 {trip.destination_name || 'Scenic Destination'}</p>

      <div className="trip-meta-row">
        <span>📅 {trip.start_date} → {trip.end_date}</span>
        <span>👥 Max {trip.max_members}</span>
      </div>

      {trip.travel_style && (
        <div className="trip-tags">
          <span className="tag-chip">{trip.travel_style}</span>
          {trip.accommodation && <span className="tag-chip">{trip.accommodation}</span>}
        </div>
      )}

      <button className="btn btn-outline btn-block mt-3" onClick={(e) => { e.stopPropagation(); onSelect(trip.id); }}>
        View Details & Workspace
      </button>
    </div>
  );
}
