<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button @click="goBack" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">搬家预约登记</h1>
          <p class="text-sm text-gray-500 mt-1">请填写详细的搬家信息，提交后等待物业审核</p>
        </div>
      </div>
      <span class="badge bg-blue-100 text-blue-700 text-sm">
        预约号将自动生成
      </span>
    </div>

    <div v-if="validationErrors.length > 0" class="card p-4 bg-red-50 border border-red-200">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <h3 class="text-sm font-medium text-red-800 mb-2">请检查以下问题：</h3>
          <ul class="text-sm text-red-600 space-y-1">
            <li v-for="(error, idx) in validationErrors" :key="idx" class="flex items-start">
              <span class="text-red-500 mr-2">•</span>
              {{ error }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="card p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-5 flex items-center">
        <span class="w-1 h-5 bg-primary-500 rounded-full mr-3"></span>
        基本信息
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            搬家类型 <span class="text-red-500">*</span>
          </label>
          <select v-model="form.movingType" class="select">
            <option value="">请选择搬家类型</option>
            <option v-for="t in movingTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
          <p class="text-xs text-gray-500 mt-1">请选择搬入或搬出</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            楼栋 <span class="text-red-500">*</span>
          </label>
          <select v-model="form.buildingId" class="select">
            <option value="">请选择楼栋</option>
            <option v-for="b in store.state.buildings" :key="b.id" :value="b.id">{{ b.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            房号 <span class="text-red-500">*</span>
          </label>
          <input v-model="form.roomNumber" type="text" class="input" placeholder="如：1501" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            业主姓名 <span class="text-red-500">*</span>
          </label>
          <input v-model="form.ownerName" type="text" class="input" placeholder="请输入业主姓名" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            业主联系电话 <span class="text-red-500">*</span>
          </label>
          <input v-model="form.ownerPhone" type="tel" class="input" placeholder="请输入业主手机号" maxlength="11" />
          <p v-if="form.ownerPhone && !phoneRegex.test(form.ownerPhone)" class="text-xs text-red-500 mt-1">
            请输入正确的11位手机号码
          </p>
        </div>
      </div>
    </div>

    <div class="card p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-5 flex items-center">
        <span class="w-1 h-5 bg-primary-500 rounded-full mr-3"></span>
        联系人信息
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            联系人姓名 <span class="text-red-500">*</span>
          </label>
          <input v-model="form.contactName" type="text" class="input" placeholder="请输入联系人姓名" />
          <p class="text-xs text-gray-500 mt-1">现场联系人，与业主可以是同一人</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            联系人电话 <span class="text-red-500">*</span>
          </label>
          <input v-model="form.contactPhone" type="tel" class="input" placeholder="请输入联系人手机号" maxlength="11" />
          <p v-if="form.contactPhone && !phoneRegex.test(form.contactPhone)" class="text-xs text-red-500 mt-1">
            请输入正确的11位手机号码
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            同行人数 <span class="text-red-500">*</span>
          </label>
          <input v-model.number="form.companionCount" type="number" class="input" min="1" placeholder="请输入同行人数" />
          <p class="text-xs text-gray-500 mt-1">包括搬运工人，最少1人</p>
        </div>
      </div>
    </div>

    <div class="card p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-5 flex items-center">
        <span class="w-1 h-5 bg-primary-500 rounded-full mr-3"></span>
        搬家时间
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            开始时间 <span class="text-red-500">*</span>
          </label>
          <input v-model="form.moveStartDate" type="date" class="input mb-2" />
          <input v-model="form.moveStartTime" type="time" class="input" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            结束时间 <span class="text-red-500">*</span>
          </label>
          <input v-model="form.moveEndDate" type="date" class="input mb-2" />
          <input v-model="form.moveEndTime" type="time" class="input" />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">时间说明</label>
          <div class="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p class="text-sm text-blue-700">
              <span class="font-medium">温馨提示：</span>
              搬家需在规定时间段内完成，超时可能产生费用。请确保结束时间晚于开始时间。
              小区搬家时间一般为 8:00 - 20:00，请合理安排。
            </p>
          </div>
          <div v-if="timeError" class="p-3 bg-red-50 rounded-lg border border-red-200 mt-3">
            <p class="text-sm text-red-700 flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {{ timeError }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="card p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-5 flex items-center">
        <span class="w-1 h-5 bg-primary-500 rounded-full mr-3"></span>
        车辆信息
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            搬运车辆数 <span class="text-red-500">*</span>
          </label>
          <input v-model.number="form.vehicleCount" type="number" class="input" min="1" placeholder="请输入车辆数" />
          <p class="text-xs text-gray-500 mt-1">最少1辆</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            搬运工人数
          </label>
          <input v-model.number="form.workerCount" type="number" class="input" min="0" placeholder="请输入工人数" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            车牌号码 <span class="text-red-500">*</span>
          </label>
          <input v-model="form.plateNumber" type="text" class="input" placeholder="如：粤B12345" />
          <p class="text-xs text-gray-500 mt-1">主要车辆车牌号</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            搬家公司
          </label>
          <input v-model="form.movingCompany" type="text" class="input" placeholder="请输入搬家公司名称" />
        </div>
      </div>
    </div>

    <div class="card p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-5 flex items-center">
        <span class="w-1 h-5 bg-primary-500 rounded-full mr-3"></span>
        物品清单
      </h2>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">主要搬运物品</label>
        <div class="flex flex-wrap gap-2 mb-3">
          <span 
            v-for="(item, idx) in form.declaredItems" 
            :key="idx"
            class="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm flex items-center"
          >
            {{ item }}
            <button @click="removeItem(idx)" class="ml-2 text-primary-500 hover:text-primary-700">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        </div>
        <div class="flex gap-2">
          <input 
            v-model="newItemInput" 
            type="text" 
            class="input flex-1" 
            placeholder="输入物品名称，如：沙发、冰箱..."
            @keyup.enter="addItem"
          />
          <button @click="addItem" class="btn-secondary">
            添加
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-2">请尽量详细申报搬运物品，便于现场核验</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <button 
          v-for="item in suggestedItems" 
          :key="item"
          @click="toggleSuggestedItem(item)"
          type="button"
          class="p-2.5 border rounded-lg text-sm hover:border-primary-300 hover:bg-primary-50 transition-colors"
          :class="form.declaredItems.includes(item) ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200'"
        >
          {{ item }}
        </button>
      </div>
    </div>

    <div class="card p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-5 flex items-center">
        <span class="w-1 h-5 bg-primary-500 rounded-full mr-3"></span>
        押金与备注
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            预估押金 <span class="text-red-500">*</span>
          </label>
          <select v-model.number="form.depositAmount" class="select">
            <option v-for="opt in depositAmountOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <p class="text-xs text-gray-500 mt-1">实际以现场审核为准，搬家完成后退还</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">特殊说明</label>
          <input v-model="form.specialNote" type="text" class="input" placeholder="如有特殊需求请填写" />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">备注信息</label>
          <textarea v-model="form.remark" class="textarea h-24" placeholder="请填写其他需要说明的内容..."></textarea>
        </div>
      </div>
    </div>

    <div class="flex justify-end space-x-4 pt-4 pb-8">
      <button @click="goBack" class="btn-secondary px-8">
        取消
      </button>
      <button @click="submitForm" class="btn-primary px-8">
        <span class="flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          提交预约
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { useStore, movingTypes, depositAmountOptions } from '../../store'

const router = useRouter()
const showToast = inject('showToast')
const store = useStore()

const phoneRegex = /^1[3-9]\d{9}$/

const form = reactive({
  movingType: 'move_in',
  buildingId: '',
  roomNumber: '',
  ownerName: '',
  ownerPhone: '',
  contactName: '',
  contactPhone: '',
  companionCount: 3,
  moveStartDate: '',
  moveStartTime: '08:00',
  moveEndDate: '',
  moveEndTime: '18:00',
  vehicleCount: 1,
  workerCount: 3,
  plateNumber: '',
  movingCompany: '',
  declaredItems: [],
  depositAmount: 1000,
  specialNote: '',
  remark: ''
})

const newItemInput = ref('')
const validationErrors = ref([])

const suggestedItems = [
  '沙发', '床垫', '冰箱', '洗衣机', '空调', '电视柜', '餐桌', '衣柜'
]

const timeError = computed(() => {
  if (!form.moveStartDate || !form.moveEndDate || !form.moveStartTime || !form.moveEndTime) {
    return ''
  }
  const start = dayjs(`${form.moveStartDate} ${form.moveStartTime}`)
  const end = dayjs(`${form.moveEndDate} ${form.moveEndTime}`)
  if (!start.isValid() || !end.isValid()) return ''
  
  if (end.isBefore(start)) {
    return '结束时间不能早于开始时间，请重新设置'
  }
  if (end.diff(start, 'minute') < 30) {
    return '搬家时长不能少于30分钟'
  }
  return ''
})

const goBack = () => {
  router.back()
}

const addItem = () => {
  const item = newItemInput.value.trim()
  if (item && !form.declaredItems.includes(item)) {
    form.declaredItems.push(item)
    newItemInput.value = ''
  }
}

const removeItem = (index) => {
  form.declaredItems.splice(index, 1)
}

const toggleSuggestedItem = (item) => {
  const idx = form.declaredItems.indexOf(item)
  if (idx > -1) {
    form.declaredItems.splice(idx, 1)
  } else {
    form.declaredItems.push(item)
  }
}

const validateForm = () => {
  const errors = []
  
  if (!form.movingType) {
    errors.push('请选择搬家类型')
  }
  if (!form.buildingId) {
    errors.push('请选择楼栋')
  }
  if (!form.roomNumber.trim()) {
    errors.push('请填写房号')
  }
  if (!form.ownerName.trim()) {
    errors.push('请填写业主姓名')
  }
  if (!form.ownerPhone) {
    errors.push('请填写业主联系电话')
  } else if (!phoneRegex.test(form.ownerPhone)) {
    errors.push('业主联系电话格式不正确，请输入11位手机号')
  }
  
  if (!form.contactName.trim()) {
    errors.push('请填写联系人姓名')
  }
  if (!form.contactPhone) {
    errors.push('请填写联系人电话')
  } else if (!phoneRegex.test(form.contactPhone)) {
    errors.push('联系人电话格式不正确，请输入11位手机号')
  }
  
  if (!form.companionCount || form.companionCount < 1) {
    errors.push('同行人数不能小于1')
  }
  
  if (!form.moveStartDate) {
    errors.push('请选择开始日期')
  }
  if (!form.moveStartTime) {
    errors.push('请选择开始时间')
  }
  if (!form.moveEndDate) {
    errors.push('请选择结束日期')
  }
  if (!form.moveEndTime) {
    errors.push('请选择结束时间')
  }
  if (timeError.value) {
    errors.push(timeError.value)
  }
  
  if (!form.vehicleCount || form.vehicleCount < 1) {
    errors.push('搬运车辆数不能小于1')
  }
  if (!form.plateNumber.trim()) {
    errors.push('请填写车牌号码')
  }
  
  if (!form.depositAmount || form.depositAmount <= 0) {
    errors.push('请选择押金金额')
  }
  
  return errors
}

const submitForm = () => {
  const errors = validateForm()
  if (errors.length > 0) {
    validationErrors.value = errors
    showToast('请检查表单填写内容', 'error')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  
  const submitData = {
    movingType: form.movingType,
    buildingId: form.buildingId,
    roomNumber: form.roomNumber.trim(),
    ownerName: form.ownerName.trim(),
    ownerPhone: form.ownerPhone.trim(),
    contactName: form.contactName.trim(),
    contactPhone: form.contactPhone.trim(),
    companionCount: form.companionCount,
    moveStartTime: `${form.moveStartDate} ${form.moveStartTime}`,
    moveEndTime: `${form.moveEndDate} ${form.moveEndTime}`,
    vehicleCount: form.vehicleCount,
    workerCount: form.workerCount || 0,
    plateNumber: form.plateNumber.trim(),
    movingCompany: form.movingCompany.trim(),
    declaredItems: [...form.declaredItems],
    depositAmount: form.depositAmount,
    specialNote: form.specialNote.trim(),
    remark: form.remark.trim()
  }
  
  const result = store.createMovingRecord(submitData)
  
  if (result.success) {
    showToast('预约提交成功，等待审核', 'success')
    setTimeout(() => {
      router.push(`/moving/${result.record.id}`)
    }, 800)
  } else {
    showToast(result.message || '提交失败，请重试', 'error')
  }
}

onMounted(() => {
  const today = dayjs().format('YYYY-MM-DD')
  form.moveStartDate = today
  form.moveEndDate = today
})
</script>
