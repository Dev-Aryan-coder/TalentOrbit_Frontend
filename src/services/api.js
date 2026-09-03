import axios from 'axios';

/**
 * TalentOrbit Axios Client
 * Configured for Spring Boot backend on http://localhost:8080/api
 */
export const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for unified, real error messaging
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let customMessage = 'An unexpected server error occurred.';

    if (error.response) {
      // Server responded with non-2xx status code
      const data = error.response.data;
      customMessage = 
        data?.message || 
        data?.error || 
        (typeof data === 'string' ? data : `Server responded with status ${error.response.status}`);
    } else if (error.request) {
      // The request was made but no response was received (e.g. backend down / connection refused)
      customMessage = 'Backend connection error: Could not reach Spring Boot server at http://localhost:8080. Please verify your backend application is running.';
    } else {
      customMessage = error.message;
    }

    return Promise.reject(new Error(customMessage));
  }
);

/**
 * 1. Authentication APIs (AuthController.java)
 */
export const authAPI = {
  login: (email, password) => {
    return apiClient.post('/auth/login', { email, password });
  },

  signup: (email, password, role, fullName) => {
    return apiClient.post('/auth/signup', { email, password, role, fullName });
  },
};

/**
 * 2. Tamper-Proof Cryptographic Badges APIs (BadgeController.java)
 */
export const badgesAPI = {
  getStudentBadges: (userId) => {
    return apiClient.get(`/badges/student/${userId}`);
  },

  verifyBadge: (hash) => {
    return apiClient.get(`/badges/verify/${encodeURIComponent(hash)}`);
  },

  awardBadge: (userId, badgeId, score = 90) => {
    return apiClient.post(`/badges/award?userId=${userId}&badgeId=${badgeId}&score=${score}`);
  },
};

/**
 * 3. Industry Postings & Internships (PostingController.java)
 */
export const postingsAPI = {
  getAll: () => {
    return apiClient.get('/postings');
  },

  getById: (id) => {
    return apiClient.get(`/postings/${id}`);
  },
};

/**
 * 4. Applications Management (ApplicationController.java)
 */
export const applicationsAPI = {
  getByUser: (userId) => {
    return apiClient.get(`/applications/user/${userId}`);
  },

  apply: (userId, postingId) => {
    return apiClient.post(`/applications/apply?userId=${userId}&postingId=${postingId}`);
  },
};

/**
 * 5. Student Digital Portfolio (PortfolioController.java)
 */
export const portfolioAPI = {
  getByUser: (userId) => {
    return apiClient.get(`/portfolio/user/${userId}`);
  },
};

export default {
  auth: authAPI,
  badges: badgesAPI,
  postings: postingsAPI,
  applications: applicationsAPI,
  portfolio: portfolioAPI,
};
