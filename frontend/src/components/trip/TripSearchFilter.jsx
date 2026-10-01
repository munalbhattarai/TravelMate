import React from 'react';

export default function TripSearchFilter({ filters, onChange, onSearch }) {
  return (
    <div className="search-filter-bar glass-panel">
      <div className="filter-input-group">
        <label className="filter-label">Search Query</label>
        <input
          type="text"
          className="form-input"
          placeholder="Keywords, country, or title..."
          value={filters.query || ''}
          onChange={(e) => onChange('query', e.target.value)}
        />
      </div>

      <div className="filter-input-group">
        <label className="filter-label">Travel Style</label>
        <select
          className="form-select"
          value={filters.travel_style || ''}
          onChange={(e) => onChange('travel_style', e.target.value)}
        >
          <option value="">All Styles</option>
          <option value="adventure">Adventure</option>
          <option value="cultural">Cultural</option>
          <option value="nature">Nature / Trekking</option>
          <option value="relaxation">Relaxation</option>
        </select>
      </div>

      <div className="filter-input-group">
        <label className="filter-label">Status</label>
        <select
          className="form-select"
          value={filters.status || ''}
          onChange={(e) => onChange('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="full">Full</option>
          <option value="in_progress">In Progress</option>
        </select>
      </div>

      <button className="btn btn-primary filter-search-btn" onClick={onSearch}>
        Search Trips
      </button>
    </div>
  );
}
