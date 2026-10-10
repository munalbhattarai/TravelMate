import React, { useState } from 'react';

export default function AdminVerificationsTab({ verifications, onUpdateVerification, loading }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeReviewId, setActiveReviewId] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = (verifications || []).filter((v) => {
    if (statusFilter === 'all') return true;
    return v.status === statusFilter;
  });

  const handleOpenReview = (item) => {
    setActiveReviewId(item.id);
    setReviewNotes(item.notes || '');
  };

  const handleDecision = async (id, status) => {
    setActionLoading(true);
    try {
      await onUpdateVerification(id, {
        status,
        notes: reviewNotes || (status === 'verified' ? 'Credentials verified by admin.' : 'Documentation insufficient.'),
      });
      setActiveReviewId(null);
      setReviewNotes('');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="admin-tab-pane">
      <div className="admin-pane-header">
        <div>
          <h2>📜 Guide & Trekker Verification Pipeline</h2>
          <p className="admin-pane-sub">
            Review submitted government trekking permits, NATHM guide licenses, and identity documents.
          </p>
        </div>
        <div className="admin-filter-bar">
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Submissions ({verifications?.length || 0})</option>
            <option value="pending">Pending Review</option>
            <option value="verified">Verified & Approved</option>
            <option value="rejected">Rejected / Incomplete</option>
          </select>
        </div>
      </div>

      <div className="admin-verification-cards-grid">
        {loading && (!verifications || verifications.length === 0) ? (
          <div className="admin-loading-state">
            <div className="admin-spinner"></div>
            <p>Fetching verification dossier...</p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((item) => (
            <div key={item.id} className={`admin-verify-card status-border-${item.status}`}>
              <div className="verify-card-header">
                <div className="verify-user-brief">
                  <span className="verify-avatar-dot">
                    {(item.username || 'U').charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <h4 className="verify-applicant-name">{item.display_name || item.username}</h4>
                    <span className="verify-applicant-email">{item.email}</span>
                  </div>
                </div>
                <span className={`admin-status-badge badge-${item.status}`}>
                  {item.status.toUpperCase()}
                </span>
              </div>

              <div className="verify-body">
                <div className="verify-field">
                  <span className="field-label">Submitted On:</span>
                  <span className="field-val">
                    {item.submitted_at ? new Date(item.submitted_at).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
                {item.reviewed_by && (
                  <div className="verify-field">
                    <span className="field-label">Reviewed By:</span>
                    <span className="field-val">@{item.reviewer_username || 'admin'}</span>
                  </div>
                )}
                <div className="verify-notes-box">
                  <span className="field-label">Applicant Details / Notes:</span>
                  <p className="verify-notes-text">
                    {item.notes || 'Official government license & identity documents submitted for audit.'}
                  </p>
                </div>
              </div>

              {activeReviewId === item.id ? (
                <div className="verify-action-drawer">
                  <textarea
                    className="admin-notes-textarea"
                    placeholder="Enter audit remarks, license number verified, or rejection reason..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={3}
                  />
                  <div className="verify-drawer-actions">
                    <button
                      className="admin-action-btn success"
                      disabled={actionLoading}
                      onClick={() => handleDecision(item.id, 'verified')}
                    >
                      ✓ Approve Verification
                    </button>
                    <button
                      className="admin-action-btn danger"
                      disabled={actionLoading}
                      onClick={() => handleDecision(item.id, 'rejected')}
                    >
                      ✕ Reject
                    </button>
                    <button
                      className="admin-action-btn neutral"
                      disabled={actionLoading}
                      onClick={() => setActiveReviewId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="verify-footer-actions">
                  <button
                    className="admin-review-toggle-btn"
                    onClick={() => handleOpenReview(item)}
                  >
                    {item.status === 'pending' ? 'Audit & Decide →' : 'Re-evaluate Status'}
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-quiet-box">
            <p>No verification requests match "{statusFilter}".</p>
          </div>
        )}
      </div>
    </div>
  );
}
