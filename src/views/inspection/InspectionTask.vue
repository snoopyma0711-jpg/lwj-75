<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">今日巡检任务</h1>
        <p class="text-sm text-gray-500 mt-1">{{ store.state.currentDate }} · 共 {{ todayTasks.length }} 项任务</p>
      </div>
      <div class="flex space-x-3">
        <router-link to="/inspection" class="btn-secondary">巡检记录</router-link>
        <router-link to="/inspection/item" class="btn-secondary">巡检项目</router-link>
        <button @click="generateTasks" class="btn-primary" :disabled="todayTasks.length > 0">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            生成今日任务
          </span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-4">
      <div class="card p-4 flex items-center space-x-4">
        <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
          </svg>
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">{{ todayTasks.length }}</p>
          <p class="text-sm text-gray-500">总任务</p>
        </div>
      </div>
      <div class="card p-4 flex items-center space-x-4">
        <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-600">{{ pendingTasks.length }}</p>
          <p class="text-sm text-gray-500">待巡检</p>
        </div>
      </div>
      <div class="card p-4 flex items-center space-x-4">
        <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p class="text-2xl font-bold text-blue-600">{{ inspectingTasks.length }}</p>
          <p class="text-sm text-gray-500">巡检中</p>
        </div>
      </div>
      <div class="card p-4 flex items-center space-x-4">
        <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p class="text-2xl font-bold text-green-600">{{ completedTasks.length }}</p>
          <p class="text-sm text-gray-500">已完成</p>
        </div>
      </div>
    </div>

    <div class="card overflow-hidden">
      <div v-if="todayTasks.length > 0" class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>巡检项目</th>
              <th>设备名称</th>
              <th>状态</th>
              <th>巡检员</th>
              <th>开始时间</th>
              <th>是否异常</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in todayTasks" :key="task.id">
              <td class="font-medium">{{ task.itemName }}</td>
              <td>{{ task.equipmentName }}</td>
              <td>
                <span class="badge" :class="getStatusClass(task.status)">{{ getStatusLabel(task.status) }}</span>
              </td>
              <td>
                <span v-if="task.inspectorName">{{ task.inspectorName }}</span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td>
                <span v-if="task.startTime">{{ task.startTime }}</span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td>
                <span v-if="task.status === 'completed'" class="badge" :class="task.abnormal ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'">
                  {{ task.abnormal ? '有异常' : '正常' }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td>
                <div class="flex space-x-2">
                  <button
                    v-if="task.status === 'pending'"
                    @click="startInspection(task)"
                    class="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  >
                    开始巡检
                  </button>
                  <button
                    v-if="task.status === 'inspecting'"
                    @click="showCompleteModal(task)"
                    class="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    完成巡检
                  </button>
                  <button
                    v-if="task.status === 'completed' && task.abnormal && !task.repairOrderId"
                    @click="convertToRepair(task)"
                    class="text-orange-600 hover:text-orange-800 text-sm font-medium"
                  >
                    转报修
                  </button>
                  <button
                    v-if="task.status === 'completed'"
                    @click="viewDetail(task)"
                    class="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    查看详情
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState v-else title="暂无巡检任务" description="点击右上角生成今日巡检任务">
        <template #action>
          <button @click="generateTasks" class="btn-primary btn-sm">生成任务</button>
        </template>
      </EmptyState>
    </div>

    <Transition name="fade">
      <div v-if="showComplete" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">完成巡检 - {{ currentTask?.itemName }}</h3>
          <form @submit.prevent="handleComplete" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">巡检结果</label>
              <div class="flex space-x-6">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input v-model="completeForm.result" type="radio" value="normal" class="w-4 h-4 text-primary-600" />
                  <span class="text-sm text-green-600 font-medium">正常</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input v-model="completeForm.result" type="radio" value="abnormal" class="w-4 h-4 text-primary-600" />
                  <span class="text-sm text-red-600 font-medium">有异常</span>
                </label>
              </div>
              <p v-if="completeErrors.result" class="text-red-500 text-xs mt-1">{{ completeErrors.result }}</p>
            </div>
            
            <div v-if="completeForm.result === 'abnormal'">
              <label class="block text-sm font-medium text-gray-700 mb-2">异常说明 <span class="text-red-500">*</span></label>
              <textarea v-model="completeForm.abnormalDesc" class="textarea h-24" placeholder="请详细描述发现的异常情况"></textarea>
              <p v-if="completeErrors.abnormalDesc" class="text-red-500 text-xs mt-1">{{ completeErrors.abnormalDesc }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">处理建议</label>
              <textarea v-model="completeForm.suggestion" class="textarea h-20" placeholder="请填写处理建议（可选）"></textarea>
            </div>
            
            <div v-if="completeForm.result === 'abnormal'" class="flex items-center space-x-2">
              <input v-model="autoConvert" type="checkbox" class="w-4 h-4 text-primary-600" id="autoConvert" />
              <label for="autoConvert" class="text-sm text-gray-700">自动生成报修工单</label>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4 border-t">
              <button type="button" @click="closeCompleteModal" class="btn-secondary">取消</button>
              <button type="submit" class="btn-success">确认完成</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showDetail" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">巡检详情</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">巡检项目：</span>
                <span class="font-medium">{{ currentTask?.itemName }}</span>
              </div>
              <div>
                <span class="text-gray-500">设备：</span>
                <span class="font-medium">{{ currentTask?.equipmentName }}</span>
              </div>
              <div>
                <span class="text-gray-500">巡检员：</span>
                <span class="font-medium">{{ currentTask?.inspectorName }}</span>
              </div>
              <div>
                <span class="text-gray-500">用时：</span>
                <span class="font-medium">{{ getDuration(currentTask) }}</span>
              </div>
            </div>
            <div>
              <span class="text-sm text-gray-500">检查结果：</span>
              <span class="ml-2 badge" :class="currentTask?.abnormal ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'">
                {{ currentTask?.abnormal ? '有异常' : '正常' }}
              </span>
            </div>
            <div v-if="currentTask?.abnormalDesc">
              <p class="text-sm text-gray-500 mb-1">异常说明：</p>
              <p class="text-sm text-gray-900">{{ currentTask.abnormalDesc }}</p>
            </div>
            <div v-if="currentTask?.suggestion">
              <p class="text-sm text-gray-500 mb-1">处理建议：</p>
              <p class="text-sm text-gray-900">{{ currentTask.suggestion }}</p>
            </div>
            <div v-if="currentTask?.repairOrderId" class="p-3 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-700">
                已生成报修工单：
                <span class="font-mono font-medium">{{ currentTask.repairOrderId }}</span>
                <button @click="goToRepair(currentTask.repairOrderId)" class="ml-2 underline">查看</button>
              </p>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
              <button type="button" @click="showDetail = false" class="btn-secondary">关闭</button>
              <button
                v-if="currentTask?.abnormal && !currentTask?.repairOrderId"
                @click="convertToRepair(currentTask)"
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

const showComplete = ref(false)
const showDetail = ref(false)
const currentTask = ref(null)
const autoConvert = ref(true)

const todayTasks = computed(() => {
  return store.state.inspectionRecords.filter(t => t.date === store.state.currentDate)
})

const pendingTasks = computed(() => todayTasks.value.filter(t => t.status === 'pending'))
const inspectingTasks = computed(() => todayTasks.value.filter(t => t.status === 'inspecting'))
const completedTasks = computed(() => todayTasks.value.filter(t => t.status === 'completed'))

const completeForm = reactive({
  result: '',
  abnormalDesc: '',
  suggestion: ''
})

const completeErrors = reactive({
  result: '',
  abnormalDesc: ''
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

const getDuration = (task) => {
  if (!task?.startTime || !task?.endTime) return '-'
  const start = dayjs(task.startTime)
  const end = dayjs(task.endTime)
  const mins = end.diff(start, 'minute')
  return `${mins}分钟`
}

const generateTasks = () => {
  if (todayTasks.value.length > 0) {
    showToast('今日任务已存在', 'warning')
    return
  }
  store.generateTodayInspectionTasks()
  showToast('已生成今日巡检任务', 'success')
}

const startInspection = (task) => {
  const inspectorId = 'ENG001'
  const inspectorName = currentRole.value === 'engineer' ? '李工程师' : '操作员'
  const success = store.startInspection(task.id, inspectorId, inspectorName)
  if (success) {
    showToast('已开始巡检', 'success')
  }
}

const showCompleteModal = (task) => {
  currentTask.value = task
  completeForm.result = ''
  completeForm.abnormalDesc = ''
  completeForm.suggestion = ''
  completeErrors.result = ''
  completeErrors.abnormalDesc = ''
  autoConvert.value = true
  showComplete.value = true
}

const closeCompleteModal = () => {
  showComplete.value = false
  currentTask.value = null
}

const handleComplete = () => {
  let valid = true
  completeErrors.result = ''
  completeErrors.abnormalDesc = ''
  
  if (!completeForm.result) {
    completeErrors.result = '请选择巡检结果'
    valid = false
  }
  
  if (completeForm.result === 'abnormal' && !completeForm.abnormalDesc.trim()) {
    completeErrors.abnormalDesc = '请描述异常情况'
    valid = false
  }
  
  if (!valid) {
    showToast('请检查填写的信息', 'error')
    return
  }
  
  const resultData = {
    result: completeForm.result,
    abnormal: completeForm.result === 'abnormal',
    abnormalDesc: completeForm.result === 'abnormal' ? completeForm.abnormalDesc : null,
    suggestion: completeForm.suggestion || null
  }
  
  const task = store.completeInspection(currentTask.value.id, resultData)
  
  if (task) {
    showToast('巡检已完成', 'success')
    closeCompleteModal()
    
    if (autoConvert.value && completeForm.result === 'abnormal') {
      const operatorName = currentRole.value === 'engineer' ? '李工程师' : '操作员'
      const newOrder = store.convertInspectionToRepair(task.id, operatorName)
      if (newOrder) {
        showToast(`已自动生成报修工单 ${newOrder.id}`, 'success')
      }
    }
  }
}

const viewDetail = (task) => {
  currentTask.value = task
  showDetail.value = true
}

const convertToRepair = (task) => {
  if (task.repairOrderId) {
    showToast('该巡检已生成过报修工单', 'warning')
    return
  }
  
  const operatorName = currentRole.value === 'engineer' ? '李工程师' : '操作员'
  const newOrder = store.convertInspectionToRepair(task.id, operatorName)
  
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
