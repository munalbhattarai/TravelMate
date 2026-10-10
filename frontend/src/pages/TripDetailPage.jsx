import React, { useState, useEffect } from 'react';
import { tripApi } from '../services/tripApi';
import { useAuth } from '../hooks/useAuth';
import TripChat from '../components/chat/TripChat';
import TripItinerary from '../components/trip/TripItinerary';
import TripExpenses from '../components/expenses/TripExpenses';
import NepalTripMap from '../components/map/NepalTripMap';
import ReviewModal from '../components/reviews/ReviewModal';
import ReportModal from '../components/moderation/ReportModal';
import TripPackingList from '../components/trip/TripPackingList';

export default function TripDetailPage({ tripId, onBack, onNavigate }) {
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [actionError, setActionError] = useState('');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [memberToReview, setMemberToReview] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState({ type: 'trip', id: null, name: '' });

  const loadData = async () => {
    try {
      const data = await tripApi.getTrip(tripId);
      setTrip(data);

      const [itinRes, memRes] = await Promise.allSettled([
        tripApi.getItinerary(tripId),
        tripApi.getMemberships(tripId),
      ]);

      if (itinRes.status === 'fulfilled') {
        const val = itinRes.value?.results || itinRes.value;
        setItineraries(Array.isArray(val) ? val : []);
      }
      if (memRes.status === 'fulfilled') {
        const val = memRes.value?.results || memRes.value;
        setMemberships(Array.isArray(val) ? val : []);
      }

      // Only fetch expenses if user is an accepted member, host, or admin
      const memberList = memRes.status === 'fulfilled' ? (memRes.value?.results || memRes.value || []) : [];
      const userIsMember = Boolean(
        user && (
          user.username === data?.creator ||
          (data?.creator_id && user.id === data?.creator_id) ||
          user.role === 'admin' ||
          user.is_staff ||
          (Array.isArray(memberList) && memberList.some(m => (m.user === user.username || m.user_id === user.id) && m.status === 'accepted'))
        )
      );

      if (userIsMember) {
        try {
          const expRes = await tripApi.getExpenses(tripId);
          const val = expRes?.results || expRes;
          setExpenses(Array.isArray(val) ? val : []);
        } catch {
          setExpenses([]);
        }
      } else {
        setExpenses([]);
      }
    } catch (err) {
      console.error('Failed to load trip workspace:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tripId]);

  const handleRequestJoin = async () => {
    setActionMsg('');
    setActionError('');
    if (!user) {
      setActionError('Please sign in to send a request to join this expedition.');
      if (onNavigate) onNavigate('login');
      return;
    }
    try {
      await tripApi.requestJoin(tripId);
      setActionMsg('Join request sent successfully! Waiting for host approval.');
      loadData();
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('already have a membership')) {
        setActionMsg('Your join request has been submitted and is pending host approval.');
        loadData();
      } else if (msg.toLowerCase().includes('authentication credentials were not provided')) {
        setActionError('Your session has expired. Please sign in again.');
        if (onNavigate) onNavigate('login');
      } else {
        setActionError(msg || 'Could not send join request.');
      }
    }
  };

  const handleAcceptMember = async (membershipId) => {
    try {
      await tripApi.acceptMember(tripId, membershipId);
      setActionMsg('Member request accepted! They can now access the group chat and workspace.');
      loadData();
    } catch (err) {
      setActionError(err.message || 'Could not accept member.');
    }
  };

  const handleRejectMember = async (membershipId) => {
    try {
      await tripApi.rejectMember(tripId, membershipId);
      setActionMsg('Member request declined.');
      loadData();
    } catch (err) {
      setActionError(err.message || 'Could not decline member.');
    }
  };

  const handleStartTrip = async () => {
    if (!window.confirm('Are you ready to mark this expedition as Ongoing / In Progress?')) return;
    try {
      await tripApi.startTrip(tripId);
      setActionMsg('Expedition started! Safe travels on the trails.');
      loadData();
    } catch (err) {
      setActionError(err.message || 'Could not start expedition.');
    }
  };

  const handleCompleteTrip = async () => {
    if (!window.confirm('Mark this expedition as Completed? Members will be prompted to leave peer reviews.')) return;
    try {
      await tripApi.completeTrip(tripId);
      setActionMsg('Expedition marked as Completed! Great job reaching the summit/destination.');
      loadData();
    } catch (err) {
      setActionError(err.message || 'Could not complete trip.');
    }
  };

  const handleCancelTrip = async () => {
    if (!window.confirm('Are you sure you want to cancel this trip?')) return;
    try {
      await tripApi.cancelTrip(tripId);
      setActionMsg('Trip has been cancelled.');
      loadData();
    } catch (err) {
      setActionError(err.message || 'Could not cancel trip.');
    }
  };

  const handleLeaveTrip = async () => {
    if (!window.confirm('Are you sure you want to leave this trip?')) return;
    try {
      await tripApi.leaveTrip(tripId);
      setActionMsg('You have successfully left the expedition.');
      loadData();
    } catch (err) {
      setActionError(err.message || 'Could not leave trip.');
    }
  };

  const isCreator = Boolean(user && (user.username === trip?.creator || (trip?.creator_id && user.id === trip?.creator_id)));
  const isAdmin = Boolean(user && (user.role === 'admin' || user.is_staff));
  const myMembership = Array.isArray(memberships) ? memberships.find((m) => m.user === user?.username || (user?.id && m.user_id === user?.id)) : null;
  const isAcceptedMember = isCreator || isAdmin || myMembership?.status === 'accepted';
  const pendingRequests = Array.isArray(memberships) ? memberships.filter((m) => m.status === 'pending') : [];
  const acceptedMembers = Array.isArray(memberships) ? memberships.filter((m) => m.status === 'accepted') : [];
  const spotsLeft = Math.max(0, (trip?.max_members || 4) - acceptedMembers.length);

  if (loading) {
    return (
      <div className="trip-detail-loading">
        <div className="loading-spinner-ring"></div>
        <p>Loading Nepal Trip Workspace...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="trip-detail-container">
        <button className="btn-back-pill" onClick={onBack}>← Back to Trips</button>
        <div className="trip-empty-state">
          <h3>Trip Not Found</h3>
          <p>The requested journey may have been removed or is unavailable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trip-detail-container">
      {/* Action Messages */}
      {actionMsg && (
        <div className="alert-banner-success">
          <span>✓ {actionMsg}</span>
          <button className="alert-dismiss" onClick={() => setActionMsg('')}>✕</button>
        </div>
      )}
      {actionError && (
        <div className="alert-banner-error">
          <span>⚠️ {actionError}</span>
          <button className="alert-dismiss" onClick={() => setActionError('')}>✕</button>
        </div>
      )}

      {/* Main Unified Trip Dossier Banner */}
      <div className="trip-dossier-card">
        {/* Top Row: Back Navigation + Status and CTA */}
        <div className="trip-dossier-topbar">
          <button className="btn-back-pill" onClick={onBack}>
            ← Back to Nepal Trips
          </button>

          <div className="trip-status-actions">
            <span className={`status-pill status-${(trip.status || 'open').toLowerCase()}`}>
              <span className="status-dot"></span>
              {(trip.status || 'open').toUpperCase()}
            </span>

            {!user && trip.status === 'open' && (
              <button 
                className="btn-join-primary" 
                onClick={() => onNavigate ? onNavigate('login') : null}
              >
                🔑 Sign In to Join
              </button>
            )}

            {user && !isCreator && !myMembership && trip.status === 'open' && (
              <button className="btn-join-primary" onClick={handleRequestJoin}>
                ✨ Request to Join Trip
              </button>
            )}

            {myMembership && !isCreator && (
              <span className={`status-pill ${
                myMembership.status === 'accepted' ? 'member-confirmed' :
                myMembership.status === 'rejected' ? 'member-declined' : 'member-pending'
              }`}>
                {myMembership.status === 'accepted' ? '✓ Confirmed Member' :
                 myMembership.status === 'rejected' ? '✕ Join Request Declined' : '⏳ Request Pending Approval'}
              </span>
            )}

            {isCreator && (
              <span className="status-pill creator-badge">
                {trip.creator_role === 'guide' ? '🏔️ Certified Guide (Host)' : '👑 You are the Trip Leader'}
              </span>
            )}

            {isAdmin && !isCreator && (
              <span className="status-pill admin-badge" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#4f46e5', borderColor: '#a5b4fc', fontWeight: 600 }}>
                🛡️ Admin Superuser
              </span>
            )}

            {(isCreator || isAdmin) && (trip.status === 'open' || trip.status === 'full') && (
              <button className="btn-lifecycle btn-lifecycle-start" onClick={handleStartTrip}>
                🚀 Start Expedition
              </button>
            )}

            {(isCreator || isAdmin) && trip.status === 'ongoing' && (
              <button className="btn-lifecycle btn-lifecycle-complete" onClick={handleCompleteTrip}>
                🏁 Mark Completed
              </button>
            )}

            {(isCreator || isAdmin) && trip.status !== 'completed' && trip.status !== 'cancelled' && (
              <button className="btn-lifecycle btn-lifecycle-cancel" onClick={handleCancelTrip}>
                ✕ Cancel Trip
              </button>
            )}

            {myMembership && myMembership.status === 'accepted' && !isCreator && trip.status !== 'completed' && (
              <button className="btn-lifecycle btn-lifecycle-leave" onClick={handleLeaveTrip}>
                🚪 Leave Trip
              </button>
            )}
          </div>
        </div>

        {/* Title, Destination and Host Info */}
        <div className="trip-dossier-header-block">
          <div className="trip-destination-pill">
            📍 <strong>{trip.destination_name || 'Nepal'}</strong>
            {trip.destination_region && <span className="dest-region-text">• {trip.destination_region}</span>}
          </div>

          <h1 className="trip-dossier-heading">{trip.title}</h1>

          <div className="trip-host-summary">
            <div className="host-avatar-chip">
              {trip.creator ? trip.creator.charAt(0).toUpperCase() : 'H'}
            </div>
            <div className="host-text-details">
              <span className="host-label">
                {trip.creator_role === 'guide' ? 'Expedition Guide & Host' : 'Organized by'}
              </span>
              <span className="host-name">
                {trip.creator} {trip.creator_role === 'guide' && '🏔️'}
              </span>
            </div>
          </div>
        </div>

        {/* Trip Description */}
        <div className="trip-dossier-description-box">
          <p>{trip.description || 'Join this journey through the mountains, cultural heritage trails, and landscapes of Nepal. Coordinate gear, itineraries, and shared experiences with travel companions.'}</p>
        </div>

        {/* Streamlined Expedition Highlights Bar (3 Balanced Metric Pillars + Logistics Ribbon) */}
        <div className="trip-expedition-brief">
          <div className="brief-metrics-grid">
            <div className="brief-metric-tile">
              <div className="brief-icon-box">📅</div>
              <div className="brief-metric-data">
                <span className="brief-label">EXPEDITION DATES</span>
                <span className="brief-value">
                  {trip.start_date ? `${trip.start_date} → ${trip.end_date}` : 'Flexible Dates'}
                </span>
                <span className="brief-subtext">Himalayan Trek Window</span>
              </div>
            </div>

            <div className="brief-metric-tile">
              <div className="brief-icon-box">💰</div>
              <div className="brief-metric-data">
                <span className="brief-label">ESTIMATED BUDGET</span>
                <span className="brief-value">
                  NPR {Number(trip.budget || 0).toLocaleString()}
                </span>
                <span className="brief-subtext">Approx per traveler</span>
              </div>
            </div>

            <div className="brief-metric-tile">
              <div className="brief-icon-box">👥</div>
              <div className="brief-metric-data">
                <span className="brief-label">CONFIRMED COMPANIONS</span>
                <span className="brief-value">
                  {acceptedMembers.length} / {trip.max_members || 4} Confirmed
                </span>
                <span className="brief-subtext">
                  {spotsLeft > 0 ? `${spotsLeft} open spot${spotsLeft === 1 ? '' : 's'} available` : 'Capacity reached'}
                </span>
              </div>
            </div>
          </div>

          {/* Integrated Logistics Badges Strip */}
          <div className="brief-logistics-strip">
            <div className="logistics-pills-row">
              <span className="brief-tag">
                <span className="tag-ico">🎒</span> Travel Style: <strong>{trip.travel_style ? trip.travel_style.charAt(0).toUpperCase() + trip.travel_style.slice(1) : 'Adventure'}</strong>
              </span>
              <span className="brief-tag">
                <span className="tag-ico">🚌</span> Transport: <strong>{trip.transport ? trip.transport.charAt(0).toUpperCase() + trip.transport.slice(1) : 'Tourist Bus'}</strong>
              </span>
              <span className="brief-tag">
                <span className="tag-ico">🏡</span> Stay: <strong>{trip.accommodation ? trip.accommodation.charAt(0).toUpperCase() + trip.accommodation.slice(1) : 'Teahouse / Hotel'}</strong>
              </span>
              {trip.languages && (
                <span className="brief-tag">
                  <span className="tag-ico">🗣️</span> Languages: <strong>{trip.languages}</strong>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Workspace Navigation Tabs */}
      <div className="workspace-tabs-wrapper">
        <div className="workspace-tabs-bar">
          <button 
            className={`ws-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
            title="Overview & Confirmed Members"
          >
            <span className="ws-tab-icon">📋</span>
            <span>Overview</span>
            <span className="ws-tab-counter">{acceptedMembers.length}</span>
          </button>

          <button 
            className={`ws-tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
            onClick={() => setActiveTab('itinerary')}
            title="Daily Itinerary Timeline"
          >
            <span className="ws-tab-icon">📅</span>
            <span>Itinerary</span>
            <span className="ws-tab-counter">{itineraries.length}</span>
          </button>

          {/* Companion Chat Tab (Always visible, marked locked for non-members) */}
          <button 
            className={`ws-tab-btn ws-tab-chat ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
            title="Live Companion Group Chat"
          >
            <span className="ws-tab-icon">{isAcceptedMember ? '💬' : '🔒'}</span>
            <span>Chat</span>
            {!isAcceptedMember ? (
              <span className="ws-tab-lock-badge">Members Only</span>
            ) : (
              <span className="ws-tab-pulse-dot"></span>
            )}
          </button>

          {/* Expenses & Settlement Tab (Always visible, marked locked for non-members) */}
          <button 
            className={`ws-tab-btn ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
            title="Expenses & Shared Settlement"
          >
            <span className="ws-tab-icon">{isAcceptedMember ? '💳' : '🔒'}</span>
            <span>Expenses</span>
            {isAcceptedMember ? (
              <span className="ws-tab-counter">{expenses.length}</span>
            ) : (
              <span className="ws-tab-lock-badge">Members Only</span>
            )}
          </button>

          <button 
            className={`ws-tab-btn ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => setActiveTab('map')}
            title="Interactive Route & Nepal Map"
          >
            <span className="ws-tab-icon">🗺️</span>
            <span>Route Map</span>
          </button>

          <button 
            className={`ws-tab-btn ${activeTab === 'packing' ? 'active' : ''}`}
            onClick={() => setActiveTab('packing')}
            title="Gear Checklist & Packing Guide"
          >
            <span className="ws-tab-icon">🎒</span>
            <span>Gear Checklist</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="workspace-content-card">
        {activeTab === 'overview' && (
          <div className="overview-tab-layout">
            <div className="overview-grid">
              {/* Left Column: Confirmed Members & Logistics */}
              <div className="overview-card-block">
                <div className="card-block-header">
                  <h3>👥 Confirmed Travelers ({acceptedMembers.length})</h3>
                  <span className="text-muted text-sm">Capacity: {acceptedMembers.length} of {trip.max_members} spots filled</span>
                </div>

                <div className="members-badge-list">
                  {/* Trip Creator Host Card */}
                  <div className="member-item-row host-row">
                    <div className="member-avatar host">
                      {trip.creator ? trip.creator.charAt(0).toUpperCase() : 'H'}
                    </div>
                    <div className="member-meta">
                      <span className="member-username">{trip.creator}</span>
                      <span className="member-role-tag">
                        {trip.creator_role === 'guide' ? '🏔️ Certified Trek Guide & Host' : '👑 Trip Organizer & Host'}
                      </span>
                    </div>
                    <span className="member-verified-badge">✓ Verified Host</span>
                  </div>

                  {/* Joined Members */}
                  {acceptedMembers.filter(m => m.user !== trip.creator).map((m) => (
                    <div key={m.id} className="member-item-row">
                      <div className="member-avatar">
                        {m.user ? m.user.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="member-meta">
                        <span className="member-username">{m.user}</span>
                        <span className="member-role-tag">
                          {m.user_role === 'guide' ? '🏔️ Licensed Guide' : '🎒 Confirmed Companion'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                        <span className="member-status-ok">Ready to Trek</span>
                        {user && user.username !== m.user && trip.status === 'completed' && (
                          <button
                            className="btn btn-outline btn-xs"
                            onClick={() => {
                              setMemberToReview({ id: m.user_id || m.id, username: m.user });
                              setReviewModalOpen(true);
                            }}
                            title="Review Companion"
                            style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '8px' }}
                          >
                            ⭐ Review
                          </button>
                        )}
                        {user && user.username !== m.user && (
                          <button
                            className="btn-icon-report"
                            onClick={() => {
                              setReportTarget({ type: 'user', id: m.user_id || m.id, name: m.user });
                              setReportModalOpen(true);
                            }}
                            title="Report User for Safety"
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
                          >
                            🛡️
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {acceptedMembers.length === 0 && (
                    <div className="p-4 text-center text-muted">
                      No additional members joined yet. Invite companions or wait for join requests.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Pending Join Requests & Expedition Notes */}
              <div className="overview-card-block">
                {isCreator && (
                  <div className="pending-approvals-box">
                    <div className="card-block-header">
                      <h3>⏳ Pending Join Requests ({pendingRequests.length})</h3>
                    </div>

                    {pendingRequests.length === 0 ? (
                      <p className="text-muted text-sm">No pending requests at this moment.</p>
                    ) : (
                      <div className="pending-requests-list">
                        {pendingRequests.map((req) => (
                          <div key={req.id} className="pending-request-card">
                            <div className="pending-user-info">
                              <span className="pending-avatar">{req.user?.charAt(0).toUpperCase() || 'U'}</span>
                              <div>
                                <strong>{req.user}</strong>
                                <span className="text-muted text-xs block">Wants to join this Nepal trip</span>
                              </div>
                            </div>
                            <div className="pending-btn-actions">
                              <button 
                                className="btn-action-accept"
                                onClick={() => handleAcceptMember(req.id)}
                              >
                                Accept
                              </button>
                              <button 
                                className="btn-action-decline"
                                onClick={() => handleRejectMember(req.id)}
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Nepal Travel Advisory */}
                <div className="nepal-trip-advisory">
                  <h4>🏔️ Nepal Expedition Guidance</h4>
                  <ul className="advisory-list">
                    <li><strong>Permits:</strong> Ensure TIMS Card and National Park / Conservation entry permits are arranged beforehand.</li>
                    <li><strong>Altitude Safety:</strong> Stay hydrated and maintain a moderate acclimatization pace.</li>
                    <li><strong>Local Currency:</strong> Carry sufficient NPR cash for remote teahouses where ATMs and card machines are unavailable.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'itinerary' && (
          <TripItinerary 
            itineraries={itineraries}
            tripId={trip.id}
            isCreator={isCreator}
            canEdit={isAcceptedMember}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'chat' && (
          !isAcceptedMember ? (
            <div className="workspace-locked-card">
              <div className="locked-icon-bubble">🔒</div>
              <h3>Companion Chat is Members-Only</h3>
              <p className="locked-lead-text">
                {!user 
                  ? 'Sign in to your TravelMate account and join this expedition to participate in group chat and coordinate trail logistics with fellow companions.'
                  : myMembership?.status === 'pending'
                  ? 'Your join request has been submitted and is awaiting approval by the trip leader. The group chat will unlock automatically once your request is accepted!'
                  : myMembership?.status === 'rejected'
                  ? 'Your request to join this trip was declined by the host.'
                  : 'Join this expedition to chat in real-time, share gear recommendations, and coordinate trail details with confirmed companions.'}
              </p>
              <div className="locked-action-group">
                {!user && onNavigate && (
                  <button className="btn btn-primary" onClick={() => onNavigate('login')}>
                    🔑 Sign In to Join
                  </button>
                )}
                {user && !myMembership && trip.status === 'open' && (
                  <button className="btn btn-primary" onClick={handleRequestJoin}>
                    ✨ Request to Join Trip
                  </button>
                )}
              </div>
            </div>
          ) : (
            <TripChat tripId={trip.id} currentUser={user} />
          )
        )}

        {activeTab === 'expenses' && (
          !isAcceptedMember ? (
            <div className="workspace-locked-card">
              <div className="locked-icon-bubble">🔒</div>
              <h3>Expenses & Settlement is Members-Only</h3>
              <p className="locked-lead-text">
                {!user 
                  ? 'Sign in to your TravelMate account and join this expedition to access shared cost tracking, itemized bills, and peer expense settlements.'
                  : myMembership?.status === 'pending'
                  ? 'Your join request is awaiting host approval. Once accepted, shared expense logs and settlement calculations will unlock automatically!'
                  : myMembership?.status === 'rejected'
                  ? 'Your request to join this trip was declined by the host.'
                  : 'Shared expense logs, itemized receipts, and cost-splitting calculations are reserved for confirmed companions to protect traveler financial privacy.'}
              </p>
              <div className="locked-action-group">
                {!user && onNavigate && (
                  <button className="btn btn-primary" onClick={() => onNavigate('login')}>
                    🔑 Sign In to Join
                  </button>
                )}
                {user && !myMembership && trip.status === 'open' && (
                  <button className="btn btn-primary" onClick={handleRequestJoin}>
                    ✨ Request to Join Trip
                  </button>
                )}
              </div>
            </div>
          ) : (
            <TripExpenses
              expenses={expenses}
              tripId={trip.id}
              members={acceptedMembers}
              onExpenseAdded={loadData}
              canAdd={isAcceptedMember}
            />
          )
        )}

        {activeTab === 'map' && (
          <div className="trip-map-pane">
            <div className="trip-map-pane-header">
              <div>
                <h3 className="map-pane-title">🗺️ Nepal Trekking & Route Map</h3>
                <p className="map-pane-subtitle">
                  Interactive topographic visualization for <strong>{trip.destination_name || 'Nepal Destination'}</strong>
                  {trip.destination_latitude ? ` (GPS: ${parseFloat(trip.destination_latitude).toFixed(4)}° N, ${parseFloat(trip.destination_longitude).toFixed(4)}° E)` : ''}
                </p>
              </div>
              <div className="map-badge-tags">
                <span className="map-layer-tip">Switch Layers in Top-Right ↗ (OSM / Topo / Satellite)</span>
              </div>
            </div>
            <NepalTripMap singleTrip={trip} height="560px" />
          </div>
        )}

        {activeTab === 'packing' && (
          <TripPackingList tripId={trip.id} destinationName={trip.destination_name} />
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        tripId={trip.id}
        memberToReview={memberToReview}
        onReviewSubmitted={() => {
          setActionMsg('Thank you for submitting your verified companion review!');
          loadData();
        }}
      />

      {/* Trust & Safety Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        targetType={reportTarget.type}
        targetId={reportTarget.id}
        targetName={reportTarget.name}
      />
    </div>
  );
}
