import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'

interface User {
  id: string
  email: string
  name: string
  role: string
  organizationId: string
}

interface Organization {
  id: string
  name: string
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  organizationName: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    organization: null as Organization | null,
    token: null as string | null,
    loading: false,
    error: null as string | null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    userData: (state) => state.user,
    organizationData: (state) => state.organization,
  },
  
  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null
      
      try {
        // In a real app, this would be an API call
        // For demo purposes, we're simulating a successful login
        const response = await new Promise<{user: User, organization: Organization, token: string}>((resolve) => {
          setTimeout(() => {
            resolve({
              user: {
                id: '1',
                email: credentials.email,
                name: 'Admin User',
                role: 'admin',
                organizationId: '1'
              },
              organization: {
                id: '1',
                name: 'Demo Organization'
              },
              token: 'mock-token-12345'
            })
          }, 1000)
        })
        
        this.user = response.user
        this.organization = response.organization
        this.token = response.token
        
        router.push('/dashboard')
      } catch (error: any) {
        this.error = error.message || 'Failed to login'
        console.error('Login error:', error)
      } finally {
        this.loading = false
      }
    },
    
    async register(data: RegisterData) {
      this.loading = true
      this.error = null
      
      try {
        // In a real app, this would be an API call
        // For demo purposes, we're simulating a successful registration
        const response = await new Promise<{user: User, organization: Organization, token: string}>((resolve) => {
          setTimeout(() => {
            resolve({
              user: {
                id: '1',
                email: data.email,
                name: data.name,
                role: 'admin',
                organizationId: '1'
              },
              organization: {
                id: '1',
                name: data.organizationName
              },
              token: 'mock-token-12345'
            })
          }, 1000)
        })
        
        this.user = response.user
        this.organization = response.organization
        this.token = response.token
        
        router.push('/dashboard')
      } catch (error: any) {
        this.error = error.message || 'Failed to register'
        console.error('Registration error:', error)
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      this.user = null
      this.organization = null
      this.token = null
      router.push('/login')
    }
  },
  
  persist: {
    storage: localStorage,
    paths: ['user', 'organization', 'token'],
  },
})