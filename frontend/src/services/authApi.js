import { api } from './api';
import { setTokens, clearTokens } from '../utils/token';

export const authApi = {
  async login(username, password) {
    const data = await api.post('/auth/login/', { username, password });
    if (data.access) {
      setTokens(data.access, data.refresh);
    }
    return data;
  },

  async register(userData) {
    return api.post('/auth/register/', userData);
  },

  async getProfile() {
    return api.get('/auth/me/');
  },

  async updatePreferences(preferences) {
    return api.patch('/auth/me/', { travel_preference: preferences });
  },

  logout() {
    clearTokens();
  }
};
