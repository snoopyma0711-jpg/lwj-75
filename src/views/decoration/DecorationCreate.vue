<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">装修申请登记</h1>
        <p class="text-sm text-gray-500 mt-1">请填写装修申请相关信息，带 <span class="text-red-500">*</span> 为必填项</p>
      </div>
      <router-link to="/decoration" class="btn-secondary">
        <span class="flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回列表
        </span>
      </router-link>
    </div>

    <div class="card p-6">
      <div class="space-y-6">
        <div class="border-b border-gray-200 pb-4">
          <h3 class="text-lg font-medium text-gray-900 flex items-center">
            <svg class="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            房屋信息
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              楼栋 <span class="text-red-500">*</span>
            </label>
            <select 
              v-model="form.buildingId" 
              class="select"
              :class="{ 'border-red-500': errors.buildingId }"
              @change="errors.buildingId = ''"
            >
              <option value="">请选择楼栋</option>
              <option v-for="b in store.state.buildings" :key="b.id" :value="b.id">{{ b.name }}</option>
            </select>
            <p v-if="errors.buildingId" class="text-red-500 text-xs mt-1">{{ errors.buildingId }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              房号 <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="form.roomNumber" 
              type="text" 
              class="input"
              :class="{ 'border-red-500': errors.roomNumber }"
              placeholder="例如：1单元1501室"
              @input="errors.roomNumber = ''"
            />
            <p v-if="errors.roomNumber" class="text-red-500 text-xs mt-1">{{ errors.roomNumber }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              业主姓名 <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="form.ownerName" 
              type="text" 
              class="input"
              :class="{ 'border-red-500': errors.ownerName }"
              placeholder="请输入业主姓名"
              @input="errors.ownerName = ''"
            />
            <p v-if="errors.ownerName" class="text-red-500 text-xs mt-1">{{ errors.ownerName }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              业主电话 <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="form.ownerPhone" 
              type="tel" 
              class="input"
              :class="{ 'border-red-500': errors.ownerPhone }"
              placeholder="请输入手机号码"
              @input="errors.ownerPhone = ''"
            />
            <p v-if="errors.ownerPhone" class="text-red-500 text-xs mt-1">{{ errors.ownerPhone }}</p>
          </div>
        </div>

        <div class="border-b border-gray-200 pb-4 mt-8">
          <h3 class="text-lg font-medium text-gray-900 flex items-center">
            <svg class="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            装修信息
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              装修类型 <span class="text-red-500">*</span>
            </label>
            <select 
              v-model="form.decorationType" 
              class="select"
              :class="{ 'border-red-500': errors.decorationType }"
              @change="errors.decorationType = ''"
            >
              <option value="">请选择装修类型</option>
              <option v-for="t in store.state.decorationTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
            </select>
            <p v-if="errors.decorationType" class="text-red-500 text-xs mt-1">{{ errors.decorationType }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              开始时间 <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="form.startDate" 
              type="date" 
              class="input"
              :class="{ 'border-red-500': errors.startDate }"
              @change="errors.startDate = ''; errors.endDate = ''"
            />
            <p v-if="errors.startDate" class="text-red-500 text-xs mt-1">{{ errors.startDate }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              结束时间 <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="form.endDate" 
              type="date" 
              class="input"
              :class="{ 'border-red-500': errors.endDate }"
              @change="errors.endDate = ''; validateDates()"
            />
            <p v-if="errors.endDate" class="text-red-500 text-xs mt-1">{{ errors.endDate }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              押金金额（元） <span class="text-red-500">*</span>
            </label>
            <input 
              v-model.number="form.depositAmount" 
              type="number" 
              class="input"
              :class="{ 'border-red-500': errors.depositAmount }"
              placeholder="请输入押金金额"
              min="0"
              @input="errors.depositAmount = ''"
            />
            <p v-if="errors.depositAmount" class="text-red-500 text-xs mt-1">{{ errors.depositAmount }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              是否已缴纳押金
            </label>
            <select v-model="form.depositPaid" class="select">
              <option :value="true">已缴纳</option>
              <option :value="false">未缴纳</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              装修内容 <span class="text-red-500">*</span>
            </label>
            <textarea 
              v-model="form.decorationContent" 
              class="textarea h-28"
              :class="{ 'border-red-500': errors.decorationContent }"
              placeholder="请详细描述装修内容，例如：全屋装修，包括水电改造、墙面地面处理、吊顶、橱柜安装、门窗更换等..."
              @input="errors.decorationContent = ''"
            ></textarea>
            <p v-if="errors.decorationContent" class="text-red-500 text-xs mt-1">{{ errors.decorationContent }}</p>
          </div>

          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              特殊要求
            </label>
            <textarea 
              v-model="form.specialRequirements" 
              class="textarea h-20"
              placeholder="例如：节假日不施工，工作日施工时间8:00-12:00,14:00-18:00"
            ></textarea>
          </div>
        </div>

        <div class="border-b border-gray-200 pb-4 mt-8">
          <h3 class="text-lg font-medium text-gray-900 flex items-center">
            <svg class="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            施工单位信息
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              施工单位 <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="form.constructionCompany" 
              type="text" 
              class="input"
              :class="{ 'border-red-500': errors.constructionCompany }"
              placeholder="请输入施工单位名称"
              @input="errors.constructionCompany = ''"
            />
            <p v-if="errors.constructionCompany" class="text-red-500 text-xs mt-1">{{ errors.constructionCompany }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              施工许可证号
            </label>
            <input 
              v-model="form.constructionLicense" 
              type="text" 
              class="input"
              placeholder="请输入施工许可证号"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              施工负责人 <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="form.foremanName" 
              type="text" 
              class="input"
              :class="{ 'border-red-500': errors.foremanName }"
              placeholder="请输入施工负责人姓名"
              @input="errors.foremanName = ''"
            />
            <p v-if="errors.foremanName" class="text-red-500 text-xs mt-1">{{ errors.foremanName }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              负责人电话 <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="form.foremanPhone" 
              type="tel" 
              class="input"
              :class="{ 'border-red-500': errors.foremanPhone }"
              placeholder="请输入负责人手机号码"
              @input="errors.foremanPhone = ''"
            />
            <p v-if="errors.foremanPhone" class="text-red-500 text-xs mt-1">{{ errors.foremanPhone }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              施工人数 <span class="text-red-500">*</span>
            </label>
            <input 
              v-model.number="form.workerCount" 
              type="number" 
              class="input"
              :class="{ 'border-red-500': errors.workerCount }"
              placeholder="请输入施工人数"
              min="1"
              @input="errors.workerCount = ''"
            />
            <p v-if="errors.workerCount" class="text-red-500 text-xs mt-1">{{ errors.workerCount }}</p>
          </div>
        </div>

        <div class="border-b border-gray-200 pb-4 mt-8">
          <h3 class="text-lg font-medium text-gray-900 flex items-center">
            <svg class="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            提交材料清单
          </h3>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="(material, index) in form.materialList" :key="index" class="flex items-center space-x-3">
              <input 
                v-model="material.provided" 
                type="checkbox" 
                :id="'material-' + index"
                class="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <label :for="'material-' + index" class="text-sm text-gray-700">
                {{ material.name }}
              </label>
              <span v-if="!material.provided" class="text-xs text-yellow-600">(待提供)</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-6 border-t">
          <router-link to="/decoration" class="btn-secondary">
            取消
          </router-link>
          <button @click="validateAndSubmit" class="btn-primary">
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              提交申请
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { useStore } from '../../store'

const router = useRouter()
const store = useStore()

const form = reactive({
  buildingId: '',
  roomNumber: '',
  ownerName: '',
  ownerPhone: '',
  decorationType: '',
  startDate: '',
  endDate: '',
  constructionCompany: '',
  constructionLicense: '',
  foremanName: '',
  foremanPhone: '',
  workerCount: null,
  depositAmount: null,
  depositPaid: true,
  depositPaidDate: dayjs().format('YYYY-MM-DD'),
  decorationContent: '',
  specialRequirements: '',
  materialList: [
    { name: '装修图纸及方案', provided: true },
    { name: '施工人员身份证复印件', provided: true },
    { name: '特种作业操作证', provided: false },
    { name: '防火责任书', provided: false }
  ]
})

const errors = reactive({
  buildingId: '',
  roomNumber: '',
  ownerName: '',
  ownerPhone: '',
  decorationType: '',
  startDate: '',
  endDate: '',
  constructionCompany: '',
  foremanName: '',
  foremanPhone: '',
  workerCount: '',
  depositAmount: '',
  decorationContent: ''
})

const validateDates = () => {
  if (form.startDate && form.endDate && dayjs(form.endDate).isBefore(dayjs(form.startDate))) {
    errors.endDate = '结束时间不能早于开始时间'
    return false
  }
  return true
}

const validateAndSubmit = () => {
  const validationErrors = store.validateDecorationForm(form)
  
  let hasError = false
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  Object.keys(validationErrors).forEach(key => {
    if (validationErrors[key]) {
      errors[key] = validationErrors[key]
      hasError = true
    }
  })
  
  if (!validateDates()) {
    hasError = true
  }
  
  if (hasError) {
    const toast = window.__VUE_TOAST__
    if (toast) {
      toast('请检查并完善表单信息', 'error')
    }
    return
  }
  
  const result = store.createDecorationRecord({
    ...form,
    buildingId: form.buildingId,
    roomNumber: form.roomNumber,
    ownerName: form.ownerName.trim(),
    ownerPhone: form.ownerPhone.trim(),
    decorationType: form.decorationType,
    startDate: form.startDate,
    endDate: form.endDate,
    constructionCompany: form.constructionCompany.trim(),
    constructionLicense: form.constructionLicense?.trim() || '',
    foremanName: form.foremanName.trim(),
    foremanPhone: form.foremanPhone.trim(),
    workerCount: Number(form.workerCount),
    depositAmount: Number(form.depositAmount),
    depositPaid: form.depositPaid,
    depositPaidDate: form.depositPaid ? form.depositPaidDate : null,
    decorationContent: form.decorationContent.trim(),
    specialRequirements: form.specialRequirements?.trim() || '',
    materialList: [...form.materialList]
  })
  
  if (result) {
    const toast = window.__VUE_TOAST__
    if (toast) {
      toast('装修申请提交成功，等待物业审核', 'success')
    }
    router.push('/decoration')
  } else {
    const toast = window.__VUE_TOAST__
    if (toast) {
      toast('提交失败，请重试', 'error')
    }
  }
}
</script>
