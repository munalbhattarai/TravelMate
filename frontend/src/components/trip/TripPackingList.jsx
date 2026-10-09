import React, { useState, useEffect } from 'react';

const DEFAULT_CATEGORIES = [
  {
    id: 'permits',
    title: '📄 Permits, Insurance & Identity',
    items: [
      { id: 'p1', name: 'TIMS Card (Trekker Information Management System)', essential: true },
      { id: 'p2', name: 'Conservation Area / National Park Entry Permit (ACAP/Sagarmatha)', essential: true },
      { id: 'p3', name: 'Valid Passport + 4 Passport Photos (for checkpoints)', essential: true },
      { id: 'p4', name: 'Travel Insurance with Helicopter Medevac Cover (>5000m)', essential: true },
      { id: 'p5', name: 'NPR Cash in Small Bills (ATMs absent on trails)', essential: true },
    ]
  },
  {
    id: 'clothing',
    title: '🏔️ High Altitude Trekking Layers',
    items: [
      { id: 'c1', name: '4-Season Down Jacket (rated down to -10°C)', essential: true },
      { id: 'c2', name: 'Wind & Waterproof Outer Shell Jacket (GORE-TEX)', essential: true },
      { id: 'c3', name: 'Thermal Base Layers (Merino Wool tops & bottoms)', essential: true },
      { id: 'c4', name: 'Sturdy Waterproof Hiking Boots (Broken-in)', essential: true },
      { id: 'c5', name: 'Moisture-wicking Trekking Socks (3-4 pairs)', essential: false },
      { id: 'c6', name: 'Fleece Mid-layer Jacket & Trekking Pants', essential: false },
      { id: 'c7', name: 'Thermal Beanie & Sun Hat with neck flap', essential: false },
      { id: 'c8', name: 'Insulated Windproof Gloves & Liner Gloves', essential: true },
    ]
  },
  {
    id: 'medical',
    title: '💊 High Altitude Health & First Aid',
    items: [
      { id: 'm1', name: 'Acetazolamide (Diamox) for Altitude Sickness (AMS)', essential: true },
      { id: 'm2', name: 'Water Purification Tablets (Aquatabs / Iodine)', essential: true },
      { id: 'm3', name: 'Oral Rehydration Salts (ORS) & Electrolytes', essential: true },
      { id: 'm4', name: 'Blister Prevention Tape (Compeed / Leukotape)', essential: true },
      { id: 'm5', name: 'Broad-spectrum Antibiotics & Painkillers (Paracetamol/Ibuprofen)', essential: false },
      { id: 'm6', name: 'High-SPF 50+ Sunscreen & UV Lip Balm', essential: true },
    ]
  },
  {
    id: 'gear',
    title: '🎒 Trekking Hardware & Electronics',
    items: [
      { id: 'g1', name: 'Trekking Poles with shock absorbers (Pair)', essential: true },
      { id: 'g2', name: 'Sleeping Bag (Rated -10°C Comfort)', essential: true },
      { id: 'g3', name: '20,000mAh Power Bank (Cold drains batteries fast)', essential: true },
      { id: 'g4', name: 'LED Headlamp + Extra Lithium Batteries', essential: true },
      { id: 'g5', name: 'Category 3/4 UV Polarized Glacier Sunglasses', essential: true },
      { id: 'g6', name: '1L Insulated Hot-Water Safe Bottle (Nalgene)', essential: true },
      { id: 'g7', name: 'Daypack (30-40L) with Waterproof Rain Cover', essential: true },
      { id: 'g8', name: 'Microfiber Quick-dry Towel & Biodegradable Soap', essential: false },
    ]
  }
];

