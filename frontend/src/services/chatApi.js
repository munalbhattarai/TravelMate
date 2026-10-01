import { api } from './api';

export const chatApi = {
  async getTripMessages(tripId) {
    return api.get(`/trips/${tripId}/messages/`);
  },
  async sendMessage(tripId, content) {
    return api.post(`/trips/${tripId}/messages/`, { content });
  }
};
