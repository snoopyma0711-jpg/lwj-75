<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">工作台</h1>
        <p class="text-sm text-gray-500 mt-1">{{ currentDate }} 星期三</p>
      </div>
      <router-link to="/repair/create" class="btn-primary">
        <span class="flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          新增报修
        </span>
      </router-link>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-5 cursor-pointer hover:shadow-md transition-shadow" @click="goToRepairListWithFilter('today')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">今日新报修</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ todayNewOrders.length }}</p>
            <p class="text-xs text-gray-400 mt-1">较昨日 +3</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 cursor-pointer hover:shadow-md transition-shadow" @click="goToRepairListWithFilter('urged')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">今日催办</p>
            <p class="text-3xl font-bold text-orange-600 mt-1">{{ todayUrgeOrders.length }}</p>
            <p class="text-xs text-orange-500 mt-1">需要加快处理</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 cursor-pointer hover:shadow-md transition-shadow" @click="goToRepairListWithFilter('escalated')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">今日升级</p>
            <p class="text-3xl font-bold text-red-600 mt-1">{{ todayEscalateOrders.length }}</p>
            <p class="text-xs text-red-500 mt-1">升级为重点跟进</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 cursor-pointer hover:shadow-md transition-shadow" @click="goToRepairListWithFilter('keyFollowup')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">重点跟进工单</p>
            <p class="text-3xl font-bold text-rose-700 mt-1">{{ keyFollowupOrders.length }}</p>
            <p class="text-xs text-rose-600 mt-1">正在重点跟进中</p>
          </div>
          <div class="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-rose-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">处理中</p>
            <p class="text-3xl font-bold text-yellow-600 mt-1">{{ processingOrders.length }}</p>
            <p class="text-xs text-gray-400 mt-1">进行中的工单</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">待跟进工单</p>
            <p class="text-3xl font-bold text-red-600 mt-1">{{ followupOrders.length }}</p>
            <p class="text-xs text-red-500 mt-1">回访不满意需跟进</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">已超时</p>
            <p class="text-3xl font-bold text-red-600 mt-1">{{ timeoutOrders.length }}</p>
            <p class="text-xs text-red-500 mt-1">需要尽快处理</p>
          </div>
          <div class="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">今日完成</p>
            <p class="text-3xl font-bold text-emerald-600 mt-1">{{ todayCompletedOrders.length }}</p>
            <p class="text-xs text-gray-400 mt-1">今日处理完成</p>
          </div>
          <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">最近7天报修量趋势</h2>
          <span class="text-sm text-gray-500">单位：单</span>
        </div>
        <div class="h-64">
          <canvas ref="trendChartRef"></canvas>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">最近7天回访满意度趋势</h2>
          <span class="text-sm text-gray-500">单位：%</span>
        </div>
        <div class="h-64">
          <canvas ref="satisfactionChartRef"></canvas>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">待处理工单</h2>
          <router-link to="/repair" class="text-sm text-primary-600 hover:text-primary-700">查看全部</router-link>
        </div>
        <div v-if="pendingOrders.length > 0" class="space-y-3">
          <div
            v-for="order in pendingOrders"
            :key="order.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            @click="goToDetail(order.id)"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :class="getUrgencyClass(order.urgency)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ order.roomNumber }}</p>
                <p class="text-xs text-gray-500">{{ getCategoryLabel(order.category) }} · {{ order.description.slice(0, 20) }}...</p>
              </div>
            </div>
            <div class="text-right">
              <div class="flex flex-col items-end space-y-1">
                <span class="badge" :class="getStatusClass(order.status)">{{ getStatusLabel(order.status) }}</span>
                <div class="flex space-x-1">
                  <span v-if="order.urgeRecords && order.urgeRecords.length > 0" class="badge bg-orange-100 text-orange-600 text-xs">
                    催{{ order.urgeRecords.length }}
                  </span>
                  <span v-if="order.escalation && order.escalation.isEscalated" class="badge bg-red-500 text-white text-xs">
                    重点
                  </span>
                </div>
              </div>
              <p class="text-xs text-gray-400 mt-1">{{ order.createTime.slice(11, 16) }}</p>
            </div>
          </div>
        </div>
        <EmptyState v-else title="暂无待处理工单" description="所有工单都已处理完毕" />
      </div>

      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">今日巡检任务</h2>
          <router-link to="/inspection/task" class="text-sm text-primary-600 hover:text-primary-700">查看全部</router-link>
        </div>
        <div v-if="todayInspectionTasks.length > 0" class="space-y-3">
          <div
            v-for="task in todayInspectionTasks"
            :key="task.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            @click="goToInspection(task)"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ task.itemName }}</p>
                <p class="text-xs text-gray-500">{{ task.equipmentName }}</p>
              </div>
            </div>
            <div class="text-right">
              <span class="badge" :class="getInspectionStatusClass(task.status)">{{ getInspectionStatusLabel(task.status) }}</span>
              <p v-if="task.inspectorName" class="text-xs text-gray-400 mt-1">{{ task.inspectorName }}</p>
            </div>
          </div>
        </div>
        <EmptyState v-else title="暂无巡检任务" description="今天没有安排巡检任务" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { Chart, registerables } from 'chart.js'
