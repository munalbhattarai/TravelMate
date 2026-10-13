import { api } from './api';

let cachedDestinations = null;
let cacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const destinationApi = {
  async getDestinations() {
    if (cachedDestinations && (Date.now() - cacheTime < CACHE_TTL_MS)) {
      return cachedDestinations;
    }
    const data = await api.get('/destinations/');
    cachedDestinations = data;
    cacheTime = Date.now();
    return data;
  },

  clearCache() {
    cachedDestinations = null;
    cacheTime = 0;
  }
};
