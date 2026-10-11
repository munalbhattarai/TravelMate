import React, { useState } from 'react';

export default function AdminReportsTab({ reports, onUpdateReport, loading }) {
  const [filter, setFilter] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const filtered = (reports || []).filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const handleStatusChange = async (reportId, newStatus) => {
    setActionLoadingId(reportId);
    try {
      await onUpdateReport(reportId, { status: newStatus });
    } finally {
      setActionLoadingId(null);
    }
  };

  const getCategoryBadgeClass = (cat) => {
    switch (cat) {
      case 'safety_concern':
        return 'cat-safety';
      case 'harassment':
        return 'cat-harassment';
      case 'fraud':
        return 'cat-fraud';
      case 'spam':
        return 'cat-spam';
      default:
        return 'cat-other';
    }
  };

  return (
    <div className="admin-tab-pane">
      <div className="admin-pane-header">
        <div>
          <h2>🚨 Safety Incident & Moderation Triage Queue</h2>
          <p className="admin-pane-sub">
            Review reported violations, harassment flags, trail safety deviations, and scam alerts.
          </p>
        </div>
        <div className="admin-filter-bar">
          <select
            className="admin-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Incidents ({reports?.length || 0})</option>
            <option value="pending">Pending Triage</option>
            <option value="investigating">Under Active Investigation</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Dismissed / Rejected</option>
          </select>
        </div>
      </div>

      <div className="admin-reports-stream">
        {loading && (!reports || reports.length === 0) ? (
          <div className="admin-loading-state">
            <div className="admin-spinner"></div>
            <p>Fetching incident reports...</p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((item) => (
            <div key={item.id} className={`admin-report-card status-accent-${item.status}`}>
              <div className="report-card-top">
                <div className="report-category-group">
                  <span className={`report-cat-tag ${getCategoryBadgeClass(item.category)}`}>
                    {(item.category || 'general').replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="report-target-pill">
                    Target: {item.target_type?.toUpperCase()} #{item.target_id}
                  </span>
                </div>
                <span className={`admin-status-badge badge-${item.status}`}>
                  {item.status.toUpperCase()}
                </span>
              </div>

              <div className="report-card-content">
                <p className="report-detail-text">"{item.detail}"</p>
              </div>

              <div className="report-card-meta">
                <span>Filed by: <strong>@{item.reporter_username || 'anonymous'}</strong></span>
                <span>Logged: {item.created_at ? new Date(item.created_at).toLocaleString() : 'Recent'}</span>
                {item.resolved_at && (
                  <span className="resolved-note">Resolved: {new Date(item.resolved_at).toLocaleDateString()}</span>
                )}
              </div>

              <div className="report-card-actions">
                {item.status !== 'investigating' && item.status !== 'resolved' && (
                  <button
                    className="admin-action-btn warn"
                    disabled={actionLoadingId === item.id}
                    onClick={() => handleStatusChange(item.id, 'investigating')}
                  >
                    🔍 Investigate
                  </button>
                )}
                {item.status !== 'resolved' && (
                  <button
                    className="admin-action-btn success"
                    disabled={actionLoadingId === item.id}
                    onClick={() => handleStatusChange(item.id, 'resolved')}
                  >
                    ✓ Resolve Incident
                  </button>
                )}
                {item.status !== 'rejected' && (
                  <button
                    className="admin-action-btn neutral"
                    disabled={actionLoadingId === item.id}
                    onClick={() => handleStatusChange(item.id, 'rejected')}
                  >
                    Dismiss Flag
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-quiet-box">
            <p>No safety or moderation incident reports match "{filter}".</p>
          </div>
        )}
      </div>
    </div>
  );
}
