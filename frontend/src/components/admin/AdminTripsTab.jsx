import React, { useState } from 'react';

export default function AdminTripsTab({ trips, onUpdateTrip, onSelectTrip, loading }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const filtered = (trips || []).filter((t) => {
    const matchesSearch =
      (t.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.destination_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.creator_username || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusOverride = async (tripId, newStatus) => {
    setActionLoadingId(tripId);
    try {
      await onUpdateTrip(tripId, { status: newStatus });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="admin-tab-pane">
      <div className="admin-pane-header">
        <div>
          <h2>🏔️ Expedition & Trek Oversight Console</h2>
          <p className="admin-pane-sub">
            Monitor all community itineraries, team rosters, and override expedition lifecycle states.
          </p>
        </div>
        <div className="admin-filter-bar">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search trek name, route, creator..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses ({trips?.length || 0})</option>
            <option value="open">Open for Join</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="admin-table-container">
        {loading && (!trips || trips.length === 0) ? (
          <div className="admin-loading-state">
            <div className="admin-spinner"></div>
            <p>Fetching platform expeditions...</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Trek Title & Destination</th>
                <th>Organizer</th>
                <th>Schedule</th>
                <th>Roster / Capacity</th>
                <th>Budget (NPR)</th>
                <th>Lifecycle Status</th>
                <th>Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div className="trip-cell-title-block">
                        <span className="trip-cell-title">{t.title}</span>
                        <span className="trip-cell-destination">📍 {t.destination_name || 'Nepal Trek'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="creator-cell-pill">@{t.creator_username || 'organizer'}</span>
                    </td>
                    <td>
                      <div className="date-cell-sub">
                        <span>{t.start_date ? new Date(t.start_date).toLocaleDateString() : 'TBD'}</span>
                        <span className="to-arrow">→</span>
                        <span>{t.end_date ? new Date(t.end_date).toLocaleDateString() : 'TBD'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="roster-badge">
                        👥 {t.members_count || 1} / {t.max_members || 8}
                      </span>
                    </td>
                    <td>
                      <span className="budget-text">
                        {t.currency || 'NPR'} {Number(t.estimated_cost || 0).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <select
                        className={`trip-status-select-pill status-pill-${t.status}`}
                        value={t.status || 'open'}
                        disabled={actionLoadingId === t.id}
                        onChange={(e) => handleStatusOverride(t.id, e.target.value)}
                      >
                        <option value="open">🟢 Open</option>
                        <option value="full">🟡 Full</option>
                        <option value="in_progress">🔵 In Progress</option>
                        <option value="completed">🏁 Completed</option>
                        <option value="cancelled">🔴 Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="admin-action-btn neutral"
                        onClick={() => onSelectTrip(t.id)}
                        title="Inspect full expedition workspace"
                      >
                        Workspace ↗
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-table-cell">
                    No expeditions match filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
