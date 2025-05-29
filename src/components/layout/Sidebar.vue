<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['toggle'])

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const toggleSidebar = () => {
  emit('toggle')
}

const isActive = (path: string) => {
  return route.path === path
}

const user = computed(() => authStore.user)
const organization = computed(() => authStore.organization)

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Users', path: '/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { name: 'Groups', path: '/groups', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { name: 'Profile', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
]

const logout = () => {
  authStore.logout()
}
</script>

<template>
  <aside 
    class="bg-white border-r border-gray-200 z-20 h-full flex flex-col"
    v-motion
    :initial="{ x: -20, opacity: 0 }"
    :enter="{ x: 0, opacity: 1, transition: { duration: 500 } }"
  >
    <!-- Logo section -->
    <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200">
      <div class="flex items-center">
        <img 
          src="https://via.placeholder.com/40/FFCC00/000000?text=A" 
          alt="Logo" 
          class="h-8 w-8 rounded" 
        />
        <span 
          v-if="isOpen" 
          class="ml-2 text-xl font-semibold text-primary-600 transition-opacity duration-200"
        >
          Admin Panel
        </span>
      </div>
      <button 
        @click="toggleSidebar" 
        class="p-1 rounded-md hover:bg-gray-100 focus:outline-none"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-6 w-6 text-gray-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            v-if="isOpen" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7" 
          />
          <path 
            v-else 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M4 6h16M4 12h16M4 18h16" 
          />
        </svg>
      </button>
    </div>
    
    <!-- Organization info -->
    <div v-if="isOpen" class="px-4 py-3 border-b border-gray-200">
      <p class="text-xs text-gray-500 mb-1">ORGANIZATION</p>
      <p class="font-medium text-gray-800 truncate">{{ organization?.name || 'N/A' }}</p>
    </div>
    
    <!-- Navigation Menu -->
    <nav class="mt-4 flex-1 overflow-y-auto">
      <ul class="px-2 space-y-1">
        <li v-for="item in menuItems" :key="item.path">
          <router-link 
            :to="item.path" 
            class="flex items-center px-3 py-2 rounded-md transition-colors duration-200" 
            :class="[
              isActive(item.path) 
                ? 'bg-primary-50 text-primary-600' 
                : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-5 w-5" 
              :class="[isActive(item.path) ? 'text-primary-600' : 'text-gray-500']"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
            </svg>
            <span v-if="isOpen" class="ml-3 transition-opacity duration-200">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
    
    <!-- User profile section -->
    <div class="border-t border-gray-200 p-4">
      <div class="flex items-center">
        <div class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
          {{ user?.name?.charAt(0) || 'U' }}
        </div>
        <div v-if="isOpen" class="ml-3 transition-opacity duration-200">
          <p class="text-sm font-medium text-gray-800 truncate">{{ user?.name || 'User' }}</p>
          <p class="text-xs text-gray-500 truncate">{{ user?.email || 'user@example.com' }}</p>
        </div>
      </div>
      
      <button 
        v-if="isOpen"
        @click="logout" 
        class="mt-3 w-full flex items-center px-3 py-2 text-sm text-red-500 rounded-md hover:bg-red-50 transition-colors duration-200"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span class="ml-2">Logout</span>
      </button>
      
      <button 
        v-else
        @click="logout" 
        class="mt-3 w-full flex justify-center items-center p-2 text-red-500 rounded-md hover:bg-red-50 transition-colors duration-200"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  </aside>
</template>