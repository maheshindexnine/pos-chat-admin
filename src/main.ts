import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import router from './router'
import './style.css'

// Create pinia instance with persistence
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Create and mount the app
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(MotionPlugin)
app.mount('#app')