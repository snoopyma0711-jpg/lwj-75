<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">新增报修</h1>
        <p class="text-sm text-gray-500 mt-1">登记住户报修信息</p>
      </div>
      <router-link to="/repair" class="btn-secondary">返回列表</router-link>
    </div>

    <div class="card p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              房号 <span class="text-red-500">*</span>
            </label>
            <div class="flex space-x-2">
              <select v-model="form.buildingId" class="select flex-1" :class="{ 'border-red-500': errors.buildingId }">
                <option value="">请选择楼栋</option>
                <option v-for="b in store.state.buildings" :key="b.id" :value="b.id">{{ b.name }}</option>
              </select>
              <input
                v-model="form.roomNumber"
                type="text"
                class="input flex-1"
                :class="{ 'border-red-500': errors.roomNumber }"
                placeholder="如：1单元1501室"
              />
            </div>
            <p v-if="errors.buildingId || errors.roomNumber" class="text-red-500 text-xs mt-1">请选择楼栋并填写房号</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              联系人 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.contactName"
              type="text"
              class="input"
              :class="{ 'border-red-500': errors.contactName }"
              placeholder="请输入联系人姓名"
            />
            <p v-if="errors.contactName" class="text-red-500 text-xs mt-1">{{ errors.contactName }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              联系电话 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.contactPhone"
              type="tel"
              class="input"
              :class="{ 'border-red-500': errors.contactPhone }"
              placeholder="请输入手机号码"
              maxlength="11"
            />
            <p v-if="errors.contactPhone" class="text-red-500 text-xs mt-1">{{ errors.contactPhone }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              报修分类 <span class="text-red-500">*</span>
            </label>
            <select v-model="form.category" class="select" :class="{ 'border-red-500': errors.category }">
              <option value="">请选择分类</option>
              <option v-for="c in repairCategories" :key="c.value" :value="c.value">{{ c.label }}</option>
            </select>
            <p v-if="errors.category" class="text-red-500 text-xs mt-1">请选择报修分类</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              期望上门时间
            </label>
            <input
              v-model="form.expectedTime"
              type="text"
              class="input"
              placeholder="如：2026-06-17 14:00-16:00"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              紧急程度 <span class="text-red-500">*</span>
            </label>
            <div class="flex space-x-4">
              <label
                v-for="u in urgentLevels"
                :key="u.value"
                class="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  v-model="form.urgency"
                  :value="u.value"
                  class="w-4 h-4 text-primary-600"
                />
                <span
                  class="text-sm"
                  :class="{
                    'text-red-600 font-medium': u.value === 'high',
                    'text-yellow-600 font-medium': u.value === 'medium',
                    'text-gray-700': u.value === 'low'
                  }"
                >{{ u.label }}</span>
              </label>
            </div>
            <p v-if="errors.urgency" class="text-red-500 text-xs mt-1">请选择紧急程度</p>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            问题描述 <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.description"
            class="textarea h-28"
            :class="{ 'border-red-500': errors.description }"
            placeholder="请详细描述遇到的问题..."
          ></textarea>
          <p class="text-gray-400 text-xs mt-1">{{ form.description.length }}/500字</p>
          <p v-if="errors.description" class="text-red-500 text-xs mt-1">{{ errors.description }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">备注</label>
          <textarea
            v-model="form.remarks"
            class="textarea h-20"
            placeholder="其他需要说明的信息..."
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3 pt-4 border-t">
          <router-link to="/repair" class="btn-secondary">取消</router-link>
          <button type="submit" class="btn-primary">提交报修</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useStore, repairCategories, urgentLevels } from '../../store'

const router = useRouter()
const showToast = inject('showToast')
const store = useStore()

const form = reactive({
  buildingId: '',
  roomNumber: '',
  contactName: '',
  contactPhone: '',
  category: '',
  description: '',
  expectedTime: '',
  urgency: '',
  remarks: ''
})

const errors = reactive({
  buildingId: false,
  roomNumber: false,
  contactName: '',
  contactPhone: '',
  category: false,
  description: '',
  urgency: false
})

const validatePhone = (phone) => {
  return /^1[3-9]\d{9}$/.test(phone)
}

const validate = () => {
  let valid = true
  
  errors.buildingId = !form.buildingId
  errors.roomNumber = !form.roomNumber.trim()
  errors.category = !form.category
  errors.urgency = !form.urgency
  
  if (!form.contactName.trim()) {
    errors.contactName = '请输入联系人姓名'
    valid = false
  } else {
    errors.contactName = ''
  }
  
  if (!form.contactPhone.trim()) {
    errors.contactPhone = '请输入联系电话'
    valid = false
  } else if (!validatePhone(form.contactPhone)) {
    errors.contactPhone = '请输入正确的手机号码'
    valid = false
  } else {
    errors.contactPhone = ''
  }
  
  if (!form.description.trim()) {
    errors.description = '请描述遇到的问题'
    valid = false
  } else if (form.description.length < 5) {
    errors.description = '问题描述至少5个字'
    valid = false
  } else {
    errors.description = ''
  }
  
  if (errors.buildingId || errors.roomNumber || errors.category || errors.urgency) {
    valid = false
  }
  
  return valid
}

const handleSubmit = () => {
  if (!validate()) {
    showToast('请检查填写的信息', 'error')
    return
  }
  
  const building = store.state.buildings.find(b => b.id === form.buildingId)
  const orderData = {
    ...form,
    roomNumber: `${building.name}${form.roomNumber}`
  }
  
  const newOrder = store.createRepairOrder(orderData)
  
  if (newOrder) {
    showToast('报修提交成功', 'success')
    router.push(`/repair/${newOrder.id}`)
  } else {
    showToast('提交失败，请重试', 'error')
  }
}
</script>
