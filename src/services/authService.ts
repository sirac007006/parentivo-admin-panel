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
      console.log('🔐 LOGIN ATTEMPT:', email);
      
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.ADMIN_LOGIN,
        { email, password }
      );
      
      console.log('📦 Raw API response:', JSON.stringify(response.data, null, 2));
      
      // Handle different response formats
      let token = response.data.token || response.data.accessToken || response.data.access_token;
      let user = response.data.user || response.data;
      
      console.log('🎫 Extracted token (first 100 chars):', token?.substring(0, 100));
      console.log('👤 Extracted user object:', JSON.stringify(user, null, 2));
      
      // If token is inside user object
      if (!token && user.token) {
        token = user.token;
        console.log('🎫 Token was inside user object');
      }
      
      if (!token) {
        throw new Error('Token nije pronađen u odgovoru servera');
      }
      
      // NOVA STRATEGIJA: Umjesto čitanja iz JWT-a, pozovi GET /users/me ili dekoduj JWT za ID pa pozovi GET /users/{id}
      let userId = null;
      
      // Prvo pokušaj da dobiješ userId
      if (user.id) {
        userId = user.id;
        console.log('✅ User ID from response:', userId);
      } else {
        // Dekoduj JWT da dobiješ userId
        const decodedToken = decodeJWT(token);
        console.log('📋 Decoded JWT:', JSON.stringify(decodedToken, null, 2));
        
        if (decodedToken) {
          userId = decodedToken.sub || decodedToken.userId || decodedToken.id;
          console.log('✅ User ID from JWT:', userId);
        }
      }
      
      // KRITIČNO: Pozovi backend da dobiješ PRAVU role!
      if (userId) {
        console.log('🔄 Fetching user data from backend: GET /users/' + userId);
        
        try {
          // Postavi token u header prije poziva
          localStorage.setItem(TOKEN_KEY, token);
          
          const userResponse = await apiClient.get(`/users/${userId}`);
          const backendUser = userResponse.data;
          
          console.log('✅ Backend user data:', JSON.stringify(backendUser, null, 2));
          console.log('✅✅✅ REAL ROLE FROM BACKEND:', backendUser.role, '✅✅✅');
          
          // Koristi podatke direktno iz backend-a!
          user = {
            id: backendUser.id,
            email: backendUser.email,
            fullName: backendUser.fullName || backendUser.name || email,
            role: backendUser.role, // PRAVA ROLE IZ BACKEND-A!
            verified: backendUser.verified !== false,
            createdAt: backendUser.createdAt || new Date().toISOString(),
            updatedAt: backendUser.updatedAt || new Date().toISOString(),
          };
          
          console.log('👤 Final user object (from backend):', JSON.stringify(user, null, 2));
          
        } catch (fetchError: any) {
          console.error('❌ Failed to fetch user from backend:', fetchError.message);
          console.error('❌ Falling back to JWT decode...');
          
          // Fallback na stari način
          const decodedToken = decodeJWT(token);
          if (decodedToken && !user.role) {
            user = {
              id: decodedToken.sub || decodedToken.userId || decodedToken.id,
              email: decodedToken.email || email,
              fullName: decodedToken.fullName || decodedToken.name || email,
              role: decodedToken.role || decodedToken.userRole || 'SUPERADMIN',
              verified: decodedToken.verified !== false,
              createdAt: decodedToken.createdAt || new Date().toISOString(),
              updatedAt: decodedToken.updatedAt || new Date().toISOString(),
            };
          }
        }
      }
      
      // Final fallback
      if (!user.role) {
        console.error('❌❌❌ STILL NO ROLE! Defaulting to SUPERADMIN ❌❌❌');
        user.role = 'SUPERADMIN';
      }
      
      // Save token and user data
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      console.log('💾 Saved to localStorage:');
      console.log('   - Token (first 50 chars):', token.substring(0, 50));
      console.log('   - User:', JSON.stringify(user, null, 2));
      console.log('   - Final Role:', user.role);
      
      return { token, user };
    } catch (error: any) {
      console.error('❌ Login error:', error.response?.data || error.message);
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
