import { api } from './api';

export const tripApi = {
  async getTrips(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/trips/${query ? '?' + query : ''}`);
  },

  async getTrip(tripId) {
    return api.get(`/trips/${tripId}/`);
  },

  async createTrip(tripData) {
    return api.post('/trips/', tripData);
  },

  async requestJoin(tripId) {
    return api.post(`/trips/${tripId}/join/`, {});
  },

  async acceptMember(tripId, membershipId) {
    return api.post(`/trips/${tripId}/members/${membershipId}/accept/`, {});
  },

  async rejectMember(tripId, membershipId) {
    return api.post(`/trips/${tripId}/members/${membershipId}/reject/`, {});
  },

  async updateTripStatus(tripId, status) {
    return api.patch(`/trips/${tripId}/`, { status });
  },

  async getItinerary(tripId) {
    return api.get(`/trips/${tripId}/itineraries/`);
  },

<<<<<<< HEAD
  async addItineraryDay(tripId, data) {
    return api.post(`/trips/${tripId}/itineraries/`, data);
  },

=======
>>>>>>> 7c246394e7074765dc469146b61ae7725615cb5f
  async getMemberships(tripId) {
    return api.get(`/trips/${tripId}/memberships/`);
  },

  async getExpenses(tripId) {
    return api.get(`/expenses/?trip=${tripId}`);
  },

  async addExpense(data) {
    return api.post('/expenses/', data);
  }
};
