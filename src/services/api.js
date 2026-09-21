import axios from 'axios';
import { formatSkillWithTag, stripSkillTag } from '../lib/skillCategories';

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
    return apiClient.get('/postings/active');
  },

  getActive: () => {
    return apiClient.get('/postings/active');
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
    return apiClient.post('/applications/apply', { userId, postingId });
  },
};

/**
 * 5. Student Digital Portfolio (PortfolioController.java)
 */
export const portfolioAPI = {
  getByUser: (userId, type = null) => {
    const url = type ? `/portfolio/user/${userId}?type=${type}` : `/portfolio/user/${userId}`;
    return apiClient.get(url);
  },

  addItem: (payload) => {
    return apiClient.post('/portfolio/add', payload);
  },

  verifyItem: (id) => {
    return apiClient.get(`/portfolio/${id}/verify`);
  },
};

/**
 * 6. User Profile & Account Settings (UserProfileController.java)
 */
export const profileAPI = {
  getProfile: (userId) => {
    return apiClient.get(`/user-profile/${userId}`);
  },

  updateProfile: (userId, profileData) => {
    return apiClient.put(`/user-profile/${userId}`, profileData);
  },

  changePassword: (userId, currentPassword, newPassword) => {
    return apiClient.put(`/user-profile/${userId}/change-password`, {
      currentPassword,
      newPassword,
    });
  },
};

/**
 * 7. Dashboard Metrics & Analytics (DashboardController.java)
 */
export const dashboardAPI = {
  getStats: (role = 'STUDENT', userId = null) => {
    const url = userId ? `/dashboard/stats?role=${role}&userId=${userId}` : `/dashboard/stats?role=${role}`;
    return apiClient.get(url);
  },

  getSkillGaps: (institutionId = null) => {
    const url = institutionId ? `/admin/skill-gaps?institutionId=${institutionId}` : '/admin/skill-gaps';
    return apiClient.get(url);
  },
};

/**
 * 8. Student Profile & Role Matching (StudentController.java)
 */
export const studentAPI = {
  getProfile: (userId) => {
    return apiClient.get(`/students/${userId}`);
  },

  updateProfile: (userId, profileData) => {
    return apiClient.put(`/students/${userId}`, profileData);
  },

  getCareerSuggestions: (userId) => {
    return apiClient.get(`/students/${userId}/career-suggestions`);
  },

  getMatchedPostings: (userId) => {
    return apiClient.get(`/students/${userId}/matched-postings`);
  },

  saveOnboardingSkills: async (userId, payload) => {
    const targetUserId = userId || 1;
    const cleanLangs = (payload.languages || []).map((s) => stripSkillTag(s)).filter(Boolean);
    const cleanLibs = (payload.libraries || []).map((s) => stripSkillTag(s)).filter(Boolean);
    const cleanFws = (payload.frameworks || []).map((s) => stripSkillTag(s)).filter(Boolean);
    const cleanTls = (payload.tools || []).map((s) => stripSkillTag(s)).filter(Boolean);

    // Build tagged skills so MySQL student_skills retains explicit category information
    const allSkills = payload.taggedSkills && payload.taggedSkills.length > 0
      ? payload.taggedSkills
      : [
          ...cleanLangs.map((s) => formatSkillWithTag(s, 'languages')),
          ...cleanLibs.map((s) => formatSkillWithTag(s, 'libraries')),
          ...cleanFws.map((s) => formatSkillWithTag(s, 'frameworks')),
          ...cleanTls.map((s) => formatSkillWithTag(s, 'tools')),
        ];

    const profilePayload = {
      fullName: payload.fullName,
      skills: allSkills,
      languages: cleanLangs,
      libraries: cleanLibs,
      frameworks: cleanFws,
      tools: cleanTls,
      onboardingCompleted: true,
      onboardedAt: payload.onboardedAt || new Date().toISOString(),
    };

    // 1. Sync skills to student controller (persists directly to student_skills in MySQL)
    try {
      await apiClient.put(`/students/${targetUserId}`, { skills: allSkills });
    } catch (err) {
      console.warn('Student controller skills sync notice:', err.message);
    }

    // 2. Sync profile attributes to user-profile controller
    return apiClient.put(`/user-profile/${targetUserId}`, profilePayload);
  },

  getStudentSkills: (userId) => {
    return apiClient.get(`/user-profile/${userId}`);
  },
};

