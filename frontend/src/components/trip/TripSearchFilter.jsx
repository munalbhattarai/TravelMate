import React from 'react';
import CustomSelect from '../ui/CustomSelect';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: '🟢 Open (Accepting Members)' },
  { value: 'full', label: '🟡 Full (Group Full)' },
  { value: 'in_progress', label: '🔵 Ongoing Trip' },
];

export default function TripSearchFilter({ filters, onChange, onSearch, onClear }) {
  const hasActiveFilters = Boolean(filters.query || (filters.status && filters.status !== 'open'));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="trip-filter-toolbar">
      <div className="filter-toolbar-inner">
        {/* Destination / Location Search */}
        <div className="filter-field-box search-box">
          <label className="filter-field-label">Destination or City</label>
          <div className="filter-input-wrap">
            <span className="filter-field-icon">🔍</span>
            <input
              type="text"
              className="clean-filter-input"
              placeholder="Where do you want to go? (e.g. Pokhara, Kathmandu, Chitwan...)"
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

        {/* Trip Status */}
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

        {/* Action Buttons */}
        <div className="filter-action-box">
          <button className="btn-filter-submit" onClick={onSearch}>
            Search Trips
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

