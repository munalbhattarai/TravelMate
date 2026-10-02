import React from 'react';

export default function TripItinerary({ itineraries }) {
  if (!itineraries || itineraries.length === 0) {
    return (
      <div className="itinerary-empty glass-panel p-6 text-center text-muted">
        No day-by-day activities scheduled yet. The trip creator can add itinerary items.
      </div>
    );
  }

  return (
    <div className="trip-itinerary-timeline">
      {itineraries.map((day) => (
        <div key={day.id || day.day_number} className="timeline-day glass-panel">
          <div className="day-header">
            <span className="day-badge">Day {day.day_number}</span>
            <h4 className="day-title">{day.title}</h4>
          </div>
          {day.description && <p className="day-description">{day.description}</p>}
          {day.accommodation && (
            <div className="day-stay">🏨 Stay: <strong>{day.accommodation}</strong></div>
          )}

          {day.items && day.items.length > 0 && (
            <div className="day-activities-list">
              {day.items.map((item) => (
                <div key={item.id} className="activity-card">
                  <span className="activity-time">{item.time || 'All Day'}</span>
                  <div className="activity-details">
                    <strong>{item.title}</strong>
                    {item.location_name && <span className="activity-loc">📍 {item.location_name}</span>}
                    {item.description && <p>{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
