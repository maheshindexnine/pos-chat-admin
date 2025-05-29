<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const goHome = () => {
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  } else {
    router.push('/login')
  }
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div 
    class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12"
    v-motion
    :initial="{ opacity: 0 }"
    :enter="{ opacity: 1, transition: { duration: 500 } }"
  >
    <div class="max-w-md w-full text-center">
      <div 
        class="text-primary-500 font-bold text-9xl"
        v-motion
        :initial="{ scale: 0.5, opacity: 0 }"
        :enter="{ scale: 1, opacity: 1, transition: { duration: 500 } }"
      >
        404
      </div>
      
      <h1 
        class="mt-4 text-3xl font-bold text-gray-900"
        v-motion
        :initial="{ y: 20, opacity: 0 }"
        :enter="{ y: 0, opacity: 1, transition: { duration: 500, delay: 100 } }"
      >
        Page Not Found
      </h1>
      
      <p 
        class="mt-2 text-gray-600"
        v-motion
        :initial="{ y: 20, opacity: 0 }"
        :enter="{ y: 0, opacity: 1, transition: { duration: 500, delay: 200 } }"
      >
        Sorry, we couldn't find the page you're looking for.
      </p>
      
      <div 
        class="mt-8 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4"
        v-motion
        :initial="{ y: 20, opacity: 0 }"
        :enter="{ y: 0, opacity: 1, transition: { duration: 500, delay: 300 } }"
      >
        <button 
          @click="goHome"
          class="btn btn-primary"
        >
          Go to Home
        </button>
        <button 
          @click="goBack"
          class="btn btn-secondary"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>