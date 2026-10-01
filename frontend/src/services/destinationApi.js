import { api } from './api';

export const destinationApi = {
  async getDestinations() {
    return api.get('/destinations/');
  }
};
