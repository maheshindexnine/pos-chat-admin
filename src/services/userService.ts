import axiosInstance from "./axiosConfig";
import { USER_ENDPOINTS } from "../utils/constants";

export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  type: string;
  organizationId?: string;
  isOnline?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  lastSeen?: string;
}

export const userService = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await axiosInstance.get(USER_ENDPOINTS.GET_ALL);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await axiosInstance.get(USER_ENDPOINTS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new user
  createUser: async (userData: Omit<User, "id">): Promise<User> => {
    try {
      const response = await axiosInstance.post(
        USER_ENDPOINTS.CREATE,
        userData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user
  updateUser: async (id: string, userData: User): Promise<User> => {
    try {
      const response = await axiosInstance.put(
        `${USER_ENDPOINTS.UPDATE}/${id}`,
        userData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`${USER_ENDPOINTS.DELETE}/${id}`);
    } catch (error) {
      throw error;
    }
  },
};
