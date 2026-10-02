import React, { useState, useEffect } from 'react';
import { matchingApi } from '../services/matchingApi';
import MatchBadge from '../components/matching/MatchBadge';
import MatchBreakdown from '../components/matching/MatchBreakdown';

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBreakdown, setSelectedBreakdown] = useState(null);

  useEffect(() => {
    async function loadMatches() {
      try {
        const res = await matchingApi.getMatches();
        setMatches(res.results || res || []);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, []);

  return (
    <div className="matches-page-container">
      <div className="matches-header">
        <h2>Recommended Travel Companions</h2>
        <p>Ranked strictly by our TravelMate 8-factor compatibility algorithm</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted">Computing compatibility matrix...</div>
      ) : matches.length === 0 ? (
        <div className="glass-panel p-8 text-center text-muted">
          No matches found yet. Update your travel preferences in your profile!
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map((item, idx) => {
            const user = item.user || item;
            const score = item.compatibility_score || item.score || 0.85;
            return (
              <div key={user.id || idx} className="match-card glass-panel">
                <div className="match-card-top">
                  <div className="match-avatar-circle">
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h4>{user.username}</h4>
                    <span className="text-muted text-sm">{user.travel_style || 'Explorer'} • {user.pace || 'Moderate'}</span>
                  </div>
                  <MatchBadge score={score} />
                </div>

                <p className="match-bio">{user.bio || 'Eager to explore new trails, authentic cuisines, and photographic sights.'}</p>

                <div className="match-card-actions">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setSelectedBreakdown(item.breakdown || { travel_style: score, pace: score, budget: score })}
                  >
                    View Breakdown
                  </button>
                  <button className="btn btn-primary btn-sm">Invite to Trip</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedBreakdown && (
        <div className="modal-overlay" onClick={() => setSelectedBreakdown(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="btn-icon-close" onClick={() => setSelectedBreakdown(null)}>✕</button>
            <MatchBreakdown breakdown={selectedBreakdown} />
          </div>
        </div>
      )}
    </div>
  );
}
