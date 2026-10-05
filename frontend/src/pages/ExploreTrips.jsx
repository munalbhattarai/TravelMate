import React, { useState, useEffect } from 'react';
import { tripApi } from '../services/tripApi';
import { useAuth } from '../hooks/useAuth';
import TripCard from '../components/trip/TripCard';
import TripSearchFilter from '../components/trip/TripSearchFilter';
import CreateTripModal from '../components/trip/CreateTripModal';
import NepalTripMap from '../components/map/NepalTripMap';

export default function ExploreTrips({ onSelectTrip }) {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
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
      <div className="explore-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Explore Nepal Trips & Treks</h2>
          <p>Browse trips organized by fellow travelers across Pokhara, Annapurna, Everest, and beyond</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="view-mode-toggle">
            <button
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              📋 Cards
            </button>
            <button
              className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
              title="Interactive Map View"
            >
              🗺️ Nepal Map
            </button>
          </div>

          {user && (
            <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
              + Create Trip
            </button>
          )}
        </div>
      </div>

      <CreateTripModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onTripCreated={(newTrip) => {
          loadTrips();
          if (newTrip && newTrip.id) onSelectTrip(newTrip.id);
        }}
      />

      <TripSearchFilter
        filters={filters}
        onChange={handleFilterChange}
        onSearch={loadTrips}
      />

      {loading ? (
        <div className="p-8 text-center text-muted">Loading Nepal trips...</div>
      ) : trips.length === 0 ? (
        <div className="surface-card p-8 text-center text-muted">No trips found matching your filter criteria.</div>
      ) : viewMode === 'map' ? (
        <div className="explore-map-container surface-card p-4">
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: '0.95rem' }}>
              📍 Showing {trips.length} active journeys across Nepal
            </span>
            <span className="text-muted text-xs">Click any marker pin to view trip details</span>
          </div>
          <NepalTripMap trips={trips} onSelectTrip={onSelectTrip} height="600px" />
        </div>
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
