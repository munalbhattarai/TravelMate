import React, { useState, useEffect, useRef } from 'react';
import { chatApi } from '../../services/chatApi';

// In-memory cache for instant 0ms tab switching and reopening
const chatCache = new Map();

export default function TripChat({ tripId, currentUser }) {
  const [messages, setMessages] = useState(() => chatCache.get(tripId) || []);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(() => !chatCache.has(tripId));
  const bodyRef = useRef(null);
  const initialLoaded = useRef(false);

  const scrollToBottom = (smooth = false) => {
    if (bodyRef.current) {
      bodyRef.current.scrollTo({
        top: bodyRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  const loadMessages = async () => {
    try {
      const res = await chatApi.getTripMessages(tripId);
      const list = (res.results || res || []).slice().reverse();
      chatCache.set(tripId, list);

      setMessages((prev) => {
        const optimistic = prev.filter((m) => m.is_optimistic);
        if (optimistic.length === 0) {
          const isIdentical =
            prev.length === list.length &&
            (prev.length === 0 || prev[prev.length - 1]?.id === list[list.length - 1]?.id);
          if (isIdentical) return prev;
          return list;
        }

        // Retain optimistic messages not yet acknowledged in list
        const pendingOptimistic = optimistic.filter(
          (opt) =>
            !list.some(
              (m) =>
                m.content === opt.content &&
                (m.sender === opt.sender || m.sender_username === opt.sender_username)
            )
        );

        return [...list, ...pendingOptimistic];
      });
    } catch {
      // offline/fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If cached messages exist, set initialLoaded true so no jump occurs
    if (chatCache.has(tripId) && chatCache.get(tripId).length > 0) {
      setTimeout(() => scrollToBottom(false), 20);
    }
    loadMessages();
    const interval = setInterval(loadMessages, 2500);
    return () => clearInterval(interval);
  }, [tripId]);

  useEffect(() => {
    if (!initialLoaded.current && messages.length > 0) {
      initialLoaded.current = true;
      scrollToBottom(false);
      return;
    }

    if (bodyRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = bodyRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
      if (isNearBottom) {
        scrollToBottom(true);
      }
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    const messageText = newMsg.trim();
    setNewMsg('');

    // Instant Optimistic Message (0ms UI rendering)
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const optimisticMsg = {
      id: tempId,
      sender: currentUser?.id,
      sender_username: currentUser?.username || 'You',
      content: messageText,
      created_at: new Date().toISOString(),
      is_optimistic: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(() => scrollToBottom(true), 20);

    try {
      const sent = await chatApi.sendMessage(tripId, messageText);
      setMessages((prev) => {
        const next = prev.map((m) => (m.id === tempId ? { ...sent, is_optimistic: false } : m));
        chatCache.set(tripId, next.filter((m) => !m.is_optimistic));
        return next;
      });
      setTimeout(() => scrollToBottom(true), 20);
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setNewMsg(messageText);
      alert(err.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <div className="trip-chat-messenger">
      <div className="messenger-header">
        <div className="messenger-title-group">
          <span className="messenger-icon">💬</span>
          <div>
            <h4 className="messenger-title">Trip Workspace Chat</h4>
            <span className="messenger-status">
              <span className="live-dot" /> Live Group Channel
            </span>
          </div>
        </div>
        <span className="messenger-badge">End-to-End Logged</span>
      </div>

      <div className="messenger-body" ref={bodyRef}>
        {loading ? (
          <div className="chat-empty-state">Loading conversation history...</div>
        ) : messages.length === 0 ? (
          <div className="chat-empty-state">
            <span className="empty-icon">🏔️</span>
            <p>No messages yet. Say hello and coordinate your travel plans!</p>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.sender === currentUser?.id || m.sender_username === currentUser?.username;
            return (
              <div
                key={m.id}
                className={`chat-message-row ${isMe ? 'outgoing' : 'incoming'} ${
                  m.is_optimistic ? 'optimistic-sending' : ''
                }`}
              >
                {!isMe && (
                  <div className="chat-user-avatar" title={m.sender_username}>
                    {m.sender_username ? m.sender_username.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div className="chat-bubble-card">
                  {!isMe && <div className="chat-author-name">{m.sender_username}</div>}
                  <div className="chat-text-body">{m.content}</div>
                  <div className="chat-timestamp">
                    {m.is_optimistic ? (
                      <span className="chat-sending-indicator" title="Sending...">
                        <span className="sending-dot-pulse">●</span> sending...
                      </span>
                    ) : (
                      new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSend} className="messenger-input-tray">
        <input
          type="text"
          className="messenger-input-field"
          placeholder="Coordinate meetups, gear, permits, or say hello..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
        />
        <button type="submit" className="btn-messenger-send" disabled={!newMsg.trim()}>
          <span>Send</span>
          <span className="send-arrow">➤</span>
        </button>
      </form>
    </div>
  );
}
