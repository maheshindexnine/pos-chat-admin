import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { User, userService } from "../services/userService";

interface NewUser {
  name: string;
  email: string;
  password: string;
  type: string;
}

export const useUserStore = defineStore("users", {
  state: () => ({
    users: [] as User[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getUserById: (state) => (id: string) => {
      return state.users.find((user) => user.id === id);
    },
    allUsers: (state) => state.users,
    adminUsers: (state) => state.users.filter((user) => user.type === "admin"),
    regularUsers: (state) => state.users.filter((user) => user.type === "user"),
  },

  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;

      try {
        // Mock API call - in a real app, this would fetch from backend
        await new Promise((resolve) => setTimeout(resolve, 800));
        const usersRes: any = await userService.getAllUsers();
        this.users = usersRes;
      } catch (error: any) {
        this.error = error.message || "Failed to fetch users";
        console.error("Error fetching users:", error);
      } finally {
        this.loading = false;
      }
    },

    async createUser(userData: NewUser) {
      this.loading = true;
      this.error = null;

      try {
        const authStore = useAuthStore();

        // Create a new user object
        const newUser: User = {
          name: userData.name,
          email: userData.email,
          type: userData.type,
          organizationId: "6836d2f418273851104c440a",
          password: userData.password,
        };

        await userService.createUser(newUser);
        await this.fetchUsers();
      } catch (error: any) {
        this.error = error.message || "Failed to create user";
        console.error("Error creating user:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateUser(id: string, userData: Partial<User>) {
      this.loading = true;
      this.error = null;

      try {
        const response = await userService.updateUser(id, userData as User);
        await this.fetchUsers();
      } catch (error: any) {
        this.error = error.message || "Failed to update user";
        console.error("Error updating user:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(id: string) {
      this.loading = true;
      this.error = null;

      try {
        await userService.deleteUser(id);
        await this.fetchUsers();
      } catch (error: any) {
        this.error = error.message || "Failed to delete user";
        console.error("Error deleting user:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