/**
 * 9. AI Skill Assessment Engine (AiAssessmentController.java)
 */
export const assessmentAPI = {
  getQuestionsForSkill: (skillId) => {
    return apiClient.get(`/assessment/questions/${skillId}`);
  },

  getQuestionsByTechType: (techType) => {
    return apiClient.get(`/assessment/filter/tech-type/${techType}`);
  },

  getQuestionsByLanguage: (language) => {
    return apiClient.get(`/assessment/filter/language/${encodeURIComponent(language)}`);
  },

  getQuestionsByFramework: (framework) => {
    return apiClient.get(`/assessment/filter/framework/${encodeURIComponent(framework)}`);
  },

  getOrGenerateQuestions: (skillName, skillType) => {
    return apiClient.get(
      `/assessment/skill-assessment?skillName=${encodeURIComponent(skillName)}${
        skillType ? `&type=${encodeURIComponent(skillType)}` : ''
      }`
    );
  },

  evaluateWithAi: (payload) => {
    return apiClient.post('/assessment/evaluate-with-ai', payload);
  },
};

/**
 * 10. Milestone Learning Roadmap (RoadmapController.java)
 */
export const roadmapAPI = {
  getSteps: (userId) => {
    return apiClient.get(`/roadmap/user/${userId}`);
  },

  updateStepStatus: (stepId, status) => {
    return apiClient.patch(`/roadmap/step/${stepId}`, { status });
  },
};

export const chatbotAPI = {
  sendMessage: (payload) => {
    return apiClient.post('/chatbot/message', payload);
  },

  getUserSessions: (userId) => {
    return apiClient.get(`/chatbot/sessions/${userId}`);
  },

  getSessionMessages: (sessionId) => {
    return apiClient.get(`/chatbot/sessions/${sessionId}/messages`);
  },
};

/**
 * 11. Industry / Recruiter Management APIs (Spring Boot Endpoints)
 */
export const recruiterAPI = {
  // Dashboard & Analytics (DashboardController.java)
  getDashboardStats: (companyId) => {
    return apiClient.get('/dashboard/stats', {
      params: { role: 'INDUSTRY', userId: companyId },
    });
  },

  // Job & Internship Postings (PostingController.java)
  getCompanyPostings: async (companyId) => {
    const postings = await apiClient.get('/postings/active');
    if (Array.isArray(postings) && companyId) {
      return postings.filter(p => !p.postedBy || p.postedBy === companyId || p.postedBy?.id === companyId || p.postedById === companyId || true);
    }
    return postings;
  },

  createPosting: (payload) => {
    return apiClient.post('/postings/create', payload);
  },

  previewMatchCount: (payload) => {
    return apiClient.post('/postings/preview-match-count', payload);
  },

  // Applicants & ATS Pipeline (ApplicationController.java)
  getRankedApplicants: (postingId) => {
    return apiClient.get(`/applications/posting/${postingId}/ranked`);
  },

  getUserApplications: (userId) => {
    return apiClient.get(`/applications/user/${userId}`);
  },

  updateApplicationStatus: (applicationId, status) => {
    return apiClient.patch(`/applications/${applicationId}/status`, { status });
  },

  // Talent Pool Search & Scouting (StudentSearchController.java)
  searchTalentPool: (filter = {}) => {
    return apiClient.post('/talent-pool/search', filter);
  },

  inviteTalent: (payload) => {
    return apiClient.post('/talent-pool/invite', payload);
  },

  // Company Profile (UserProfileController.java)
  getCompanyProfile: (companyId) => {
    return apiClient.get(`/user-profile/${companyId}`);
  },

  updateCompanyProfile: (companyId, profileData) => {
    return apiClient.put(`/user-profile/${companyId}`, profileData);
  },
};

/**
 * 12. Interview Management APIs (InterviewController.java)
 */
export const interviewsAPI = {
  getInterviewsForApplication: (applicationId) => {
    return apiClient.get(`/interviews/application/${applicationId}`);
  },

  schedule: (payload) => {
    return apiClient.post('/interviews/schedule', payload);
  },

  updateStatus: (interviewId, status, notes = '') => {
    return apiClient.patch(`/interviews/${interviewId}/status`, { status, notes });
  },
};

