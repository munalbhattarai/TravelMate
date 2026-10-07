import { api } from './api';

export const moderationApi = {
  async reportEntity({ target_type, target_id, category, detail }) {
    return api.post('/reports/', {
      target_type,
      target_id,
      category,
      detail,
    });
  },

  async blockUser(blockedUserId) {
    return api.post('/blocks/', {
      blocked: blockedUserId,
    });
  },

  async unblockUser(blockId) {
    return api.delete(`/blocks/${blockId}/`);
  },
};
