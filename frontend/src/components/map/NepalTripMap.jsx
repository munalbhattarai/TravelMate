import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom styled pin with travel theme
const createTravelPin = (label = '📍', title = '') => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div class="pin-marker-bubble">
        <span class="pin-marker-emoji">${label}</span>
      </div>
      <div class="pin-marker-pulse"></div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -38],
  });
};

const DEFAULT_NEPAL_COORDS = [28.2096, 83.9856]; // Pokhara / Central Nepal

export default function NepalTripMap({ 
  trips = [], 
  singleTrip = null, 
  onSelectTrip,
  height = '500px' 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [activeLayer, setActiveLayer] = useState('osm'); // 'osm' | 'topo' | 'sat'
  const layersRef = useRef({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Teardown previous instance cleanly
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Determine initial center and zoom
    let center = DEFAULT_NEPAL_COORDS;
    let zoom = 7;

    if (singleTrip) {
      const lat = parseFloat(singleTrip.destination_latitude || singleTrip.latitude || 28.2096);
      const lon = parseFloat(singleTrip.destination_longitude || singleTrip.longitude || 83.9856);
      if (!isNaN(lat) && !isNaN(lon)) {
        center = [lat, lon];
        zoom = 10;
      }
    }

    // Initialize Leaflet map with smooth wheel and touch zooming
    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      scrollWheelZoom: true,
      touchZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      preferCanvas: true,
      zoomControl: true,
    });

    mapInstanceRef.current = map;

    // Prevent trackpad pinch or Ctrl+Wheel from zooming the entire browser window
    const container = mapContainerRef.current;
    const handleWheelZoom = (e) => {
      // If user pinches trackpad or presses Ctrl+Wheel, intercept and zoom the map directly
      if (e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
        if (mapInstanceRef.current) {
          if (e.deltaY < 0) {
            mapInstanceRef.current.zoomIn(0.5);
          } else if (e.deltaY > 0) {
            mapInstanceRef.current.zoomOut(0.5);
          }
        }
      }
    };
    container.addEventListener('wheel', handleWheelZoom, { passive: false });

    // Tile Layer 1: OpenStreetMap Standard (Fast, free, reliable, no API key)
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: ['a', 'b', 'c'],
      maxZoom: 19,
    });

    // Tile Layer 2: Esri World Topo Map (Realistic Himalayan contour lines & terrain relief)
    const topoLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, USGS',
      maxZoom: 18,
    });

    // Tile Layer 3: Esri World Imagery (Satellite photo view of mountains and valleys)
    const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Earthstar Geographics',
      maxZoom: 18,
    });

    layersRef.current = { osm: osmLayer, topo: topoLayer, sat: satLayer };

    // Add base layer control in top-right
    const baseMaps = {
      '🗺️ Standard Map': osmLayer,
      '🏔️ Himalayan Topo': topoLayer,
      '🛰️ Satellite View': satLayer,
    };

    osmLayer.addTo(map);
    L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

    // Plot single trip
    if (singleTrip) {
      let lat = parseFloat(singleTrip.destination_latitude || singleTrip.latitude);
      let lon = parseFloat(singleTrip.destination_longitude || singleTrip.longitude);

      if (isNaN(lat) || isNaN(lon)) {
        const destLower = (singleTrip.destination_name || singleTrip.title || '').toLowerCase();
        if (destLower.includes('langtang')) { lat = 28.2100; lon = 85.5700; }
        else if (destLower.includes('annapurna')) { lat = 28.5300; lon = 83.8780; }
        else if (destLower.includes('everest')) { lat = 28.0040; lon = 86.8530; }
        else if (destLower.includes('kathmandu') || destLower.includes('ktm')) { lat = 27.7172; lon = 85.3240; }
        else if (destLower.includes('mustang')) { lat = 29.1824; lon = 83.9570; }
        else if (destLower.includes('chitwan')) { lat = 27.5341; lon = 84.4533; }
        else if (destLower.includes('rara')) { lat = 29.5312; lon = 82.0833; }
        else { lat = 28.2096; lon = 83.9856; }
      }

      const marker = L.marker([lat, lon], { 
        icon: createTravelPin('🏔️', singleTrip.title) 
      }).addTo(map);

      const budgetFormatted = singleTrip.budget ? `NPR ${Number(singleTrip.budget).toLocaleString()}` : '';

      marker.bindPopup(`
        <div class="map-popup-card">
          <div class="map-popup-header">
            <h4>${singleTrip.title || 'Trip Destination'}</h4>
            <span class="status-badge badge-primary">${(singleTrip.status || 'open').toUpperCase()}</span>
          </div>
          <p class="map-popup-dest">📍 <strong>${singleTrip.destination_name || 'Nepal Destination'}</strong></p>
          ${singleTrip.destination_region ? `<p class="map-popup-sub">Region: ${singleTrip.destination_region}</p>` : ''}
          ${budgetFormatted ? `<p class="map-popup-budget">💰 Est. Budget: <strong>${budgetFormatted}</strong></p>` : ''}
          <div class="map-popup-coords">GPS: ${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E</div>
        </div>
      `, { maxWidth: 300 }).openPopup();

      map.setView([lat, lon], 10);
    } 
    // Plot multiple trips across Nepal
    else if (trips.length > 0) {
      const bounds = [];

      trips.forEach((t) => {
        let lat = parseFloat(t.destination_latitude || t.latitude);
        let lon = parseFloat(t.destination_longitude || t.longitude);

        if (isNaN(lat) || isNaN(lon)) {
          const destLower = (t.destination_name || t.title || '').toLowerCase();
          if (destLower.includes('annapurna')) { lat = 28.5300; lon = 83.8780; }
          else if (destLower.includes('everest')) { lat = 28.0040; lon = 86.8530; }
          else if (destLower.includes('kathmandu') || destLower.includes('ktm')) { lat = 27.7172; lon = 85.3240; }
          else if (destLower.includes('mustang')) { lat = 29.1824; lon = 83.9570; }
          else if (destLower.includes('chitwan')) { lat = 27.5341; lon = 84.4533; }
          else if (destLower.includes('langtang')) { lat = 28.2100; lon = 85.5700; }
          else if (destLower.includes('rara')) { lat = 29.5312; lon = 82.0833; }
          else { lat = 28.2096; lon = 83.9856; }
        }

        bounds.push([lat, lon]);
        const marker = L.marker([lat, lon], { 
          icon: createTravelPin('🧭', t.title) 
        }).addTo(map);

        const budgetFormatted = t.budget ? `NPR ${Number(t.budget).toLocaleString()}` : 'Flexible';

        marker.bindPopup(`
          <div class="map-popup-card">
            <h4>${t.title}</h4>
            <p class="map-popup-dest">📍 ${t.destination_name || 'Nepal'}</p>
            <p class="map-popup-budget">💰 ${budgetFormatted}</p>
            <div class="map-popup-dates">📅 ${t.start_date || 'Flexible'} → ${t.end_date || ''}</div>
            <button class="map-popup-btn" id="btn-popup-trip-${t.id}">
              Open Trip Details →
            </button>
          </div>
        `, { maxWidth: 280 });

        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-popup-trip-${t.id}`);
          if (btn && onSelectTrip) {
            btn.onclick = () => onSelectTrip(t.id);
          }
        });
      });

      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      } else if (bounds.length === 1) {
        map.setView(bounds[0], 9);
      }
    }

    // Invalidate size to ensure tiles render properly even inside tab changes
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);

    // ResizeObserver ensures smooth re-render when switching tabs or resizing window
    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(timer);
      if (container) {
        container.removeEventListener('wheel', handleWheelZoom);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [trips, singleTrip]);

  return (
    <div className="nepal-map-container-box">
      <div 
        ref={mapContainerRef} 
        style={{ 
          height, 
          width: '100%', 
          borderRadius: '16px', 
          overflow: 'hidden',
          zIndex: 10,
          background: '#e5e3df'
        }} 
      />
    </div>
  );
}
