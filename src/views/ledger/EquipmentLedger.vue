<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">设备台账</h1>
        <p class="text-sm text-gray-500 mt-1">共 {{ filteredEquipment.length }} 台设备</p>
      </div>
      <div class="flex space-x-3">
        <router-link to="/ledger/buildings" class="btn-secondary">楼栋台账</router-link>
        <button @click="showAddModal = true" class="btn-primary">新增设备</button>
      </div>
    </div>

    <div class="card p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="label">所属楼栋</label>
          <select v-model="filters.buildingId" class="input">
            <option value="">全部楼栋</option>
            <option v-for="b in store.state.buildings" :key="b.id" :value="b.id">{{ b.name }}</option>
          </select>
        </div>
        <div>
          <label class="label">设备类型</label>
          <select v-model="filters.type" class="input">
            <option value="">全部类型</option>
            <option v-for="t in equipmentTypes" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <div>
          <label class="label">设备状态</label>
          <select v-model="filters.status" class="input">
            <option value="">全部状态</option>
            <option value="normal">正常运行</option>
            <option value="maintenance">维护中</option>
            <option value="fault">故障</option>
          </select>
        </div>
        <div>
          <label class="label">关键词搜索</label>
          <div class="relative">
            <input v-model="filters.keyword" type="text" class="input pl-9" placeholder="设备名称/编号">
            <svg class="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredEquipment.length > 0" class="overflow-x-auto card">
      <table class="table">
        <thead>
          <tr>
            <th class="w-28">设备编号</th>
            <th class="w-36">设备名称</th>
            <th class="w-28">设备类型</th>
            <th class="w-32">所属楼栋</th>
            <th class="w-36">安装位置</th>
            <th class="w-24">状态</th>
            <th class="w-32">最近维修</th>
            <th class="w-32">最近巡检</th>
            <th class="w-28">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="eq in filteredEquipment" :key="eq.id" class="hover:bg-gray-50 transition-colors">
            <td><span class="font-mono text-primary-600 text-sm">{{ eq.id }}</span></td>
            <td class="font-medium">{{ eq.name }}</td>
            <td>{{ eq.type }}</td>
            <td>{{ getBuildingName(eq.buildingId) }}</td>
            <td>{{ eq.location }}</td>
            <td>
              <span class="badge" :class="getStatusClass(eq.status)">
                {{ getStatusLabel(eq.status) }}
              </span>
            </td>
            <td class="text-sm text-gray-600">{{ getLastRepair(eq.id) }}</td>
            <td class="text-sm text-gray-600">{{ getLastInspection(eq.id) }}</td>
            <td>
              <div class="flex space-x-2">
                <button @click="viewDetail(eq)" class="btn-secondary text-xs px-3 py-1">查看</button>
                <button @click="goToEquipmentRepairs(eq.id)" class="text-primary-600 text-xs hover:text-primary-800">相关工单</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="card py-16 text-center">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
      <p class="text-gray-500 mb-2">没有找到符合条件的设备</p>
      <p class="text-sm text-gray-400">请尝试调整筛选条件</p>
    </div>

    <Transition name="fade">
      <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">{{ currentEquipment?.name }}</h3>
            <button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <span class="text-gray-500">设备编号：</span>
              <span class="font-mono text-primary-600">{{ currentEquipment?.id }}</span>
            </div>
            <div>
              <span class="text-gray-500">设备类型：</span>
              <span class="font-medium">{{ currentEquipment?.type }}</span>
            </div>
            <div>
              <span class="text-gray-500">所属楼栋：</span>
              <span class="font-medium">{{ getBuildingName(currentEquipment?.buildingId) }}</span>
            </div>
            <div>
              <span class="text-gray-500">安装位置：</span>
              <span class="font-medium">{{ currentEquipment?.location }}</span>
            </div>
            <div>
              <span class="text-gray-500">启用日期：</span>
              <span class="font-medium">{{ currentEquipment?.installDate }}</span>
            </div>
            <div>
              <span class="text-gray-500">状态：</span>
              <span class="badge" :class="getStatusClass(currentEquipment?.status)">
                {{ getStatusLabel(currentEquipment?.status) }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-500">累计维修次数</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ getRepairCount(currentEquipment.id) }}次</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-500">累计巡检次数</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ getInspectionCount(currentEquipment.id) }}次</p>
            </div>
          </div>

          <div v-if="currentEquipment?.specifications" class="mb-6">
            <h4 class="text-sm font-medium text-gray-900 mb-3">规格参数</h4>
            <div class="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap">{{ currentEquipment.specifications }}</div>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-3">最近维修记录</h4>
            <div v-if="equipmentRepairs.length > 0" class="space-y-2">
              <div
                v-for="order in equipmentRepairs"
                :key="order.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                @click="goToRepair(order.id)"
              >
                <div>
                  <p class="font-mono text-xs text-primary-600">{{ order.id }}</p>
                  <p class="text-sm">{{ order.description.slice(0, 30) }}...</p>
                </div>
                <span class="text-xs text-gray-500">{{ order.completeTime?.slice(0, 10) || '处理中' }}</span>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500">暂无维修记录</p>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button @click="showDetailModal = false" class="btn-secondary">关闭</button>
            <button @click="goToEquipmentRepairs(currentEquipment.id)" class="btn-primary">查看相关工单</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">新增设备</h3>
            <button @click="closeAddModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="addEquipment" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">设备名称 <span class="text-red-500">*</span></label>
                <input v-model="form.name" type="text" class="input" placeholder="请输入设备名称" required>
              </div>
              <div>
                <label class="label">设备类型 <span class="text-red-500">*</span></label>
                <select v-model="form.type" class="input" required>
                  <option value="">请选择类型</option>
                  <option v-for="t in equipmentTypes" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">所属楼栋 <span class="text-red-500">*</span></label>
                <select v-model="form.buildingId" class="input" required>
                  <option value="">请选择楼栋</option>
                  <option v-for="b in store.state.buildings" :key="b.id" :value="b.id">{{ b.name }}</option>
                </select>
              </div>
              <div>
                <label class="label">安装位置 <span class="text-red-500">*</span></label>
                <input v-model="form.location" type="text" class="input" placeholder="如：1单元地下室" required>
              </div>
            </div>
            <div>
              <label class="label">规格参数</label>
              <textarea v-model="form.specifications" class="input h-20 resize-none" placeholder="设备型号、功率、品牌等信息"></textarea>
            </div>

            <div v-if="formError" class="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
              {{ formError }}
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeAddModal" class="btn-secondary">取消</button>
              <button type="submit" class="btn-primary">保存</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="toast.show" class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div :class="['px-6 py-3 rounded-lg shadow-lg text-white font-medium', toast.type === 'success' ? 'bg-green-500' : 'bg-red-500']">
          {{ toast.message }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../../store'

const router = useRouter()
const store = useStore()

const filters = reactive({
  buildingId: '',
  type: '',
  status: '',
  keyword: ''
})

const showDetailModal = ref(false)
const showAddModal = ref(false)
const currentEquipment = ref(null)
const formError = ref('')

const toast = reactive({
  show: false,
  message: '',
  type: 'success'
})

const form = reactive({
  name: '',
  type: '',
  buildingId: '',
  location: '',
  specifications: ''
})

const equipmentTypes = computed(() => {
  const types = new Set(store.state.equipmentList.map(e => e.type))
  return Array.from(types)
})

const filteredEquipment = computed(() => {
  return store.state.equipmentList.filter(eq => {
    if (filters.buildingId && eq.buildingId !== filters.buildingId) return false
    if (filters.type && eq.type !== filters.type) return false
    if (filters.status && eq.status !== filters.status) return false
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase()
      return eq.name.toLowerCase().includes(kw) || eq.id.toLowerCase().includes(kw)
    }
    return true
  })
})

