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
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [tripId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    try {
      const sent = await chatApi.sendMessage(tripId, newMsg.trim());
      setMessages((prev) => [...prev, sent]);
      setNewMsg('');
    } catch (err) {
      alert(err.message || 'Failed to send message');
    }
  };

  return (
    <div className="trip-chat-container glass-panel">
      <div className="chat-header">
        <h4>💬 Trip Workspace Group Chat</h4>
        <span className="live-indicator">● Active</span>
      </div>

      <div className="chat-message-list">
        {loading ? (
          <div className="text-center text-muted p-4">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted p-4">No messages yet. Say hi to your travel group!</div>
        ) : (
          messages.map((m) => {
            const isMe = m.sender === currentUser?.id || m.sender_username === currentUser?.username;
            return (
              <div key={m.id} className={`chat-bubble-row ${isMe ? 'outgoing' : 'incoming'}`}>
                <div className="chat-bubble">
                  <div className="bubble-author">{m.sender_username}</div>
                  <div className="bubble-content">{m.content}</div>
                  <div className="bubble-time">{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="chat-input-bar">
        <input
          type="text"
          className="form-input chat-input"
          placeholder="Coordinate plans or say hello..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
        />
        <button type="submit" className="btn btn-primary send-btn">Send</button>
      </form>
    </div>
  );
}
