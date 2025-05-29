import axiosInstance from "./axiosConfig";
import { GROUP_ENDPOINTS } from "../utils/constants";

export interface Group {
  _id?: string;
  name: string;
  description?: string;
  createdBy?: string;
  organizationId?: string;
  members?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const groupService = {
  // Get all groups
  getAllGroups: async (): Promise<Group[]> => {
    try {
      const response = await axiosInstance.get(GROUP_ENDPOINTS.GET_ALL);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new group
  createGroup: async (groupData: Omit<Group, "id">): Promise<Group> => {
    try {
      const response = await axiosInstance.post(
        GROUP_ENDPOINTS.CREATE,
        groupData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add member to group
  addMember: async (groupId: string, userId: string): Promise<Group> => {
    try {
      const response = await axiosInstance.post(
        GROUP_ENDPOINTS.ADD_MEMBER(groupId, userId)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove member from group
  removeMember: async (groupId: string, userId: string): Promise<Group> => {
    try {
      const response = await axiosInstance.delete(
        GROUP_ENDPOINTS.REMOVE_MEMBER(groupId, userId)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
