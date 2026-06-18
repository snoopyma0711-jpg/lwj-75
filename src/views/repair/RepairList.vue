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
          <label class="block text-sm font-medium text-gray-600 mb-1">是否催办</label>
          <select v-model="filters.isUrged" class="select text-sm">
            <option value="">全部</option>
            <option value="yes">已催办</option>
            <option value="no">未催办</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">是否升级</label>
          <select v-model="filters.isEscalated" class="select text-sm">
            <option value="">全部</option>
            <option value="yes">已升级重点跟进</option>
            <option value="no">未升级</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">处理阶段</label>
          <select v-model="filters.processStage" class="select text-sm">
            <option value="">全部阶段</option>
            <option value="pending">待派单</option>
            <option value="assigned">已派单待接单</option>
            <option value="processing">处理中</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
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
              <th>催办/升级</th>
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
                <span class="badge" :class="getStatusClass(getDisplayStatus(order))">{{ getStatusLabel(getDisplayStatus(order)) }}</span>
              </td>
              <td>
                <div class="flex flex-col space-y-1">
                  <div v-if="order.urgeRecords && order.urgeRecords.length > 0" class="flex items-center">
                    <span class="badge bg-orange-100 text-orange-600 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      已催办{{ order.urgeRecords.length }}次
                    </span>
                  </div>
                  <div v-if="order.escalation && order.escalation.isEscalated" class="flex items-center">
                    <span class="badge bg-red-500 text-white flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      重点跟进
                    </span>
                  </div>
                  <span v-if="(!order.urgeRecords || order.urgeRecords.length === 0) && (!order.escalation || !order.escalation.isEscalated)" class="text-gray-400 text-xs">-</span>
                </div>
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
                <div class="flex items-center space-x-2">
                  <button @click.stop="goToDetail(order.id)" class="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    查看详情
                  </button>
                  <button 
                    v-if="currentRole === 'service' && !['completed', 'cancelled'].includes(order.status)" 
                    @click.stop="openUrgeModal(order)" 
                    class="text-orange-600 hover:text-orange-800 text-sm font-medium"
                  >
                    催办
                  </button>
                  <button 
                    v-if="currentRole === 'service' && !['completed', 'cancelled'].includes(order.status) && (!order.escalation || !order.escalation.isEscalated) && order.urgeRecords && order.urgeRecords.length > 0" 
                    @click.stop="openEscalateModal(order)" 
                    class="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    升级
                  </button>
                  <span 
                    v-else-if="currentRole === 'service' && !['completed', 'cancelled'].includes(order.status) && (!order.escalation || !order.escalation.isEscalated)" 
                    class="text-gray-400 text-sm"
                    title="请先催办，催办后无进展才能升级"
                  >
                    升级
                  </span>
                </div>
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

    <Transition name="fade">
      <div v-if="showUrgeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">工单催办</h3>
          <div v-if="urgeForm.orderId" class="mb-4 p-3 bg-gray-50 rounded-lg">
            <p class="text-sm"><span class="text-gray-500">工单号：</span><span class="font-mono font-medium">{{ urgeForm.orderId }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">房号：</span><span class="font-medium">{{ urgeForm.roomNumber }}</span></p>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">催办对象 <span class="text-red-500">*</span></label>
              <select v-model="urgeForm.targetId" class="select" @change="urgeErrors.targetId = ''">
                <option value="">请选择催办对象</option>
                <option v-if="urgeForm.engineerId" :value="urgeForm.engineerId">
                  处理工程师：{{ urgeForm.engineerName }}
                </option>
                <option value="service_team">客服主管团队</option>
                <option value="engineering_dept">工程部主管</option>
              </select>
              <p v-if="urgeErrors.targetId" class="text-red-500 text-xs mt-1">{{ urgeErrors.targetId }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">催办原因 <span class="text-red-500">*</span></label>
              <textarea 
                v-model="urgeForm.reason" 
                class="textarea h-28" 
                placeholder="请详细描述催办原因，例如：长时间未接单、处理进度卡住、住户多次来电催问等..."
                @input="urgeErrors.reason = ''"
              ></textarea>
              <p v-if="urgeErrors.reason" class="text-red-500 text-xs mt-1">{{ urgeErrors.reason }}</p>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button @click="closeUrgeModal" class="btn-secondary">取消</button>
            <button @click="submitUrge" class="btn-primary">确认催办</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showEscalateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            升级为重点跟进工单
          </h3>
          <div v-if="escalateForm.orderId" class="mb-4 p-3 bg-red-50 rounded-lg border border-red-100">
            <p class="text-sm"><span class="text-gray-500">工单号：</span><span class="font-mono font-medium">{{ escalateForm.orderId }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">房号：</span><span class="font-medium">{{ escalateForm.roomNumber }}</span></p>
            <p v-if="escalateForm.urgeCount > 0" class="text-sm mt-1 text-orange-600">
              <span class="inline-flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                该工单已催办 {{ escalateForm.urgeCount }} 次
              </span>
            </p>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">升级原因 <span class="text-red-500">*</span></label>
              <textarea 
                v-model="escalateForm.reason" 
                class="textarea h-28" 
                placeholder="请详细说明升级为重点跟进工单的原因，例如：催办后仍无进展、问题严重影响住户生活、存在安全隐患、领导特别关注等..."
                @input="escalateErrors.reason = ''"
              ></textarea>
              <p v-if="escalateErrors.reason" class="text-red-500 text-xs mt-1">{{ escalateErrors.reason }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">要求完成时限 <span class="text-red-500">*</span></label>
              <input 
                v-model="escalateForm.deadlineTime" 
                type="datetime-local" 
                class="input"
                @input="escalateErrors.deadlineTime = ''"
              />
              <p v-if="escalateErrors.deadlineTime" class="text-red-500 text-xs mt-1">{{ escalateErrors.deadlineTime }}</p>
              <p class="text-xs text-gray-500 mt-2">请设定明确的处理截止时间，超时未完成将自动触发更高层级关注</p>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button @click="closeEscalateModal" class="btn-secondary">取消</button>
            <button @click="submitEscalate" class="btn-danger">确认升级</button>
          </div>
        </div>
      </div>
    </Transition>
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
const currentRole = inject('currentRole')
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
  needFollowup: '',
  isUrged: '',
  isEscalated: '',
  processStage: ''
})

const showUrgeModal = ref(false)
const showEscalateModal = ref(false)

const urgeForm = reactive({
  orderId: '',
  roomNumber: '',
  targetId: '',
  targetName: '',
  targetType: '',
  engineerId: '',
  engineerName: '',
  reason: ''
})

const urgeErrors = reactive({
  targetId: '',
  reason: ''
})

const escalateForm = reactive({
  orderId: '',
  roomNumber: '',
  urgeCount: 0,
  reason: '',
  deadlineTime: ''
})

const escalateErrors = reactive({
  reason: '',
  deadlineTime: ''
})

const filteredOrders = computed(() => {
  return store.state.repairOrders.filter(order => {
    if (filters.buildingId && order.buildingId !== filters.buildingId) return false
    if (filters.equipmentId && order.equipmentId !== filters.equipmentId) return false
    if (filters.status && order.status !== filters.status) return false
    if (filters.category && order.category !== filters.category) return false
    if (filters.urgency && order.urgency !== filters.urgency) return false

    if (filters.processStage) {
      if (filters.processStage === 'pending' && order.status !== 'pending') return false
      if (filters.processStage === 'assigned' && order.status !== 'assigned') return false
      if (filters.processStage === 'processing' && order.status !== 'processing') return false
      if (filters.processStage === 'completed' && order.status !== 'completed') return false
      if (filters.processStage === 'cancelled' && order.status !== 'cancelled') return false
    }

    if (filters.isUrged) {
      const isUrged = order.urgeRecords && order.urgeRecords.length > 0
      if (filters.isUrged === 'yes' && !isUrged) return false
      if (filters.isUrged === 'no' && isUrged) return false
    }

    if (filters.isEscalated) {
      const isEscalated = order.escalation && order.escalation.isEscalated
      if (filters.isEscalated === 'yes' && !isEscalated) return false
      if (filters.isEscalated === 'no' && isEscalated) return false
    }

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
  if (route.query.isUrged) {
    filters.isUrged = route.query.isUrged
  }
  if (route.query.isEscalated) {
    filters.isEscalated = route.query.isEscalated
  }
  if (route.query.timeRange) {
    filters.timeRange = route.query.timeRange
  }
  if (route.query.processStage) {
    filters.processStage = route.query.processStage
  }
})

watch(() => route.query, (newQuery) => {
  if (newQuery.building) filters.buildingId = newQuery.building
  if (newQuery.equipment) filters.equipmentId = newQuery.equipment
  if (newQuery.isUrged) filters.isUrged = newQuery.isUrged
  if (newQuery.isEscalated) filters.isEscalated = newQuery.isEscalated
  if (newQuery.timeRange) filters.timeRange = newQuery.timeRange
  if (newQuery.processStage) filters.processStage = newQuery.processStage
}, { immediate: true })

const openUrgeModal = (order) => {
  urgeForm.orderId = order.id
  urgeForm.roomNumber = order.roomNumber
  urgeForm.targetId = ''
  urgeForm.targetName = ''
  urgeForm.targetType = ''
  urgeForm.reason = ''
  urgeForm.engineerId = order.engineerId || ''
  urgeForm.engineerName = order.engineerId ? getEngineerName(order.engineerId) : ''
  urgeErrors.targetId = ''
  urgeErrors.reason = ''
  showUrgeModal.value = true
}

const closeUrgeModal = () => {
  showUrgeModal.value = false
  Object.keys(urgeForm).forEach(key => urgeForm[key] = '')
  urgeErrors.targetId = ''
  urgeErrors.reason = ''
}

const submitUrge = () => {
  let hasError = false
  urgeErrors.targetId = ''
  urgeErrors.reason = ''

  if (!urgeForm.targetId) {
    urgeErrors.targetId = '请选择催办对象'
    hasError = true
  }

  if (!urgeForm.reason.trim()) {
    urgeErrors.reason = '请填写催办原因'
    hasError = true
  } else if (urgeForm.reason.trim().length < 10) {
    urgeErrors.reason = '催办原因至少需要10个字，请详细描述'
    hasError = true
  }

  if (hasError) return

  let targetName = ''
  let targetType = ''
  if (urgeForm.targetId === urgeForm.engineerId) {
    targetName = urgeForm.engineerName
    targetType = 'engineer'
  } else if (urgeForm.targetId === 'service_team') {
    targetName = '客服主管团队'
    targetType = 'service_team'
  } else if (urgeForm.targetId === 'engineering_dept') {
    targetName = '工程部主管'
    targetType = 'engineering_dept'
  }

  const operator = currentRole.value === 'service' ? '张客服' : '操作员'
  const result = store.urgeOrder(urgeForm.orderId, {
    operator: operator,
    reason: urgeForm.reason.trim(),
    targetName: targetName,
    targetType: targetType
  })

  if (result) {
    showToast('催办成功，已通知催办对象并记录催办信息', 'success')
    closeUrgeModal()
  } else {
    showToast('催办失败，请重试', 'error')
  }
}

const openEscalateModal = (order) => {
  escalateForm.orderId = order.id
  escalateForm.roomNumber = order.roomNumber
  escalateForm.urgeCount = (order.urgeRecords && order.urgeRecords.length) || 0
  escalateForm.reason = ''
  escalateForm.deadlineTime = ''
  escalateErrors.reason = ''
  escalateErrors.deadlineTime = ''
  showEscalateModal.value = true
}

const closeEscalateModal = () => {
  showEscalateModal.value = false
  escalateForm.orderId = ''
  escalateForm.roomNumber = ''
  escalateForm.urgeCount = 0
  escalateForm.reason = ''
  escalateForm.deadlineTime = ''
  escalateErrors.reason = ''
  escalateErrors.deadlineTime = ''
}

const submitEscalate = () => {
  const order = store.getOrderById(escalateForm.orderId)
  if (!order || !order.urgeRecords || order.urgeRecords.length === 0) {
    showToast('请先催办，催办后无进展才能升级为重点跟进', 'error')
    return
  }

  let hasError = false
  escalateErrors.reason = ''
  escalateErrors.deadlineTime = ''

  if (!escalateForm.reason.trim()) {
    escalateErrors.reason = '请填写升级原因'
    hasError = true
  } else if (escalateForm.reason.trim().length < 15) {
    escalateErrors.reason = '升级原因至少需要15个字，请详细说明情况'
    hasError = true
  }

  if (!escalateForm.deadlineTime) {
    escalateErrors.deadlineTime = '请选择要求完成时限'
    hasError = true
  } else {
    const deadline = dayjs(escalateForm.deadlineTime)
    const now = dayjs()
    if (deadline.isBefore(now)) {
      escalateErrors.deadlineTime = '完成时限不能早于当前时间'
      hasError = true
    }
  }

  if (hasError) return

  const operator = currentRole.value === 'service' ? '张客服' : '操作员'
  const formattedDeadline = dayjs(escalateForm.deadlineTime).format('YYYY-MM-DD HH:mm:ss')
  const result = store.escalateOrder(escalateForm.orderId, {
    operator: operator,
    reason: escalateForm.reason.trim(),
    deadlineTime: formattedDeadline
  })

  if (result) {
    showToast('升级成功，该工单已标记为重点跟进工单', 'warning')
    closeEscalateModal()
  } else {
    showToast('升级失败，请重试', 'error')
  }
}

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
    case 'followup': return 'bg-red-100 text-red-600'
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
    case 'followup': return '待跟进'
    default: return status
  }
}

const getDisplayStatus = (order) => {
  if (order.visitStatus === 'followup') return 'followup'
  return order.status
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
  filters.isUrged = ''
  filters.isEscalated = ''
  filters.processStage = ''
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
