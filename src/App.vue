<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from './stores/auth'

const route = useRoute()
const authStore = useAuthStore()

// Check if the current route is in the auth layout
const isAuthLayout = computed(() => {
  return route.meta.layout === 'auth'
})

// Computed property to determine if user is authenticated
const isAuthenticated = computed(() => {
  return authStore.isAuthenticated
})
</script>

<template>
  <div class="app-container">
    <!-- Auth layout (Login/Register) -->
    <router-view v-if="isAuthLayout || !isAuthenticated"></router-view>
    
    <!-- Dashboard layout (only if authenticated) -->
    <div v-else class="dashboard-layout">
      <router-view></router-view>
    </div>
  </div>
</template>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.dashboard-layout {
  display: flex;
  flex: 1;
  min-height: 100vh;
}
</style>