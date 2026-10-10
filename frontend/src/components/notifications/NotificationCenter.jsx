import React, { useState, useEffect } from 'react';
import { notificationApi } from '../../services/notificationApi';

export default function NotificationCenter({ onClose, onUpdateCount, onNavigateTrip }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const fetchNotifs = async () => {
    try {
      const res = await notificationApi.getNotifications();
      const list = res.results || res || [];
      setNotifications(Array.isArray(list) ? list : []);
    } catch {
      setNotifications([]);
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
      if (onUpdateCount) onUpdateCount();
    } catch (e) {
      console.error('Failed to mark notification read:', e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      if (onUpdateCount) onUpdateCount();
    } catch (e) {
      console.error('Failed to mark all read:', e);
    }
  };

  const handleClickItem = async (n) => {
    if (!n.is_read) {
      await handleMarkRead(n.id);
    }
    const tripId = n.payload?.trip_id;
    if (tripId && onNavigateTrip) {
      onNavigateTrip(tripId);
    }
  };

  const formatTimeAgo = (dateStr) => {
    try {
      const diffSec = Math.floor((new Date() - new Date(dateStr)) / 1000);
      if (diffSec < 60) return 'Just now';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const getNotifDetails = (n) => {
    const p = n.payload || {};
    switch (n.type) {
      case 'request_received':
        return {
          icon: '🎒',
          type: 'request',
          badgeText: 'Join Request',
          title: 'Expedition Join Request',
          summary: (
            <span>
              <strong>@{p.applicant || 'A companion'}</strong> requested to join <em>"{p.trip_title || 'your expedition'}"</em>.
            </span>
          ),
          actionLabel: 'Review Request →',
        };
      case 'request_accepted':
        return {
          icon: '✨',
          type: 'accepted',
          badgeText: 'Approved',
          title: "You're on the Team!",
          summary: (
            <span>
              Your request to join <em>"{p.trip_title || 'the expedition'}"</em> has been approved!
            </span>
          ),
          actionLabel: 'Open Workspace →',
        };
      case 'request_rejected':
        return {
          icon: '✕',
          type: 'rejected',
          badgeText: 'Declined',
          title: 'Join Request Update',
          summary: (
            <span>
              Your request to join <em>"{p.trip_title || 'the expedition'}"</em> was declined.
            </span>
          ),
          actionLabel: null,
        };
      case 'new_message':
        return {
          icon: '💬',
          type: 'chat',
          badgeText: 'Trip Chat',
          title: `Message from @${p.sender || 'Companion'}`,
          summary: (
            <span>
              "{p.preview || p.message || 'New message in trip chat'}"
            </span>
          ),
          actionLabel: 'Open Chat →',
        };
      case 'trip_updated':
        return {
          icon: '🏔️',
          type: 'update',
          badgeText: 'Itinerary Update',
          title: 'Expedition Updated',
          summary: (
            <span>
              New milestones or schedule changes in <em>"{p.trip_title || 'your trip'}"</em>.
            </span>
          ),
          actionLabel: 'View Details →',
        };
      case 'trip_cancelled':
        return {
          icon: '⚠️',
          type: 'cancelled',
          badgeText: 'Cancelled',
          title: 'Expedition Cancelled',
          summary: (
            <span>
              The expedition <em>"{p.trip_title || 'this trip'}"</em> was cancelled by the host.
            </span>
          ),
          actionLabel: null,
        };
      case 'review_received':
        return {
          icon: '⭐',
          type: 'review',
          badgeText: 'Peer Review',
          title: 'New Traveler Review',
          summary: (
            <span>
              <strong>@{p.reviewer || 'A companion'}</strong> submitted a peer review for you.
            </span>
          ),
          actionLabel: 'View Profile →',
        };
      default:
        return {
          icon: '🔔',
          type: 'notice',
          badgeText: (n.type || 'Notice').replace(/_/g, ' '),
          title: 'Expedition Notification',
          summary: <span>{p.message || p.trip_title || 'You have an expedition notification.'}</span>,
          actionLabel: p.trip_id ? 'View Expedition →' : null,
        };
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const displayedNotifications = filter === 'unread'
    ? notifications.filter((n) => !n.is_read)
    : notifications;

  return (
    <div className="notification-center-dropdown glass-panel">
      {/* Pristine Modern Top Bar */}
      <div className="notif-tray-header">
        <div className="notif-tray-title-group">
          <span className="notif-tray-title">Notifications</span>
          {unreadCount > 0 && (
            <span className="notif-unread-counter">{unreadCount}</span>
          )}
        </div>
        <div className="notif-tray-actions">
          {unreadCount > 0 && (
            <button
              type="button"
              className="notif-mark-read-action"
              onClick={handleMarkAllRead}
            >
              Mark all read
            </button>
          )}
          <button
            type="button"
            className="notif-close-action"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Segmented Filter Control */}
      <div className="notif-segmented-control">
        <button
          type="button"
          className={`notif-segment-btn ${filter === 'all' ? 'is-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          className={`notif-segment-btn ${filter === 'unread' ? 'is-active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      {/* Notifications Scroll Body */}
      <div className="notif-tray-body">
        {loading ? (
          <div className="notif-empty-state">
            <div className="loading-spinner-ring" style={{ width: 22, height: 22, margin: '0 auto 8px' }} />
            <p className="notif-empty-sub">Checking updates...</p>
          </div>
        ) : displayedNotifications.length === 0 ? (
          <div className="notif-empty-state">
            <span className="notif-empty-icon">🧭</span>
            <div className="notif-empty-title">
              {filter === 'unread' ? 'No Unread Notifications' : 'All Caught Up!'}
            </div>
            <p className="notif-empty-sub">
              {filter === 'unread'
                ? "You've read all your expedition updates."
                : 'Activity like companion join requests, approvals, and trip messages will appear here.'}
            </p>
          </div>
        ) : (
          displayedNotifications.map((n) => {
            const details = getNotifDetails(n);
            return (
              <div
                key={n.id}
                className={`notif-entry-card ${n.is_read ? 'is-read' : 'is-unread'}`}
                onClick={() => handleClickItem(n)}
              >
                {/* Visual Icon Avatar */}
                <div className={`notif-entry-avatar avatar-${details.type}`}>
                  {details.icon}
                </div>

                {/* Main Content */}
                <div className="notif-entry-main">
                  <div className="notif-entry-header">
                    <span className={`notif-badge-tag tag-${details.type}`}>
                      {details.badgeText}
                    </span>
                    <div className="notif-timestamp-box">
                      <span className="notif-time-ago">{formatTimeAgo(n.created_at)}</span>
                      {!n.is_read && <span className="notif-unread-dot" title="Unread" />}
                    </div>
                  </div>

                  <h5 className="notif-entry-title">{details.title}</h5>
                  <p className="notif-entry-description">{details.summary}</p>

                  {/* Optional Interactive CTA */}
                  {details.actionLabel && (
                    <div className="notif-entry-cta-row">
                      <span className={`notif-entry-cta-pill cta-${details.type}`}>
                        {details.actionLabel}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
