import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { adminApi } from '../services/adminApi';
import AdminOverviewTab from '../components/admin/AdminOverviewTab';
import AdminUsersTab from '../components/admin/AdminUsersTab';
import AdminVerificationsTab from '../components/admin/AdminVerificationsTab';
import AdminReportsTab from '../components/admin/AdminReportsTab';
import AdminTripsTab from '../components/admin/AdminTripsTab';
import AdminSystemAudit from '../components/admin/AdminSystemAudit';
import './AdminDashboard.css';

export default function AdminDashboard({ onNavigate, onSelectTrip }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [reports, setReports] = useState([]);
  const [trips, setTrips] = useState([]);

  const isAdmin = Boolean(
    user && (user.role === 'admin' || user.is_staff || user.is_superuser)
  );

  const loadAllData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [sumRes, anaRes, userRes, verRes, repRes, tripRes] = await Promise.allSettled([
        adminApi.getDashboardSummary(),
        adminApi.getAnalytics(),
        adminApi.getUsers(),
        adminApi.getVerifications(),
        adminApi.getReports(),
        adminApi.getTrips(),
      ]);

      if (sumRes.status === 'fulfilled') setSummary(sumRes.value);
      if (anaRes.status === 'fulfilled') setAnalytics(anaRes.value);
      if (userRes.status === 'fulfilled') setUsers(userRes.value || []);
      if (verRes.status === 'fulfilled') setVerifications(verRes.value || []);
      if (repRes.status === 'fulfilled') setReports(repRes.value || []);
      if (tripRes.status === 'fulfilled') setTrips(tripRes.value || []);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    }
  }, [isAdmin]);

  const handleUpdateUser = async (userId, data) => {
    try {
      const updated = await adminApi.updateUser(userId, data);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...updated } : u))
      );
      loadAllData(true);
    } catch {
      // Fallback local state update
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...data } : u))
      );
    }
  };

  const handleUpdateVerification = async (id, data) => {
    try {
      const updated = await adminApi.updateVerification(id, data);
      setVerifications((prev) =>
        prev.map((v) => (v.id === id ? { ...v, ...updated } : v))
      );
      loadAllData(true);
    } catch {
      setVerifications((prev) =>
        prev.map((v) => (v.id === id ? { ...v, ...data } : v))
      );
    }
  };

  const handleUpdateReport = async (id, data) => {
    try {
      const updated = await adminApi.updateReport(id, data);
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
      );
      loadAllData(true);
    } catch {
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...data } : r))
      );
    }
  };

  const handleUpdateTrip = async (id, data) => {
    try {
      const updated = await adminApi.updateTrip(id, data);
      setTrips((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
      );
      loadAllData(true);
    } catch {
      setTrips((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data } : t))
      );
    }
  };

  // Guard clause for unauthorized access
  if (!isAdmin) {
    return (
      <div className="admin-unauthorized-container">
        <div className="unauthorized-card">
          <div className="unauth-icon">🛡️🔒</div>
          <h2>Restricted Administrative Perimeter</h2>
          <p>
            You must be signed in with system administrator or staff credentials to access
            the TravelMate Central Control Deck.
          </p>
          <div className="unauth-btn-row">
            <button className="btn-primary" onClick={() => onNavigate('home')}>
              Return to Safe Trail
            </button>
            <button className="btn-secondary" onClick={() => onNavigate('login')}>
              Sign In as Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pendingVerifCount = (verifications || []).filter((v) => v.status === 'pending').length;
  const pendingReportCount = (reports || []).filter((r) => r.status === 'pending' || r.status === 'investigating').length;

  return (
    <div className="admin-dashboard-page">
      {/* Top Banner / Masthead */}
      <div className="admin-header-masthead">
        <div className="admin-masthead-content">
          <div className="masthead-badge-row">
            <span className="masthead-badge">ADMIN CONSOLE</span>
            <span className="admin-user-tag">@{user?.username}</span>
          </div>
          <h1 className="admin-masthead-title">Platform Administration</h1>
          <p className="admin-masthead-desc">
            Manage community users, verify Himalayan trekking guides, triage safety incident reports, and oversee expeditions.
          </p>
        </div>

        <div className="admin-masthead-actions">
          <button
            className={`admin-refresh-btn ${refreshing ? 'spinning' : ''}`}
            onClick={() => loadAllData(true)}
            title="Refresh Real-Time Platform State"
          >
            🔄 {refreshing ? 'Syncing...' : 'Sync Data'}
          </button>
          <a
            href="http://127.0.0.1:8000/admin/"
            target="_blank"
            rel="noreferrer"
            className="django-admin-link-btn"
            title="Launch Django System Admin"
          >
            Django DB Suite ↗
          </a>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="admin-tab-nav-bar">
        <button
          className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Platform Radar
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 User Directory <span className="tab-pill-count">{users.length}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'verifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('verifications')}
        >
          📜 Guide Verifications
          {pendingVerifCount > 0 && <span className="tab-pill-alert">{pendingVerifCount}</span>}
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          🚨 Incident Triage
          {pendingReportCount > 0 && <span className="tab-pill-alert">{pendingReportCount}</span>}
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'trips' ? 'active' : ''}`}
          onClick={() => setActiveTab('trips')}
        >
          🏔️ Expeditions <span className="tab-pill-count">{trips.length}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          🛡️ Emergency & System Audit
        </button>
      </div>

      {/* Active Tab Panel Body */}
      <div className="admin-content-stage">
        {activeTab === 'overview' && (
          <AdminOverviewTab
            summary={summary}
            analytics={analytics}
            loading={loading}
            onNavigateTab={setActiveTab}
          />
        )}
        {activeTab === 'users' && (
          <AdminUsersTab
            users={users}
            onUpdateUser={handleUpdateUser}
            loading={loading}
          />
        )}
        {activeTab === 'verifications' && (
          <AdminVerificationsTab
            verifications={verifications}
            onUpdateVerification={handleUpdateVerification}
            loading={loading}
          />
        )}
        {activeTab === 'reports' && (
          <AdminReportsTab
            reports={reports}
            onUpdateReport={handleUpdateReport}
            loading={loading}
          />
        )}
        {activeTab === 'trips' && (
          <AdminTripsTab
            trips={trips}
            onUpdateTrip={handleUpdateTrip}
            onSelectTrip={onSelectTrip}
            loading={loading}
          />
        )}
        {activeTab === 'audit' && (
          <AdminSystemAudit />
        )}
      </div>
    </div>
  );
}
