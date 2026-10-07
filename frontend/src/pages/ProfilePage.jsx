import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../services/authApi';
import { reviewApi } from '../services/reviewApi';
import CustomSelect from '../components/ui/CustomSelect';

const NEPAL_DESTINATIONS = [
  'Pokhara',
  'Annapurna Base Camp',
  'Everest Base Camp',
  'Kathmandu Valley',
  'Upper Mustang (Lo Manthang)',
  'Langtang Valley',
  'Chitwan National Park',
  'Manang & Tilicho Lake',
  'Rara Lake',
  'Gosaikunda Holy Lakes',
  'Bandipur Heritage Hill',
  'Nagarkot Panoramic Ridge',
  'Lumbini Sacred Garden',
  'Bardia National Park',
];

const STYLE_OPTIONS = [
  'adventure',
  'backpacking',
  'photography',
  'culture',
  'hiking',
  'nature',
  'relaxation',
];

const INTEREST_OPTIONS = [
  'trekking',
  'photography',
  'local cuisine',
  'heritage sites',
  'mountain views',
  'camping',
  'wildlife safari',
  'boating',
];

const TRANSPORT_OPTIONS = [
  { value: 'bus', label: 'Tourist Bus' },
  { value: 'car', label: 'Private Car / 4x4 Jeep' },
  { value: 'flight', label: 'Domestic Flight' },
  { value: 'bike', label: 'Motorbike' },
  { value: 'walking', label: 'Trekking on Foot' },
];

const ACCOMMODATION_OPTIONS = [
  { value: 'hostel', label: 'Hostel / Teahouse' },
  { value: 'hotel', label: 'Standard Hotel' },
  { value: 'homestay', label: 'Local Homestay' },
  { value: 'camping', label: 'Alpine Camping' },
];

const LANGUAGE_OPTIONS = ['Nepali', 'English', 'Hindi', 'Newari', 'Tibetan'];

