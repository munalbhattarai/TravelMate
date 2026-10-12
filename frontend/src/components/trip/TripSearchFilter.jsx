import React from 'react';
import CustomSelect from '../ui/CustomSelect';

const STYLE_OPTIONS = [
  { value: '', label: 'All Travel Styles' },
  { value: 'adventure', label: '🎒 Adventure & Trekking' },
  { value: 'cultural', label: '🛕 Cultural & Heritage' },
  { value: 'nature', label: '🌲 Alpine Nature' },
  { value: 'relaxation', label: '🌅 Lakeside & Scenic' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: '🟢 Open (Accepting Members)' },
  { value: 'full', label: '🟡 Full (Capacity Reached)' },
  { value: 'in_progress', label: '🔵 Ongoing Expedition' },
];

export default function TripSearchFilter({ filters, onChange, onSearch, onClear }) {
  const hasActiveFilters = Boolean(filters.query || filters.travel_style || (filters.status && filters.status !== 'open'));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="trip-filter-toolbar">
      <div className="filter-toolbar-inner">
        {/* Destination / Route Search */}
        <div className="filter-field-box search-box">
          <label className="filter-field-label">Destination or Trek Route</label>
          <div className="filter-input-wrap">
            <span className="filter-field-icon">🔍</span>
            <input
              type="text"
              className="clean-filter-input"
              placeholder="Where in Nepal? (e.g. Pokhara, Annapurna, Everest, Mustang...)"
              value={filters.query || ''}
              onChange={(e) => onChange('query', e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {filters.query && (
              <button
                type="button"
                className="filter-clear-sub"
                onClick={() => onChange('query', '')}
                title="Clear query"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Travel Style */}
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

        {/* Trip Status */}
        <div className="filter-field-box">
          <label className="filter-field-label">Expedition Status</label>
          <CustomSelect
            value={filters.status || ''}
            options={STATUS_OPTIONS}
            onChange={(val) => onChange('status', val)}
            placeholder="All Statuses"
            icon="🏷️"
          />
        </div>

        {/* Action Buttons */}
        <div className="filter-action-box">
          <button className="btn-filter-submit" onClick={onSearch}>
            Filter Expeditions
          </button>
          {hasActiveFilters && onClear && (
            <button className="btn-filter-clear" onClick={onClear} title="Reset all filters">
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
