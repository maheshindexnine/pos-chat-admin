<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const registerForm = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  organizationName: "",
  description: "",
  age: 0,
  phone: 0,
});

const isLoading = ref(false);
const error = ref("");

const handleRegister = async () => {
  // Validate form
  if (
    !registerForm.name ||
    !registerForm.email ||
    !registerForm.password ||
    !registerForm.organizationName ||
    !registerForm.description ||
    !registerForm.phone ||
    !registerForm.age
  ) {
    error.value = "Please fill in all required fields";
    return;
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    error.value = "Passwords do not match";
    return;
  }

  error.value = "";
  isLoading.value = true;

  try {
    await authStore.register({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
      organizationName: registerForm.organizationName,
      description: registerForm.description,
      age: registerForm.age,
      phone: String(registerForm.phone),
    });

    // Registration successful, router navigation is handled in the auth store
  } catch (err: any) {
    error.value = err.message || "Registration failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

const goToLogin = () => {
  router.push("/login");
};
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    v-motion
    :initial="{ opacity: 0, y: 20 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <img
          class="mx-auto h-12 w-auto"
          src="/images/brand_name-bg.png"
          alt="Logo"
        />
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Create new organization
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Or
          <button
            @click="goToLogin"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            sign in to existing account
          </button>
        </p>
      </div>

      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleRegister">
          <div
            v-if="error"
            class="p-3 bg-red-50 text-red-700 rounded-md text-sm"
          >
            {{ error }}
          </div>

          <div>
            <label
              for="organization"
              class="block text-sm font-medium text-gray-700"
            >
              Organization Name
            </label>
            <div class="mt-1">
              <input
                id="organization"
                v-model="registerForm.organizationName"
                name="organization"
                type="text"
                required
                class="form-control"
                :disabled="isLoading"
              />
            </div>
          </div>

          <div>
            <label
              for="organization"
              class="block text-sm font-medium text-gray-700"
            >
              Organization Description
            </label>
            <div class="mt-1">
              <textarea
                id="description"
                v-model="registerForm.description"
                name="description"
                type="text"
                required
                class="form-control"
                :disabled="isLoading"
              />
            </div>
          </div>

          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <div class="mt-1">
              <input
                id="name"
                v-model="registerForm.name"
                name="name"
                type="text"
                required
                class="form-control"
                :disabled="isLoading"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="registerForm.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="form-control"
                :disabled="isLoading"
              />
            </div>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div class="mt-1">
              <input
                id="phone"
                v-model="registerForm.phone"
                name="phone"
                type="number"
                autocomplete="phone"
                required
                class="form-control"
                :disabled="isLoading"
              />
            </div>
          </div>

          <div>
            <label for="age" class="block text-sm font-medium text-gray-700">
              Age
            </label>
            <div class="mt-1">
              <input
                id="age"
                v-model="registerForm.age"
                name="age"
                type="number"
                autocomplete="age"
                required
                class="form-control"
                :disabled="isLoading"
              />
            </div>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="registerForm.password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                class="form-control"
                :disabled="isLoading"
              />
            </div>
          </div>

          <div>
            <label
              for="confirm-password"
              class="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div class="mt-1">
              <input
                id="confirm-password"
                v-model="registerForm.confirmPassword"
                name="confirm-password"
                type="password"
                autocomplete="new-password"
                required
                class="form-control"
                :disabled="isLoading"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="btn btn-primary w-full flex justify-center"
            >
              <svg
                v-if="isLoading"
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Create Organization
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