const equipmentRepairs = computed(() => {
  if (!currentEquipment.value) return []
  return store.state.repairOrders
    .filter(o => o.equipmentId === currentEquipment.value.id)
    .slice(0, 5)
})

const getBuildingName = (id) => {
  const building = store.state.buildings.find(b => b.id === id)
  return building?.name || '-'
}

const getStatusClass = (status) => {
  switch (status) {
    case 'normal': return 'bg-green-100 text-green-600'
    case 'maintenance': return 'bg-yellow-100 text-yellow-600'
    case 'fault': return 'bg-red-100 text-red-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'normal': return '正常运行'
    case 'maintenance': return '维护中'
    case 'fault': return '故障'
    default: return status
  }
}

const getLastRepair = (equipmentId) => {
  const repairs = store.state.repairOrders
    .filter(o => o.equipmentId === equipmentId && o.completeTime)
    .sort((a, b) => b.completeTime.localeCompare(a.completeTime))
  return repairs.length > 0 ? repairs[0].completeTime.slice(0, 10) : '暂无'
}

const getLastInspection = (equipmentId) => {
  const inspections = store.state.inspectionRecords
    .filter(r => r.equipmentId === equipmentId && r.status === 'completed')
    .sort((a, b) => b.endTime?.localeCompare(a.endTime) || 0)
  return inspections.length > 0 ? inspections[0].date : '暂无'
}

const getRepairCount = (equipmentId) => {
  return store.state.repairOrders.filter(o => o.equipmentId === equipmentId && o.completeTime).length
}

const getInspectionCount = (equipmentId) => {
  return store.state.inspectionRecords.filter(r => r.equipmentId === equipmentId && r.status === 'completed').length
}

const showToast = (message, type = 'success') => {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => {
    toast.show = false
  }, 2000)
}

const viewDetail = (eq) => {
  currentEquipment.value = eq
  showDetailModal.value = true
}

const goToRepair = (id) => {
  showDetailModal.value = false
  router.push(`/repair/${id}`)
}

const goToEquipmentRepairs = (equipmentId) => {
  showDetailModal.value = false
  router.push({ path: '/repair', query: { equipment: equipmentId } })
}

const resetForm = () => {
  form.name = ''
  form.type = ''
  form.buildingId = ''
  form.location = ''
  form.specifications = ''
  formError.value = ''
}

const closeAddModal = () => {
  showAddModal.value = false
  resetForm()
}

const addEquipment = () => {
  formError.value = ''
  
  if (!form.name.trim()) {
    formError.value = '请输入设备名称'
    return
  }
  if (!form.type) {
    formError.value = '请选择设备类型'
    return
  }
  if (!form.buildingId) {
    formError.value = '请选择所属楼栋'
    return
  }
  if (!form.location.trim()) {
    formError.value = '请输入安装位置'
    return
  }

  const newEquipment = {
    id: `EQ${String(store.state.equipmentList.length + 1).padStart(3, '0')}`,
    name: form.name.trim(),
    type: form.type,
    buildingId: form.buildingId,
    location: form.location.trim(),
    installDate: new Date().toISOString().slice(0, 10),
    status: 'normal',
    specifications: form.specifications.trim() || null,
    lastRepairDate: null,
    lastInspectionDate: null
  }

  store.addEquipment(newEquipment)
  closeAddModal()
  showToast('设备添加成功')
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
