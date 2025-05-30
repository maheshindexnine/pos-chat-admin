<script setup lang="ts">
import { ref, onMounted, provide } from "vue";
import Sidebar from "./Sidebar.vue";
import Header from "./Header.vue";
import { useAuthStore } from "../../stores/auth";
import { useUserStore } from "../../stores/users";
import { useGroupStore } from "../../stores/groups";

const authStore = useAuthStore();
const userStore = useUserStore();
const groupStore = useGroupStore();

const isSidebarOpen = ref(true);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Make sidebar state available to child components
provide("isSidebarOpen", isSidebarOpen);
provide("toggleSidebar", toggleSidebar);

onMounted(async () => {
  // Load initial data
  if (authStore.isAuthenticated) {
    await Promise.all([userStore.fetchUsers(), groupStore.fetchGroups()]);
  }
});
</script>

<template>
  <div
    class="dashboard-container flex h-screen overflow-hidden w-full bg-gradient-to-br from-blue-100 via-purple-200 to-yellow-200"
  >
    <!-- Sidebar -->
    <Sidebar
      :class="[
        isSidebarOpen ? 'w-64' : 'w-20',
        'transition-all duration-300 ease-in-out',
      ]"
      :is-open="isSidebarOpen"
      @toggle="toggleSidebar"
    />

    <!-- Main content area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <Header
        :is-sidebar-open="isSidebarOpen"
        @toggle-sidebar="toggleSidebar"
      />

      <!-- Main content -->
      <main class="flex-1 overflow-y-auto p-4 md:p-6">
        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        >
          <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
}
</style>
