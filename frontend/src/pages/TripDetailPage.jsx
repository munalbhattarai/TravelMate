import React, { useState, useEffect } from 'react';
import { tripApi } from '../services/tripApi';
import { useAuth } from '../hooks/useAuth';
import TripChat from '../components/chat/TripChat';
import TripItinerary from '../components/trip/TripItinerary';
import TripExpenses from '../components/expenses/TripExpenses';

export default function TripDetailPage({ tripId, onBack }) {
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await tripApi.getTrip(tripId);
        setTrip(data);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tripId]);

  if (loading) return <div className="p-8 text-center text-muted">Loading trip details...</div>;
  if (!trip) return <div className="p-8 text-center text-muted">Trip not found.</div>;

  return (
    <div className="trip-detail-container">
      <button className="btn btn-outline btn-sm mb-4" onClick={onBack}>← Back to Trips</button>

      <div className="trip-header-card glass-panel">
        <div className="trip-header-main">
          <h2>{trip.title}</h2>
          <span className="status-badge badge-primary">{trip.status?.toUpperCase()}</span>
        </div>
        <p className="trip-header-desc">{trip.description || 'Explore the world with trusted companions.'}</p>
        <div className="trip-header-chips">
          <span>📍 {trip.destination_name || 'Destination'}</span>
          <span>📅 {trip.start_date} to {trip.end_date}</span>
          <span>💰 ${trip.budget} budget</span>
        </div>
      </div>

      <div className="workspace-tabs">
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        <button className={`tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`} onClick={() => setActiveTab('itinerary')}>
          Itinerary Timeline
        </button>
        <button className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
          Group Chat Workspace
        </button>
        <button className={`tab-btn ${activeTab === 'expenses' ? 'active' : ''}`} onClick={() => setActiveTab('expenses')}>
          Expenses & Settlement
        </button>
      </div>

      <div className="workspace-tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab glass-panel p-6">
            <h3>Trip Information</h3>
            <p>Travel Style: <strong>{trip.travel_style || 'Flexible'}</strong></p>
            <p>Accommodation: <strong>{trip.accommodation || 'Standard'}</strong></p>
            <p>Max Members: <strong>{trip.max_members}</strong></p>
          </div>
        )}
        {activeTab === 'itinerary' && (
          <TripItinerary itineraries={trip.itineraries || []} />
        )}
        {activeTab === 'chat' && (
          <TripChat tripId={trip.id} currentUser={user} />
        )}
        {activeTab === 'expenses' && (
          <TripExpenses expenses={trip.expenses || []} />
        )}
      </div>
    </div>
  );
}
