import React, { useState } from 'react';

export default function AdminUsersTab({ users, onUpdateUser, loading }) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const filteredUsers = (users || []).filter((u) => {
    const matchesSearch =
      (u.username || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.display_name || '').toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId, newRole) => {
    setActionLoadingId(userId);
    try {
      await onUpdateUser(userId, { role: newRole });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    setActionLoadingId(userId);
    try {
      await onUpdateUser(userId, { is_active: !currentStatus });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="admin-tab-pane">
      <div className="admin-pane-header">
        <div>
          <h2>👥 Member & Guide Governance Directory</h2>
          <p className="admin-pane-sub">
            Manage user roles, verify guide credentials, and regulate platform access permissions.
          </p>
        </div>
        <div className="admin-filter-bar">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by username, email, name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="admin-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles ({users?.length || 0})</option>
            <option value="traveller">Travellers</option>
            <option value="guide">Licensed Guides</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      <div className="admin-table-container">
        {loading && (!users || users.length === 0) ? (
          <div className="admin-loading-state">
            <div className="admin-spinner"></div>
            <p>Fetching user directory...</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User / Explorer</th>
                <th>Role & Permissions</th>
                <th>Verification</th>
                <th>Trek Metrics</th>
                <th>Account Status</th>
                <th>Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className={!u.is_active ? 'row-suspended' : ''}>
                    <td>
                      <div className="user-cell-wrap">
                        <span className="user-avatar-dot-sm">
                          {(u.username || 'U').charAt(0).toUpperCase()}
                        </span>
                        <div className="user-cell-meta">
                          <span className="user-cell-name">
                            {u.display_name || u.username}
                          </span>
                          <span className="user-cell-email">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <select
                        className={`role-select-pill pill-${u.role}`}
                        value={u.role || 'traveller'}
                        disabled={actionLoadingId === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        <option value="traveller">🎒 Traveller</option>
                        <option value="guide">🏔️ Guide</option>
                        <option value="admin">⚙️ Admin</option>
                      </select>
                    </td>
                    <td>
                      <span
                        className={`admin-status-badge badge-${
                          u.verification_status || 'unverified'
                        }`}
                      >
                        {u.verification_status === 'verified'
                          ? '✓ Verified'
                          : u.verification_status === 'pending'
                          ? '⏳ Pending Review'
                          : 'Unverified'}
                      </span>
                    </td>
                    <td>
                      <div className="metric-cell">
                        <span>⭐ {u.average_rating ? Number(u.average_rating).toFixed(1) : '5.0'}</span>
                        <span className="metric-sub">{u.trips_completed || 0} Treks</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${u.is_active ? 'active' : 'suspended'}`}>
                        {u.is_active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`admin-action-btn ${u.is_active ? 'warn' : 'success'}`}
                        disabled={actionLoadingId === u.id}
                        onClick={() => handleStatusToggle(u.id, u.is_active)}
                      >
                        {actionLoadingId === u.id
                          ? 'Saving...'
                          : u.is_active
                          ? 'Suspend'
                          : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-table-cell">
                    No users matching "{search}" or role filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
