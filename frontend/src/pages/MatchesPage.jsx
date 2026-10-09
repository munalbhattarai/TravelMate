import React, { useState, useEffect } from 'react';
import { matchingApi } from '../services/matchingApi';
import { tripApi } from '../services/tripApi';
import { useAuth } from '../hooks/useAuth';
import MatchBadge from '../components/matching/MatchBadge';
import MatchBreakdown from '../components/matching/MatchBreakdown';
import CustomSelect from '../components/ui/CustomSelect';

export default function MatchesPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBreakdown, setSelectedBreakdown] = useState(null);

  useEffect(() => {
    async function loadTrips() {
      try {
        const res = await tripApi.getTrips();
        const list = res.results || res || [];
        setTrips(list);
        if (list.length > 0) {
          setSelectedTripId(list[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadTrips();
  }, []);

  const loadMatches = async (tripId) => {
    setLoading(true);
    try {
      const res = await matchingApi.getMatches(tripId ? { trip: tripId } : {});
      setMatches(res.results || res || []);
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches(selectedTripId);
  }, [selectedTripId]);

  return (
    <div className="matches-page-container">
      <div className="matches-header">
        <h2>Recommended Travel Companions</h2>
        <p>Ranked strictly by our TravelMate 8-factor compatibility algorithm</p>

        {trips.length > 0 && (
          <div className="match-trip-selector-card">
            <div className="selector-icon-badge">🎯</div>
            <div className="selector-info">
              <span className="selector-title">Target Trip for Matching</span>
              <span className="selector-subtitle">Calculating companion compatibility for your Nepal journey</span>
            </div>
            <div className="custom-select-container">
              <CustomSelect
                value={selectedTripId}
                options={trips.map((t) => ({
                  value: t.id,
                  label: `${t.title} (${t.destination_name || 'Nepal'})`
                }))}
                onChange={(val) => setSelectedTripId(val)}
                placeholder="Choose target trip..."
                icon="🏔️"
              />
            </div>
          </div>
        )}
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
<<<<<<< HEAD
            const candidate = item.user || item;
=======
            const user = item.user || item;
>>>>>>> 7c246394e7074765dc469146b61ae7725615cb5f
            const score = item.compatibility_score ?? item.score ?? 85;
            return (
              <div key={candidate.id || idx} className="match-card glass-panel">
                <div className="match-card-top">
                  <div className="match-avatar-circle">
                    {candidate.username ? candidate.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h4>{candidate.username}</h4>
                    <span className="text-muted text-sm">{candidate.travel_style || 'Explorer'} • {candidate.pace || 'Moderate'}</span>
                  </div>
                  <MatchBadge score={score} />
                </div>

                <p className="match-bio">{candidate.bio || 'Eager to explore new trails, authentic cuisines, and photographic sights.'}</p>

                <div className="match-card-actions">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setSelectedBreakdown({
                      breakdown: item.breakdown || {},
<<<<<<< HEAD
                      candidateName: candidate.username,
=======
                      candidateName: user.username,
>>>>>>> 7c246394e7074765dc469146b61ae7725615cb5f
                      score: score,
                    })}
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', width: '92%' }}>
            <button className="btn-icon-close" onClick={() => setSelectedBreakdown(null)}>✕</button>
            <MatchBreakdown 
              breakdown={selectedBreakdown.breakdown} 
              candidateName={selectedBreakdown.candidateName}
              overallScore={selectedBreakdown.score}
            />
          </div>
        </div>
      )}
    </div>
  );
}
