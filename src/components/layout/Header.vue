<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../../stores/auth'

const props = defineProps<{
  isSidebarOpen: boolean
}>()

const emit = defineEmits(['toggle-sidebar'])

const authStore = useAuthStore()
const isMobile = ref(false)
const isProfileMenuOpen = ref(false)
const isNotificationsOpen = ref(false)

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
  if (isProfileMenuOpen.value) {
    isNotificationsOpen.value = false
  }
}

const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value
  if (isNotificationsOpen.value) {
    isProfileMenuOpen.value = false
  }
}

const logout = () => {
  authStore.logout()
}

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<template>
  <header class="bg-white border-b border-gray-200 z-10">
    <div class="h-16 flex items-center justify-between px-4">
      <!-- Left section: Mobile menu button and search -->
      <div class="flex items-center">
        <button 
          v-if="isMobile" 
          @click="toggleSidebar"
          class="mr-2 p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <!-- Search bar -->
        <div class="relative ml-3 hidden md:block">
          <div class="flex items-center border rounded-md bg-gray-50 pl-3">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-4 w-4 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search..." 
              class="w-64 px-2 py-2 bg-transparent border-none focus:outline-none text-sm" 
            />
          </div>
        </div>
      </div>
      
      <!-- Right section: Notifications and profile -->
      <div class="flex items-center space-x-3">
        <!-- Notifications -->
        <div class="relative">
          <button 
            @click="toggleNotifications"
            class="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none relative"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="absolute top-0 right-0 h-2 w-2 bg-primary-500 rounded-full"></span>
          </button>
          
          <!-- Notifications dropdown -->
          <div 
            v-if="isNotificationsOpen"
            v-motion
            :initial="{ opacity: 0, y: -10 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 200 } }"
            class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
          >
            <div class="px-4 py-2 border-b border-gray-200">
              <h3 class="text-sm font-semibold text-gray-700">Notifications</h3>
            </div>
            <div class="max-h-60 overflow-y-auto">
              <div class="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                <p class="text-sm font-medium text-gray-800">New user registered</p>
                <p class="text-xs text-gray-500">2 minutes ago</p>
              </div>
              <div class="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                <p class="text-sm font-medium text-gray-800">Group 'Marketing' created</p>
                <p class="text-xs text-gray-500">1 hour ago</p>
              </div>
              <div class="px-4 py-3 hover:bg-gray-50">
                <p class="text-sm font-medium text-gray-800">User Jane assigned as admin</p>
                <p class="text-xs text-gray-500">Yesterday</p>
              </div>
            </div>
            <div class="px-4 py-2 border-t border-gray-200">
              <a href="#" class="text-xs font-medium text-primary-600 hover:text-primary-700">View all notifications</a>
            </div>
          </div>
        </div>
        
        <!-- Profile dropdown -->
        <div class="relative">
          <button 
            @click="toggleProfileMenu"
            class="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            <div class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
              {{ authStore.user?.name?.charAt(0) || 'U' }}
            </div>
            <span class="hidden md:block text-sm font-medium text-gray-700">{{ authStore.user?.name || 'User' }}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-5 w-5 text-gray-400" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <!-- Profile menu dropdown -->
          <div 
            v-if="isProfileMenuOpen"
            v-motion
            :initial="{ opacity: 0, y: -10 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 200 } }"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
          >
            <router-link 
              to="/profile" 
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Your Profile
            </router-link>
            <a 
              href="#" 
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Settings
            </a>
            <div class="border-t border-gray-100 my-1"></div>
            <button 
              @click="logout" 
              class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>