import dayjs from 'dayjs'
import { useStore, repairCategories } from '../store'
import EmptyState from '../components/EmptyState.vue'

Chart.register(...registerables)

const router = useRouter()
const showToast = inject('showToast')
const store = useStore()

const { 
  todayNewOrders, 
  processingOrders, 
  timeoutOrders, 
  todayCompletedOrders, 
  last7DaysOrders, 
  buildingDistribution,
  todayPendingVisits,
  todayCompletedVisits,
  followupOrders,
  visitSatisfactionRate,
  last7DaysSatisfaction,
  todayUrgeOrders,
  todayEscalateOrders,
  keyFollowupOrders
} = store

const trendChartRef = ref(null)
const buildingChartRef = ref(null)
const satisfactionChartRef = ref(null)
const currentDate = dayjs('2026-06-17').format('YYYY年MM月DD日')

const pendingOrders = computed(() => {
  return store.state.repairOrders
    .filter(o => ['pending', 'assigned'].includes(o.status))
    .slice(0, 5)
})

const todayInspectionTasks = computed(() => {
  return store.state.inspectionRecords
    .filter(t => t.date === store.state.currentDate)
    .slice(0, 5)
})

const getCategoryLabel = (value) => {
  const cat = repairCategories.find(c => c.value === value)
  return cat ? cat.label : value
}

const getUrgencyClass = (urgency) => {
  switch (urgency) {
    case 'high': return 'bg-red-100 text-red-600'
    case 'medium': return 'bg-yellow-100 text-yellow-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-gray-100 text-gray-600'
    case 'assigned': return 'bg-blue-100 text-blue-600'
    case 'processing': return 'bg-yellow-100 text-yellow-600'
    case 'completed': return 'bg-green-100 text-green-600'
    case 'cancelled': return 'bg-gray-100 text-gray-500'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'pending': return '待派单'
    case 'assigned': return '已派单'
    case 'processing': return '处理中'
    case 'completed': return '已完成'
    case 'cancelled': return '已取消'
    default: return status
  }
}

const getInspectionStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-gray-100 text-gray-600'
    case 'inspecting': return 'bg-blue-100 text-blue-600'
    case 'completed': return 'bg-green-100 text-green-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const getInspectionStatusLabel = (status) => {
  switch (status) {
    case 'pending': return '待巡检'
    case 'inspecting': return '巡检中'
    case 'completed': return '已完成'
    default: return status
  }
}

const goToDetail = (id) => {
  router.push(`/repair/${id}`)
}

const goToRepairListWithFilter = (filterType) => {
  const query = {}
  if (filterType === 'today') {
    query.timeRange = 'today'
  } else if (filterType === 'urged') {
    query.isUrged = 'yes'
  } else if (filterType === 'escalated') {
    query.isEscalated = 'yes'
  } else if (filterType === 'keyFollowup') {
    query.isEscalated = 'yes'
  }
  router.push({ path: '/repair', query })
}

const goToInspection = (task) => {
  if (task.status === 'completed') {
    router.push('/inspection')
  } else {
    router.push('/inspection/task')
  }
}

onMounted(() => {
  if (trendChartRef.value) {
    new Chart(trendChartRef.value, {
      type: 'line',
      data: {
        labels: last7DaysOrders.value.map(d => d.date.slice(5)),
        datasets: [{
          label: '报修量',
          data: last7DaysOrders.value.map(d => d.count),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    })
  }

  if (buildingChartRef.value) {
    const data = buildingDistribution.value.slice(0, 6)
    new Chart(buildingChartRef.value, {
      type: 'bar',
      data: {
        labels: data.map(d => d.name),
        datasets: [{
          label: '报修数量',
          data: data.map(d => d.count),
          backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6',
            '#ec4899'
          ],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    })
  }

  if (satisfactionChartRef.value) {
    new Chart(satisfactionChartRef.value, {
      type: 'line',
      data: {
        labels: last7DaysSatisfaction.value.map(d => d.date.slice(5)),
        datasets: [{
          label: '满意率',
          data: last7DaysSatisfaction.value.map(d => d.rate),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20,
              callback: (value) => value + '%'
            }
          }
        }
      }
    })
  }
})
</script>
