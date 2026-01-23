// @ts-nocheck
import { apiClient } from './authService';
import { API_ENDPOINTS } from '../config';

// ============ TYPES ============

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  specializationId?: string | null;
}

export interface ForumCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Specialization {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportedPost {
  id: string;
  userId: string;
  postId: string;
  reason?: string;
  createdAt: string;
  user?: User;
  post?: any;
}

export interface ReportedComment {
  id: string;
  userId: string;
  commentId: string;
  reason?: string;
  createdAt: string;
  user?: User;
  comment?: any;
}

export interface HelpDeskSlot {
  id: string;
  maxChildren: number;
  startFrom: string;
  startTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface Slot {
  id: string;
  doctorId: string;
  isBooked: boolean;
  startFrom: string;
  startTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  speakerName: string;
  creatorId: string;
  isLive: boolean;
  isActive: boolean;
  startFrom: string;
  startTo: string;
  createdAt: string;
  updatedAt: string;
}

// ============ USER SERVICE ============

export const UserService = {
  // GET /users
  getUsers: async (params?: {
    fullName?: string;
    email?: string;
    role?: string;
    verified?: boolean;
  }) => {
    const response = await apiClient.get<User[]>(API_ENDPOINTS.USERS, {
      params,
    });
    return response.data;
  },

  // GET /users/experts
  getExperts: async (params?: {
    fullName?: string;
    email?: string;
    specializationId?: string;
  }) => {
    const response = await apiClient.get<User[]>(API_ENDPOINTS.USERS_EXPERTS, {
      params,
    });
    return response.data;
  },

  // GET /users/{id}
  getUserById: async (userId: string) => {
    const response = await apiClient.get<User>(
      `${API_ENDPOINTS.USER_BY_ID}/${userId}`
    );
    return response.data;
  },

  // PATCH /users/change-role/{id}
  changeUserRole: async (userId: string, role: string) => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.CHANGE_USER_ROLE}/${userId}`,
      { role }
    );
    return response.data;
  },

  // DELETE /users/{id}
  deleteUser: async (userId: string) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.USER_BY_ID}/${userId}`
    );
    return response.data;
  },
};

// ============ FORUM CATEGORY SERVICE ============

