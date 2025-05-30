<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useGroupStore } from '../../stores/groups'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import Card from '../../components/ui/Card.vue'
import Button from '../../components/ui/Button.vue'

const authStore = useAuthStore()
const groupStore = useGroupStore()

// State
const isLoading = ref(false)
const isEditMode = ref(false)
const isSaving = ref(false)

// Form data
const profileForm = reactive({
  name: '',
  email: ''
})

// Password change form
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Form errors
const formErrors = reactive({
  name: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// User's groups
const userGroups = computed(() => {
  if (!authStore.user) return []
  return groupStore.getUserGroups(authStore.user.id)
})

// Admin groups
const adminGroups = computed(() => {
  if (!authStore.user) return []
  return groupStore.getAdminGroups(authStore.user.id)
})

// Toggle edit mode
const toggleEditMode = () => {
  if (isEditMode.value) {
    // Cancel editing - reset form
    profileForm.name = authStore.user?.name || ''
    profileForm.email = authStore.user?.email || ''
    isEditMode.value = false
  } else {
    // Enter edit mode
    isEditMode.value = true
  }
}

// Validate profile form
const validateProfileForm = () => {
  let isValid = true
  
  // Reset errors
  formErrors.name = ''
  formErrors.email = ''
  
  // Validate name
  if (!profileForm.name) {
    formErrors.name = 'Name is required'
    isValid = false
  }
  
  // Validate email
  if (!profileForm.email) {
    formErrors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
    formErrors.email = 'Invalid email format'
    isValid = false
  }
  
  return isValid
}

// Validate password form
const validatePasswordForm = () => {
  let isValid = true
  
  // Reset errors
  formErrors.currentPassword = ''
  formErrors.newPassword = ''
  formErrors.confirmPassword = ''
  
  // Validate current password
  if (!passwordForm.currentPassword) {
    formErrors.currentPassword = 'Current password is required'
    isValid = false
  }
  
  // Validate new password
  if (!passwordForm.newPassword) {
    formErrors.newPassword = 'New password is required'
    isValid = false
  } else if (passwordForm.newPassword.length < 6) {
    formErrors.newPassword = 'Password must be at least 6 characters'
    isValid = false
  }
  
  // Validate confirm password
  if (!passwordForm.confirmPassword) {
    formErrors.confirmPassword = 'Please confirm your new password'
    isValid = false
  } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    formErrors.confirmPassword = 'Passwords do not match'
    isValid = false
  }
  
  return isValid
}

// Save profile
const saveProfile = async () => {
  if (!validateProfileForm()) {
    return
  }
  
  isSaving.value = true
  
  try {
    // In a real app, this would call the auth store to update the user
    // For demo purposes, simulate an API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (authStore.user) {
      authStore.user.name = profileForm.name
      authStore.user.email = profileForm.email
    }
    
    isEditMode.value = false
  } catch (error: any) {
    console.error('Failed to update profile:', error)
  } finally {
    isSaving.value = false
  }
}

// Change password
const changePassword = async () => {
  if (!validatePasswordForm()) {
    return
  }
  
  isSaving.value = true
  
  try {
    // In a real app, this would call the auth store to change the password
    // For demo purposes, simulate an API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Reset password form
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
    // Show success message (in a real app)
    alert('Password changed successfully')
  } catch (error: any) {
    console.error('Failed to change password:', error)
  } finally {
    isSaving.value = false
  }
}

