import React from 'react';
import { getDestinationImage, calculateDurationDays, getDifficulty } from '../../utils/destinationImages';

const STYLE_ICONS = {
  adventure: '🎒 Adventure',
  cultural: '🛕 Cultural',
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
    open: 'badge-open',
    full: 'badge-full',
    in_progress: 'badge-progress',
    completed: 'badge-completed',
    cancelled: 'badge-cancelled',
    draft: 'badge-draft',
  };

  const coverImg = getDestinationImage(trip.destination_name, trip.title);
  const duration = calculateDurationDays(trip.start_date, trip.end_date);
  const difficulty = getDifficulty(trip);

  const formattedBudget = trip.budget
    ? `NPR ${Number(trip.budget).toLocaleString()}`
    : trip.estimated_cost
    ? `NPR ${Number(trip.estimated_cost).toLocaleString()}`
    : 'Flexible';

  const maxMembers = trip.max_members || 4;
  const currentMembers = trip.current_members || trip.members_count || 1;
  const spotsLeft = Math.max(0, maxMembers - currentMembers);
  const fillPct = Math.min(100, Math.round((currentMembers / maxMembers) * 100));

  const creatorName = trip.creator_username || trip.creator?.username || 'trekker';

  return (
    <div className="trip-card" onClick={() => onSelect && onSelect(trip.id)}>
      {/* Visual Destination Media Header */}
      <div className="trip-card-cover">
        <img
          src={coverImg}
          alt={trip.title}
          className="trip-card-img"
          loading="lazy"
        />
        <div className="trip-card-img-scrim"></div>

        {/* Top Badges */}
        <div className="card-overlay-top">
          <span className={`status-pill-glass ${statusColors[trip.status] || 'badge-open'}`}>
            {trip.status === 'open' ? '🟢 Open' : trip.status === 'full' ? '🟡 Full' : trip.status === 'in_progress' ? '🔵 Ongoing' : trip.status?.toUpperCase()}
          </span>
          <span className="price-tag-glass">{formattedBudget}</span>
        </div>

        {/* Bottom Badges */}
        <div className="card-overlay-bottom">
          <span className={`diff-pill ${difficulty.className}`}>
            {difficulty.icon} {difficulty.label}
          </span>
          {duration && (
            <span className="duration-pill-glass">
              ⏱️ {duration}
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="trip-card-body">
        <h3 className="trip-title" title={trip.title}>
          {trip.title}
        </h3>
        
        <p className="trip-destination">
          <span className="dest-pin-icon">📍</span>
          <span>{trip.destination_name || 'Nepal Himalayan Circuit'}</span>
        </p>

        {/* Host Info Capsule */}
        <div className="trip-host-row">
          <span className="trip-host-avatar">
            {creatorName.charAt(0).toUpperCase()}
          </span>
          <div className="trip-host-meta">
            <span className="trip-host-name">@{creatorName}</span>
            <span className="trip-host-badge">✓ Verified Host</span>
          </div>
        </div>

        {/* Team Roster Progress Bar */}
        <div className="trip-roster-progress-box">
          <div className="roster-progress-header">
            <span className="roster-joined-text">
              👥 {currentMembers} of {maxMembers} joined
            </span>
            <span className={`roster-urgency-tag ${spotsLeft === 1 ? 'urgent' : spotsLeft === 0 ? 'full' : ''}`}>
              {spotsLeft === 0 ? 'Team Full' : spotsLeft === 1 ? '🔥 Only 1 spot left!' : `${spotsLeft} spots left`}
            </span>
          </div>
          <div className="roster-progress-track">
            <div
              className={`roster-progress-fill ${spotsLeft === 0 ? 'fill-full' : ''}`}
              style={{ width: `${fillPct}%` }}
            ></div>
          </div>
        </div>

        {/* Dates */}
        <div className="trip-dates-row">
          <span className="dates-label">🗓️ Dates:</span>
          <span className="dates-val">
            {trip.start_date || 'Flexible'} → {trip.end_date || 'Flexible'}
          </span>
        </div>

        {/* Travel Style & Amenities Chips */}
        <div className="trip-tags">
          {trip.travel_style && <span className="tag-chip">{formatStyle(trip.travel_style)}</span>}
          {trip.transport && <span className="tag-chip">🚌 {formatWord(trip.transport)}</span>}
          {trip.accommodation && <span className="tag-chip">🏡 {formatWord(trip.accommodation)}</span>}
        </div>

        {/* Primary CTA */}
        <button
          className="btn-view-trip-card"
          onClick={(e) => {
            e.stopPropagation();
            if (onSelect) onSelect(trip.id);
          }}
        >
          View Trip & Workspace →
        </button>
      </div>
    </div>
  );
}