export const ForumCategoryService = {
  // GET /forum-categories
  getForumCategories: async (params?: { name?: string }) => {
    const response = await apiClient.get<ForumCategory[]>(
      API_ENDPOINTS.FORUM_CATEGORIES,
      { params }
    );
    return response.data;
  },

  // GET /forum-categories/{id}
  getForumCategoryById: async (categoryId: string) => {
    const response = await apiClient.get<ForumCategory>(
      `${API_ENDPOINTS.FORUM_CATEGORY_BY_ID}/${categoryId}`
    );
    return response.data;
  },

  // POST /forum-categories
  createForumCategory: async (data: { name: string; description?: string }) => {
    const response = await apiClient.post<ForumCategory>(
      API_ENDPOINTS.FORUM_CATEGORIES,
      data
    );
    return response.data;
  },

  // PATCH /forum-categories/{id}
  updateForumCategory: async (
    categoryId: string,
    data: { name?: string; description?: string }
  ) => {
    const response = await apiClient.patch<ForumCategory>(
      `${API_ENDPOINTS.FORUM_CATEGORY_BY_ID}/${categoryId}`,
      data
    );
    return response.data;
  },

  // DELETE /forum-categories/{id}
  deleteForumCategory: async (categoryId: string) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.FORUM_CATEGORY_BY_ID}/${categoryId}`
    );
    return response.data;
  },
};

// ============ SPECIALIZATION SERVICE ============

export const SpecializationService = {
  // GET /specializations
  getSpecializations: async (params?: { name?: string }) => {
    const response = await apiClient.get<Specialization[]>(
      API_ENDPOINTS.SPECIALIZATIONS,
      { params }
    );
    return response.data;
  },

  // GET /specializations/{id}
  getSpecializationById: async (specializationId: string) => {
    const response = await apiClient.get<Specialization>(
      `${API_ENDPOINTS.SPECIALIZATIONS_BY_ID}/${specializationId}`
    );
    return response.data;
  },

  // POST /specializations
  createSpecialization: async (data: { name: string; description?: string }) => {
    const response = await apiClient.post<Specialization>(
      API_ENDPOINTS.SPECIALIZATIONS,
      data
    );
    return response.data;
  },

  // PATCH /specializations/{id}
  updateSpecialization: async (
    specializationId: string,
    data: { name?: string; description?: string }
  ) => {
    const response = await apiClient.patch<Specialization>(
      `${API_ENDPOINTS.SPECIALIZATIONS_BY_ID}/${specializationId}`,
      data
    );
    return response.data;
  },

  // DELETE /specializations/{id}
  deleteSpecialization: async (specializationId: string) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.SPECIALIZATIONS_BY_ID}/${specializationId}`
    );
    return response.data;
  },

  // POST /specializations/set/{userId}
  setUserSpecialization: async (userId: string, specializationId: string) => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.SET_SPECIALIZATION}/${userId}`,
      { specializationId }
    );
    return response.data;
  },
};

// ============ REPORT SERVICE ============

export const ReportService = {
  // GET /report/posts
  getReportedPosts: async (params?: { userId?: string; postId?: string }) => {
    const response = await apiClient.get<ReportedPost[]>(
      API_ENDPOINTS.REPORTED_POSTS,
      { params }
    );
    return response.data;
  },

  // GET /report/posts/{reportId}
  getReportedPostById: async (reportId: string) => {
    const response = await apiClient.get<ReportedPost>(
      `${API_ENDPOINTS.REPORTED_POST_BY_ID}/${reportId}`
    );
    return response.data;
  },

  // DELETE /report/posts/{reportId}
  deleteReportedPost: async (reportId: string) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.REPORTED_POST_BY_ID}/${reportId}`
    );
    return response.data;
  },

  // PATCH /forum-post/change-status/{postId} - Odbij post (promeni status u REJECTED)
  rejectPost: async (postId: string) => {
    const response = await apiClient.patch(
      `/forum-post/change-status/${postId}`,
      { status: 'REJECTED' }
    );
    return response.data;
  },

  // GET /report/comments
  getReportedComments: async (params?: {
    userId?: string;
    commentId?: string;
  }) => {
    const response = await apiClient.get<ReportedComment[]>(
      API_ENDPOINTS.REPORTED_COMMENTS,
      { params }
    );
    return response.data;
  },

  // GET /report/comments/{reportId}
  getReportedCommentById: async (reportId: string) => {
    const response = await apiClient.get<ReportedComment>(
      `${API_ENDPOINTS.REPORTED_COMMENT_BY_ID}/${reportId}`
    );
    return response.data;
  },

  // DELETE /report/comments/{reportId}
  deleteReportedComment: async (reportId: string) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.REPORTED_COMMENT_BY_ID}/${reportId}`
    );
    return response.data;
  },

  // PATCH /forum-comment/change-status/{commentId} - Odbij komentar (promeni status u REJECTED)
  rejectComment: async (commentId: string) => {
    const response = await apiClient.patch(
      `/forum-comment/change-status/${commentId}`,
      { status: 'REJECTED' }
    );
    return response.data;
  },

  // GET /forum-post/rejected - Lista odbijenih postova
  getRejectedPosts: async () => {
    const response = await apiClient.get('/forum-post/rejected');
    return response.data;
  },

  // GET /forum-comment/rejected - Lista odbijenih komentara
  getRejectedComments: async () => {
    const response = await apiClient.get('/forum-comment/rejected');
    return response.data;
  },

  // DELETE /forum-post/{id}
  deleteForumPost: async (postId: string) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.FORUM_POST_BY_ID}/${postId}`
    );
    return response.data;
  },

  // DELETE /forum-comment/{id}
  deleteForumComment: async (commentId: string) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.FORUM_COMMENT_BY_ID}/${commentId}`
    );
    return response.data;
  },
};

// ============ HELP DESK SLOT SERVICE ============

export const HelpDeskSlotService = {
  // GET /help-desk-slots
  getHelpDeskSlots: async (params?: {
    maxChildren?: number;
    startFrom?: string;
    startTo?: string;
  }) => {
    const response = await apiClient.get<HelpDeskSlot[]>(
      API_ENDPOINTS.HELP_DESK_SLOTS,
      { params }
    );
    return response.data;
  },

  // GET /help-desk-slots/{id}
  getHelpDeskSlotById: async (slotId: string) => {
    const response = await apiClient.get<HelpDeskSlot>(
      `${API_ENDPOINTS.HELP_DESK_SLOT_BY_ID}/${slotId}`
    );
    return response.data;
  },

  // POST /help-desk-slots
  createHelpDeskSlot: async (data: {
    maxChildren: number;
    startFrom: string;
    startTo: string;
  }) => {
    const response = await apiClient.post<HelpDeskSlot>(
      API_ENDPOINTS.HELP_DESK_SLOTS,
      data
    );
    return response.data;
  },

  // PATCH /help-desk-slots/{id}
  updateHelpDeskSlot: async (
    slotId: string,
    data: {
      maxChildren?: number;
      startFrom?: string;
      startTo?: string;
    }
  ) => {
    const response = await apiClient.patch<HelpDeskSlot>(
      `${API_ENDPOINTS.HELP_DESK_SLOT_BY_ID}/${slotId}`,
      data
    );
    return response.data;
  },

  // DELETE /help-desk-slots/{id}
  deleteHelpDeskSlot: async (slotId: string) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.HELP_DESK_SLOT_BY_ID}/${slotId}`
    );
    return response.data;
  },
};

