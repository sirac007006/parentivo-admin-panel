// @ts-nocheck
import axios, { AxiosError } from 'axios';
import { API_BASE_URL, API_ENDPOINTS, API_TIMEOUT } from '../config';
import { decodeJWT } from '../utils/jwtDecode';

// Token storage keys
const TOKEN_KEY = 'parentivo_admin_token';
const USER_KEY = 'parentivo_admin_user';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ApiError {
  message: string;
  errors?: any;
}

const AuthService = {
  // Login admin
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.ADMIN_LOGIN,
        { email, password }
      );
      
      console.log('Raw API response:', response.data);
      
      // Handle different response formats
      let token = response.data.token || response.data.accessToken || response.data.access_token;
      let user = response.data.user || response.data;
      
      // If token is inside user object
      if (!token && user.token) {
        token = user.token;
      }
      
      if (!token) {
        throw new Error('Token nije pronađen u odgovoru servera');
      }
      
      // If user doesn't have role, try to decode JWT
      if (!user.role) {
        console.log('User object does not have role, attempting to decode JWT...');
        const decodedToken = decodeJWT(token);
        console.log('Decoded JWT:', decodedToken);
        
        if (decodedToken) {
          // Create user object from decoded JWT
          user = {
            id: decodedToken.sub || decodedToken.userId || decodedToken.id,
            email: decodedToken.email || email,
            fullName: decodedToken.fullName || decodedToken.name || email,
            // If role not in JWT, assume SUPERADMIN since they logged in via /auth/admin/login
            role: decodedToken.role || decodedToken.userRole || 'SUPERADMIN',
            verified: decodedToken.verified !== false,
            createdAt: decodedToken.createdAt || new Date().toISOString(),
            updatedAt: decodedToken.updatedAt || new Date().toISOString(),
          };
          console.log('Created user from JWT:', user);
        }
      }
      
      // If still no role, set default SUPERADMIN (since /auth/admin/login succeeded)
      if (!user.role) {
        console.log('No role found, setting default SUPERADMIN');
        user.role = 'SUPERADMIN';
      }
      
      // Save token and user data
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      console.log('Saved token:', token);
      console.log('Saved user:', user);
      
      return { token, user };
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || error.message || 'Greška pri prijavljivanju'
      );
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  // Get token
  getToken: (): string | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || token === 'undefined' || token === 'null') {
      return null;
    }
    return token;
  },

  // Get user data
  getUserData: (): any | null => {
    try {
      const userData = localStorage.getItem(USER_KEY);
      if (!userData || userData === 'undefined' || userData === 'null') {
        return null;
      }
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Check if user has required role
  hasRole: (requiredRoles: string[]): boolean => {
    const userData = AuthService.getUserData();
    if (!userData || !userData.role) return false;
    return requiredRoles.includes(userData.role);
  },
};

export { apiClient };
export default AuthService;
