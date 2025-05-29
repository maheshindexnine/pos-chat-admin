import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { useUserStore } from './users'

interface Group {
  id: string
  name: string
  description: string
  adminId: string
  organizationId: string
  createdAt: string
  members: string[] // User IDs
}

interface NewGroup {
  name: string
  description: string
  adminId: string
}

export const useGroupStore = defineStore('groups', {
  state: () => ({
    groups: [] as Group[],
    loading: false,
    error: null as string | null,
  }),
  
  getters: {
    getGroupById: (state) => (id: string) => {
      return state.groups.find(group => group.id === id)
    },
    allGroups: (state) => state.groups,
    getUserGroups: (state) => (userId: string) => {
      return state.groups.filter(group => 
        group.adminId === userId || 
        group.members.includes(userId)
      )
    },
    getAdminGroups: (state) => (userId: string) => {
      return state.groups.filter(group => group.adminId === userId)
    }
  },
  
  actions: {
    async fetchGroups() {
      this.loading = true
      this.error = null
      
      try {
        // Mock API call - in a real app, this would fetch from backend
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data
        const mockGroups: Group[] = [
          {
            id: '1',
            name: 'Marketing Team',
            description: 'Marketing department team',
            adminId: '1',
            organizationId: '1',
            createdAt: new Date().toISOString(),
            members: ['1', '2']
          },
          {
            id: '2',
            name: 'Development Team',
            description: 'Software development team',
            adminId: '1',
            organizationId: '1',
            createdAt: new Date().toISOString(),
            members: ['1', '3']
          }
        ]
        
        this.groups = mockGroups
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch groups'
        console.error('Error fetching groups:', error)
      } finally {
        this.loading = false
      }
    },
    
    async createGroup(groupData: NewGroup) {
      this.loading = true
      this.error = null
      
      try {
        // Mock API call - in a real app, this would call the backend
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const authStore = useAuthStore()
        
        // Create a new group object
        const newGroup: Group = {
          id: Date.now().toString(), // Mock ID generation
          name: groupData.name,
          description: groupData.description,
          adminId: groupData.adminId,
          organizationId: authStore.organization?.id || '1',
          createdAt: new Date().toISOString(),
          members: [groupData.adminId] // Admin is automatically a member
        }
        
        // Add to the groups array
        this.groups.push(newGroup)
        
        return newGroup
      } catch (error: any) {
        this.error = error.message || 'Failed to create group'
        console.error('Error creating group:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async updateGroup(id: string, groupData: Partial<Group>) {
      this.loading = true
      this.error = null
      
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const groupIndex = this.groups.findIndex(group => group.id === id)
        
        if (groupIndex === -1) {
          throw new Error('Group not found')
        }
        
        // Update group data
        this.groups[groupIndex] = {
          ...this.groups[groupIndex],
          ...groupData
        }
        
        return this.groups[groupIndex]
      } catch (error: any) {
        this.error = error.message || 'Failed to update group'
        console.error('Error updating group:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async deleteGroup(id: string) {
      this.loading = true
      this.error = null
      
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const groupIndex = this.groups.findIndex(group => group.id === id)
        
        if (groupIndex === -1) {
          throw new Error('Group not found')
        }
        
        // Remove group from array
        this.groups.splice(groupIndex, 1)
        
        return true
      } catch (error: any) {
        this.error = error.message || 'Failed to delete group'
        console.error('Error deleting group:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async addUserToGroup(groupId: string, userId: string) {
      this.loading = true
      this.error = null
      
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const groupIndex = this.groups.findIndex(group => group.id === groupId)
        
        if (groupIndex === -1) {
          throw new Error('Group not found')
        }
        
        // Check if user is already a member
        if (!this.groups[groupIndex].members.includes(userId)) {
          this.groups[groupIndex].members.push(userId)
        }
        
        return this.groups[groupIndex]
      } catch (error: any) {
        this.error = error.message || 'Failed to add user to group'
        console.error('Error adding user to group:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async removeUserFromGroup(groupId: string, userId: string) {
      this.loading = true
      this.error = null
      
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const groupIndex = this.groups.findIndex(group => group.id === groupId)
        
        if (groupIndex === -1) {
          throw new Error('Group not found')
        }
        
        // Check if user is the admin
        if (this.groups[groupIndex].adminId === userId) {
          throw new Error('Cannot remove the group admin')
        }
        
        // Remove user from members
        const memberIndex = this.groups[groupIndex].members.indexOf(userId)
        if (memberIndex !== -1) {
          this.groups[groupIndex].members.splice(memberIndex, 1)
        }
        
        return this.groups[groupIndex]
      } catch (error: any) {
        this.error = error.message || 'Failed to remove user from group'
        console.error('Error removing user from group:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async changeGroupAdmin(groupId: string, newAdminId: string) {
      this.loading = true
      this.error = null
      
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const groupIndex = this.groups.findIndex(group => group.id === groupId)
        
        if (groupIndex === -1) {
          throw new Error('Group not found')
        }
        
        // Check if new admin is a member
        if (!this.groups[groupIndex].members.includes(newAdminId)) {
          throw new Error('New admin must be a member of the group')
        }
        
        // Update admin
        this.groups[groupIndex].adminId = newAdminId
        
        return this.groups[groupIndex]
      } catch (error: any) {
        this.error = error.message || 'Failed to change group admin'
        console.error('Error changing group admin:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})