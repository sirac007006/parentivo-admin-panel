// API konfiguracija
export const API_BASE_URL = 'http://157.90.237.216:3333';

export const API_ENDPOINTS = {
  // Auth endpoints
  ADMIN_LOGIN: '/auth/admin/login',
  
  // Users
  USERS: '/users',
  USERS_EXPERTS: '/users/experts',
  USER_BY_ID: '/users', // + /{id}
  CHANGE_USER_ROLE: '/users/change-role', // + /{id}
  
  // Forum kategorije
  FORUM_CATEGORIES: '/forum-categories',
  FORUM_CATEGORY_BY_ID: '/forum-categories', // + /{id}
  
  // Specijalizacije
  SPECIALIZATIONS: '/specializations',
  SPECIALIZATIONS_BY_ID: '/specializations', // + /{id}
  SET_SPECIALIZATION: '/specializations/set', // + /{userId}
  
  // Prijavljeni postovi
  REPORTED_POSTS: '/report/posts',
  REPORTED_POST_BY_ID: '/report/posts', // + /{reportId}
  
  // Prijavljeni komentari
  REPORTED_COMMENTS: '/report/comments',
  REPORTED_COMMENT_BY_ID: '/report/comments', // + /{reportId}
  
  // Forum postovi
  FORUM_POST_BY_ID: '/forum-post', // + /{id}
  
  // Forum komentari
  FORUM_COMMENT_BY_ID: '/forum-comment', // + /{id}
  
  // HelpDesk Slots
  HELP_DESK_SLOTS: '/help-desk-slots',
  HELP_DESK_SLOT_BY_ID: '/help-desk-slots', // + /{id}
  
  // Slots (za eksperte)
  SLOTS: '/slots',
  SLOTS_MY: '/slots/my',
  SLOTS_DOCTOR: '/slots/doctor', // + /{id}
  SLOT_BY_ID: '/slots', // + /{id}
  
  // Meetings
  MEETINGS: '/meetings',
  MEETINGS_BY_ID: '/meetings', // + /{id}
  MEETINGS_START: '/meetings', // + /{id}/start
  MEETINGS_END: '/meetings', // + /{id}/end
  MEETINGS_ADMIN: '/meetings/admin',
};

export const API_TIMEOUT = 30000; // 30 sekundi

// User roles
export const USER_ROLES = {
  SUPERADMIN: 'SUPERADMIN',
  ADMIN: 'ADMIN',
  EXPERT: 'EXPERT',
  USER: 'USER'
} as const;

// Export default objekat
export default {
  API_BASE_URL,
  API_ENDPOINTS,
  API_TIMEOUT,
  USER_ROLES,
};
