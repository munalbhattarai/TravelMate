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
      const refreshRes = await fetch(`${API_BASE}/auth/refresh/`, {
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
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    } catch {
      clearTokens();
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
  }

  if (!response.ok) {
    if (response.status === 502) {
      throw new Error('Backend server is unreachable (502 Bad Gateway). Please make sure the Django server is running on port 8000.');
    }
    if (response.status === 503) {
      throw new Error('Service is temporarily unavailable (503). Please try again shortly.');
    }
    if (response.status === 504) {
      throw new Error('Gateway timeout (504): The server took too long to respond.');
    }

    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: response.statusText || 'An error occurred' };
    }

    let errorMessage = '';
    if (typeof errorData === 'string') {
      errorMessage = errorData;
    } else if (errorData.detail) {
      errorMessage = errorData.detail;
    } else if (errorData.message) {
      errorMessage = errorData.message;
    } else if (errorData.non_field_errors) {
      errorMessage = Array.isArray(errorData.non_field_errors)
        ? errorData.non_field_errors.join(' ')
        : String(errorData.non_field_errors);
    } else if (typeof errorData === 'object' && errorData !== null) {
      const fieldErrors = Object.entries(errorData)
        .map(([field, errs]) => {
          const text = Array.isArray(errs) ? errs.join(' ') : String(errs);
          const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ');
          return `${fieldName}: ${text}`;
        });
      if (fieldErrors.length > 0) {
        errorMessage = fieldErrors.join(' | ');
      }
    }

    throw new Error(errorMessage || 'Request failed. Please check your inputs and try again.');
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
