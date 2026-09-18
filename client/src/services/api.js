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

  const token = localStorage.getItem('craftloopToken') || localStorage.getItem('craftloop_token');
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

  // Authentication
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),

  // Messages (Phase 6)
  sendMessage: (receiverId, content) => api.post('/messages', { receiverId, content }),
  getConversations: () => api.get('/messages/conversations'),
  getConversation: (userId) => api.get(`/messages/conversation/${userId}`),
  markConversationAsRead: (userId) => api.put(`/messages/conversation/${userId}/read`, {}),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),

  // Courses
  getCourses: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/courses${query ? `?${query}` : ''}`);
  },
  getCourseById: (id) => api.get(`/courses/${id}`),
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),

  // Projects
  getProjects: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/projects${query ? `?${query}` : ''}`);
  },
  getProjectById: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),

  // Enrollments (Phase 5)
  enrollInCourse: (courseId) => api.post(`/enrollments/${courseId}`, {}),
  getMyLearning: () => api.get('/enrollments/me'),
  getMyEnrollment: (courseId) => api.get(`/enrollments/${courseId}`),
  updateLessonProgress: (courseId, data) => api.put(`/enrollments/${courseId}/progress`, data),
};

export default api;
