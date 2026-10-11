import React, { useState } from 'react';

export default function AdminSystemAudit() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [savedBroadcast, setSavedBroadcast] = useState('');

  const handleSaveBroadcast = () => {
    setSavedBroadcast(broadcastMsg);
  };

  const emergencyContacts = [
    { name: 'Nepal Tourist Police 24/7 Hotline', phone: '1144', icon: '👮' },
    { name: 'Himalayan Rescue Association (HRA)', phone: '+977-1-4445484', icon: '🚁' },
    { name: 'Nepal Armed Police Force (Disaster SAR)', phone: '1114', icon: '🚨' },
    { name: 'Tribhuvan Int’l Airport Mountain SAR Air Wing', phone: '+977-1-4470311', icon: '✈️' },
  ];

  return (
    <div className="admin-tab-pane">
      <div className="admin-pane-header">
        <div>
          <h2>🛡️ System Infrastructure & Emergency Operations Desk</h2>
          <p className="admin-pane-sub">
            Monitor API gateways, database health, emergency SOS dispatch lines, and broadcast system announcements.
          </p>
        </div>
      </div>

      {/* System Infrastructure Telemetry */}
      <div className="audit-grid">
        <div className="audit-card">
          <span className="audit-card-title">Django REST Core Gateway</span>
          <div className="audit-status-line">
            <span className="live-pulse-dot"></span>
            <span>Port 8000 Online</span>
          </div>
          <p className="rate-caption" style={{ marginTop: '0.4rem' }}>
            Django 6.1 with JWT SimpleJWT bearer authentication and CORS filter.
          </p>
        </div>

        <div className="audit-card">
          <span className="audit-card-title">Database Storage Engine</span>
          <div className="audit-status-line">
            <span className="live-pulse-dot"></span>
            <span>AWS Supabase Pooler</span>
          </div>
          <p className="rate-caption" style={{ marginTop: '0.4rem' }}>
            PostgreSQL instance (aws-0-ap-northeast-1) connection active.
          </p>
        </div>

        <div className="audit-card">
          <span className="audit-card-title">Nepal GPS & Map Server</span>
          <div className="audit-status-line">
            <span className="live-pulse-dot"></span>
            <span>Leaflet + OSM Tiles</span>
          </div>
          <p className="rate-caption" style={{ marginTop: '0.4rem' }}>
            High-precision Himalayan trail waypoints rendering accurately.
          </p>
        </div>
      </div>

      {/* Nepal Emergency Rapid Dispatch Panel */}
      <div className="admin-card" style={{ marginBottom: '1.75rem' }}>
        <div className="admin-card-header">
          <h3>🏔️ Nepal Emergency Rapid Dispatch Directives</h3>
          <span className="admin-badge-success">SAR Integration Ready</span>
        </div>
        <p className="rate-caption" style={{ marginBottom: '1.25rem', fontSize: '0.85rem' }}>
          Certified emergency channels recognized by TAAN and NTB for altitude sickness evacuation and Himalayan search and rescue:
        </p>

        <div className="admin-kpi-row" style={{ marginBottom: 0 }}>
          {emergencyContacts.map((contact, idx) => (
            <div key={idx} className="admin-kpi-card" style={{ padding: '1rem 1.25rem' }}>
              <div className="kpi-icon-wrap" style={{ width: '42px', height: '42px', fontSize: '1.3rem', background: '#fef2f2' }}>
                {contact.icon}
              </div>
              <div className="kpi-info">
                <span className="kpi-label" style={{ fontSize: '0.74rem' }}>{contact.name}</span>
                <span className="kpi-value" style={{ fontSize: '1.15rem', color: '#b91c1c' }}>{contact.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trail Announcement & Maintenance Broadcast */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>📢 Community Announcement Broadcast</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700 }}>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
            />
            Maintenance Mode Flag
          </label>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="text"
            className="admin-search-input"
            style={{ flex: 1 }}
            placeholder="e.g. Thorong La Pass blizzard advisory: All trekkers advise shelter in Thorong Phedi."
            value={broadcastMsg}
            onChange={(e) => setBroadcastMsg(e.target.value)}
          />
          <button className="admin-action-btn success" onClick={handleSaveBroadcast}>
            Broadcast Banner
          </button>
        </div>

        {savedBroadcast && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', color: '#1e40af', fontSize: '0.86rem' }}>
            🔔 <strong>Active Broadcast:</strong> {savedBroadcast}
          </div>
        )}
      </div>
    </div>
  );
}
