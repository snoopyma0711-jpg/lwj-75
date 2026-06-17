<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">巡检记录</h1>
        <p class="text-sm text-gray-500 mt-1">共 {{ filteredRecords.length }} 条记录</p>
      </div>
      <div class="flex space-x-3">
        <router-link to="/inspection/task" class="btn-secondary">今日任务</router-link>
        <router-link to="/inspection/item" class="btn-secondary">巡检项目</router-link>
      </div>
    </div>

    <div class="card p-5">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">状态</label>
          <select v-model="filters.status" class="select text-sm">
            <option value="">全部状态</option>
            <option value="pending">待巡检</option>
            <option value="inspecting">巡检中</option>
            <option value="completed">已完成</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">是否异常</label>
          <select v-model="filters.abnormal" class="select text-sm">
            <option value="">全部</option>
            <option value="normal">正常</option>
            <option value="abnormal">有异常</option>
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
              placeholder="搜索项目、设备..."
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
              <th>任务编号</th>
              <th>巡检项目</th>
              <th>设备名称</th>
              <th>巡检日期</th>
              <th>状态</th>
              <th>巡检员</th>
              <th>检查结果</th>
              <th>关联工单</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in filteredRecords" :key="record.id" class="cursor-pointer" @click="viewDetail(record)">
              <td>
                <span class="font-mono text-sm text-primary-600">{{ record.id }}</span>
              </td>
              <td class="font-medium">{{ record.itemName }}</td>
              <td>{{ record.equipmentName }}</td>
              <td>{{ record.date }}</td>
              <td>
                <span class="badge" :class="getStatusClass(record.status)">{{ getStatusLabel(record.status) }}</span>
              </td>
              <td>
                <span v-if="record.inspectorName">{{ record.inspectorName }}</span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td>
                <span v-if="record.status === 'completed'" class="badge" :class="record.abnormal ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'">
                  {{ record.abnormal ? '有异常' : '正常' }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td>
                <span v-if="record.repairOrderId" class="font-mono text-sm text-primary-600 cursor-pointer hover:underline" @click.stop="goToRepair(record.repairOrderId)">
                  {{ record.repairOrderId }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td>
                <div class="flex space-x-2">
                  <button @click.stop="viewDetail(record)" class="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    查看详情
                  </button>
                  <button
                    v-if="record.status === 'completed' && record.abnormal && !record.repairOrderId"
                    @click.stop="convertToRepair(record)"
                    class="text-orange-600 hover:text-orange-800 text-sm font-medium"
                  >
                    转报修
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState v-else title="没有找到匹配的记录" description="请尝试调整筛选条件">
        <template #action>
          <button @click="resetFilters" class="btn-primary btn-sm">重置筛选</button>
        </template>
      </EmptyState>
    </div>

    <Transition name="fade">
      <div v-if="showDetail" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">巡检详情</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">任务编号：</span>
                <span class="font-mono font-medium">{{ currentRecord?.id }}</span>
              </div>
              <div>
                <span class="text-gray-500">巡检日期：</span>
                <span class="font-medium">{{ currentRecord?.date }}</span>
              </div>
              <div>
                <span class="text-gray-500">巡检项目：</span>
                <span class="font-medium">{{ currentRecord?.itemName }}</span>
              </div>
              <div>
                <span class="text-gray-500">设备：</span>
                <span class="font-medium">{{ currentRecord?.equipmentName }}</span>
              </div>
              <div>
                <span class="text-gray-500">巡检员：</span>
                <span class="font-medium">{{ currentRecord?.inspectorName || '-' }}</span>
              </div>
              <div>
                <span class="text-gray-500">状态：</span>
                <span class="badge" :class="getStatusClass(currentRecord?.status)">{{ getStatusLabel(currentRecord?.status) }}</span>
              </div>
            </div>
            
            <div v-if="currentRecord?.status === 'completed'">
              <div class="mb-3">
                <span class="text-sm text-gray-500">检查结果：</span>
                <span class="ml-2 badge" :class="currentRecord?.abnormal ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'">
                  {{ currentRecord?.abnormal ? '有异常' : '正常' }}
                </span>
              </div>
              <div v-if="currentRecord?.abnormalDesc" class="mb-3">
                <p class="text-sm text-gray-500 mb-1">异常说明：</p>
                <p class="text-sm text-gray-900">{{ currentRecord.abnormalDesc }}</p>
              </div>
              <div v-if="currentRecord?.suggestion">
                <p class="text-sm text-gray-500 mb-1">处理建议：</p>
                <p class="text-sm text-gray-900">{{ currentRecord.suggestion }}</p>
              </div>
            </div>
            
            <div v-if="currentRecord?.repairOrderId" class="p-3 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-700">
                已生成报修工单：
                <span class="font-mono font-medium">{{ currentRecord.repairOrderId }}</span>
                <button @click="goToRepair(currentRecord.repairOrderId)" class="ml-2 underline">查看</button>
              </p>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4 border-t">
              <button type="button" @click="showDetail = false" class="btn-secondary">关闭</button>
              <button
                v-if="currentRecord?.abnormal && !currentRecord?.repairOrderId"
                @click="convertToRepair(currentRecord)"
                class="btn-warning"
              >
                转报修
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { useStore } from '../../store'
import EmptyState from '../../components/EmptyState.vue'

const router = useRouter()
const showToast = inject('showToast')
const currentRole = inject('currentRole')
const store = useStore()

const showDetail = ref(false)
const currentRecord = ref(null)

const filters = reactive({
  status: '',
  abnormal: '',
  timeRange: 'all',
  keyword: ''
})

const filteredRecords = computed(() => {
  return store.state.inspectionRecords.filter(record => {
    if (filters.status && record.status !== filters.status) return false
    
    if (filters.abnormal && record.status === 'completed') {
      if (filters.abnormal === 'normal' && record.abnormal) return false
      if (filters.abnormal === 'abnormal' && !record.abnormal) return false
    }
    
    if (filters.timeRange !== 'all') {
      const recordDate = dayjs(record.date)
      const today = dayjs('2026-06-17')
      if (filters.timeRange === 'today' && !recordDate.isSame(today, 'day')) return false
      if (filters.timeRange === 'week' && recordDate.isBefore(today.subtract(7, 'day'))) return false
      if (filters.timeRange === 'month' && recordDate.isBefore(today.subtract(30, 'day'))) return false
    }
    
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase()
      const match = 
        record.id.toLowerCase().includes(kw) ||
        record.itemName.toLowerCase().includes(kw) ||
        record.equipmentName.toLowerCase().includes(kw)
      if (!match) return false
    }
    
    return true
  }).sort((a, b) => b.id.localeCompare(a.id))
})

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-gray-100 text-gray-600'
    case 'inspecting': return 'bg-blue-100 text-blue-600'
    case 'completed': return 'bg-green-100 text-green-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'pending': return '待巡检'
    case 'inspecting': return '巡检中'
    case 'completed': return '已完成'
    default: return status
  }
}

const resetFilters = () => {
  filters.status = ''
  filters.abnormal = ''
  filters.timeRange = 'all'
  filters.keyword = ''
  showToast('筛选条件已重置', 'success')
}

const viewDetail = (record) => {
  currentRecord.value = record
  showDetail.value = true
}

const convertToRepair = (record) => {
  if (record.repairOrderId) {
    showToast('该巡检已生成过报修工单', 'warning')
    return
  }
  
  const operatorName = currentRole.value === 'engineer' ? '李工程师' : '操作员'
  const newOrder = store.convertInspectionToRepair(record.id, operatorName)
  
  if (newOrder) {
    showToast(`已生成报修工单 ${newOrder.id}`, 'success')
    showDetail.value = false
    router.push(`/repair/${newOrder.id}`)
  }
}

const goToRepair = (id) => {
  showDetail.value = false
  router.push(`/repair/${id}`)
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
