import { apiRequest } from "./api";

/**
 * ===========================================
 * Types
 * ===========================================
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  expiresAt?: string;

  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
  };
}

/**
 * ===========================================
 * Backend Authentication Response
 * ===========================================
 */

interface BackendAuthResponse {
  access_token: string;
  token_type: string;

  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    is_active: boolean;
  };
}

/**
 * ===========================================
 * Generic Request Helper
 * ===========================================
 */

/**
 * ===========================================
 * Authentication Service
 * ===========================================
 */

export const authService = {
  /**
   * Login
   */
  async login(
    data: LoginRequest
  ): Promise<AuthResponse> {
    const response =
      await apiRequest<BackendAuthResponse>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );

    return {
      token: response.access_token,

      user: {
        id: response.user.id,
        firstName: response.user.first_name,
        lastName: response.user.last_name,
        email: response.user.email,
        role: response.user.role,
      },
    };
  },

  /**
   * Register
   */
  async register(
    data: RegisterRequest
  ): Promise<AuthResponse> {
    const response =
      await apiRequest<BackendAuthResponse>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            password: data.password,
            confirm_password: data.confirmPassword,
          }),
        }
      );

    return {
      token: response.access_token,

      user: {
        id: response.user.id,
        firstName: response.user.first_name,
        lastName: response.user.last_name,
        email: response.user.email,
        role: response.user.role,
      },
    };
  },

  /**
   * Forgot Password
   */
  forgotPassword(
    data: ForgotPasswordRequest
  ) {
    return apiRequest<void>(
      "/auth/forgot-password",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Reset Password
   */
  resetPassword(
    data: ResetPasswordRequest
  ) {
    return apiRequest<void>(
      "/auth/reset-password",
      {
        method: "POST",
        body: JSON.stringify({
          token: data.token,
          password: data.password,
          confirm_password: data.confirmPassword,
        }),
      }
    );
  },

  /**
   * Logout
   */
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  /**
   * Save Session
   */
  saveSession(
    auth: AuthResponse
  ) {
    localStorage.setItem(
      "token",
      auth.token
    );

    if (auth.refreshToken) {
      localStorage.setItem(
        "refreshToken",
        auth.refreshToken
      );
    }

    localStorage.setItem(
      "user",
      JSON.stringify(auth.user)
    );
  },

  /**
   * Get Token
   */
  getToken() {
    return localStorage.getItem("token");
  },

  /**
   * Get Current User
   */
  getCurrentUser() {
    const user =
      localStorage.getItem("user");

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  },

  /**
   * Check Login Status
   */
  isAuthenticated() {
    return !!localStorage.getItem(
      "token"
    );
  },
};