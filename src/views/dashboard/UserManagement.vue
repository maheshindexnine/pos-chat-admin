<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '../../stores/users'
import { useAuthStore } from '../../stores/auth'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import Card from '../../components/ui/Card.vue'
import Button from '../../components/ui/Button.vue'
import Modal from '../../components/ui/Modal.vue'

const userStore = useUserStore()
const authStore = useAuthStore()

// State
const isLoading = ref(false)
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const searchQuery = ref('')
const selectedUser = ref<any>(null)

// Form data
const newUserForm = reactive({
  name: '',
  email: '',
  password: '',
  type: 'user'
})

// Form errors
const formErrors = reactive({
  name: '',
  email: '',
  password: ''
})

// Filtered users
const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    return userStore.allUsers
  }
  
  const query = searchQuery.value.toLowerCase()
  return userStore.allUsers.filter(user => 
    user.name.toLowerCase().includes(query) || 
    user.email.toLowerCase().includes(query) ||
    user.type.toLowerCase().includes(query)
  )
})

// Validation
const validateForm = () => {
  let isValid = true
  
  // Reset errors
  formErrors.name = ''
  formErrors.email = ''
  formErrors.password = ''
  
  // Validate name
  if (!newUserForm.name) {
    formErrors.name = 'Name is required'
    isValid = false
  }
  
  // Validate email
  if (!newUserForm.email) {
    formErrors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserForm.email)) {
    formErrors.email = 'Invalid email format'
    isValid = false
  }
  
  // Validate password (only for new users)
  if (!isEditModalOpen.value && !newUserForm.password) {
    formErrors.password = 'Password is required'
    isValid = false
  } else if (!isEditModalOpen.value && newUserForm.password.length < 6) {
    formErrors.password = 'Password must be at least 6 characters'
    isValid = false
  }
  
  return isValid
}

// CRUD operations
const openCreateModal = () => {
  // Reset form
  newUserForm.name = ''
  newUserForm.email = ''
  newUserForm.password = ''
  newUserForm.type = 'user'
  
  isCreateModalOpen.value = true
}

const openEditModal = (user: any) => {
  selectedUser.value = user
  
  // Fill form with user data
  newUserForm.name = user.name
  newUserForm.email = user.email
  newUserForm.password = '' // Don't prefill password
  newUserForm.type = user.type
  
  isEditModalOpen.value = true
}

const openDeleteModal = (user: any) => {
  selectedUser.value = user
  isDeleteModalOpen.value = true
}

const handleCreateUser = async () => {
  if (!validateForm()) {
    return
  }
  
  isLoading.value = true
  
  try {
    await userStore.createUser({
      name: newUserForm.name,
      email: newUserForm.email,
      password: newUserForm.password,
      type: newUserForm.type
    })
    
    // Reset form and close modal
    newUserForm.name = ''
    newUserForm.email = ''
    newUserForm.password = ''
    newUserForm.type = 'user'
    
    isCreateModalOpen.value = false
  } catch (error: any) {
    console.error('Failed to create user:', error)
  } finally {
    isLoading.value = false
  }
}

const handleUpdateUser = async () => {
  if (!validateForm() || !selectedUser.value) {
    return
  }
  
  isLoading.value = true
  
  try {
    await userStore.updateUser(selectedUser.value._id, {
      name: newUserForm.name,
      email: newUserForm.email,
      type: newUserForm.type
    })
    
    // Close modal
    isEditModalOpen.value = false
  } catch (error: any) {
    console.error('Failed to update user:', error)
  } finally {
    isLoading.value = false
  }
}

const handleDeleteUser = async () => {
  if (!selectedUser.value) {
    return
  }
  
  isLoading.value = true
  
  try {
    await userStore.deleteUser(selectedUser.value._id)
    isDeleteModalOpen.value = false
  } catch (error: any) {
    console.error('Failed to delete user:', error)
  } finally {
    isLoading.value = false
  }
}

// Fetch users on component mount
onMounted(async () => {
  isLoading.value = true
  await userStore.fetchUsers()
  isLoading.value = false
})
</script>

