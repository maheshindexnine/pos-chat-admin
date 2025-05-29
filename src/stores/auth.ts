import { defineStore } from "pinia";
import router from "../router";
import { authService, RegisterData } from "../services/authService";
interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as { name: string } | null,
    token: null as string | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    userData: (state) => state.user,
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authService.login(credentials);

        this.user = { name: response.name };
        this.token = response.token;

        router.push("/dashboard");
      } catch (error: any) {
        this.error = error.message || "Failed to login";
        console.error("Login error:", error);
      } finally {
        this.loading = false;
      }
    },

    async register(data: RegisterData) {
      this.loading = true;
      this.error = null;

      try {
        await authService.register(data);
        router.push("/login");
      } catch (error: any) {
        this.error = error.message || "Failed to register";
        console.error("Registration error:", error);
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.clear()
      router.push("/login");
    },
  },

  persist: {
    storage: localStorage,
    paths: ["user", "token"],
  },
});
