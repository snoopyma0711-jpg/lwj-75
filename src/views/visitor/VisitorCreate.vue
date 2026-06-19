<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ isEdit ? '编辑预约' : '新增来访预约' }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ isEdit ? '修改访客预约信息' : '登记新的访客预约' }}</p>
      </div>
      <router-link to="/visitor" class="btn-secondary">
        <span class="flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回列表
        </span>
      </router-link>
    </div>

    <div v-if="isEdit && editRecord" class="card p-4 bg-blue-50 border-blue-100">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-blue-800">当前状态：<span class="badge" :class="visitorStatusColorMap[editRecord.status]">{{ visitorStatusMap[editRecord.status] }}</span></p>
          <p class="text-xs text-blue-600 mt-1">预约号：{{ editRecord.id }} · 创建时间：{{ editRecord.createTime }}</p>
        </div>
      </div>
    </div>

    <div class="card p-6">
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b flex items-center">
                <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                来访人信息
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    来访人姓名 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.visitorName"
                    type="text"
                    class="input"
                    :class="{ 'border-red-400': errors.visitorName }"
                    placeholder="请输入来访人姓名"
                    @input="clearError('visitorName')"
                  />
                  <p v-if="errors.visitorName" class="text-red-500 text-xs mt-1 flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ errors.visitorName }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    联系电话 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.visitorPhone"
                    type="tel"
                    class="input"
                    :class="{ 'border-red-400': errors.visitorPhone }"
                    placeholder="请输入11位手机号"
                    maxlength="11"
                    @input="clearError('visitorPhone')"
                  />
                  <p v-if="errors.visitorPhone" class="text-red-500 text-xs mt-1 flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ errors.visitorPhone }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    同行人数 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.number="form.companionCount"
                    type="number"
                    min="0"
                    max="20"
                    class="input"
                    :class="{ 'border-red-400': errors.companionCount }"
                    placeholder="0"
                    @input="clearError('companionCount')"
                  />
                  <p v-if="errors.companionCount" class="text-red-500 text-xs mt-1 flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ errors.companionCount }}
                  </p>
                  <p class="text-gray-400 text-xs mt-1">不含来访人本人，无同行请填0</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    车牌号（选填）
                  </label>
                  <input
                    v-model="form.plateNumber"
                    type="text"
                    class="input"
                    :class="{ 'border-red-400': errors.plateNumber }"
                    placeholder="如：京A12345"
                    @input="clearError('plateNumber')"
                  />
                  <p v-if="errors.plateNumber" class="text-red-500 text-xs mt-1 flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ errors.plateNumber }}
                  </p>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    身份证号（选填）
                  </label>
                  <input
                    v-model="form.idCard"
                    type="text"
                    class="input"
                    placeholder="用于访客身份核验，选填"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b flex items-center">
                <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                来访时间与事由
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    到访时间 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.visitTime"
                    type="datetime-local"
                    class="input"
                    :class="{ 'border-red-400': errors.visitTime }"
                    @input="clearError('visitTime')"
                  />
                  <p v-if="errors.visitTime" class="text-red-500 text-xs mt-1 flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ errors.visitTime }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    预计离场时间 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.endTime"
                    type="datetime-local"
                    class="input"
                    :class="{ 'border-red-400': errors.endTime }"
                    @input="clearError('endTime')"
                  />
                  <p v-if="errors.endTime" class="text-red-500 text-xs mt-1 flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ errors.endTime }}
                  </p>
                  <p class="text-gray-400 text-xs mt-1">单次来访最长不超过12小时</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    来访事由 <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.purpose"
                    class="select"
                  >
                    <option value="">请选择来访事由</option>
                    <option v-for="p in visitorPurposes" :key="p.value" :value="p.value">{{ p.label }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    事由详情（选填）
                  </label>
                  <input
                    v-model="form.purposeDetail"
                    type="text"
                    class="input"
                    placeholder="如：XX快递、XX维修、公司名等"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b flex items-center">
                <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                被访人信息
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    选择楼栋 <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.buildingId"
                    class="select"
                    @change="onBuildingChange"
                  >
                    <option value="">请选择楼栋</option>
                    <option v-for="b in store.state.buildings" :key="b.id" :value="b.id">{{ b.name }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    拜访房号 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.roomNumber"
                    type="text"
                    class="input"
                    :class="{ 'border-red-400': errors.roomNumber }"
                    placeholder="如：1单元1501室"
                    @input="clearError('roomNumber')"
                  />
                  <p v-if="errors.roomNumber" class="text-red-500 text-xs mt-1 flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ errors.roomNumber }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    被访人姓名 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.hostName"
                    type="text"
                    class="input"
                    :class="{ 'border-red-400': errors.hostName }"
                    placeholder="请输入被访人姓名"
                    @input="clearError('hostName')"
                  />
                  <p v-if="errors.hostName" class="text-red-500 text-xs mt-1 flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ errors.hostName }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    被访人电话 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.hostPhone"
                    type="tel"
                    class="input"
                    :class="{ 'border-red-400': errors.hostPhone }"
                    placeholder="请输入11位手机号"
                    maxlength="11"
                    @input="clearError('hostPhone')"
                  />
                  <p v-if="errors.hostPhone" class="text-red-500 text-xs mt-1 flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ errors.hostPhone }}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b flex items-center">
                <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                备注信息
              </h3>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  物业备注（选填）
                </label>
                <textarea
                  v-model="form.remark"
                  class="textarea h-24"
                  placeholder="请输入需要特别说明的信息，如：携带大件物品、需要帮助等..."
                ></textarea>
              </div>
            </div>

            <div v-if="Object.keys(errors).length > 0" class="p-4 bg-red-50 border border-red-100 rounded-lg">
              <h4 class="text-sm font-medium text-red-800 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                请检查以下问题：
              </h4>
              <ul class="text-xs text-red-600 space-y-1">
                <li v-for="(msg, key) in errors" :key="key" class="flex items-start">
                  <span class="mr-1">·</span>{{ msg }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t flex justify-end space-x-3">
          <router-link to="/visitor" class="btn-secondary">取消</router-link>
          <button type="submit" class="btn-primary px-8">
            <span class="flex items-center">
              <svg v-if="isEdit" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              {{ isEdit ? '保存修改' : '提交预约' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { useStore, visitorPurposes, visitorStatusMap, visitorStatusColorMap } from '../../store'

const router = useRouter()
const route = useRoute()
const showToast = inject('showToast')
const currentRole = inject('currentRole')
const store = useStore()

const isEdit = computed(() => !!route.query.id)
const editRecord = ref(null)

const form = reactive({
  visitorName: '',
  visitorPhone: '',
  companionCount: 0,
  plateNumber: '',
  idCard: '',
  visitTime: '',
  endTime: '',
  purpose: '',
  purposeDetail: '',
  buildingId: '',
  roomNumber: '',
  hostName: '',
  hostPhone: '',
  remark: ''
})

const errors = reactive({})

onMounted(() => {
  if (isEdit.value) {
    const record = store.getVisitorById(route.query.id)
    if (record) {
      editRecord.value = record
      Object.assign(form, {
        visitorName: record.visitorName,
        visitorPhone: record.visitorPhone,
        companionCount: record.companionCount,
        plateNumber: record.plateNumber,
        idCard: record.idCard || '',
        visitTime: record.visitTime ? record.visitTime.replace(' ', 'T') : '',
        endTime: record.endTime ? record.endTime.replace(' ', 'T') : '',
        purpose: record.purpose,
        purposeDetail: record.purposeDetail || '',
        buildingId: record.buildingId,
        roomNumber: record.roomNumber,
        hostName: record.hostName,
        hostPhone: record.hostPhone,
        remark: record.remark || ''
      })
    } else {
      showToast('未找到该预约记录', 'error')
      router.push('/visitor')
    }
  } else {
    const now = dayjs('2026-06-17 10:00:00')
    form.visitTime = now.format('YYYY-MM-DDTHH:mm')
    form.endTime = now.add(3, 'hour').format('YYYY-MM-DDTHH:mm')
  }
})

const onBuildingChange = () => {
  if (form.buildingId && !form.roomNumber) {
    const building = store.state.buildings.find(b => b.id === form.buildingId)
    if (building) {
      form.roomNumber = building.name + '1单元'
    }
  }
}

const clearError = (field) => {
  if (errors[field]) {
    delete errors[field]
  }
}

const validateForm = () => {
  Object.keys(errors).forEach(k => delete errors[k])
  
  const formData = {
    ...form,
    visitTime: form.visitTime ? form.visitTime.replace('T', ' ') : '',
    endTime: form.endTime ? form.endTime.replace('T', ' ') : ''
  }
  
  const validateErrors = store.validateVisitorForm(formData)
  
  if (!form.purpose) {
    validateErrors.purpose = '请选择来访事由'
  }
  if (!form.buildingId) {
    validateErrors.buildingId = '请选择楼栋'
  }
  
  Object.assign(errors, validateErrors)
  
  return Object.keys(errors).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) {
    showToast('请检查表单填写是否正确', 'error')
    return
  }

  const submitData = {
    visitorName: form.visitorName.trim(),
    visitorPhone: form.visitorPhone.trim(),
    companionCount: Number(form.companionCount),
    plateNumber: form.plateNumber.trim().toUpperCase(),
    idCard: form.idCard.trim(),
    visitTime: form.visitTime.replace('T', ' '),
    endTime: form.endTime.replace('T', ' '),
    purpose: form.purpose,
    purposeDetail: form.purposeDetail.trim(),
    buildingId: form.buildingId,
    roomNumber: form.roomNumber.trim(),
    hostName: form.hostName.trim(),
    hostPhone: form.hostPhone.trim(),
    remark: form.remark.trim(),
    createOperator: getOperatorName()
  }

  if (isEdit.value) {
    const result = store.updateVisitorRecord(route.query.id, {
      ...submitData,
      updateOperator: getOperatorName()
    })
    if (result) {
      showToast('修改成功', 'success')
      router.push(`/visitor/${route.query.id}`)
    } else {
      showToast('修改失败，请重试', 'error')
    }
  } else {
    const newRecord = store.createVisitorRecord(submitData)
    if (newRecord) {
      showToast('预约提交成功，待审核', 'success')
      router.push(`/visitor/${newRecord.id}`)
    } else {
      showToast('提交失败，请重试', 'error')
    }
  }
}

const getOperatorName = () => {
  const roleMap = {
    service: '张客服（前台登记）',
    engineer: '李工程师',
    housekeeper: '楼栋管家-小赵（代登记）',
    security: '安保-陈队长（代登记）'
  }
  return roleMap[currentRole.value] || '操作员'
}
</script>
