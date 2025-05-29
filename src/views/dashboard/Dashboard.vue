<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../../stores/users'
import { useGroupStore } from '../../stores/groups'
import { useAuthStore } from '../../stores/auth'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import Card from '../../components/ui/Card.vue'
import Button from '../../components/ui/Button.vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const userStore = useUserStore()
const groupStore = useGroupStore()
const authStore = useAuthStore()

const isLoading = ref(true)

// Statistics
const totalUsers = computed(() => userStore.allUsers.length)
const totalGroups = computed(() => groupStore.allGroups.length)
const totalAdmins = computed(() => userStore.adminUsers.length)

// Recent users
const recentUsers = computed(() => {
  return userStore.allUsers
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

// Recent groups
const recentGroups = computed(() => {
  return groupStore.allGroups
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

// Chart data
const userChartData = computed(() => {
  const dates = getLast7Days()
  const userCounts = dates.map(date => 
    userStore.allUsers.filter(user => 
      new Date(user.createdAt).toDateString() === new Date(date).toDateString()
    ).length
  )

  return {
    labels: dates.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
    datasets: [
      {
        label: 'New Users',
        backgroundColor: '#FFCC00',
        borderColor: '#FFCC00',
        data: userCounts,
        tension: 0.4
      }
    ]
  }
})

const groupChartData = computed(() => {
  const dates = getLast7Days()
  const groupCounts = dates.map(date => 
    groupStore.allGroups.filter(group => 
      new Date(group.createdAt).toDateString() === new Date(date).toDateString()
    ).length
  )

  return {
    labels: dates.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
    datasets: [
      {
        label: 'New Groups',
        backgroundColor: '#10B981',
        borderColor: '#10B981',
        data: groupCounts,
        tension: 0.4
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
}

// Helper function to get last 7 days
const getLast7Days = () => {
  const dates = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date)
  }
  return dates
}

onMounted(async () => {
  isLoading.value = true
  await Promise.all([
    userStore.fetchUsers(),
    groupStore.fetchGroups()
  ])
  isLoading.value = false
})
</script>

<template>
  <DashboardLayout>
    <PageHeader 
      title="Dashboard" 
      :subtitle="`Welcome back, ${authStore.user?.name || 'User'}!`" 
    />
    
    <!-- Stats cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <!-- Total Users -->
      <Card 
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 100 } }"
      >
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-primary-100 text-primary-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Total Users</h3>
            <p class="text-3xl font-bold text-gray-700">{{ totalUsers }}</p>
          </div>
        </div>
      </Card>
      
      <!-- Total Groups -->
      <Card 
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 200 } }"
      >
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Total Groups</h3>
            <p class="text-3xl font-bold text-gray-700">{{ totalGroups }}</p>
          </div>
        </div>
      </Card>
      
      <!-- Total Admins -->
      <Card 
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 300 } }"
      >
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Admin Users</h3>
            <p class="text-3xl font-bold text-gray-700">{{ totalAdmins }}</p>
          </div>
        </div>
      </Card>
    </div>
    
    <!-- Charts section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- User Growth Chart -->
      <Card 
        title="User Growth" 
        subtitle="New users in the last 7 days"
        :loading="isLoading"
        v-motion
        :initial="{ opacity: 0, x: -20 }"
        :enter="{ opacity: 1, x: 0, transition: { duration: 500, delay: 400 } }"
      >
        <div class="h-64">
          <Line
            :data="userChartData"
            :options="chartOptions"
          />
        </div>
      </Card>
      
      <!-- Group Growth Chart -->
      <Card 
        title="Group Growth" 
        subtitle="New groups in the last 7 days"
        :loading="isLoading"
        v-motion
        :initial="{ opacity: 0, x: 20 }"
        :enter="{ opacity: 1, x: 0, transition: { duration: 500, delay: 500 } }"
      >
        <div class="h-64">
          <Line
            :data="groupChartData"
            :options="chartOptions"
          />
        </div>
      </Card>
    </div>
    
    <!-- Recent activity section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Users -->
      <Card 
        title="Recent Users" 
        :loading="isLoading"
        v-motion
        :initial="{ opacity: 0, x: -20 }"
        :enter="{ opacity: 1, x: 0, transition: { duration: 500, delay: 600 } }"
      >
        <div class="space-y-4">
          <div v-if="recentUsers.length === 0 && !isLoading" class="text-center py-4 text-gray-500">
            No users found
          </div>
          
          <div 
            v-for="user in recentUsers" 
            :key="user.id"
            class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors duration-200"
          >
            <div class="flex items-center">
              <div class="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white">
                {{ user.name.charAt(0) }}
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
                <p class="text-xs text-gray-500">{{ user.email }}</p>
              </div>
            </div>
            <div>
              <span 
                class="px-2 py-1 text-xs rounded-full" 
                :class="user.role === 'admin' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'"
              >
                {{ user.role }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="mt-4 flex justify-end">
          <Button 
            variant="text"
            size="sm"
            @click="$router.push('/users')"
          >
            View all users
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </Card>
      
      <!-- Recent Groups -->
      <Card 
        title="Recent Groups" 
        :loading="isLoading"
        v-motion
        :initial="{ opacity: 0, x: 20 }"
        :enter="{ opacity: 1, x: 0, transition: { duration: 500, delay: 700 } }"
      >
        <div class="space-y-4">
          <div v-if="recentGroups.length === 0 && !isLoading" class="text-center py-4 text-gray-500">
            No groups found
          </div>
          
          <div 
            v-for="group in recentGroups" 
            :key="group.id"
            class="p-3 hover:bg-gray-50 rounded-md transition-colors duration-200"
          >
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium text-gray-900">{{ group.name }}</h4>
              <p class="text-xs text-gray-500">
                {{ group.members.length }} members
              </p>
            </div>
            <p class="text-xs text-gray-500 mt-1 line-clamp-1">{{ group.description }}</p>
          </div>
        </div>
        
        <div class="mt-4 flex justify-end">
          <Button 
            variant="text"
            size="sm"
            @click="$router.push('/groups')"
          >
            View all groups
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </Card>
    </div>
  </DashboardLayout>
</template>