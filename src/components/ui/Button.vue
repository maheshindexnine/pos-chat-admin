<script setup lang="ts">
interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'text'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  icon?: boolean
}

withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  block: false,
  icon: false
})

const emit = defineEmits(['click'])

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    @click="handleClick"
    :class="[
      'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
      {
        'px-4': !icon && size === 'md',
        'px-3': !icon && size === 'sm',
        'px-5': !icon && size === 'lg',
        'py-2': size === 'md',
        'py-1': size === 'sm',
        'py-3': size === 'lg',
        'h-8 w-8': icon && size === 'sm',
        'h-10 w-10': icon && size === 'md',
        'h-12 w-12': icon && size === 'lg',
        'opacity-70 cursor-not-allowed': disabled,
        'w-full': block,
        
        // Variants
        'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500': variant === 'primary',
        'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-primary-500': variant === 'secondary',
        'bg-success-500 hover:bg-success-600 text-white focus:ring-success-500': variant === 'success',
        'bg-error-500 hover:bg-error-600 text-white focus:ring-error-500': variant === 'danger',
        'bg-transparent hover:bg-gray-100 text-primary-600 border border-primary-500 focus:ring-primary-500': variant === 'outline',
        'bg-transparent hover:bg-gray-100 text-primary-600 hover:text-primary-700 focus:ring-transparent p-1': variant === 'text',
      }
    ]"
  >
    <svg 
      v-if="loading" 
      class="animate-spin h-4 w-4 mr-2" 
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
    <slot></slot>
  </button>
</template>