import React from 'react';
import CustomSelect from '../ui/CustomSelect';

const STYLE_OPTIONS = [
  { value: '', label: 'All Travel Styles' },
  { value: 'adventure', label: 'Adventure & Trekking' },
  { value: 'cultural', label: 'Cultural & Heritage' },
  { value: 'nature', label: 'Nature / Trekking' },
  { value: 'relaxation', label: 'Lakeside & Relaxation' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Open (Accepting Members)' },
  { value: 'full', label: 'Full (Capacity Reached)' },
  { value: 'in_progress', label: 'Ongoing / In Progress' },
];

export default function TripSearchFilter({ filters, onChange, onSearch }) {
  return (
    <div className="trip-filter-toolbar">
      <div className="filter-toolbar-inner">
        <div className="filter-field-box search-box">
          <label className="filter-field-label">Destination / Keyword</label>
          <div className="filter-input-wrap">
            <span className="filter-field-icon">🔍</span>
            <input
              type="text"
              className="clean-filter-input"
              placeholder="e.g. Pokhara, Annapurna, Everest, Mustang..."
              value={filters.query || ''}
              onChange={(e) => onChange('query', e.target.value)}
            />
          </div>
        </div>

        <div className="filter-field-box">
          <label className="filter-field-label">Travel Style</label>
          <CustomSelect
            value={filters.travel_style || ''}
            options={STYLE_OPTIONS}
            onChange={(val) => onChange('travel_style', val)}
            placeholder="All Styles"
            icon="🎒"
          />
        </div>

        <div className="filter-field-box">
          <label className="filter-field-label">Trip Status</label>
          <CustomSelect
            value={filters.status || ''}
            options={STATUS_OPTIONS}
            onChange={(val) => onChange('status', val)}
            placeholder="All Statuses"
            icon="🏷️"
          />
        </div>

        <div className="filter-action-box">
          <button className="btn-filter-submit" onClick={onSearch}>
            Filter Trips
          </button>
        </div>
      </div>
    </div>
  );
}