export default function TripPackingList({ tripId, destinationName }) {
  const storageKey = `travelmate_packing_v1_${tripId}`;

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_CATEGORIES;
  });

  const [newItemName, setNewItemName] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('gear');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(categories));
    } catch (e) {
      console.warn('Could not save packing list to localStorage', e);
    }
  }, [categories, storageKey]);

  const toggleItem = (catId, itemId) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== catId) return cat;
        return {
          ...cat,
          items: cat.items.map((item) =>
            item.id === itemId ? { ...item, packed: !item.packed } : item
          )
        };
      })
    );
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem = {
      id: `custom_${Date.now()}`,
      name: newItemName.trim(),
      packed: false,
      essential: false,
      custom: true
    };

    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== selectedCatId) return cat;
        return {
          ...cat,
          items: [...cat.items, newItem]
        };
      })
    );

    setNewItemName('');
  };

  const handleRemoveCustomItem = (catId, itemId) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== catId) return cat;
        return {
          ...cat,
          items: cat.items.filter((item) => item.id !== itemId)
        };
      })
    );
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset packing checklist to standard Nepal expedition defaults?')) {
      setCategories(DEFAULT_CATEGORIES);
    }
  };

  const allItems = categories.flatMap((c) => c.items);
  const packedItems = allItems.filter((i) => i.packed);
  const progressPercent = allItems.length > 0 ? Math.round((packedItems.length / allItems.length) * 100) : 0;

  const filteredCategories = activeCategoryFilter === 'all'
    ? categories
    : categories.filter((c) => c.id === activeCategoryFilter);

  return (
    <div className="packing-list-container">
      {/* Top Banner & Progress Header */}
      <div className="packing-header-card">
        <div className="packing-header-meta">
          <div>
            <h3 className="packing-title">🎒 Nepal Expedition Packing & Gear Coordinator</h3>
            <p className="packing-subtitle">
              Interactive preparation checklist for <strong>{destinationName || 'Nepal Himalayan Trails'}</strong>. Keep all companions aligned on permits, alpine layers, and medical gear.
            </p>
          </div>
          <button className="btn btn-outline btn-xs btn-reset-checklist" onClick={handleResetDefaults}>
            ↺ Reset Defaults
          </button>
        </div>

        {/* Progress Bar */}
        <div className="packing-progress-bar-wrap">
          <div className="packing-progress-info">
            <span className="packing-progress-count">
              ✓ <strong>{packedItems.length}</strong> of <strong>{allItems.length}</strong> items prepared
            </span>
            <span className="packing-progress-badge">{progressPercent}% Ready</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${progressPercent}%`,
                background: progressPercent === 100 ? '#10b981' : 'var(--primary)'
              }}
            ></div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="packing-filter-pills">
          <button
            className={`pill-filter-btn ${activeCategoryFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategoryFilter('all')}
          >
            All Items ({allItems.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              className={`pill-filter-btn ${activeCategoryFilter === c.id ? 'active' : ''}`}
              onClick={() => setActiveCategoryFilter(c.id)}
            >
              {c.title.split(' ')[0]} {c.id.toUpperCase()} ({c.items.filter(i => i.packed).length}/{c.items.length})
            </button>
          ))}
        </div>
      </div>

      {/* Add Custom Item Form */}
      <form className="packing-add-form" onSubmit={handleAddItem}>
        <div className="packing-add-input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Add custom gear (e.g. Crampons, Drone permit, Snacks)..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <select
            className="form-control packing-category-select"
            value={selectedCatId}
            onChange={(e) => setSelectedCatId(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary btn-add-gear">
            + Add Gear
          </button>
        </div>
      </form>

      {/* Gear Categories & Checklist Items */}
      <div className="packing-categories-grid">
        {filteredCategories.map((cat) => {
          const catPacked = cat.items.filter((i) => i.packed).length;
          return (
            <div key={cat.id} className="packing-category-card">
              <div className="packing-category-header">
                <h4>{cat.title}</h4>
                <span className="cat-completion-badge">
                  {catPacked} / {cat.items.length}
                </span>
              </div>

              <div className="packing-items-list">
                {cat.items.map((item) => (
                  <label
                    key={item.id}
                    className={`packing-item-row ${item.packed ? 'item-checked' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={!!item.packed}
                      onChange={() => toggleItem(cat.id, item.id)}
                      className="packing-checkbox"
                    />
                    <div className="item-text-wrapper">
                      <span className="item-name">{item.name}</span>
                      {item.essential && (
                        <span className="badge-essential">Essential</span>
                      )}
                    </div>
                    {item.custom && (
                      <button
                        type="button"
                        className="btn-delete-item"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveCustomItem(cat.id, item.id);
                        }}
                        title="Delete custom item"
                      >
                        ✕
                      </button>
                    )}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
