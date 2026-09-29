import { api } from './api';
import { setTokens, clearTokens } from '../utils/token';

export const authApi = {
  async login(username, password) {
    const data = await api.post('/accounts/auth/token/', { username, password });
    if (data.access) {
      setTokens(data.access, data.refresh);
    }
    return data;
  },

  async register(userData) {
    return api.post('/accounts/register/', userData);
  },

  async getProfile() {
    return api.get('/accounts/profile/');
  },

  async updatePreferences(preferences) {
    return api.patch('/accounts/preferences/', preferences);
  },

  logout() {
    clearTokens();
  }
};
