const API_BASE_URL = "http://localhost:5000/auth";

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

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      ...options,
    }
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      error || "Something went wrong."
    );
  }

  return response.json();
}

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
      await request<BackendAuthResponse>(
        "/login",
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
      await request<BackendAuthResponse>(
        "/register",
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
   * Forgot Password
   */
  forgotPassword(
    data: ForgotPasswordRequest
  ) {
    return request<void>(
      "/forgot-password",
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
    return request<void>(
      "/reset-password",
      {
        method: "POST",
        body: JSON.stringify(data),
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