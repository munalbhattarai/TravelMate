import React, { useState, useEffect } from 'react';
import { tripApi } from '../../services/tripApi';
import { destinationApi } from '../../services/destinationApi';
import CustomSelect from '../ui/CustomSelect';

const STYLE_OPTIONS = [
  { value: 'adventure', label: 'Adventure & Trekking' },
  { value: 'cultural', label: 'Cultural & Heritage' },
  { value: 'nature', label: 'Nature / Trekking' },
  { value: 'relaxation', label: 'Lakeside & Relaxation' },
];

const TRANSPORT_OPTIONS = [
  { value: 'bus', label: 'Tourist Bus' },
  { value: 'car', label: 'Private Car / 4x4 Jeep' },
  { value: 'flight', label: 'Domestic Flight' },
  { value: 'bike', label: 'Motorbike / Scooter' },
];

const ACCOMMODATION_OPTIONS = [
  { value: 'hostel', label: 'Hostel / Teahouse' },
  { value: 'hotel', label: 'Standard Hotel' },
  { value: 'homestay', label: 'Local Homestay' },
  { value: 'camping', label: 'Alpine Camping' },
];

export default function CreateTripModal({ isOpen, onClose, onTripCreated }) {
  const [destinations, setDestinations] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    description: '',
    start_date: '',
    end_date: '',
    budget: '',
    max_members: 4,
    travel_style: 'adventure',
    transport: 'bus',
    accommodation: 'hostel',
    status: 'open',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      destinationApi.getDestinations().then((res) => {
        const list = res.results || res || [];
        setDestinations(list);
        if (list.length > 0) {
          setFormData((prev) => prev.destination ? prev : { ...prev, destination: list[0].id });
        }
      }).catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.destination) {
      setError('Please select a destination in Nepal.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        destination: parseInt(formData.destination, 10),
        budget: parseFloat(formData.budget),
        max_members: parseInt(formData.max_members, 10),
      };
      const created = await tripApi.createTrip(payload);
      if (onTripCreated) onTripCreated(created);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  const destinationOptions = destinations.map((d) => ({
    value: d.id,
    label: `${d.name} (${d.region || d.country})`
  }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', width: '92%' }}>
        <div className="modal-header">
          <div>
            <h3>Plan a New Nepal Trip</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Publish your itinerary to find matching travel companions</p>
          </div>
          <button className="btn-icon-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert-error mb-4">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Trip Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g. 5-Day Annapurna Base Camp Trek"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Destination in Nepal</label>
            <CustomSelect
              value={formData.destination}
              options={destinationOptions}
              onChange={(val) => setFormData((prev) => ({ ...prev, destination: val }))}
              placeholder="Select Nepal destination..."
              icon="📍"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Start Date</label>
              <input
                type="date"
                name="start_date"
                className="form-input"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">End Date</label>
              <input
                type="date"
                name="end_date"
                className="form-input"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Estimated Budget (NPR)</label>
              <input
                type="number"
                name="budget"
                className="form-input"
                placeholder="e.g. 12000"
                value={formData.budget}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Max Members (Capacity)</label>
              <input
                type="number"
                name="max_members"
                min="2"
                max="20"
                className="form-input"
                value={formData.max_members}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Travel Style</label>
              <CustomSelect
                value={formData.travel_style}
                options={STYLE_OPTIONS}
                onChange={(val) => setFormData((prev) => ({ ...prev, travel_style: val }))}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Transport</label>
              <CustomSelect
                value={formData.transport}
                options={TRANSPORT_OPTIONS}
                onChange={(val) => setFormData((prev) => ({ ...prev, transport: val }))}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Stay</label>
              <CustomSelect
                value={formData.accommodation}
                options={ACCOMMODATION_OPTIONS}
                onChange={(val) => setFormData((prev) => ({ ...prev, accommodation: val }))}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Description & Expectations</label>
            <textarea
              name="description"
              className="form-input"
              rows={3}
              placeholder="Outline what you want to do, required gear, meeting points..."
              value={formData.description}
              onChange={handleChange}
              style={{ resize: 'vertical', borderRadius: '12px' }}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Creating Nepal Trip...' : 'Publish Trip to Discover Partners'}
          </button>
        </form>
      </div>
    </div>
  );
}