/**
 * 13. Academician (Faculty) Portal APIs
 * Backed by Spring Boot com.example.TalentOrbit.controller.AcademicianController & SupportController
 */
export const academicianAPI = {
  // Get faculty dashboard summary & domain distribution metrics
  getDashboardSummary: async (userId) => {
    try {
      if (userId) {
        return await apiClient.get(`/academician/dashboard-summary/${userId}`);
      }
      return await apiClient.get('/dashboard/stats', {
        params: { role: 'ACADEMICIAN', userId }
      });
    } catch (err) {
      console.warn('Falling back to generic dashboard stats:', err.message);
      return await apiClient.get('/dashboard/stats', {
        params: { role: 'ACADEMICIAN', userId }
      }).catch(() => null);
    }
  },

  // Get all opportunities or filter by type (FDP, RESEARCH, CONSULTANCY, TRAINING, WORKSHOP) with match scores
  getOpportunities: async (type = 'ALL', userId = null) => {
    try {
      const res = await apiClient.get('/academician/opportunities', {
        params: { type: type === 'ALL' ? null : type, userId }
      });
      if (Array.isArray(res)) return res;
    } catch (err) {
      console.warn('Fallback to /postings/active:', err.message);
    }
    // Resilient fallback to active postings
    const postings = await apiClient.get('/postings/active').catch(() => []);
    if (!Array.isArray(postings)) return [];
    if (type && type !== 'ALL') {
      const targetType = type.toUpperCase();
      return postings.filter((p) => (p.postingType || p.type || '').toUpperCase() === targetType);
    }
    return postings;
  },

  // Express interest / submit collaboration proposal with notes
  expressInterest: async (userId, postingId, proposalNote = '') => {
    try {
      return await apiClient.post('/academician/express-interest', null, {
        params: {
          userId,
          postingId,
          notes: proposalNote || ''
        }
      });
    } catch (err) {
      // Fallback to application endpoint
      return await apiClient.post('/applications/apply', {
        userId,
        postingId,
        notes: proposalNote,
      });
    }
  },

  // Get faculty's active collaborations & status pipeline
  getCollaborations: async (userId) => {
    try {
      const res = await apiClient.get(`/academician/collaborations/${userId}`);
      if (Array.isArray(res)) return res;
    } catch (err) {
      console.warn('Fallback to /applications/user:', err.message);
    }
    return await apiClient.get(`/applications/user/${userId}`).catch(() => []);
  },

  // Get faculty expertise tags
  getInterests: async (userId) => {
    try {
      const res = await apiClient.get(`/academician/interests/${userId}`);
      if (Array.isArray(res)) return res;
    } catch (err) {
      console.warn('Error fetching academician interests:', err.message);
    }
    return [];
  },

  // Update faculty expertise tags
  updateInterests: async (userId, tagNames = []) => {
    return await apiClient.post('/academician/interests/update', {
      userId,
      tagNames
    });
  },

  // Get faculty profile details
  getProfile: async (userId) => {
    try {
      return await apiClient.get(`/academician/profile/${userId}`);
    } catch (err) {
      return await apiClient.get(`/user-profile/${userId}`).catch(() => null);
    }
  },

  // Update faculty profile details
  updateProfile: async (userId, profileData) => {
    try {
      return await apiClient.put(`/academician/profile/${userId}`, profileData);
    } catch (err) {
      return await apiClient.put(`/user-profile/${userId}`, profileData);
    }
  },

  // Submit help / support ticket
  submitSupportTicket: async (ticketData) => {
    try {
      return await apiClient.post('/support/ticket/create', ticketData);
    } catch (err) {
      return await apiClient.post('/support/ticket', ticketData);
    }
  },

  // Publish a Collaborative Research Call or Training Proposal
  createCallForOpportunity: (payload) => {
    return apiClient.post('/postings/create', payload);
  },
};

export default {
  auth: authAPI,
  badges: badgesAPI,
  postings: postingsAPI,
  applications: applicationsAPI,
  portfolio: portfolioAPI,
  profile: profileAPI,
  dashboard: dashboardAPI,
  student: studentAPI,
  assessment: assessmentAPI,
  roadmap: roadmapAPI,
  chatbot: chatbotAPI,
  recruiter: recruiterAPI,
  interviews: interviewsAPI,
  academician: academicianAPI,
};
