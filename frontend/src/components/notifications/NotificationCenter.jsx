import React, { useState, useEffect } from 'react';
import { notificationApi } from '../../services/notificationApi';

export default function NotificationCenter({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const res = await notificationApi.getNotifications();
      setNotifications(res.results || res || []);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="notification-center-dropdown glass-panel">
      <div className="dropdown-header">
        <h4>Notifications</h4>
        <div className="header-actions">
          <button className="btn-link text-xs" onClick={handleMarkAllRead}>Mark all read</button>
          <button className="btn-icon-close" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="notification-list">
        {loading ? (
          <div className="p-4 text-center text-muted">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-muted">No notifications yet.</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`notification-item ${n.is_read ? 'read' : 'unread'}`}
              onClick={() => !n.is_read && handleMarkRead(n.id)}
            >
              <div className="notif-type-tag">{n.type.replace('_', ' ').toUpperCase()}</div>
              <p className="notif-text">
                {n.payload?.message || n.payload?.trip_title || 'You have a new update.'}
              </p>
              <span className="notif-date">{new Date(n.created_at).toLocaleDateString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
