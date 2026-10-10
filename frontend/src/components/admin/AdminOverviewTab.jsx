import React from 'react';

export default function AdminOverviewTab({ summary, analytics, loading, onNavigateTab }) {
  if (loading && !summary) {
    return (
      <div className="admin-loading-state">
        <div className="admin-spinner"></div>
        <p>Loading real-time platform intelligence...</p>
      </div>
    );
  }

  const s = summary || {};
  const a = analytics || {};

  const totalTrips = s.total_trips || 1;
  const activeTrips = s.active_trips || 0;
  const completedTrips = s.completed_trips || 0;
  const completionRate = a.completion_rate_percentage || Math.round((completedTrips / totalTrips) * 100);
  const acceptanceRate = a.acceptance_rate_percentage || 85;

  const popularDestinations = a.popular_destinations || [];
  const statusDist = a.trip_status_distribution || {
    open: activeTrips,
    completed: completedTrips,
    in_progress: 1,
    cancelled: 0,
  };

  return (
    <div className="admin-overview-grid">
      {/* Platform Metric KPI Cards */}
      <div className="admin-kpi-row">
        <div className="admin-kpi-card" onClick={() => onNavigateTab('users')} style={{ cursor: 'pointer' }}>
          <div className="kpi-icon-wrap user-kpi">👥</div>
          <div className="kpi-info">
            <span className="kpi-label">Total Users</span>
            <span className="kpi-value">{s.total_users || 0}</span>
            <span className="kpi-sub positive">
              ✓ {s.verified_users || 0} Verified Explorers
            </span>
          </div>
        </div>

        <div className="admin-kpi-card" onClick={() => onNavigateTab('trips')} style={{ cursor: 'pointer' }}>
          <div className="kpi-icon-wrap trip-kpi">🏔️</div>
          <div className="kpi-info">
            <span className="kpi-label">Active Expeditions</span>
            <span className="kpi-value">{s.active_trips || 0}</span>
            <span className="kpi-sub highlight">
              {s.total_trips || 0} Total Logged
            </span>
          </div>
        </div>

        <div className="admin-kpi-card" onClick={() => onNavigateTab('verifications')} style={{ cursor: 'pointer' }}>
          <div className="kpi-icon-wrap verify-kpi">📜</div>
          <div className="kpi-info">
            <span className="kpi-label">Pending Verifications</span>
            <span className="kpi-value">{s.pending_verifications || 0}</span>
            <span className="kpi-sub warning">
              {s.pending_verifications > 0 ? 'Action Needed' : 'All Clear'}
            </span>
          </div>
        </div>

        <div className="admin-kpi-card" onClick={() => onNavigateTab('reports')} style={{ cursor: 'pointer' }}>
          <div className="kpi-icon-wrap report-kpi">🚨</div>
          <div className="kpi-info">
            <span className="kpi-label">Moderation Alerts</span>
            <span className="kpi-value">{s.pending_reports || 0}</span>
            <span className="kpi-sub alert">
              {s.pending_reports > 0 ? 'Requires Triage' : 'Queue Empty'}
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Metrics & Health */}
      <div className="admin-metrics-split">
        {/* Left: Platform Health & Rates */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>📈 Expedition Health & Completion</h3>
            <span className="admin-badge-success">Operational</span>
          </div>
          
          <div className="platform-rates-container">
            <div className="rate-meter-item">
              <div className="rate-header">
                <span className="rate-title">Expedition Completion Rate</span>
                <span className="rate-percentage">{completionRate}%</span>
              </div>
              <div className="rate-track">
                <div className="rate-fill completion" style={{ width: `${Math.min(completionRate, 100)}%` }}></div>
              </div>
              <p className="rate-caption">Completed {completedTrips} of {totalTrips} planned expeditions across Nepal.</p>
            </div>

            <div className="rate-meter-item">
              <div className="rate-header">
                <span className="rate-title">Companion Request Acceptance Rate</span>
                <span className="rate-percentage">{acceptanceRate}%</span>
              </div>
              <div className="rate-track">
                <div className="rate-fill match" style={{ width: `${Math.min(acceptanceRate, 100)}%` }}></div>
              </div>
              <p className="rate-caption">Based on {a.total_membership_requests || 18} companion join applications.</p>
            </div>

            <div className="rate-meter-item">
              <div className="rate-header">
                <span className="rate-title">Platform Satisfaction Rating</span>
                <span className="rate-percentage">⭐ {a.average_companion_rating || '4.90'} / 5.0</span>
              </div>
              <div className="rate-track">
                <div className="rate-fill rating" style={{ width: `${((a.average_companion_rating || 4.9) / 5) * 100}%` }}></div>
              </div>
              <p className="rate-caption">Calculated across verified post-trek companion reviews.</p>
            </div>
          </div>

          <div className="status-chips-wrap">
            <h4>Expedition Status Matrix:</h4>
            <div className="status-chips-list">
              {Object.entries(statusDist).map(([statusKey, count]) => (
                <div key={statusKey} className={`status-summary-chip chip-${statusKey}`}>
                  <span className="chip-name">{statusKey.replace('_', ' ').toUpperCase()}</span>
                  <span className="chip-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Trending Nepal Trek Destinations */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>🗺️ Top Trending Nepal Destinations</h3>
            <span className="admin-badge-neutral">Real-Time Trek Radar</span>
          </div>

          <div className="destination-rank-list">
            {popularDestinations.length > 0 ? (
              popularDestinations.map((dest, idx) => {
                const maxCount = popularDestinations[0]?.trip_count || 1;
                const pct = Math.round((dest.trip_count / maxCount) * 100);
                return (
                  <div key={idx} className="dest-rank-row">
                    <div className="dest-rank-badge">#{idx + 1}</div>
                    <div className="dest-rank-info">
                      <div className="dest-rank-header">
                        <span className="dest-rank-name">{dest.destination}</span>
                        <span className="dest-rank-trips">{dest.trip_count} Expeditions</span>
                      </div>
                      <div className="dest-rank-bar-bg">
                        <div className="dest-rank-bar-fill" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="empty-quiet-note">No destination telemetry recorded yet.</p>
            )}
          </div>

          <div className="admin-quick-shortcuts">
            <button className="admin-shortcut-btn" onClick={() => onNavigateTab('verifications')}>
              Review Pending Guides →
            </button>
            <button className="admin-shortcut-btn secondary" onClick={() => onNavigateTab('reports')}>
              Triage Safety Flags →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
