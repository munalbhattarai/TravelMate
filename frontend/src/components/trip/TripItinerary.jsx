import React, { useState } from 'react';
import { tripApi } from '../../services/tripApi';

export default function TripItinerary({ itineraries, tripId, isCreator, onRefresh }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dayNumber, setDayNumber] = useState((itineraries?.length || 0) + 1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activities, setActivities] = useState('');
  const [accommodation, setAccommodation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAddDay = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a title for this day.');
      return;
    }

    setSubmitting(true);
    try {
      await tripApi.addItineraryDay(tripId, {
        day_number: parseInt(dayNumber, 10),
        title: title.trim(),
        description: description.trim(),
        activities: activities ? activities.split(',').map(s => s.trim()) : [],
        accommodation: accommodation.trim(),
      });
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setActivities('');
      setAccommodation('');
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err.message || 'Failed to add itinerary day.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="trip-itinerary-container">
      <div className="itinerary-header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.35rem', color: 'var(--text-heading)', margin: 0 }}>📅 Expedition Timeline</h3>
          <p className="text-muted text-xs" style={{ marginTop: '0.2rem' }}>Day-by-day route, trail milestones, and planned teahouse stays</p>
        </div>
        {tripId && (
          <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>
            + Add Day Plan
          </button>
        )}
      </div>

      {(!itineraries || itineraries.length === 0) ? (
        <div className="itinerary-empty glass-panel p-8 text-center text-muted" style={{ borderRadius: '16px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏔️</div>
          <p>No day-by-day activities scheduled yet.</p>
          <span className="text-xs">Trip members and hosts can add daily plans using the button above.</span>
        </div>
      ) : (
        <div className="trip-itinerary-timeline">
          {itineraries.map((day) => (
            <div key={day.id || day.day_number} className="timeline-day glass-panel" style={{ marginBottom: '1.25rem', padding: '1.25rem', borderRadius: '16px', border: '1px solid #ebe5dc', background: '#faf8f5' }}>
              <div className="day-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span className="day-badge" style={{ background: 'var(--primary)', color: '#fff', padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  Day {day.day_number}
                </span>
                <h4 className="day-title" style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-heading)' }}>{day.title}</h4>
              </div>
              {day.description && <p className="day-description text-sm" style={{ color: '#4b5563', lineHeight: 1.5, margin: '0.4rem 0' }}>{day.description}</p>}
              
              {day.accommodation && (
                <div className="day-stay text-xs" style={{ color: '#065f46', marginTop: '0.4rem' }}>
                  🏡 Overnight: <strong>{day.accommodation}</strong>
                </div>
              )}

              {Array.isArray(day.activities) && day.activities.length > 0 && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {day.activities.map((act, idx) => (
                    <span key={idx} style={{ background: '#ede6da', color: '#4a3b2c', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '8px' }}>
                      {act}
                    </span>
                  ))}
                </div>
              )}

              {day.items && day.items.length > 0 && (
                <div className="day-activities-list" style={{ marginTop: '0.75rem' }}>
                  {day.items.map((item) => (
                    <div key={item.id} className="activity-card" style={{ background: '#fff', padding: '0.65rem', borderRadius: '10px', marginTop: '0.35rem', border: '1px solid #e5dcce' }}>
                      <span className="activity-time text-xs" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{item.time || 'All Day'}</span>
                      <div className="activity-details">
                        <strong className="text-sm">{item.title}</strong>
                        {item.location_name && <span className="activity-loc text-xs text-muted block">📍 {item.location_name}</span>}
                        {item.description && <p className="text-xs text-muted mt-1">{item.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Day Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', width: '92%' }}>
            <div className="modal-header">
              <h3>Add Day to Itinerary</h3>
              <button className="btn-icon-close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            {error && <div className="alert-banner-error mb-3">⚠️ {error}</div>}

            <form onSubmit={handleAddDay}>
              <div className="form-group">
                <label className="form-label">Day Number</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={dayNumber}
                  onChange={(e) => setDayNumber(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Day Title / Route Milestone</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Trek from Nayapul to Tikhedhunga"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Planned Accommodation / Teahouse</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Chandra Teahouse, Tikhedhunga"
                  value={accommodation}
                  onChange={(e) => setAccommodation(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Activities (Comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. suspension bridges, stone staircases, photography"
                  value={activities}
                  onChange={(e) => setActivities(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes & Details</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Altitude, expected hiking hours, water refill stops..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                  {submitting ? 'Saving Day...' : 'Add Itinerary Day'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
