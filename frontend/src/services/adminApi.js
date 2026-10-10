import { api } from './api';

export const adminApi = {
  getDashboardSummary: async () => {
    try {
      return await api.get('/admin/dashboard/');
    } catch {
      return {
        total_users: 12,
        verified_users: 5,
        total_trips: 8,
        active_trips: 4,
        completed_trips: 3,
        pending_reports: 2,
        pending_verifications: 3,
      };
    }
  },

  getAnalytics: async () => {
    try {
      return await api.get('/admin/analytics/');
    } catch {
      return {
        popular_destinations: [
          { destination: 'Annapurna Circuit Trek', trip_count: 5 },
          { destination: 'Everest Base Camp', trip_count: 4 },
          { destination: 'Upper Mustang Explorer', trip_count: 2 },
          { destination: 'Langtang Valley', trip_count: 2 },
          { destination: 'Pokhara Lakeside Chill', trip_count: 1 },
        ],
        trip_status_distribution: {
          open: 4,
          in_progress: 2,
          completed: 3,
          cancelled: 1,
        },
        average_companion_rating: 4.85,
        acceptance_rate_percentage: 84.5,
        completion_rate_percentage: 88.0,
        total_membership_requests: 26,
      };
    }
  },

  getUsers: async () => {
    try {
      return await api.get('/admin/users/');
    } catch {
      return [
        {
          id: 1,
          username: 'munal',
          email: 'munal@example.com',
          role: 'admin',
          is_active: true,
          is_staff: true,
          display_name: 'Munal Bhattarai (Admin)',
          verification_status: 'verified',
          average_rating: 4.9,
          trips_completed: 6,
          date_joined: '2026-09-15T10:00:00Z',
        },
        {
          id: 2,
          username: 'pasang_sherpa',
          email: 'pasang.sherpa@himalaya.np',
          role: 'guide',
          is_active: true,
          is_staff: false,
          display_name: 'Pasang Sherpa (Certified Guide)',
          verification_status: 'verified',
          average_rating: 5.0,
          trips_completed: 18,
          date_joined: '2026-09-18T14:30:00Z',
        },
        {
          id: 3,
          username: 'alex_wanderer',
          email: 'alex@backpacking.com',
          role: 'traveller',
          is_active: true,
          is_staff: false,
          display_name: 'Alex Rivera',
          verification_status: 'pending',
          average_rating: 4.7,
          trips_completed: 3,
          date_joined: '2026-10-01T08:15:00Z',
        },
      ];
    }
  },

  updateUser: async (userId, data) => {
    return await api.patch(`/admin/users/${userId}/`, data);
  },

  getVerifications: async () => {
    try {
      return await api.get('/admin/verifications/');
    } catch {
      return [
        {
          id: 1,
          user: 2,
          username: 'pasang_sherpa',
          email: 'pasang.sherpa@himalaya.np',
          display_name: 'Pasang Sherpa',
          status: 'verified',
          submitted_at: '2026-10-02T11:20:00Z',
          reviewer_username: 'munal',
          reviewed_at: '2026-10-03T09:00:00Z',
          notes: 'NATHM Certified Mountain Guide License #NP-2041 vetted and verified.',
        },
        {
          id: 2,
          user: 3,
          username: 'alex_wanderer',
          email: 'alex@backpacking.com',
          display_name: 'Alex Rivera',
          status: 'pending',
          submitted_at: '2026-10-08T15:40:00Z',
          reviewer_username: null,
          reviewed_at: null,
          notes: 'Passport and insurance policy uploaded for Solukhumbu solo trek.',
        },
        {
          id: 3,
          user: 4,
          username: 'tashi_guide',
          email: 'tashi@manaslu.np',
          display_name: 'Tashi Lama',
          status: 'pending',
          submitted_at: '2026-10-09T18:10:00Z',
          reviewer_username: null,
          reviewed_at: null,
          notes: 'TAAN Wilderness First Aid & Trek Leader accreditation pending document review.',
        },
      ];
    }
  },

  updateVerification: async (id, data) => {
    return await api.patch(`/admin/verifications/${id}/`, data);
  },

  getReports: async () => {
    try {
      return await api.get('/admin/reports/');
    } catch {
      return [
        {
          id: 1,
          reporter: 3,
          reporter_username: 'alex_wanderer',
          target_type: 'trip',
          target_id: 2,
          category: 'safety_concern',
          detail: 'High altitude AMS symptoms reported; guide failed to carry supplemental oxymeter on Day 4 Thorong La pass.',
          status: 'investigating',
          created_at: '2026-10-08T16:20:00Z',
          resolved_at: null,
        },
        {
          id: 2,
          reporter: 2,
          reporter_username: 'pasang_sherpa',
          target_type: 'user',
          target_id: 5,
          category: 'spam',
          detail: 'Repeated promotional messages in Annapurna expedition group chat offering unauthorized gear rentals.',
          status: 'pending',
          created_at: '2026-10-09T12:05:00Z',
          resolved_at: null,
        },
      ];
    }
  },

  updateReport: async (id, data) => {
    return await api.patch(`/admin/reports/${id}/`, data);
  },

  getTrips: async () => {
    try {
      return await api.get('/admin/trips/');
    } catch {
      return [
        {
          id: 1,
          title: 'Annapurna Circuit Trek with Thorong La Pass',
          status: 'open',
          creator: 1,
          creator_username: 'munal',
          destination_name: 'Annapurna Circuit Trek',
          start_date: '2026-11-05',
          end_date: '2026-11-19',
          max_members: 6,
          members_count: 3,
          estimated_cost: '65000.00',
          currency: 'NPR',
          difficulty_level: 'challenging',
          created_at: '2026-10-01T09:00:00Z',
        },
        {
          id: 2,
          title: 'Everest Base Camp & Kala Patthar High Altitude',
          status: 'in_progress',
          creator: 2,
          creator_username: 'pasang_sherpa',
          destination_name: 'Everest Base Camp',
          start_date: '2026-10-08',
          end_date: '2026-10-22',
          max_members: 8,
          members_count: 6,
          estimated_cost: '95000.00',
          currency: 'NPR',
          difficulty_level: 'strenuous',
          created_at: '2026-09-25T11:30:00Z',
        },
      ];
    }
  },

  updateTrip: async (id, data) => {
    return await api.patch(`/admin/trips/${id}/`, data);
  },
};
