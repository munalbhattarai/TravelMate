import { api } from './api';

// High-speed In-Memory Cache Layer with SWR (Stale-While-Revalidate)
const tripsListCache = new Map();
const singleTripCache = new Map();
const itineraryCache = new Map();
const membershipCache = new Map();
const CACHE_TTL_MS = 90 * 1000; // 90 seconds cache

export const tripApi = {
  getCachedTrip(tripId) {
    const entry = singleTripCache.get(String(tripId));
    if (entry && (Date.now() - entry.timestamp < CACHE_TTL_MS)) {
      return entry.data;
    }
    return null;
  },

  clearCache() {
    tripsListCache.clear();
    singleTripCache.clear();
    itineraryCache.clear();
    membershipCache.clear();
  },

  async getTrips(params = {}) {
    const query = new URLSearchParams(params).toString();
    const cacheKey = query || 'all';
    const cached = tripsListCache.get(cacheKey);

    // If cache is fresh, return immediately
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      // Background revalidate if older than 15 seconds
      if (Date.now() - cached.timestamp > 15000) {
        api.get(`/trips/${query ? '?' + query : ''}`).then((fresh) => {
          tripsListCache.set(cacheKey, { data: fresh, timestamp: Date.now() });
          const list = fresh?.results || fresh;
          if (Array.isArray(list)) {
            for (const t of list) {
              if (t?.id) singleTripCache.set(String(t.id), { data: t, timestamp: Date.now() });
            }
          }
        }).catch(() => {});
      }
      return cached.data;
    }

    const data = await api.get(`/trips/${query ? '?' + query : ''}`);
    tripsListCache.set(cacheKey, { data, timestamp: Date.now() });

    // Pre-seed single trips into cache so detail views load in 0ms
    const list = data?.results || data;
    if (Array.isArray(list)) {
      for (const t of list) {
        if (t?.id) {
          singleTripCache.set(String(t.id), { data: t, timestamp: Date.now() });
        }
      }
    }

    return data;
  },

  async getTrip(tripId) {
    const idStr = String(tripId);
    const cached = singleTripCache.get(idStr);

    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      // Background revalidate if older than 10s
      if (Date.now() - cached.timestamp > 10000) {
        api.get(`/trips/${tripId}/`).then((fresh) => {
          singleTripCache.set(idStr, { data: fresh, timestamp: Date.now() });
        }).catch(() => {});
      }
      return cached.data;
    }

    const data = await api.get(`/trips/${tripId}/`);
    singleTripCache.set(idStr, { data, timestamp: Date.now() });
    return data;
  },

  async createTrip(tripData) {
    this.clearCache();
    return api.post('/trips/', tripData);
  },

  async requestJoin(tripId) {
    this.clearCache();
    return api.post(`/trips/${tripId}/join/`, {});
  },

  async acceptMember(tripId, membershipId) {
    this.clearCache();
    return api.post(`/trips/${tripId}/members/${membershipId}/accept/`, {});
  },

  async rejectMember(tripId, membershipId) {
    this.clearCache();
    return api.post(`/trips/${tripId}/members/${membershipId}/reject/`, {});
  },

  async updateTripStatus(tripId, status) {
    this.clearCache();
    return api.patch(`/trips/${tripId}/`, { status });
  },

  async startTrip(tripId) {
    this.clearCache();
    return api.post(`/trips/${tripId}/start/`, {});
  },

  async completeTrip(tripId) {
    this.clearCache();
    return api.post(`/trips/${tripId}/complete/`, {});
  },

  async cancelTrip(tripId) {
    this.clearCache();
    return api.post(`/trips/${tripId}/cancel/`, {});
  },

  async leaveTrip(tripId) {
    this.clearCache();
    return api.post(`/trips/${tripId}/leave/`, {});
  },

  async getItinerary(tripId) {
    const idStr = String(tripId);
    const cached = itineraryCache.get(idStr);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      return cached.data;
    }
    const data = await api.get(`/trips/${tripId}/itineraries/`);
    itineraryCache.set(idStr, { data, timestamp: Date.now() });
    return data;
  },

  async addItineraryDay(tripId, data) {
    itineraryCache.delete(String(tripId));
    return api.post(`/trips/${tripId}/itineraries/`, data);
  },

  async getMemberships(tripId) {
    const idStr = String(tripId);
    const cached = membershipCache.get(idStr);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      return cached.data;
    }
    const data = await api.get(`/trips/${tripId}/memberships/`);
    membershipCache.set(idStr, { data, timestamp: Date.now() });
    return data;
  },

  async getExpenses(tripId) {
    return api.get(`/expenses/?trip=${tripId}`);
  },

  async addExpense(data) {
    return api.post('/expenses/', data);
  }
};