export default function ProfilePage({ onNavigateTrip }) {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [reviews, setReviews] = useState([]);

  // Form State
  const [profileData, setProfileData] = useState({
    display_name: '',
    bio: '',
    location: '',
  });

  const [preferences, setPreferences] = useState({
    travel_styles: [],
    interests: [],
    preferred_transport: 'bus',
    preferred_accommodation: 'hostel',
    budget_min: '',
    budget_max: '',
    preferred_duration_days: 7,
    preferred_destinations: [],
    languages: ['English', 'Nepali'],
  });

  useEffect(() => {
    async function fetchFullProfile() {
      try {
        const data = await authApi.getProfile();
        if (data) {
          const prof = data.profile || {};
          const pref = data.travel_preference || {};

          setProfileData({
            display_name: prof.display_name || data.username || '',
            bio: prof.bio || '',
            location: prof.location || 'Nepal',
          });

          setPreferences({
            travel_styles: Array.isArray(pref.travel_styles) ? pref.travel_styles : [],
            interests: Array.isArray(pref.interests) ? pref.interests : [],
            preferred_transport: pref.preferred_transport || 'bus',
            preferred_accommodation: pref.preferred_accommodation || 'hostel',
            budget_min: pref.budget_min !== null && pref.budget_min !== undefined ? String(pref.budget_min) : '8000',
            budget_max: pref.budget_max !== null && pref.budget_max !== undefined ? String(pref.budget_max) : '20000',
            preferred_duration_days: pref.preferred_duration_days || 7,
            preferred_destinations: Array.isArray(pref.preferred_destinations) ? pref.preferred_destinations : ['Pokhara'],
            languages: Array.isArray(pref.languages) && pref.languages.length > 0 ? pref.languages : ['English', 'Nepali'],
          });

          if (data.id) {
            try {
              const revRes = await reviewApi.getUserReviews(data.id);
              setReviews(revRes.results || revRes || []);
            } catch {}
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchFullProfile();
  }, []);

  const toggleArrayItem = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload = {
        profile: {
          display_name: profileData.display_name,
          bio: profileData.bio,
          location: profileData.location,
        },
        travel_preference: {
          ...preferences,
          budget_min: preferences.budget_min ? parseFloat(preferences.budget_min) : null,
          budget_max: preferences.budget_max ? parseFloat(preferences.budget_max) : null,
          preferred_duration_days: parseInt(preferences.preferred_duration_days, 10) || 7,
        },
      };

      const updated = await authApi.updateFullProfile(payload);
      if (setUser) setUser(updated);
      setSuccessMsg('Profile & Travel Preferences updated successfully! Your match recommendations will now use these criteria.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile preferences.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="trip-detail-loading">
        <div className="loading-spinner-ring"></div>
        <p>Loading Traveler Profile...</p>
      </div>
    );
  }

  const userProfile = user?.profile || {};

  return (
    <div className="profile-page-container">
      {/* Profile Header Dossier */}
      <div className="profile-hero-card">
        <div className="profile-hero-left">
          <div className="profile-avatar-large">
            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="profile-identity-info">
            <div className="profile-name-row">
              <h2>{profileData.display_name || user?.username}</h2>
              <span className="profile-role-badge">🎒 {user?.role ? user.role.toUpperCase() : 'TRAVELLER'}</span>
              <span className={`verification-badge status-${userProfile.verification_status || 'not_verified'}`}>
                {userProfile.verification_status === 'verified' ? '✓ Verified Traveler' : '🛡️ Standard Traveler'}
              </span>
            </div>
            <p className="profile-handle text-muted">@{user?.username} • {profileData.location || 'Nepal'}</p>
            <p className="profile-bio-snippet">{profileData.bio || 'Add a bio below to tell companions about your travel background!'}</p>
          </div>
        </div>

        <div className="profile-stats-panel">
          <div className="stat-stat-box">
            <span className="stat-number">⭐ {userProfile.average_rating ? Number(userProfile.average_rating).toFixed(1) : '5.0'}</span>
            <span className="stat-label">Reputation Rating</span>
          </div>
          <div className="stat-stat-box">
            <span className="stat-number">{userProfile.trips_completed || 0}</span>
            <span className="stat-label">Trips Completed</span>
          </div>
          <div className="stat-stat-box">
            <span className="stat-number">{reviews.length}</span>
            <span className="stat-label">Peer Reviews</span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="alert-banner-success mb-4">
          <span>✓ {successMsg}</span>
          <button className="alert-dismiss" onClick={() => setSuccessMsg('')}>✕</button>
        </div>
      )}
      {errorMsg && (
        <div className="alert-banner-error mb-4">
          <span>⚠️ {errorMsg}</span>
          <button className="alert-dismiss" onClick={() => setErrorMsg('')}>✕</button>
        </div>
      )}

      <form onSubmit={handleSave} className="profile-editor-layout">
        {/* Left Column: Personal Identity */}
        <div className="editor-card personal-info-card">
          <div className="editor-card-header">
            <h3>👤 Personal Details</h3>
            <p className="text-muted text-xs">How you appear to potential travel companions</p>
          </div>

          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input
              type="text"
              className="form-input"
              value={profileData.display_name}
              onChange={(e) => setProfileData({ ...profileData, display_name: e.target.value })}
              placeholder="e.g. Sagar Sharma"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Home Base / Location</label>
            <input
              type="text"
              className="form-input"
              value={profileData.location}
              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
              placeholder="e.g. Pokhara, Nepal"
            />
          </div>

          <div className="form-group">
            <label className="form-label">About You / Travel Bio</label>
            <textarea
              className="form-input"
              rows={4}
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              placeholder="Describe your hiking pace, photography interest, favorite trails, or what makes you a great companion..."
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Peer Reviews Snippet */}
          <div className="reviews-section-box mt-4">
            <h4>💬 Reviews from Companions ({reviews.length})</h4>
            {reviews.length === 0 ? (
              <p className="text-muted text-xs mt-2">No reviews recorded yet. Reviews are unlocked once you complete trips with other companions.</p>
            ) : (
              <div className="reviews-list mt-2">
                {reviews.map((r) => (
                  <div key={r.id} className="review-item-card">
                    <div className="review-top">
                      <strong>{r.reviewer_username || 'Companion'}</strong>
                      <span>⭐ {r.rating} / 5</span>
                    </div>
                    <p className="review-comment text-sm">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Travel Preferences for Nepal Matching (FR-2) */}
        <div className="editor-card preferences-card">
          <div className="editor-card-header">
            <h3>🏔️ Travel Preferences (8-Factor Matching)</h3>
            <p className="text-muted text-xs">Used directly by our matching engine to calculate compatibility percentage</p>
          </div>

          {/* Travel Styles */}
          <div className="form-group">
            <label className="form-label">Travel Styles (Select all that fit you)</label>
            <div className="pill-selection-row">
              {STYLE_OPTIONS.map((style) => {
                const isSelected = preferences.travel_styles.includes(style);
                return (
                  <button
                    key={style}
                    type="button"
                    className={`filter-pill-toggle ${isSelected ? 'active' : ''}`}
                    onClick={() => toggleArrayItem(preferences.travel_styles, (val) => setPreferences({ ...preferences, travel_styles: val }), style)}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activities / Interests */}
          <div className="form-group">
            <label className="form-label">Activities & Interests</label>
            <div className="pill-selection-row">
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = preferences.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    className={`filter-pill-toggle ${isSelected ? 'active' : ''}`}
                    onClick={() => toggleArrayItem(preferences.interests, (val) => setPreferences({ ...preferences, interests: val }), interest)}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget Range (NPR) */}
          <div className="form-row-2col">
            <div className="form-group">
              <label className="form-label">Min Budget (NPR)</label>
              <input
                type="number"
                className="form-input"
                value={preferences.budget_min}
                onChange={(e) => setPreferences({ ...preferences, budget_min: e.target.value })}
                placeholder="e.g. 8000"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Max Budget (NPR)</label>
              <input
                type="number"
                className="form-input"
                value={preferences.budget_max}
                onChange={(e) => setPreferences({ ...preferences, budget_max: e.target.value })}
                placeholder="e.g. 25000"
              />
            </div>
          </div>

          {/* Preferred Nepal Destinations */}
          <div className="form-group">
            <label className="form-label">Preferred Nepal Destinations</label>
            <div className="pill-selection-row">
              {NEPAL_DESTINATIONS.map((dest) => {
                const isSelected = preferences.preferred_destinations.includes(dest);
                return (
                  <button
                    key={dest}
                    type="button"
                    className={`filter-pill-toggle ${isSelected ? 'active' : ''}`}
                    onClick={() => toggleArrayItem(preferences.preferred_destinations, (val) => setPreferences({ ...preferences, preferred_destinations: val }), dest)}
                  >
                    {isSelected ? '📍 ' : '+ '}
                    {dest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transport, Stay & Duration */}
          <div className="form-row-3col">
            <div className="form-group">
              <label className="form-label">Preferred Transport</label>
              <CustomSelect
                value={preferences.preferred_transport}
                options={TRANSPORT_OPTIONS}
                onChange={(val) => setPreferences({ ...preferences, preferred_transport: val })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Stay</label>
              <CustomSelect
                value={preferences.preferred_accommodation}
                options={ACCOMMODATION_OPTIONS}
                onChange={(val) => setPreferences({ ...preferences, preferred_accommodation: val })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duration (Days)</label>
              <input
                type="number"
                min="1"
                max="60"
                className="form-input"
                value={preferences.preferred_duration_days}
                onChange={(e) => setPreferences({ ...preferences, preferred_duration_days: e.target.value })}
              />
            </div>
          </div>

          {/* Spoken Languages */}
          <div className="form-group">
            <label className="form-label">Languages Spoken</label>
            <div className="pill-selection-row">
              {LANGUAGE_OPTIONS.map((lang) => {
                const isSelected = preferences.languages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    className={`filter-pill-toggle ${isSelected ? 'active' : ''}`}
                    onClick={() => toggleArrayItem(preferences.languages, (val) => setPreferences({ ...preferences, languages: val }), lang)}
                  >
                    {isSelected ? '🗣️ ' : '+ '}
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="profile-action-save mt-4">
            <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
              {saving ? 'Saving Preferences...' : 'Save & Update Travel Matching Profile'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
