<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">巡检项目管理</h1>
        <p class="text-sm text-gray-500 mt-1">共 {{ store.state.inspectionItems.length }} 个巡检项目</p>
      </div>
      <div class="flex space-x-3">
        <router-link to="/inspection" class="btn-secondary">巡检记录</router-link>
        <router-link to="/inspection/task" class="btn-secondary">今日任务</router-link>
        <button @click="showAddModal = true" class="btn-primary">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            新增项目
          </span>
        </button>
      </div>
    </div>

    <div class="flex space-x-4 mb-4">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
        :class="{
          'bg-primary-100 text-primary-700': activeTab === tab.value,
          'text-gray-500 hover:text-gray-700 hover:bg-gray-100': activeTab !== tab.value
        }"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="card overflow-hidden">
      <div v-if="filteredItems.length > 0" class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>项目名称</th>
              <th>设备类型</th>
              <th>巡检频次</th>
              <th>检查标准</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.id">
              <td class="font-medium">{{ item.name }}</td>
              <td>
                <span class="badge bg-gray-100 text-gray-700">{{ getTypeLabel(item.type) }}</span>
              </td>
              <td>
                <span class="badge" :class="getFrequencyClass(item.frequency)">{{ getFrequencyLabel(item.frequency) }}</span>
              </td>
              <td class="max-w-xs">
                <span class="text-sm text-gray-600">{{ item.standard }}</span>
              </td>
              <td>
                <span class="badge" :class="item.enable ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'">
                  {{ item.enable ? '启用' : '停用' }}
                </span>
              </td>
              <td>
                <div class="flex space-x-2">
                  <button @click="editItem(item)" class="text-primary-600 hover:text-primary-800 text-sm">编辑</button>
                  <button @click="toggleItem(item)" class="text-sm" :class="item.enable ? 'text-gray-500 hover:text-gray-700' : 'text-green-600 hover:text-green-800'">
                    {{ item.enable ? '停用' : '启用' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState v-else title="暂无巡检项目" description="点击右上角新增巡检项目" />
    </div>

    <Transition name="fade">
      <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ editingItem ? '编辑' : '新增' }}巡检项目</h3>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">项目名称 <span class="text-red-500">*</span></label>
              <input v-model="form.name" type="text" class="input" :class="{ 'border-red-500': errors.name }" placeholder="请输入项目名称" />
              <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">设备类型 <span class="text-red-500">*</span></label>
                <select v-model="form.type" class="select" :class="{ 'border-red-500': errors.type }">
                  <option value="">请选择</option>
                  <option v-for="t in equipmentTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
                </select>
                <p v-if="errors.type" class="text-red-500 text-xs mt-1">请选择设备类型</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">巡检频次 <span class="text-red-500">*</span></label>
                <select v-model="form.frequency" class="select" :class="{ 'border-red-500': errors.frequency }">
                  <option value="">请选择</option>
                  <option value="daily">每日</option>
                  <option value="weekly">每周</option>
                  <option value="monthly">每月</option>
                  <option value="quarterly">每季度</option>
                  <option value="yearly">每年</option>
                </select>
                <p v-if="errors.frequency" class="text-red-500 text-xs mt-1">请选择巡检频次</p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">检查标准 <span class="text-red-500">*</span></label>
              <textarea v-model="form.standard" class="textarea h-24" :class="{ 'border-red-500': errors.standard }" placeholder="请描述检查标准和要求"></textarea>
              <p v-if="errors.standard" class="text-red-500 text-xs mt-1">{{ errors.standard }}</p>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
              <button type="button" @click="closeModal" class="btn-secondary">取消</button>
              <button type="submit" class="btn-primary">{{ editingItem ? '保存修改' : '新增项目' }}</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, inject } from 'vue'
import { useStore } from '../../store'
import EmptyState from '../../components/EmptyState.vue'

const showToast = inject('showToast')
const store = useStore()

const showAddModal = ref(false)
const activeTab = ref('all')
const editingItem = ref(null)

const tabs = [
  { value: 'all', label: '全部' },
  { value: 'enable', label: '已启用' },
  { value: 'disable', label: '已停用' }
]

const equipmentTypes = [
  { value: 'elevator', label: '电梯' },
  { value: 'fire', label: '消防设施' },
  { value: 'plumbing', label: '给排水' },
  { value: 'electrical', label: '电气设备' },
  { value: 'lighting', label: '照明系统' },
  { value: 'security', label: '安防设备' },
  { value: 'hvac', label: '空调系统' },
  { value: 'other', label: '其他' }
]

const filteredItems = computed(() => {
  return store.state.inspectionItems.filter(item => {
    if (activeTab.value === 'enable') return item.enable
    if (activeTab.value === 'disable') return !item.enable
    return true
  })
})

const form = reactive({
  name: '',
  type: '',
  frequency: '',
  standard: ''
})

const errors = reactive({
  name: '',
  type: false,
  frequency: false,
  standard: ''
})

const getTypeLabel = (value) => {
  const t = equipmentTypes.find(item => item.value === value)
  return t ? t.label : value
}

const getFrequencyLabel = (value) => {
  const map = {
    daily: '每日',
    weekly: '每周',
    monthly: '每月',
    quarterly: '每季度',
    yearly: '每年'
  }
  return map[value] || value
}

const getFrequencyClass = (value) => {
  switch (value) {
    case 'daily': return 'bg-red-100 text-red-600'
    case 'weekly': return 'bg-orange-100 text-orange-600'
    case 'monthly': return 'bg-yellow-100 text-yellow-600'
    case 'quarterly': return 'bg-blue-100 text-blue-600'
    case 'yearly': return 'bg-green-100 text-green-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const editItem = (item) => {
  editingItem.value = item
  form.name = item.name
  form.type = item.type
  form.frequency = item.frequency
  form.standard = item.standard
  showAddModal.value = true
}

const toggleItem = (item) => {
  const success = store.updateInspectionItem(item.id, { enable: !item.enable })
  if (success) {
    showToast(item.enable ? '已停用' : '已启用', 'success')
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingItem.value = null
  form.name = ''
  form.type = ''
  form.frequency = ''
  form.standard = ''
  errors.name = ''
  errors.type = false
  errors.frequency = false
  errors.standard = ''
}

const handleSubmit = () => {
  let valid = true
  
  errors.name = ''
  errors.type = false
  errors.frequency = false
  errors.standard = ''
  
  if (!form.name.trim()) {
    errors.name = '请输入项目名称'
    valid = false
  }
  if (!form.type) {
    errors.type = true
    valid = false
  }
  if (!form.frequency) {
    errors.frequency = true
    valid = false
  }
  if (!form.standard.trim()) {
    errors.standard = '请输入检查标准'
    valid = false
  }
  
  if (!valid) {
    showToast('请检查填写的信息', 'error')
    return
  }
  
  if (editingItem.value) {
    const success = store.updateInspectionItem(editingItem.value.id, {
      name: form.name,
      type: form.type,
      frequency: form.frequency,
      standard: form.standard
    })
    if (success) {
      showToast('修改成功', 'success')
      closeModal()
    }
  } else {
    const newItem = store.addInspectionItem({
      name: form.name,
      type: form.type,
      frequency: form.frequency,
      standard: form.standard
    })
    if (newItem) {
      showToast('新增成功', 'success')
      closeModal()
    }
  }
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
