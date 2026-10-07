import { api } from './api';

export const reviewApi = {
  async getTripReviews(tripId) {
    return api.get(`/reviews/?trip=${tripId}`);
  },

  async getUserReviews(userId) {
    return api.get(`/reviews/?user=${userId}`);
  },

  async submitReview({ trip, reviewed_user, rating, comment }) {
    return api.post('/reviews/', {
      trip,
      reviewed_user,
      rating: parseInt(rating, 10),
      comment,
    });
  },
};
