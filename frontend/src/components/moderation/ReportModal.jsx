import React, { useState } from 'react';
import { moderationApi } from '../../services/moderationApi';
import CustomSelect from '../ui/CustomSelect';

const REPORT_CATEGORIES = [
  { value: 'safety_concern', label: 'Safety Concern / Reckless Behavior' },
  { value: 'harassment', label: 'Harassment / Abusive Language' },
  { value: 'spam', label: 'Spam / Commercial Solicitation' },
  { value: 'fraud', label: 'Fraud / Financial Misrepresentation' },
  { value: 'fake_profile', label: 'Fake Profile / Misleading Identity' },
  { value: 'inappropriate_content', label: 'Inappropriate Content' },
  { value: 'other', label: 'Other Issue' },
];

export default function ReportModal({ isOpen, onClose, targetType = 'user', targetId, targetName = 'Entity' }) {
  const [category, setCategory] = useState('safety_concern');
  const [detail, setDetail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!detail.trim()) {
      setError('Please provide specific details explaining the issue.');
      return;
    }

    setSubmitting(true);
    try {
      await moderationApi.reportEntity({
        target_type: targetType,
        target_id: targetId,
        category,
        detail: detail.trim(),
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', width: '92%' }}>
        <div className="modal-header">
          <div>
            <h3>Report {targetType === 'trip' ? 'Trip' : 'Traveler'}</h3>
            <p className="text-muted text-xs">Help keep the TravelMate Nepal community safe and authentic</p>
          </div>
          <button className="btn-icon-close" onClick={onClose}>✕</button>
        </div>

        {success ? (
          <div className="p-6 text-center">
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛡️</div>
            <h4>Report Submitted</h4>
            <p className="text-muted text-sm mt-1">Thank you. Platform moderators will review this submission.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="alert-banner-error mb-3">⚠️ {error}</div>}

            <div className="form-group">
              <label className="form-label">Subject of Report</label>
              <div className="form-input" style={{ background: '#f3efe6', cursor: 'default' }}>
                {targetType === 'trip' ? '🏔️ Trip: ' : '👤 Traveler: '}
                <strong>{targetName}</strong>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <CustomSelect
                value={category}
                options={REPORT_CATEGORIES}
                onChange={(val) => setCategory(val)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description of Incident</label>
              <textarea
                className="form-input"
                rows={4}
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Describe what occurred, any safety hazards, or violations of community rules..."
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-danger btn-sm" disabled={submitting} style={{ background: '#dc2626', color: '#fff', border: 'none' }}>
                {submitting ? 'Submitting...' : 'Submit Report for Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
