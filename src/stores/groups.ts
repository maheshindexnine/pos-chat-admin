import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { Group, groupService } from "../services/groupService";
interface NewGroup {
  name: string;
  description: string;
}

export const useGroupStore = defineStore("groups", {
  state: () => ({
    groups: [] as Group[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getGroupById: (state) => (id: string) => {
      return state.groups.find((group) => group.id === id);
    },
    allGroups: (state) => state.groups,
    getUserGroups: (state) => (userId: string) => {
      return state.groups.filter(
        (group) => group.adminId === userId || group.members.includes(userId)
      );
    },
    getAdminGroups: (state) => (userId: string) => {
      return state.groups.filter((group) => group.adminId === userId);
    },
  },

  actions: {
    async fetchGroups() {
      this.loading = true;
      this.error = null;

      try {
        const response: Group[] = await groupService.getAllGroups();
        this.groups = response;
      } catch (error: any) {
        this.error = error.message || "Failed to fetch groups";
        console.error("Error fetching groups:", error);
      } finally {
        this.loading = false;
      }
    },

    async createGroup(groupData: NewGroup) {
      this.loading = true;
      this.error = null;

      try {
        const newGroup: Group = {
          name: groupData.name,
          description: groupData.description,
        };
        await groupService.createGroup(newGroup);
        await this.fetchGroups();
      } catch (error: any) {
        this.error = error.message || "Failed to create group";
        console.error("Error creating group:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateGroup(id: string, groupData: Partial<Group>) {
      this.loading = true;
      this.error = null;

      try {
      } catch (error: any) {
        this.error = error.message || "Failed to update group";
        console.error("Error updating group:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteGroup(id: string) {
      this.loading = true;
      this.error = null;

      try {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        const groupIndex = this.groups.findIndex((group) => group.id === id);

        if (groupIndex === -1) {
          throw new Error("Group not found");
        }

        // Remove group from array
        this.groups.splice(groupIndex, 1);

        return true;
      } catch (error: any) {
        this.error = error.message || "Failed to delete group";
        console.error("Error deleting group:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addUserToGroup(groupId: string, userId: string) {
      this.loading = true;
      this.error = null;

      try {
        await groupService.addMember(groupId, userId);
        await this.fetchGroups();
      } catch (error: any) {
        this.error = error.message || "Failed to add user to group";
        console.error("Error adding user to group:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async removeUserFromGroup(groupId: string, userId: string) {
      this.loading = true;
      this.error = null;

      try {
        await groupService.removeMember(groupId, userId);
        await this.fetchGroups();
      } catch (error: any) {
        this.error = error.message || "Failed to remove user from group";
        console.error("Error removing user from group:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async changeGroupAdmin(groupId: string, newAdminId: string) {
      this.loading = true;
      this.error = null;

      try {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        const groupIndex = this.groups.findIndex(
          (group) => group._id === groupId
        );

        if (groupIndex === -1) {
          throw new Error("Group not found");
        }

        // Check if new admin is a member
        if (!this.groups[groupIndex].members.includes(newAdminId)) {
          throw new Error("New admin must be a member of the group");
        }

        // Update admin
        this.groups[groupIndex].adminId = newAdminId;

        return this.groups[groupIndex];
      } catch (error: any) {
        this.error = error.message || "Failed to change group admin";
        console.error("Error changing group admin:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
