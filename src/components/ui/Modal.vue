<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import Button from "./Button.vue";

const props = defineProps<{
  modelValue: boolean;
  title?: string;
  size?: "sm" | "md" | "lg";
  hideClose?: boolean;
}>();

const emit = defineEmits(["update:modelValue", "close"]);

const modalRef = ref<HTMLElement | null>(null);

const close = () => {
  emit("update:modelValue", false);
  emit("close");
};

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.modelValue) {
    close();
  }
};

const handleClickOutside = (e: MouseEvent) => {
  if (modalRef.value && !modalRef.value.contains(e.target as Node)) {
    close();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleEscape);
});

const calculateModalWidth = () => {
  switch (props.size) {
    case "sm":
      return "max-w-md";
    case "lg":
      return "max-w-3xl";
    default:
      return "max-w-xl";
  }
};

const modalWidth = calculateModalWidth();
</script>

<template>
  <teleport to="body">
    <transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="handleClickOutside"
      >
        <div class="flex items-center justify-center min-h-screen p-4">
          <!-- Overlay -->
          <div
            class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          ></div>

          <!-- Modal panel -->
          <div
            ref="modalRef"
            :class="[
              'relative bg-purple-200 rounded-lg shadow-xl transform transition-all w-full',
              modalWidth,
            ]"
            v-motion
            :initial="{ scale: 0.95, opacity: 0 }"
            :enter="{ scale: 1, opacity: 1, transition: { duration: 300 } }"
          >
            <!-- Modal header -->
            <div
              v-if="title || !hideClose"
              class="px-6 py-4 border-b border-gray-200 flex items-center justify-between"
            >
              <h3 v-if="title" class="text-lg font-medium text-gray-900">
                {{ title }}
              </h3>
              <button
                v-if="!hideClose"
                @click="close"
                class="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Modal body -->
            <div class="px-6 py-4">
              <slot></slot>
            </div>

            <!-- Modal footer -->
            <div
              v-if="$slots.footer"
              class="px-6 py-4 border-t border-gray-200"
            >
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
