<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div 
    class="mb-6 ms-6"
    v-motion
    :initial="{ opacity: 0, y: -10 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 300 } }"
  >
    <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
    <p v-if="subtitle" class="mt-1 text-sm text-gray-500">{{ subtitle }}</p>
  </div>
</template>