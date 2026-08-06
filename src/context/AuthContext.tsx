import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  authService,
  type LoginRequest,
  type RegisterRequest,
  type ForgotPasswordRequest,
  type ResetPasswordRequest,
} from "../services/authService";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;

  loading: boolean;

  isAuthenticated: boolean;

  login: (data: LoginRequest) => Promise<void>;

  register: (
    data: RegisterRequest
  ) => Promise<void>;

  logout: () => void;

  forgotPassword: (
    data: ForgotPasswordRequest
  ) => Promise<void>;

  resetPassword: (
    data: ResetPasswordRequest
  ) => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | null>(null);

interface Props {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: Props) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  /**
   * Restore session
   */

  useEffect(() => {
    const storedUser =
      authService.getCurrentUser();

    if (storedUser) {
      setUser(storedUser);
    }

    setLoading(false);
  }, []);

  /**
   * Login
   */

  async function login(
    data: LoginRequest
  ) {
    const response =
      await authService.login(data);

    authService.saveSession(response);

    setUser(response.user);
  }

  /**
   * Register
   */

  async function register(
    data: RegisterRequest
  ) {
    const response =
      await authService.register(data);

    authService.saveSession(response);

    setUser(response.user);
  }

  /**
   * Logout
   */

  function logout() {
    authService.logout();

    setUser(null);
  }

  /**
   * Forgot Password
   */

  async function forgotPassword(
    data: ForgotPasswordRequest
  ) {
    await authService.forgotPassword(data);
  }

  /**
   * Reset Password
   */

  async function resetPassword(
    data: ResetPasswordRequest
  ) {
    await authService.resetPassword(data);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom Hook
 */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}