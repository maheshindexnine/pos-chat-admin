<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useGroupStore } from '../../stores/groups'
import { useUserStore } from '../../stores/users'
import { useAuthStore } from '../../stores/auth'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import Card from '../../components/ui/Card.vue'
import Button from '../../components/ui/Button.vue'
import Modal from '../../components/ui/Modal.vue'

const groupStore = useGroupStore()
const userStore = useUserStore()
const authStore = useAuthStore()

// State
const isLoading = ref(false)
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isManageMembersModalOpen = ref(false)
const searchQuery = ref('')
const selectedGroup = ref<any>(null)
const selectedUser = ref<string>('')

// Form data
const groupForm = reactive({
  name: '',
  description: ''
})

// Form errors
const formErrors = reactive({
  name: '',
  description: ''
})

// Filtered groups
const filteredGroups = computed(() => {
  if (!searchQuery.value) {
    return groupStore.allGroups
  }
  
  const query = searchQuery.value.toLowerCase()
  return groupStore.allGroups.filter(group => 
    group.name.toLowerCase().includes(query) || 
    group.description.toLowerCase().includes(query)
  )
})

// Available users (not already in the group)
const availableUsers = computed(() => {
  if (!selectedGroup.value) return []
  
  return userStore.allUsers.filter(user => 
    !selectedGroup.value.members.includes(user.id)
  )
})

// Group members
const groupMembers = computed(() => {
  if (!selectedGroup.value) return []
  
  return userStore.allUsers.filter(user => 
    selectedGroup.value.members.includes(user.id)
  )
})

// Group admin
const groupAdmin = computed(() => {
  if (!selectedGroup.value) return null
  
  return userStore.getUserById(selectedGroup.value.adminId)
})

// Validation
const validateForm = () => {
  let isValid = true
  
  // Reset errors
  formErrors.name = ''
  formErrors.description = ''
  
  // Validate name
  if (!groupForm.name) {
    formErrors.name = 'Group name is required'
    isValid = false
  }
  
  // Validate description
  if (!groupForm.description) {
    formErrors.description = 'Description is required'
    isValid = false
  }
  
  return isValid
}

// CRUD operations
const openCreateModal = () => {
  // Reset form
  groupForm.name = ''
  groupForm.description = ''
  
  isCreateModalOpen.value = true
}

const openEditModal = (group: any) => {
  selectedGroup.value = group
  
  // Fill form with group data
  groupForm.name = group.name
  groupForm.description = group.description
  
  isEditModalOpen.value = true
}

const openDeleteModal = (group: any) => {
  selectedGroup.value = group
  isDeleteModalOpen.value = true
}

const openManageMembersModal = (group: any) => {
  selectedGroup.value = group
  selectedUser.value = ''
  isManageMembersModalOpen.value = true
}

const handleCreateGroup = async () => {
  if (!validateForm()) {
    return
  }
  
  isLoading.value = true
  
  try {
    await groupStore.createGroup({
      name: groupForm.name,
      description: groupForm.description,
      adminId: authStore.user?.id || ''
    })
    
    // Reset form and close modal
    groupForm.name = ''
    groupForm.description = ''
    
    isCreateModalOpen.value = false
  } catch (error: any) {
    console.error('Failed to create group:', error)
  } finally {
    isLoading.value = false
  }
}

const handleUpdateGroup = async () => {
  if (!validateForm() || !selectedGroup.value) {
    return
  }
  
  isLoading.value = true
  
  try {
    await groupStore.updateGroup(selectedGroup.value.id, {
      name: groupForm.name,
      description: groupForm.description
    })
    
    // Close modal
    isEditModalOpen.value = false
  } catch (error: any) {
    console.error('Failed to update group:', error)
  } finally {
    isLoading.value = false
  }
}

const handleDeleteGroup = async () => {
  if (!selectedGroup.value) {
    return
  }
  
  isLoading.value = true
  
  try {
    await groupStore.deleteGroup(selectedGroup.value.id)
    isDeleteModalOpen.value = false
  } catch (error: any) {
    console.error('Failed to delete group:', error)
  } finally {
    isLoading.value = false
  }
}

const handleAddMember = async () => {
  if (!selectedGroup.value || !selectedUser.value) {
    return
  }
  
  isLoading.value = true
  
  try {
    await groupStore.addUserToGroup(selectedGroup.value.id, selectedUser.value)
    selectedUser.value = ''
  } catch (error: any) {
    console.error('Failed to add user to group:', error)
  } finally {
    isLoading.value = false
  }
}