<template>
  <DashboardLayout>
    <PageHeader 
      title="User Management" 
      subtitle="Manage users for your organization" 
    />
    
    <Card 
      :loading="isLoading"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
    >
      <!-- Card header with search and add button -->
      <div class="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
        <div class="relative">
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
              v-model="searchQuery"
              type="text" 
              placeholder="Search users..." 
              class="w-full md:w-64 px-2 py-2 bg-transparent border-none focus:outline-none text-sm" 
            />
          </div>
        </div>
        
        <Button 
          variant="primary" 
          @click="openCreateModal"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </Button>
      </div>
      
      <!-- User table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white">
                    {{ user.name.charAt(0) }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full uppercase" 
                  :class="user.type === 'admin' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ user.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    @click="openEditModal(user)"
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    @click="openDeleteModal(user)"
                    :disabled="user.id === authStore.user?.id"
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
            
            <!-- Empty state -->
            <tr v-if="filteredUsers.length === 0">
              <td colspan="4" class="px-6 py-10 text-center text-gray-500">
                <div class="flex flex-col items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-10 w-10 text-gray-400 mb-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p>No users found</p>
                  <Button 
                    variant="primary" 
                    size="sm"
                    class="mt-2"
                    @click="openCreateModal"
                  >
                    Add User
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
    
    <!-- Create User Modal -->
    <Modal
      v-model="isCreateModalOpen"
      title="Create New User"
    >
      <form @submit.prevent="handleCreateUser" class="space-y-4">
        <!-- Name -->
        <div>
          <label for="name" class="form-label">Name</label>
          <input
            id="name"
            v-model="newUserForm.name"
            type="text"
            class="form-control"
            :class="{ 'border-red-500': formErrors.name }"
          />
          <p v-if="formErrors.name" class="form-error">{{ formErrors.name }}</p>
        </div>
        
        <!-- Email -->
        <div>
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="newUserForm.email"
            type="email"
            class="form-control"
            :class="{ 'border-red-500': formErrors.email }"
          />
          <p v-if="formErrors.email" class="form-error">{{ formErrors.email }}</p>
        </div>
        
        <!-- Password -->
        <div>
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="newUserForm.password"
            type="password"
            class="form-control"
            :class="{ 'border-red-500': formErrors.password }"
          />
          <p v-if="formErrors.password" class="form-error">{{ formErrors.password }}</p>
        </div>
        
        <!-- Role -->
        <div>
          <label for="type" class="form-label">Role</label>
          <select
            id="type"
            v-model="newUserForm.type"
            class="form-control"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </form>
      
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button 
            variant="secondary" 
            @click="isCreateModalOpen = false"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            @click="handleCreateUser"
            :loading="isLoading"
          >
            Create User
          </Button>
        </div>
      </template>
    </Modal>
    
    <!-- Edit User Modal -->
    <Modal
      v-model="isEditModalOpen"
      title="Edit User"
    >
      <form @submit.prevent="handleUpdateUser" class="space-y-4">
        <!-- Name -->
        <div>
          <label for="edit-name" class="form-label">Name</label>
          <input
            id="edit-name"
            v-model="newUserForm.name"
            type="text"
            class="form-control"
            :class="{ 'border-red-500': formErrors.name }"
          />
          <p v-if="formErrors.name" class="form-error">{{ formErrors.name }}</p>
        </div>
        
        <!-- Email -->
        <div>
          <label for="edit-email" class="form-label">Email</label>
          <input
            id="edit-email"
            v-model="newUserForm.email"
            type="email"
            class="form-control"
            :class="{ 'border-red-500': formErrors.email }"
          />
          <p v-if="formErrors.email" class="form-error">{{ formErrors.email }}</p>
        </div>
        
        <!-- Role -->
        <div>
          <label for="edit-role" class="form-label">Role</label>
          <select
            id="edit-role"
            v-model="newUserForm.type"
            class="form-control"
            :disabled="selectedUser && selectedUser.id === authStore.user?.id"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <p v-if="selectedUser && selectedUser.id === authStore.user?.id" class="text-xs text-gray-500 mt-1">
            You cannot change your own role
          </p>
        </div>
      </form>
      
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button 
            variant="secondary" 
            @click="isEditModalOpen = false"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            @click="handleUpdateUser"
            :loading="isLoading"
          >
            Update User
          </Button>
        </div>
      </template>
    </Modal>
    
    <!-- Delete User Confirmation Modal -->
    <Modal
      v-model="isDeleteModalOpen"
      title="Delete User"
    >
      <div class="text-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-12 w-12 text-red-500 mx-auto mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        
        <p class="text-gray-700 mb-4">
          Are you sure you want to delete <span class="font-semibold">{{ selectedUser?.name }}</span>?
          This action cannot be undone.
        </p>
      </div>
      
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button 
            variant="secondary" 
            @click="isDeleteModalOpen = false"
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            @click="handleDeleteUser"
            :loading="isLoading"
          >
            Delete User
          </Button>
        </div>
      </template>
    </Modal>
  </DashboardLayout>
</template>