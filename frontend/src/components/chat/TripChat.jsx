import React, { useState, useEffect, useRef } from 'react';
import { chatApi } from '../../services/chatApi';

export default function TripChat({ tripId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const endRef = useRef(null);

  const loadMessages = async () => {
    try {
      const res = await chatApi.getTripMessages(tripId);
      const list = res.results || res || [];
      setMessages([...list].reverse());
    } catch {
      // offline/fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 4000);
    return () => clearInterval(interval);
  }, [tripId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    const messageText = newMsg.trim();
    setNewMsg('');

    try {
      const sent = await chatApi.sendMessage(tripId, messageText);
      setMessages((prev) => [...prev, sent]);
    } catch (err) {
      alert(err.message || 'Failed to send message');
      setNewMsg(messageText);
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

      <div className="messenger-body">
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
              <div key={m.id} className={`chat-message-row ${isMe ? 'outgoing' : 'incoming'}`}>
                {!isMe && (
                  <div className="chat-user-avatar" title={m.sender_username}>
                    {m.sender_username ? m.sender_username.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div className="chat-bubble-card">
                  {!isMe && <div className="chat-author-name">{m.sender_username}</div>}
                  <div className="chat-text-body">{m.content}</div>
                  <div className="chat-timestamp">
                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
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
