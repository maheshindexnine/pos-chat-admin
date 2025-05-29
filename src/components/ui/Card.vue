<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
  noPadding?: boolean
  loading?: boolean
}>()
</script>

<template>
  <div 
    class="bg-white rounded-lg shadow-card overflow-hidden mb-6"
    v-motion
    :initial="{ opacity: 0, y: 20 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
  >
    <div v-if="title || subtitle" class="px-6 py-4 border-b border-gray-200">
      <h2 v-if="title" class="text-lg font-medium text-gray-900">{{ title }}</h2>
      <p v-if="subtitle" class="mt-1 text-sm text-gray-500">{{ subtitle }}</p>
    </div>
    
    <div :class="{ 'p-6': !noPadding, 'relative': loading }">
      <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <div class="loader"></div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.loader {
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>