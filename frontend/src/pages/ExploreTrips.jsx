import React, { useState, useEffect, useCallback } from 'react';
import { tripApi } from '../services/tripApi';
import { useAuth } from '../hooks/useAuth';
import TripCard from '../components/trip/TripCard';
import TripSearchFilter from '../components/trip/TripSearchFilter';
import CreateTripModal from '../components/trip/CreateTripModal';
import NepalTripMap from '../components/map/NepalTripMap';

const QUICK_CATEGORIES = [
  { id: 'all', label: 'All Expeditions', icon: '🧭' },
  { id: 'mountain', label: 'High Mountain Treks', icon: '🏔️', query: 'Annapurna' },
  { id: 'lakes', label: 'Lakes & Valleys', icon: '🚣', query: 'Pokhara' },
  { id: 'cultural', label: 'Cultural Heritage', icon: '🛕', travel_style: 'cultural' },
  { id: 'nature', label: 'Wilderness & Nature', icon: '🌲', travel_style: 'nature' },
  { id: 'relaxation', label: 'Lakeside Leisure', icon: '🌅', travel_style: 'relaxation' },
];

export default function ExploreTrips({ onSelectTrip }) {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [activeCategory, setActiveCategory] = useState('all');
  const [filters, setFilters] = useState({ query: '', travel_style: '', status: 'open' });

  const loadTrips = useCallback(async (customFilters = filters) => {
    setLoading(true);
    try {
      const res = await tripApi.getTrips(customFilters);
      setTrips(res.results || res || []);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const handleFilterChange = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
    setActiveCategory('custom');
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat.id);
    if (cat.id === 'all') {
      const reset = { query: '', travel_style: '', status: 'open' };
      setFilters(reset);
      loadTrips(reset);
    } else if (cat.query) {
      const updated = { query: cat.query, travel_style: '', status: 'open' };
      setFilters(updated);
      loadTrips(updated);
    } else if (cat.travel_style) {
      const updated = { query: '', travel_style: cat.travel_style, status: 'open' };
      setFilters(updated);
      loadTrips(updated);
    }
  };

  const handleClearFilters = () => {
    const reset = { query: '', travel_style: '', status: 'open' };
    setActiveCategory('all');
    setFilters(reset);
    loadTrips(reset);
  };

  return (
    <div className="explore-page-container">
      {/* Editorial Header Section */}
      <div className="explore-hero-masthead">
        <div className="explore-hero-left">
          <div className="explore-eyebrow-tag">
            <span>🇳🇵</span> HIMALAYAN EXPEDITION DISCOVERY
          </div>
          <h1 className="explore-main-title">Find Your Next Himalayan Expedition</h1>
          <p className="explore-main-subtitle">
            Connect with verified trekking companions across Pokhara, Annapurna, Everest Base Camp, and remote sacred valleys.
          </p>
        </div>

        <div className="explore-hero-actions">
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

          <button className="btn-create-expedition" onClick={() => setIsCreateOpen(true)}>
            + Host Expedition
          </button>
        </div>
      </div>

      {/* Quick Category Filter Pills */}
      <div className="quick-categories-scroll">
        <div className="quick-categories-track">
          {QUICK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`quick-category-pill ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-text">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Unified Search & Discovery Toolbar */}
      <TripSearchFilter
        filters={filters}
        onChange={handleFilterChange}
        onSearch={() => loadTrips()}
        onClear={handleClearFilters}
      />

      {/* Results Header Meta */}
      <div className="explore-results-meta">
        <div className="results-count-text">
          <span>Showing <strong>{trips.length}</strong> active expeditions across Nepal</span>
          {filters.query && <span className="query-pill-tag">Keyword: "{filters.query}"</span>}
          {filters.travel_style && <span className="query-pill-tag">Style: {filters.travel_style}</span>}
        </div>
        {viewMode === 'map' && (
          <span className="map-hint-pill">📍 Click map markers to inspect expedition waypoints</span>
        )}
      </div>

      {/* Main View Area */}
      {loading ? (
        <div className="explore-loading-state">
          <div className="explore-spinner"></div>
          <p>Scouting Himalayan expeditions...</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="explore-empty-state-card">
          <div className="empty-state-icon">🏔️</div>
          <h3>No Expeditions Match Your Criteria</h3>
          <p>
            We couldn't find any trips for this search. Try resetting your search filters or be the first to host this journey!
          </p>
          <div className="empty-state-btn-row">
            <button className="btn-secondary" onClick={handleClearFilters}>
              Reset All Filters
            </button>
            <button className="btn-create-expedition" onClick={() => setIsCreateOpen(true)}>
              + Host This Trip
            </button>
          </div>
        </div>
      ) : viewMode === 'map' ? (
        <div className="explore-map-container surface-card p-4">
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: '0.95rem' }}>
              📍 Visualizing {trips.length} active routes on topographic satellite map
            </span>
            <span className="text-muted text-xs">Interactive Leaflet Elevation Layer</span>
          </div>
          <NepalTripMap trips={trips} onSelectTrip={onSelectTrip} height="620px" />
        </div>
      ) : (
        <div className="trips-grid">
          {trips.map((t) => (
            <TripCard key={t.id} trip={t} onSelect={onSelectTrip} />
          ))}
        </div>
      )}

      {/* Create Trip Modal */}
      <CreateTripModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onTripCreated={(newTrip) => {
          loadTrips();
          if (newTrip && newTrip.id) onSelectTrip(newTrip.id);
        }}
      />
    </div>
  );
}
