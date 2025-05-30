import axiosInstance from "./axiosConfig";
import { AUTH_ENDPOINTS } from "../utils/constants";

export interface RegisterData {
  name: string;
  email: string;
  age: number;
  password: string;
  phone: string;
  organizationName: string;
  description: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  name: string;
  organization: string;
  email: string;
}

export const authService = {
  // Register new organization with admin
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER, data);
      const { token, name, organization, email } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", token);

      return { token, name, organization, email };
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, data);
      const { token, name, organization, email } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", token);

      return { token, name, organization, email };
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem("token");
  },

  // Get current token
  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },
};
