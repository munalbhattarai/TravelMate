import { api } from './api';

export const notificationApi = {
  async getNotifications(unreadOnly = false) {
    return api.get(`/notifications/${unreadOnly ? '?unread=true' : ''}`);
  },

  async markAsRead(notificationId) {
    return api.post(`/notifications/${notificationId}/read/`, {});
  },

  async markAllAsRead() {
    return api.post('/notifications/read-all/', {});
  }
};