const handleRemoveMember = async (userId: string) => {
  if (!selectedGroup.value) {
    return
  }
  
  isLoading.value = true
  
  try {
    await groupStore.removeUserFromGroup(selectedGroup.value.id, userId)
  } catch (error: any) {
    console.error('Failed to remove user from group:', error)
  } finally {
    isLoading.value = false
  }
}

const handleChangeAdmin = async (userId: string) => {
  if (!selectedGroup.value) {
    return
  }
  
  isLoading.value = true
  
  try {
    await groupStore.changeGroupAdmin(selectedGroup.value.id, userId)
  } catch (error: any) {
    console.error('Failed to change group admin:', error)
  } finally {
    isLoading.value = false
  }
}

// Fetch data on component mount
onMounted(async () => {
  isLoading.value = true
  await Promise.all([
    groupStore.fetchGroups(),
    userStore.fetchUsers()
  ])
  isLoading.value = false
})
</script>

<template>
  <DashboardLayout>
    <PageHeader 
      title="Group Management" 
      subtitle="Create and manage user groups for your organization" 
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
              placeholder="Search groups..." 
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
          Create Group
        </Button>
      </div>
      
      <!-- Groups Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="group in filteredGroups" 
          :key="group.id"
          class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
          v-motion
          :initial="{ opacity: 0, scale: 0.95 }"
          :enter="{ opacity: 1, scale: 1, transition: { duration: 400 } }"
        >
          <div class="p-5">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-semibold text-gray-900 truncate">{{ group.name }}</h3>
              <span class="text-xs text-gray-500">{{ group.members.length }} members</span>
            </div>
            
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ group.description }}</p>
            
            <div class="flex -space-x-2 mb-4">
              <div 
                v-for="(memberId, index) in group.members.slice(0, 5)" 
                :key="memberId"
                class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white ring-2 ring-white"
                :title="userStore.getUserById(memberId)?.name"
              >
                {{ userStore.getUserById(memberId)?.name.charAt(0) || 'U' }}
              </div>
              
              <div 
                v-if="group.members.length > 5"
                class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs ring-2 ring-white"
              >
                +{{ group.members.length - 5 }}
              </div>
            </div>
            
            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
              <div class="flex items-center">
                <div class="h-6 w-6 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs">
                  {{ userStore.getUserById(group.adminId)?.name.charAt(0) || 'A' }}
                </div>
                <span class="ml-2 text-xs text-gray-500">
                  Admin: {{ userStore.getUserById(group.adminId)?.name || 'Unknown' }}
                </span>
              </div>
              
              <div class="flex space-x-2">
                <Button 
                  variant="outline"
                  size="sm"
                  @click="openManageMembersModal(group)"
                >
                  Members
                </Button>
                
                <div class="relative group">
                  <Button 
                    variant="text"
                    size="sm"
                    icon
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </Button>
                  
                  <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <button 
                      @click="openEditModal(group)" 
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit Group
                    </button>
                    <button 
                      @click="openDeleteModal(group)" 
                      class="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                    >
                      Delete Group
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty state card -->
        <div 
          v-if="filteredGroups.length === 0"
          class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 col-span-full flex flex-col items-center justify-center"
          v-motion
          :initial="{ opacity: 0 }"
          :enter="{ opacity: 1, transition: { duration: 500 } }"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-12 w-12 text-gray-400 mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="text-gray-500 mb-4">No groups found</p>
          <Button 
            variant="primary"
            @click="openCreateModal"
          >
            Create First Group
          </Button>
        </div>
      </div>
    </Card>
    
    <!-- Create Group Modal -->
    <Modal
      v-model="isCreateModalOpen"
      title="Create New Group"
    >
      <form @submit.prevent="handleCreateGroup" class="space-y-4">
        <!-- Name -->
        <div>
          <label for="group-name" class="form-label">Group Name</label>
          <input
            id="group-name"
            v-model="groupForm.name"
            type="text"
            class="form-control"
            :class="{ 'border-red-500': formErrors.name }"
          />
          <p v-if="formErrors.name" class="form-error">{{ formErrors.name }}</p>
        </div>
        
        <!-- Description -->
        <div>
          <label for="description" class="form-label">Description</label>
          <textarea
            id="description"
            v-model="groupForm.description"
            rows="3"
            class="form-control"
            :class="{ 'border-red-500': formErrors.description }"
          ></textarea>
          <p v-if="formErrors.description" class="form-error">{{ formErrors.description }}</p>
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
            @click="handleCreateGroup"
            :loading="isLoading"
          >
            Create Group
          </Button>
        </div>
      </template>
    </Modal>
    
    <!-- Edit Group Modal -->
    <Modal
      v-model="isEditModalOpen"
      title="Edit Group"
    >
      <form @submit.prevent="handleUpdateGroup" class="space-y-4">
        <!-- Name -->
        <div>
          <label for="edit-group-name" class="form-label">Group Name</label>
          <input
            id="edit-group-name"
            v-model="groupForm.name"
            type="text"
            class="form-control"
            :class="{ 'border-red-500': formErrors.name }"
          />
          <p v-if="formErrors.name" class="form-error">{{ formErrors.name }}</p>
        </div>
        
        <!-- Description -->
        <div>
          <label for="edit-description" class="form-label">Description</label>
          <textarea
            id="edit-description"
            v-model="groupForm.description"
            rows="3"
            class="form-control"
            :class="{ 'border-red-500': formErrors.description }"
          ></textarea>
          <p v-if="formErrors.description" class="form-error">{{ formErrors.description }}</p>
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
            @click="handleUpdateGroup"
            :loading="isLoading"
          >
            Update Group
          </Button>
        </div>
      </template>
    </Modal>
    
    <!-- Delete Group Confirmation Modal -->
    <Modal
      v-model="isDeleteModalOpen"
      title="Delete Group"
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
          Are you sure you want to delete <span class="font-semibold">{{ selectedGroup?.name }}</span>?
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
            @click="handleDeleteGroup"
            :loading="isLoading"
          >
            Delete Group
          </Button>
        </div>
      </template>
    </Modal>
    
    <!-- Manage Members Modal -->
    <Modal
      v-model="isManageMembersModalOpen"
      title="Manage Group Members"
      size="lg"
    >
      <div v-if="selectedGroup" class="space-y-6">
        <!-- Add member form -->
        <div class="p-4 bg-gray-50 rounded-md">
          <h4 class="text-sm font-medium text-gray-700 mb-3">Add New Member</h4>
          <div class="flex space-x-2">
            <select 
              v-model="selectedUser"
              class="form-control flex-1"
            >
              <option value="" disabled>Select user</option>
              <option 
                v-for="user in availableUsers" 
                :key="user.id" 
                :value="user.id"
              >
                {{ user.name }} ({{ user.email }})
              </option>
            </select>
            <Button 
              variant="primary"
              :disabled="!selectedUser"
              @click="handleAddMember"
              :loading="isLoading"
            >
              Add
            </Button>
          </div>
          <p v-if="availableUsers.length === 0" class="text-sm text-gray-500 mt-2">
            All users are already members of this group
          </p>
        </div>
        
        <!-- Current members list -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 mb-3">Current Members</h4>
          <div class="max-h-60 overflow-y-auto border rounded-md divide-y divide-gray-200">
            <div 
              v-for="member in groupMembers" 
              :key="member.id"
              class="p-3 flex items-center justify-between hover:bg-gray-50"
            >
              <div class="flex items-center">
                <div class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                  {{ member.name.charAt(0) }}
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">{{ member.name }}</p>
                  <p class="text-xs text-gray-500">{{ member.email }}</p>
                </div>
                <span 
                  v-if="selectedGroup.adminId === member.id"
                  class="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary-100 text-primary-800"
                >
                  Admin
                </span>
              </div>
              
              <div class="flex space-x-2">
                <Button 
                  v-if="selectedGroup.adminId !== member.id && authStore.user?.id === selectedGroup.adminId"
                  variant="outline"
                  size="sm"
                  @click="handleChangeAdmin(member.id)"
                  :loading="isLoading"
                >
                  Make Admin
                </Button>
                
                <Button 
                  v-if="selectedGroup.adminId !== member.id"
                  variant="danger"
                  size="sm"
                  @click="handleRemoveMember(member.id)"
                  :loading="isLoading"
                >
                  Remove
                </Button>
              </div>
            </div>
            
            <div v-if="groupMembers.length === 0" class="p-4 text-center text-gray-500">
              No members in this group
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end">
          <Button 
            variant="secondary" 
            @click="isManageMembersModalOpen = false"
          >
            Close
          </Button>
        </div>
      </template>
    </Modal>
  </DashboardLayout>
</template>