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

  const defaultHeaders = {};
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const token =
    localStorage.getItem('craftloopToken') ||
    localStorage.getItem('craftloop_token') ||
    localStorage.getItem('token');
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
      if (response.status === 401 && token) {
        // Stale or expired token rejected by backend
        localStorage.removeItem('craftloopToken');
        localStorage.removeItem('craftloop_token');
      }
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
  post: (endpoint, body, options) => {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
    });
  },
  put: (endpoint, body, options) => {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: isFormData ? body : JSON.stringify(body),
    });
  },
  delete: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
  health: () => apiRequest('/health'),

  // Authentication
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  getToken: () =>
    localStorage.getItem('craftloopToken') ||
    localStorage.getItem('craftloop_token') ||
    localStorage.getItem('token'),
  setAuth: (token, user) => {
    if (token) {
      localStorage.setItem('craftloopToken', token);
      localStorage.setItem('craftloop_token', token);
      localStorage.setItem('token', token);
    }
    if (user) {
      localStorage.setItem('craftloop_user', JSON.stringify(user));
      if (user.role) {
        localStorage.setItem('craftloopRole', user.role);
      }
      if (user.role === 'creator') {
        const existing = localStorage.getItem('craftloopCreatorProfile');
        if (!existing) {
          localStorage.setItem(
            'craftloopCreatorProfile',
            JSON.stringify({
              name: user.name,
              username: user.email ? user.email.split('@')[0] : 'creator',
              profession: user.title || 'Creator',
              bio: user.bio || '',
              skills: Array.isArray(user.skills)
                ? user.skills.join(', ')
                : (user.skills || 'UI/UX Design, Graphic Design, Branding'),
              location: 'India',
            })
          );
        }
      }
    }
  },
  logout: () => {
    localStorage.removeItem('craftloopToken');
    localStorage.removeItem('craftloop_token');
    localStorage.removeItem('token');
    localStorage.removeItem('craftloop_user');
    localStorage.removeItem('craftloopRole');
    localStorage.removeItem('craftloopCreatorProfile');
  },
  isAuthenticated: () =>
    Boolean(
      localStorage.getItem('craftloopToken') ||
      localStorage.getItem('craftloop_token') ||
      localStorage.getItem('token')
    ),

  // User Profile
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),

  // Community Posts
  getCommunityPosts: () => api.get('/community/posts'),
  createCommunityPost: (data) => api.post('/community/posts', data),
  likeCommunityPost: (id) => api.post(`/community/posts/${id}/like`, {}),
  commentCommunityPost: (id, text) => api.post(`/community/posts/${id}/comments`, { text }),
  deleteCommunityPost: (id) => api.delete(`/community/posts/${id}`),

  // Messages (Phase 6)
  sendMessage: (receiverId, content) => api.post('/messages', { receiverId, content }),
  getConversations: () => api.get('/messages/conversations'),
  getConversation: (userId) => api.get(`/messages/conversation/${userId}`),
  markConversationAsRead: (userId) => api.put(`/messages/conversation/${userId}/read`, {}),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),

  // Creators
  getCreators: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/creators${query ? `?${query}` : ''}`);
  },

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

  // AI Recommendation Assistant
  sendAIChat: (message) => api.post('/ai/chat', { message }),

  // Notifications (Phase 17)
  getNotifications: () => api.get('/notifications'),
  getUnreadNotificationCount: () => api.get('/notifications/unread-count'),
  markNotificationAsRead: (id) => api.put(`/notifications/${id}/read`, {}),
  markAllNotificationsAsRead: () => api.put('/notifications/read-all', {}),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),

  // Wallet & Balance (Phase 18)
  getWallet: () => api.get('/wallet'),
  withdrawBalance: (data) => api.post('/wallet/withdraw', data),

  // Help & Support (Phase 19)
  createSupportTicket: (data) => api.post('/support', data),
  getMySupportTickets: () => api.get('/support'),

  // Saved Projects / Bookmarks (Phase 20)
  getSavedProjects: () => api.get('/saved-projects'),
  getSavedProjectIds: () => api.get('/saved-projects/ids'),
  saveProject: (projectId) => api.post(`/saved-projects/${projectId}`, {}),
  unsaveProject: (projectId) => api.delete(`/saved-projects/${projectId}`),
  checkProjectSavedStatus: (projectId) => api.get(`/saved-projects/${projectId}/status`),

  // Media Upload Service (Phase 21)
  uploadMedia: (file, folder = 'craftloop') => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);
    return api.post('/upload', formData);
  },
};


export default api;
