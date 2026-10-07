import React, { useState } from 'react';
import { reviewApi } from '../../services/reviewApi';

export default function ReviewModal({ isOpen, onClose, tripId, memberToReview, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !memberToReview) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!comment.trim()) {
      setError('Please provide feedback on how they were as a travel companion.');
      return;
    }

    setSubmitting(true);
    try {
      await reviewApi.submitReview({
        trip: tripId,
        reviewed_user: memberToReview.user_id || memberToReview.id,
        rating,
        comment: comment.trim(),
      });
      if (onReviewSubmitted) onReviewSubmitted();
      onClose();
    } catch (err) {
      setError(err.message || 'Could not submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', width: '92%' }}>
        <div className="modal-header">
          <div>
            <h3>Review Travel Companion</h3>
            <p className="text-muted text-xs">Share verified feedback about traveling with <strong>{memberToReview.user || memberToReview.username}</strong></p>
          </div>
          <button className="btn-icon-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert-banner-error mb-3">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Rating</label>
            <div className="star-rating-selector" style={{ display: 'flex', gap: '0.5rem', fontSize: '1.8rem', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{ color: star <= rating ? '#f59e0b' : '#d1d5db', transition: 'transform 0.1s' }}
                >
                  ★
                </span>
              ))}
              <span style={{ fontSize: '1rem', alignSelf: 'center', fontWeight: 'bold', marginLeft: '0.5rem', color: 'var(--text-heading)' }}>
                {rating} of 5 Stars
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Companion Review & Feedback</label>
            <textarea
              className="form-input"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Was this person punctual, helpful, cooperative on trails, or respectful of local traditions?"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
              {submitting ? 'Submitting Review...' : 'Publish Verified Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
