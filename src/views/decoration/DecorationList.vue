<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">小区装修申请与施工协同台</h1>
        <p class="text-sm text-gray-500 mt-1">共 {{ filteredRecords.length }} 条装修记录</p>
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
        <router-link to="/decoration/create" class="btn-primary">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            新增申请
          </span>
        </router-link>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 cursor-pointer hover:shadow-lg transition-shadow" @click="quickFilter('today')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-blue-600 font-medium">今日新申请</p>
            <p class="text-3xl font-bold text-blue-700 mt-2">{{ todayNewDecorations.length }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 cursor-pointer hover:shadow-lg transition-shadow" @click="quickFilter('pending_audit')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-yellow-600 font-medium">待审核</p>
            <p class="text-3xl font-bold text-yellow-700 mt-2">{{ pendingAuditDecorations.length }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 bg-gradient-to-br from-green-50 to-green-100 border-green-200 cursor-pointer hover:shadow-lg transition-shadow" @click="quickFilter('constructing')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-green-600 font-medium">施工中</p>
            <p class="text-3xl font-bold text-green-700 mt-2">{{ constructingDecorations.length }}</p>
          </div>
          <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 bg-gradient-to-br from-red-50 to-red-100 border-red-200 cursor-pointer hover:shadow-lg transition-shadow" @click="quickFilter('inspection')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-red-600 font-medium">今日待巡查</p>
            <p class="text-3xl font-bold text-red-700 mt-2">{{ todayPendingInspections.length }}</p>
          </div>
          <div class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div v-if="abnormalRecords.length > 0" class="card p-4 bg-red-50 border-red-200">
      <div class="flex items-start space-x-3">
        <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div class="flex-1">
          <h4 class="text-sm font-medium text-red-800 mb-2">异常提醒（共 {{ abnormalRecords.length }} 条）</h4>
          <div class="flex flex-wrap gap-2">
            <span v-for="record in abnormalRecords.slice(0, 5)" :key="record.id" 
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 cursor-pointer hover:bg-red-200"
                  @click="goToDetail(record.id)">
              {{ record.roomNumber }} - {{ getAbnormalType(record) }}
            </span>
            <span v-if="abnormalRecords.length > 5" class="text-xs text-red-600 self-center">
              还有 {{ abnormalRecords.length - 5 }} 条异常...
            </span>
          </div>
        </div>
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
            <option v-for="(label, key) in decorationStatusMap" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">装修类型</label>
          <select v-model="filters.decorationType" class="select text-sm">
            <option value="">全部类型</option>
            <option v-for="t in store.state.decorationTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">是否逾期</label>
          <select v-model="filters.isOverdue" class="select text-sm">
            <option value="">全部</option>
            <option value="yes">已逾期</option>
            <option value="no">未逾期</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">时间范围</label>
          <select v-model="filters.timeRange" class="select text-sm">
            <option value="all">全部时间</option>
            <option value="today">今天</option>
            <option value="week">近7天</option>
            <option value="month">近30天</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">关键词</label>
          <div class="relative">
            <input
              v-model="filters.keyword"
              type="text"
              class="input text-sm pl-8"
              placeholder="搜索申请号、房号、业主..."
            />
            <svg class="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="card overflow-hidden">
      <div v-if="filteredRecords.length > 0" class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>申请编号</th>
              <th>房号</th>
              <th>业主</th>
              <th>装修类型</th>
              <th>施工期限</th>
              <th>施工单位</th>
              <th>状态</th>
              <th>异常提醒</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in filteredRecords" :key="record.id" class="cursor-pointer hover:bg-gray-50" @click="goToDetail(record.id)">
              <td>
                <span class="font-mono text-sm text-primary-600 font-medium">{{ record.id }}</span>
              </td>
              <td class="font-medium">{{ record.roomNumber }}</td>
              <td>
                <div>{{ record.ownerName }}</div>
                <div class="text-xs text-gray-500">{{ record.ownerPhone }}</div>
              </td>
              <td>
                <span class="badge bg-gray-100 text-gray-700">{{ getDecorationTypeLabel(record.decorationType) }}</span>
              </td>
              <td>
                <div class="text-sm">{{ record.startDate }}</div>
                <div class="text-xs text-gray-500">至 {{ record.endDate }}</div>
              </td>
              <td class="text-sm">{{ record.constructionCompany }}</td>
              <td>
                <span class="badge" :class="getStatusClass(record.status)">{{ getStatusLabel(record.status) }}</span>
              </td>
              <td>
                <div class="flex flex-wrap gap-1">
                  <span v-if="record.isOverdue" class="badge bg-red-100 text-red-600 text-xs">施工逾期</span>
                  <span v-if="record.hasViolation" class="badge bg-orange-100 text-orange-600 text-xs">有违规</span>
                  <span v-if="hasMissingMaterials(record)" class="badge bg-yellow-100 text-yellow-700 text-xs">材料缺失</span>
                  <span v-if="hasUnrectified(record)" class="badge bg-red-100 text-red-600 text-xs">整改未完成</span>
                  <span v-if="record.status === 'acceptance_failed'" class="badge bg-red-100 text-red-600 text-xs">验收未通过</span>
                  <span v-if="record.status === 'acceptance_passed' && !record.depositRefunded" class="badge bg-yellow-100 text-yellow-700 text-xs">押金未退</span>
                  <span v-if="!hasAnyAbnormal(record)" class="text-gray-400 text-xs">-</span>
                </div>
              </td>
              <td class="text-gray-500 text-sm">{{ record.createTime }}</td>
              <td>
                <div class="flex items-center space-x-2">
                  <button @click.stop="goToDetail(record.id)" class="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    查看详情
                  </button>
                  <button 
                    v-if="record.status === 'pending_audit'"
                    @click.stop="quickAudit(record, true)" 
                    class="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    通过
                  </button>
                  <button 
                    v-if="record.status === 'pending_audit'"
                    @click.stop="quickAudit(record, false)" 
                    class="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    驳回
                  </button>
                  <button 
                    v-if="record.status === 'audit_approved'"
                    @click.stop="quickEnter(record)" 
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    进场
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState v-else title="没有找到匹配的装修记录" description="请尝试调整筛选条件">
        <template #action>
          <button @click="resetFilters" class="btn-primary btn-sm">重置筛选</button>
        </template>
      </EmptyState>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { useStore, decorationStatusMap, decorationStatusColorMap } from '../../store'
import EmptyState from '../../components/EmptyState.vue'

const router = useRouter()
const showToast = inject('showToast')
const store = useStore()

const { todayNewDecorations, pendingAuditDecorations, constructingDecorations, todayPendingInspections } = store

const filters = reactive({
  buildingId: '',
  status: '',
  decorationType: '',
  isOverdue: '',
  timeRange: 'all',
  keyword: ''
})

const filteredRecords = computed(() => {
  return store.state.decorationRecords.filter(record => {
    if (filters.buildingId && record.buildingId !== filters.buildingId) return false
    if (filters.status && record.status !== filters.status) return false
    if (filters.decorationType && record.decorationType !== filters.decorationType) return false
    
    if (filters.isOverdue) {
      if (filters.isOverdue === 'yes' && !record.isOverdue) return false
      if (filters.isOverdue === 'no' && record.isOverdue) return false
    }
    
    if (filters.timeRange !== 'all') {
      const recordDate = dayjs(record.createTime)
      const today = dayjs('2026-06-17')
      if (filters.timeRange === 'today' && !recordDate.isSame(today, 'day')) return false
      if (filters.timeRange === 'week' && recordDate.isBefore(today.subtract(7, 'day'))) return false
      if (filters.timeRange === 'month' && recordDate.isBefore(today.subtract(30, 'day'))) return false
    }
    
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase()
      const match = 
        record.id.toLowerCase().includes(kw) ||
        record.roomNumber.toLowerCase().includes(kw) ||
        record.ownerName.toLowerCase().includes(kw) ||
        record.ownerPhone.includes(kw) ||
        record.constructionCompany.toLowerCase().includes(kw)
      if (!match) return false
    }
    
    return true
  })
})

const abnormalRecords = computed(() => {
  return store.state.decorationRecords.filter(r => hasAnyAbnormal(r))
})

const hasAnyAbnormal = (record) => {
  return record.isOverdue || 
         record.hasViolation || 
         hasMissingMaterials(record) || 
         hasUnrectified(record) ||
         record.status === 'acceptance_failed' ||
         (record.status === 'acceptance_passed' && !record.depositRefunded)
}

const hasMissingMaterials = (record) => {
  if (!record.materialList) return false
  return record.materialList.some(m => !m.provided)
}

const hasUnrectified = (record) => {
  if (!record.rectificationRecords || record.rectificationRecords.length === 0) return false
  return record.rectificationRecords.some(r => r.recheckResult !== 'passed')
}

const getAbnormalType = (record) => {
  if (record.isOverdue) return '施工逾期'
  if (record.hasViolation) return '有违规'
  if (hasMissingMaterials(record)) return '材料缺失'
  if (hasUnrectified(record)) return '整改未完成'
  if (record.status === 'acceptance_failed') return '验收未通过'
  if (record.status === 'acceptance_passed' && !record.depositRefunded) return '押金未退'
  return '异常'
}

const getDecorationTypeLabel = (value) => {
  const t = store.state.decorationTypes.find(t => t.value === value)
  return t ? t.label : value
}

const getStatusLabel = (status) => {
  return decorationStatusMap[status] || status
}

const getStatusClass = (status) => {
  return decorationStatusColorMap[status] || 'bg-gray-100 text-gray-600'
}

const goToDetail = (id) => {
  router.push(`/decoration/${id}`)
}

const quickFilter = (type) => {
  if (type === 'today') {
    filters.timeRange = 'today'
  } else if (type === 'pending_audit') {
    filters.status = 'pending_audit'
  } else if (type === 'constructing') {
    filters.status = 'constructing'
  } else if (type === 'inspection') {
    filters.status = 'constructing'
  }
  showToast('已应用快捷筛选', 'success')
}

const resetFilters = () => {
  filters.buildingId = ''
  filters.status = ''
  filters.decorationType = ''
  filters.isOverdue = ''
  filters.timeRange = 'all'
  filters.keyword = ''
  showToast('筛选条件已重置', 'success')
}

const quickAudit = (record, isApproved) => {
  const operator = '李主管'
  const remark = isApproved ? '' : '请补充完善装修方案后重新提交'
  const result = store.auditDecoration(record.id, operator, isApproved, remark)
  if (result) {
    showToast(isApproved ? '审核通过' : '已驳回申请', 'success')
  } else {
    showToast('操作失败，请重试', 'error')
  }
}

const quickEnter = (record) => {
  const operator = '王安全员'
  const result = store.enterDecoration(record.id, operator)
  if (result) {
    showToast('已确认施工进场', 'success')
  } else {
    showToast('操作失败，请重试', 'error')
  }
}
</script>