// ============ SLOT SERVICE (for experts) ============

export const SlotService = {
  // GET /slots/my (for logged-in expert)
  getMySlots: async () => {
    const response = await apiClient.get<Slot[]>(API_ENDPOINTS.SLOTS_MY);
    return response.data;
  },

  // GET /slots/doctor/{id}
  getSlotsByDoctor: async (
    doctorId: string,
    params?: { isBooked?: boolean; startFrom?: string; startTo?: string }
  ) => {
    const response = await apiClient.get<Slot[]>(
      `${API_ENDPOINTS.SLOTS_DOCTOR}/${doctorId}`,
      { params }
    );
    return response.data;
  },

  // POST /slots
  createSlot: async (data: { startFrom: string; startTo: string }) => {
    const response = await apiClient.post<Slot>(API_ENDPOINTS.SLOTS, data);
    return response.data;
  },

  // PATCH /slots/{id}
  updateSlot: async (
    slotId: string,
    data: { startFrom?: string; startTo?: string }
  ) => {
    const response = await apiClient.patch<Slot>(
      `${API_ENDPOINTS.SLOT_BY_ID}/${slotId}`,
      data
    );
    return response.data;
  },

  // DELETE /slots/{id}
  deleteSlot: async (slotId: string) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.SLOT_BY_ID}/${slotId}`
    );
    return response.data;
  },
};

// ============ MEETING SERVICE ============

export const MeetingService = {
  // GET /meetings/admin
  getMeetingsAdmin: async (params?: {
    title?: string;
    speakerName?: string;
    creatorId?: string;
    isLive?: boolean;
    isActive?: boolean;
    startFrom?: string;
    startTo?: string;
  }) => {
    const response = await apiClient.get<Meeting[]>(
      API_ENDPOINTS.MEETINGS_ADMIN,
      { params }
    );
    return response.data;
  },

  // GET /meetings
  getMeetings: async () => {
    const response = await apiClient.get<Meeting[]>(API_ENDPOINTS.MEETINGS);
    return response.data;
  },

  // GET /meetings/{id}
  getMeetingById: async (meetingId: string) => {
    const response = await apiClient.get<Meeting>(
      `${API_ENDPOINTS.MEETINGS_BY_ID}/${meetingId}`
    );
    return response.data;
  },

  // POST /meetings
  createMeeting: async (data: {
    title: string;
    description?: string;
    speakerName: string;
    startFrom: string;
    startTo: string;
  }) => {
    const response = await apiClient.post<Meeting>(
      API_ENDPOINTS.MEETINGS,
      data
    );
    return response.data;
  },

  // PATCH /meetings/{id}
  updateMeeting: async (
    meetingId: string,
    data: {
      title?: string;
      description?: string;
      speakerName?: string;
      startFrom?: string;
      startTo?: string;
    }
  ) => {
    const response = await apiClient.patch<Meeting>(
      `${API_ENDPOINTS.MEETINGS_BY_ID}/${meetingId}`,
      data
    );
    return response.data;
  },

  // DELETE /meetings/{id}
  deleteMeeting: async (meetingId: string) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.MEETINGS_BY_ID}/${meetingId}`
    );
    return response.data;
  },

  // POST /meetings/{id}/start
  startMeeting: async (meetingId: string) => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.MEETINGS_START}/${meetingId}/start`
    );
    return response.data;
  },

  // POST /meetings/{id}/end
  endMeeting: async (meetingId: string) => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.MEETINGS_END}/${meetingId}/end`
    );
    return response.data;
  },
};

export default {
  UserService,
  ForumCategoryService,
  SpecializationService,
  ReportService,
  HelpDeskSlotService,
  SlotService,
  MeetingService,
};
