import React, { useState, useEffect } from 'react';
import { tripApi } from '../services/tripApi';
import TripCard from '../components/trip/TripCard';
import TripSearchFilter from '../components/trip/TripSearchFilter';

export default function ExploreTrips({ onSelectTrip }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ query: '', travel_style: '', status: 'open' });

  const loadTrips = async () => {
    setLoading(true);
    try {
      const res = await tripApi.getTrips(filters);
      setTrips(res.results || res || []);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleFilterChange = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="explore-page-container">
      <div className="explore-header">
        <h2>Explore Available Trips</h2>
        <p>Browse trips organized by travelers and find your next adventure companion</p>
      </div>

      <TripSearchFilter
        filters={filters}
        onChange={handleFilterChange}
        onSearch={loadTrips}
      />

      {loading ? (
        <div className="p-8 text-center text-muted">Loading trips...</div>
      ) : trips.length === 0 ? (
        <div className="glass-panel p-8 text-center text-muted">No trips found matching criteria.</div>
      ) : (
        <div className="trips-grid">
          {trips.map((t) => (
            <TripCard key={t.id} trip={t} onSelect={onSelectTrip} />
          ))}
        </div>
      )}
    </div>
  );
}
