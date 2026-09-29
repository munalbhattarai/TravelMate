// Modern Fetch API client with Bearer Token Injection & 401 Refresh Handling
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../utils/token';

const API_BASE = '/api/v1';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(url, { ...options, headers });

  // Handle Token Refresh on 401 Unauthorized
  if (response.status === 401 && getRefreshToken()) {
    try {
      const refreshRes = await fetch(`${API_BASE}/accounts/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: getRefreshToken() }),
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        setTokens(data.access, getRefreshToken());
        headers['Authorization'] = `Bearer ${data.access}`;
        response = await fetch(url, { ...options, headers });
      } else {
        clearTokens();
        window.location.href = '/login';
      }
    } catch {
      clearTokens();
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(errorData.detail || errorData.message || 'Request failed');
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, data, options) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
  patch: (endpoint, data, options) => request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(data) }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
};
