import { api } from './api';

export const matchingApi = {
  async getMatches(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/matches/${query ? '?' + query : ''}`);
  }
};

