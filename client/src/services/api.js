/**
 * API Service Client for CraftLoop
 * Standardizes communication with the Express backend
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Generic fetch wrapper
 * @param {string} endpoint 
 * @param {RequestInit} [options] 
 * @returns {Promise<any>}
 */
export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('craftloop_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error((data && data.message) || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

/**
 * Convenience methods
 */
export const api = {
  get: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
  health: () => apiRequest('/health'),
};

export default api;