// Initialize data
onMounted(async () => {
  isLoading.value = true
  
  try {
    // Load user groups
    await groupStore.fetchGroups()
    
    // Set initial form values
    if (authStore.user) {
      profileForm.name = authStore.user.name
      profileForm.email = authStore.user.email
    }
  } catch (error) {
    console.error('Error loading profile data:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <DashboardLayout>
    <PageHeader 
      title="My Profile" 
      subtitle="View and manage your profile information" 
    />
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Information Card -->
      <Card 
        title="Profile Information"
        :loading="isLoading"
        class="lg:col-span-2"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      >
        <form @submit.prevent="saveProfile" class="space-y-6">
          <!-- Profile picture and name header -->
          <div class="flex flex-col sm:flex-row items-center gap-4 pb-6 border-b border-gray-200">
            <div class="h-20 w-20 rounded-full bg-primary-500 flex items-center justify-center text-2xl text-white">
              {{ authStore.user?.name?.charAt(0) || 'U' }}
            </div>
            <div class="text-center sm:text-left">
              <h3 class="text-xl font-medium text-gray-900">{{ authStore.user?.name }}</h3>
              <p class="text-sm text-gray-500">{{ authStore.user?.email }}</p>
              <p class="text-sm text-gray-500 mt-1">
                <span 
                  class="px-2 py-1 text-xs rounded-full" 
                  :class="authStore.user?.role === 'admin' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ authStore.user?.role || 'User' }}
                </span>
              </p>
            </div>
            <div class="flex-1 flex justify-end">
              <Button 
                variant="outline"
                size="sm"
                @click="toggleEditMode"
              >
                {{ isEditMode ? 'Cancel' : 'Edit Profile' }}
              </Button>
            </div>
          </div>
          
          <!-- Profile details -->
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Name -->
              <div>
                <label for="name" class="form-label">Name</label>
                <input
                  id="name"
                  v-model="profileForm.name"
                  type="text"
                  class="form-control"
                  :disabled="!isEditMode"
                  :class="{ 'border-red-500': formErrors.name }"
                />
                <p v-if="formErrors.name" class="form-error">{{ formErrors.name }}</p>
              </div>
              
              <!-- Email -->
              <div>
                <label for="email" class="form-label">Email Address</label>
                <input
                  id="email"
                  v-model="profileForm.email"
                  type="email"
                  class="form-control"
                  :disabled="!isEditMode"
                  :class="{ 'border-red-500': formErrors.email }"
                />
                <p v-if="formErrors.email" class="form-error">{{ formErrors.email }}</p>
              </div>
            </div>
            
            <!-- Organization information -->
            <div>
              <label class="form-label">Organization</label>
              <p class="text-gray-700 font-medium">{{ authStore.organization || 'N/A' }}</p>
            </div>
            
            <!-- Save button (only visible in edit mode) -->
            <div v-if="isEditMode" class="flex justify-end">
              <Button 
                variant="primary"
                type="submit"
                :loading="isSaving"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </Card>
      
      <!-- Security Card -->
      <Card 
        title="Security"
        :loading="isLoading"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 100 } }"
      >
        <form @submit.prevent="changePassword" class="space-y-4">
          <!-- Current Password -->
          <div>
            <label for="current-password" class="form-label">Current Password</label>
            <input
              id="current-password"
              v-model="passwordForm.currentPassword"
              type="password"
              class="form-control"
              :class="{ 'border-red-500': formErrors.currentPassword }"
            />
            <p v-if="formErrors.currentPassword" class="form-error">{{ formErrors.currentPassword }}</p>
          </div>
          
          <!-- New Password -->
          <div>
            <label for="new-password" class="form-label">New Password</label>
            <input
              id="new-password"
              v-model="passwordForm.newPassword"
              type="password"
              class="form-control"
              :class="{ 'border-red-500': formErrors.newPassword }"
            />
            <p v-if="formErrors.newPassword" class="form-error">{{ formErrors.newPassword }}</p>
          </div>
          
          <!-- Confirm Password -->
          <div>
            <label for="confirm-password" class="form-label">Confirm New Password</label>
            <input
              id="confirm-password"
              v-model="passwordForm.confirmPassword"
              type="password"
              class="form-control"
              :class="{ 'border-red-500': formErrors.confirmPassword }"
            />
            <p v-if="formErrors.confirmPassword" class="form-error">{{ formErrors.confirmPassword }}</p>
          </div>
          
          <div class="pt-2">
            <Button 
              variant="primary"
              type="submit"
              :loading="isSaving"
              block
            >
              Change Password
            </Button>
          </div>
        </form>
      </Card>
      
      <!-- Groups Card -->
      <Card 
        title="My Groups"
        :loading="isLoading"
        class="lg:col-span-3"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 200 } }"
      >
        <div v-if="userGroups.length === 0" class="text-center py-6 text-gray-500">
          You are not a member of any groups yet
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="group in userGroups" 
            :key="group.id"
            class="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors duration-200"
          >
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-medium text-gray-900">{{ group.name }}</h4>
              <span 
                v-if="group.adminId === authStore.user?.id"
                class="px-2 py-0.5 text-xs rounded-full bg-primary-100 text-primary-800"
              >
                Admin
              </span>
            </div>
            <p class="text-sm text-gray-500 mb-3 line-clamp-2">{{ group.description }}</p>
            <div class="text-xs text-gray-500">
              {{ group.members.length }} members
            </div>
          </div>
        </div>
        
        <div class="mt-4 flex justify-end">
          <Button 
            variant="outline"
            size="sm"
            @click="$router.push('/groups')"
          >
            View All Groups
          </Button>
        </div>
      </Card>
    </div>
  </DashboardLayout>
</template>