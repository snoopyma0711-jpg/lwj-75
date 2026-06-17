<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">报修管理</h1>
        <p class="text-sm text-gray-500 mt-1">共 {{ filteredOrders.length }} 条工单</p>
      </div>
      <div class="flex space-x-3">
        <button @click="resetFilters" class="btn-secondary">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重置筛选
          </span>
        </button>
        <router-link to="/repair/create" class="btn-primary">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            新增报修
          </span>
        </router-link>
      </div>
    </div>

    <div class="card p-5">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">楼栋</label>
          <select v-model="filters.buildingId" class="select text-sm">
            <option value="">全部楼栋</option>
            <option v-for="b in store.state.buildings" :key="b.id" :value="b.id">{{ b.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">状态</label>
          <select v-model="filters.status" class="select text-sm">
            <option value="">全部状态</option>
            <option value="pending">待派单</option>
            <option value="assigned">已派单</option>
            <option value="processing">处理中</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">回访状态</label>
          <select v-model="filters.visitStatus" class="select text-sm">
            <option value="">全部回访状态</option>
            <option value="pending">待回访</option>
            <option value="completed">已回访完成</option>
            <option value="followup">待跟进</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">满意度</label>
          <select v-model="filters.satisfaction" class="select text-sm">
            <option value="">全部满意度</option>
            <option value="5">非常满意 😄</option>
            <option value="4">满意 🙂</option>
            <option value="3">一般 😐</option>
            <option value="2">不满意 😟</option>
            <option value="1">非常不满意 😠</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">是否需跟进</label>
          <select v-model="filters.needFollowup" class="select text-sm">
            <option value="">全部</option>
            <option value="yes">需要跟进</option>
            <option value="no">不需要跟进</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">关键词</label>
          <div class="relative">
            <input
              v-model="filters.keyword"
              type="text"
              class="input text-sm pl-8"
              placeholder="搜索工单号、房号、联系人..."
            />
            <svg class="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4 pt-4 border-t">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">分类</label>
          <select v-model="filters.category" class="select text-sm">
            <option value="">全部分类</option>
            <option v-for="c in repairCategories" :key="c.value" :value="c.value">{{ c.label }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">紧急程度</label>
          <select v-model="filters.urgency" class="select text-sm">
            <option value="">全部</option>
            <option value="low">一般</option>
            <option value="medium">紧急</option>
            <option value="high">非常紧急</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">时间范围</label>
          <select v-model="filters.timeRange" class="select text-sm">
            <option value="all">全部时间</option>
            <option value="today">今天</option>
            <option value="yesterday">昨天</option>
            <option value="week">近7天</option>
            <option value="month">近30天</option>
          </select>
        </div>
      </div>
    </div>

    <div class="card overflow-hidden">
      <div v-if="filteredOrders.length > 0" class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>工单号</th>
              <th>房号</th>
              <th>联系人</th>
              <th>分类</th>
              <th>状态</th>
              <th>回访状态</th>
              <th>满意度</th>
              <th>是否需跟进</th>
              <th>处理人</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id" class="cursor-pointer" @click="goToDetail(order.id)">
              <td>
                <span class="font-mono text-sm text-primary-600">{{ order.id }}</span>
                <span v-if="order.isTimeout" class="ml-2 badge bg-red-100 text-red-600">超时</span>
                <span v-if="order.needReturn" class="ml-2 badge bg-yellow-100 text-yellow-600">需二次上门</span>
              </td>
              <td class="font-medium">{{ order.roomNumber }}</td>
              <td>
                <div>{{ order.contactName }}</div>
                <div class="text-xs text-gray-500">{{ order.contactPhone }}</div>
              </td>
              <td>
                <span class="badge bg-gray-100 text-gray-700">{{ getCategoryLabel(order.category) }}</span>
              </td>
              <td>
                <span class="badge" :class="getStatusClass(order.status)">{{ getStatusLabel(order.status) }}</span>
              </td>
              <td>
                <span v-if="order.visitStatus" class="badge" :class="getVisitStatusClass(order.visitStatus)">
                  {{ getVisitStatusLabel(order.visitStatus) }}
                </span>
                <span v-else class="text-gray-400 text-xs">-</span>
              </td>
              <td>
                <span v-if="getOrderSatisfaction(order)" class="text-sm">
                  {{ getOrderSatisfactionEmoji(order) }} {{ getOrderSatisfactionLabel(order) }}
                </span>
                <span v-else class="text-gray-400 text-xs">-</span>
              </td>
              <td>
                <span v-if="order.visitStatus === 'followup'" class="badge bg-red-100 text-red-600">需要跟进</span>
                <span v-else class="text-gray-400 text-xs">-</span>
              </td>
              <td>
                <span v-if="order.engineerId">{{ getEngineerName(order.engineerId) }}</span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="text-gray-500 text-sm">{{ order.createTime }}</td>
              <td>
                <button @click.stop="goToDetail(order.id)" class="text-primary-600 hover:text-primary-800 text-sm font-medium">
                  查看详情
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState v-else title="没有找到匹配的工单" description="请尝试调整筛选条件">
        <template #action>
          <button @click="resetFilters" class="btn-primary btn-sm">重置筛选</button>
        </template>
      </EmptyState>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, inject, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { useStore, repairCategories, urgentLevels, satisfactionLevels, visitStatusMap } from '../../store'
import EmptyState from '../../components/EmptyState.vue'

const router = useRouter()
const route = useRoute()
const showToast = inject('showToast')
const store = useStore()

const filters = reactive({
  buildingId: '',
  equipmentId: '',
  status: '',
  category: '',
  urgency: '',
  timeRange: 'all',
  keyword: '',
  visitStatus: '',
  satisfaction: '',
  needFollowup: ''
})

const filteredOrders = computed(() => {
  return store.state.repairOrders.filter(order => {
    if (filters.buildingId && order.buildingId !== filters.buildingId) return false
    if (filters.equipmentId && order.equipmentId !== filters.equipmentId) return false
    if (filters.status && order.status !== filters.status) return false
    if (filters.category && order.category !== filters.category) return false
    if (filters.urgency && order.urgency !== filters.urgency) return false

    if (filters.visitStatus) {
      if (filters.visitStatus === 'pending') {
        if (!(order.visitStatus === 'pending' || (order.status === 'completed' && !order.visitStatus))) return false
      } else {
        if (order.visitStatus !== filters.visitStatus) return false
      }
    }

    if (filters.satisfaction) {
      const targetSat = parseInt(filters.satisfaction)
      const orderSat = getOrderSatisfaction(order)
      if (!orderSat || orderSat !== targetSat) return false
    }

    if (filters.needFollowup) {
      const isFollowup = order.visitStatus === 'followup'
      if (filters.needFollowup === 'yes' && !isFollowup) return false
      if (filters.needFollowup === 'no' && isFollowup) return false
    }
    
    if (filters.timeRange !== 'all') {
      const orderDate = dayjs(order.createTime)
      const today = dayjs('2026-06-17')
      if (filters.timeRange === 'today' && !orderDate.isSame(today, 'day')) return false
      if (filters.timeRange === 'yesterday' && !orderDate.isSame(today.subtract(1, 'day'), 'day')) return false
      if (filters.timeRange === 'week' && orderDate.isBefore(today.subtract(7, 'day'))) return false
      if (filters.timeRange === 'month' && orderDate.isBefore(today.subtract(30, 'day'))) return false
    }
    
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase()
      const match = 
        order.id.toLowerCase().includes(kw) ||
        order.roomNumber.toLowerCase().includes(kw) ||
        order.contactName.toLowerCase().includes(kw) ||
        order.contactPhone.includes(kw) ||
        order.description.toLowerCase().includes(kw)
      if (!match) return false
    }
    
    return true
  })
})

onMounted(() => {
  if (route.query.building) {
    filters.buildingId = route.query.building
  }
  if (route.query.equipment) {
    filters.equipmentId = route.query.equipment
  }
})

watch(() => route.query, (newQuery) => {
  if (newQuery.building) filters.buildingId = newQuery.building
  if (newQuery.equipment) filters.equipmentId = newQuery.equipment
}, { immediate: true })

const getCategoryLabel = (value) => {
  const cat = repairCategories.find(c => c.value === value)
  return cat ? cat.label : value
}

const getUrgencyLabel = (value) => {
  const u = urgentLevels.find(item => item.value === value)
  return u ? u.label : value
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

const getEngineerName = (id) => {
  const eng = store.state.engineers.find(e => e.id === id)
  return eng ? eng.name : id
}

const goToDetail = (id) => {
  router.push(`/repair/${id}`)
}

const resetFilters = () => {
  filters.buildingId = ''
  filters.equipmentId = ''
  filters.status = ''
  filters.category = ''
  filters.urgency = ''
  filters.timeRange = 'all'
  filters.keyword = ''
  filters.visitStatus = ''
  filters.satisfaction = ''
  filters.needFollowup = ''
  showToast('筛选条件已重置', 'success')
}

const getVisitStatusLabel = (status) => {
  return visitStatusMap[status] || status
}

const getVisitStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-orange-100 text-orange-600'
    case 'visiting': return 'bg-blue-100 text-blue-600'
    case 'completed': return 'bg-green-100 text-green-600'
    case 'followup': return 'bg-red-100 text-red-600'
    case 'closed': return 'bg-gray-100 text-gray-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const getOrderSatisfaction = (order) => {
  if (!order.visitRecords || order.visitRecords.length === 0) return null
  const lastRecord = order.visitRecords[order.visitRecords.length - 1]
  return lastRecord.satisfaction
}

const getOrderSatisfactionLabel = (order) => {
  const value = getOrderSatisfaction(order)
  if (!value) return ''
  const level = satisfactionLevels.find(l => l.value === value)
  return level ? level.label : value
}

const getOrderSatisfactionEmoji = (order) => {
  const value = getOrderSatisfaction(order)
  if (!value) return ''
  const level = satisfactionLevels.find(l => l.value === value)
  return level ? level.emoji : '😐'
}
</script>
