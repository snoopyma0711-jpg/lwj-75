<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <button @click="router.back()" class="btn-secondary btn-sm">
        <span class="flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回列表
        </span>
      </button>
      <div class="flex space-x-2">
        <button v-if="record && record.status === 'active'" @click="openReleaseModal" class="btn-warning btn-sm">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            临时放行
          </span>
        </button>
        <button v-if="record && record.status === 'active'" @click="openRemoveModal" class="btn-success btn-sm">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            移出黑名单
          </span>
        </button>
      </div>
    </div>

    <template v-if="record">
      <div class="card p-6">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div class="flex items-start space-x-4">
            <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-3 mb-2">
                <h1 class="text-2xl font-bold text-gray-900">{{ record.visitorName }}</h1>
                <span class="badge" :class="blacklistStatusColorMap[record.status]">
                  {{ blacklistStatusMap[record.status] }}
                </span>
              </div>
              <div class="text-sm text-gray-500 space-y-1">
                <p><span class="text-gray-400">黑名单编号：</span><span class="font-mono text-red-600">{{ record.id }}</span></p>
                <p><span class="text-gray-400">联系电话：</span>{{ record.visitorPhone }}</p>
                <p v-if="record.idCard"><span class="text-gray-400">身份证号：</span>{{ record.idCard }}</p>
              </div>
            </div>
          </div>
          <div class="text-sm text-gray-500 text-left md:text-right">
            <p><span class="text-gray-400">列入时间：</span>{{ record.createTime }}</p>
            <p><span class="text-gray-400">操作人：</span>{{ record.createOperator }}</p>
            <p v-if="record.reportSource"><span class="text-gray-400">信息来源：</span>{{ record.reportSource }}</p>
            <p v-if="record.complainant"><span class="text-gray-400">投诉人：</span>{{ record.complainant }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 space-y-6">
          <div class="card p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              列入原因
            </h2>
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <span class="badge bg-red-50 text-red-700">{{ getReasonLabel(record.reason) }}</span>
                <span v-if="record.complaintCount > 0" class="badge bg-red-100 text-red-700">投诉 {{ record.complaintCount }} 次</span>
              </div>
              <p class="text-gray-700 bg-gray-50 rounded-lg p-4 border border-gray-100">
                {{ record.reasonDetail }}
              </p>
            </div>
          </div>

          <div v-if="record.relatedVisitorIds && record.relatedVisitorIds.length > 0" class="card p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              关联预约记录 ({{ record.relatedVisitorIds.length }})
            </h2>
            <div class="space-y-2">
              <div v-for="(vid, index) in record.relatedVisitorIds" :key="index" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                <span class="font-mono text-sm text-blue-600">{{ vid }}</span>
                <button @click="goToVisitor(vid)" class="text-primary-600 hover:text-primary-800 text-sm font-medium">查看详情</button>
              </div>
            </div>
          </div>

          <div class="card p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              处理日志
            </h2>
            <div class="space-y-0">
              <div v-for="(log, index) in record.processLogs" :key="index" class="relative pl-6 pb-6 last:pb-0">
                <div v-if="index < record.processLogs.length - 1" class="absolute left-2 top-6 bottom-0 w-0.5 bg-gray-200"></div>
                <div class="absolute left-0 top-1 w-5 h-5 rounded-full bg-white border-2 border-purple-500 flex items-center justify-center">
                  <div class="w-2 h-2 rounded-full bg-purple-500"></div>
                </div>
                <div class="pt-0.5">
                  <div class="flex flex-wrap items-center gap-2 text-sm">
                    <span class="font-medium text-purple-600">{{ log.action }}</span>
                    <span class="text-gray-400">{{ log.time }}</span>
                    <span class="text-gray-500">操作人：{{ log.operator }}</span>
                  </div>
                  <p class="text-gray-700 mt-1 text-sm">{{ log.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="card p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">临时放行记录</h2>
            <div v-if="record.releaseRecords && record.releaseRecords.length > 0" class="space-y-3">
              <div v-for="rel in record.releaseRecords" :key="rel.id" class="p-3 rounded-lg border" :class="rel.used ? 'bg-gray-50 border-gray-200' : 'bg-yellow-50 border-yellow-200'">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-mono text-xs" :class="rel.used ? 'text-gray-500' : 'text-yellow-600'">{{ rel.id }}</span>
                  <span class="badge text-xs" :class="rel.used ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-700'">
                    {{ rel.used ? '已使用' : '待使用' }}
                  </span>
                </div>
                <div class="text-xs space-y-1 text-gray-600">
                  <p><span class="text-gray-400">访问时间：</span>{{ rel.visitTime }} - {{ rel.endTime }}</p>
                  <p><span class="text-gray-400">访问地点：</span>{{ getBuildingName(rel.buildingId) }} {{ rel.roomNumber }}</p>
                  <p><span class="text-gray-400">被访人：</span>{{ rel.hostName }}</p>
                  <p><span class="text-gray-400">审批人：</span>{{ rel.approvedBy }}</p>
                  <p><span class="text-gray-400">审批时间：</span>{{ rel.approveTime }}</p>
                  <p><span class="text-gray-400">有效期至：</span>{{ rel.expireTime }}</p>
                  <p class="pt-1 border-t border-dashed mt-1" :class="rel.used ? 'border-gray-200' : 'border-yellow-200'">
                    <span class="text-gray-400">审批原因：</span>{{ rel.approveReason }}
                  </p>
                  <p v-if="rel.usedRecordId" class="pt-1">
                    <span class="text-gray-400">使用记录：</span>
                    <button @click="goToVisitor(rel.usedRecordId)" class="text-primary-600 hover:underline">{{ rel.usedRecordId }}</button>
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <svg class="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-gray-500 text-sm">暂无临时放行记录</p>
            </div>
          </div>

          <div v-if="record.status === 'removed'" class="card p-6 bg-green-50 border-green-200">
            <h2 class="text-lg font-semibold text-green-800 mb-3">移出信息</h2>
            <div class="text-sm text-green-700 space-y-1">
              <p><span class="text-green-500">移出时间：</span>{{ record.removeTime }}</p>
              <p><span class="text-green-500">操作人：</span>{{ record.removeOperator }}</p>
              <p class="pt-2 border-t border-green-200 mt-2"><span class="text-green-500">移出原因：</span></p>
              <p>{{ record.removeReason }}</p>
            </div>
          </div>

          <div class="card p-6 bg-blue-50 border-blue-200">
            <h2 class="text-lg font-semibold text-blue-800 mb-3">安全提示</h2>
            <ul class="text-sm text-blue-700 space-y-2">
              <li class="flex items-start">
                <svg class="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                该访客再次预约时将被系统自动拦截
              </li>
              <li class="flex items-start">
                <svg class="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                临时放行仅在审批有效期内有效，且仅限一次使用
              </li>
              <li class="flex items-start">
                <svg class="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                如需永久解除限制，请使用移出黑名单功能
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>

    <EmptyState v-else title="记录不存在" description="该黑名单记录可能已被删除或编号错误">
      <template #action>
        <button @click="router.push('/blacklist')" class="btn-primary btn-sm">返回列表</button>
      </template>
    </EmptyState>

    <Transition name="fade">
      <div v-if="showRemoveModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            移出黑名单
          </h3>
          <div v-if="record" class="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
            <p class="text-sm"><span class="text-gray-500">黑名单编号：</span><span class="font-mono font-medium">{{ record.id }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">访客：</span><span class="font-medium">{{ record.visitorName }} · {{ record.visitorPhone }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">列入原因：</span><span class="font-medium">{{ getReasonLabel(record.reason) }}</span></p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">移出原因 <span class="text-red-500">*</span></label>
            <textarea v-model="removeForm.reason" class="textarea h-24" placeholder="请填写移出黑名单的原因..."></textarea>
          </div>
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button @click="showRemoveModal = false" class="btn-secondary">取消</button>
            <button @click="submitRemove" class="btn-success">确认移出</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showReleaseModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            临时放行审批
          </h3>
          <div v-if="record" class="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p class="text-sm"><span class="text-gray-500">黑名单编号：</span><span class="font-mono font-medium">{{ record.id }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">访客：</span><span class="font-medium">{{ record.visitorName }} · {{ record.visitorPhone }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">列入原因：</span><span class="font-medium">{{ getReasonLabel(record.reason) }}</span></p>
          </div>
          <div class="space-y-4">
            <h4 class="font-medium text-gray-900 pb-2 border-b">来访信息</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">到访时间 <span class="text-red-500">*</span></label>
                <input v-model="releaseForm.visitTime" type="datetime-local" class="input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">预计离场时间 <span class="text-red-500">*</span></label>
                <input v-model="releaseForm.endTime" type="datetime-local" class="input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">拜访楼栋 <span class="text-red-500">*</span></label>
                <select v-model="releaseForm.buildingId" class="select" @change="onBuildingChange">
                  <option value="">请选择楼栋</option>
                  <option v-for="b in store.state.buildings" :key="b.id" :value="b.id">{{ b.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">拜访房号 <span class="text-red-500">*</span></label>
                <input v-model="releaseForm.roomNumber" type="text" class="input" placeholder="如：1单元1501室" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">被访人姓名 <span class="text-red-500">*</span></label>
                <input v-model="releaseForm.hostName" type="text" class="input" placeholder="请输入被访人姓名" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">被访人电话 <span class="text-red-500">*</span></label>
                <input v-model="releaseForm.hostPhone" type="tel" class="input" placeholder="请输入11位手机号" maxlength="11" />
              </div>
            </div>
            <h4 class="font-medium text-gray-900 pt-4 pb-2 border-b">审批信息</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">审批人 <span class="text-red-500">*</span></label>
                <select v-model="releaseForm.approvedBy" class="select">
                  <option value="">请选择审批人</option>
                  <option value="物业经理-刘经理">物业经理-刘经理</option>
                  <option value="安保主管-陈主管">安保主管-陈主管</option>
                  <option value="客服主管-张主管">客服主管-张主管</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">有效期至 <span class="text-red-500">*</span></label>
                <input v-model="releaseForm.expireTime" type="datetime-local" class="input" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">审批原因 <span class="text-red-500">*</span></label>
                <textarea v-model="releaseForm.approveReason" class="textarea h-24" placeholder="请详细说明临时放行的原因和必要性..."></textarea>
              </div>
            </div>
            <div class="p-3 bg-red-50 rounded-lg border border-red-200">
              <p class="text-sm text-red-800 flex items-start">
                <svg class="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                临时放行仅在审批的有效期内有效，且仅限本次使用。放行后系统会自动记录使用情况。请严格审批，确保安全。
              </p>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button @click="showReleaseModal = false" class="btn-secondary">取消</button>
            <button @click="submitRelease" class="btn-primary">确认审批</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { useStore, blacklistReasons, blacklistStatusMap, blacklistStatusColorMap } from '../../store'
import EmptyState from '../../components/EmptyState.vue'

const router = useRouter()
const route = useRoute()
const showToast = inject('showToast')
const currentRole = inject('currentRole')
const store = useStore()

const id = route.params.id

const record = computed(() => {
  return store.state.blacklistRecords.find(r => r.id === id)
})

const showRemoveModal = ref(false)
const showReleaseModal = ref(false)

const removeForm = reactive({
  reason: ''
})

const releaseForm = reactive({
  visitTime: '',
  endTime: '',
  buildingId: '',
  roomNumber: '',
  hostName: '',
  hostPhone: '',
  approvedBy: '',
  approveReason: '',
  expireTime: ''
})

const getReasonLabel = (value) => {
  const r = blacklistReasons.find(r => r.value === value)
  return r ? r.label : value
}

const getBuildingName = (id) => {
  const b = store.state.buildings.find(b => b.id === id)
  return b ? b.name : id
}

const goToVisitor = (vid) => {
  router.push(`/visitor/${vid}`)
}

const openRemoveModal = () => {
  removeForm.reason = ''
  showRemoveModal.value = true
}

const submitRemove = () => {
  if (!removeForm.reason.trim()) {
    showToast('请填写移出原因', 'error')
    return
  }
  const operator = getOperatorName()
  const result = store.removeFromBlacklist(id, operator, removeForm.reason.trim())
  if (result) {
    showToast('已成功移出黑名单', 'success')
    showRemoveModal.value = false
  } else {
    showToast('操作失败，请重试', 'error')
  }
}

const openReleaseModal = () => {
  const now = dayjs('2026-06-17 10:30:00')
  releaseForm.visitTime = now.format('YYYY-MM-DDTHH:mm')
  releaseForm.endTime = now.add(4, 'hour').format('YYYY-MM-DDTHH:mm')
  releaseForm.buildingId = ''
  releaseForm.roomNumber = ''
  releaseForm.hostName = ''
  releaseForm.hostPhone = ''
  releaseForm.approvedBy = ''
  releaseForm.approveReason = ''
  releaseForm.expireTime = now.add(8, 'hour').format('YYYY-MM-DDTHH:mm')
  showReleaseModal.value = true
}

const onBuildingChange = () => {
  if (releaseForm.buildingId && !releaseForm.roomNumber) {
    const building = store.state.buildings.find(b => b.id === releaseForm.buildingId)
    if (building) {
      releaseForm.roomNumber = building.name + '1单元'
    }
  }
}

const submitRelease = () => {
  if (!releaseForm.visitTime) {
    showToast('请选择到访时间', 'error')
    return
  }
  if (!releaseForm.endTime) {
    showToast('请选择预计离场时间', 'error')
    return
  }
  if (!releaseForm.buildingId) {
    showToast('请选择楼栋', 'error')
    return
  }
  if (!releaseForm.roomNumber.trim()) {
    showToast('请填写房号', 'error')
    return
  }
  if (!releaseForm.hostName.trim()) {
    showToast('请填写被访人姓名', 'error')
    return
  }
  if (!releaseForm.hostPhone.trim() || !/^1[3-9]\d{9}$/.test(releaseForm.hostPhone.trim())) {
    showToast('请填写正确的被访人电话', 'error')
    return
  }
  if (!releaseForm.approvedBy) {
    showToast('请选择审批人', 'error')
    return
  }
  if (!releaseForm.expireTime) {
    showToast('请选择有效期', 'error')
    return
  }
  if (!releaseForm.approveReason.trim()) {
    showToast('请填写审批原因', 'error')
    return
  }

  const visit = dayjs(releaseForm.visitTime.replace('T', ' '))
  const end = dayjs(releaseForm.endTime.replace('T', ' '))
  const expire = dayjs(releaseForm.expireTime.replace('T', ' '))

  if (end.isBefore(visit)) {
    showToast('离场时间不能早于到访时间', 'error')
    return
  }
  if (expire.isBefore(end)) {
    showToast('有效期不能早于离场时间', 'error')
    return
  }

  const result = store.addTemporaryRelease(id, {
    visitTime: releaseForm.visitTime.replace('T', ' '),
    endTime: releaseForm.endTime.replace('T', ' '),
    buildingId: releaseForm.buildingId,
    roomNumber: releaseForm.roomNumber.trim(),
    hostName: releaseForm.hostName.trim(),
    hostPhone: releaseForm.hostPhone.trim(),
    approvedBy: releaseForm.approvedBy,
    approveReason: releaseForm.approveReason.trim(),
    expireTime: releaseForm.expireTime.replace('T', ' ')
  })

  if (result) {
    showToast('临时放行审批成功', 'success')
    showReleaseModal.value = false
  } else {
    showToast('操作失败，请重试', 'error')
  }
}

const getOperatorName = () => {
  const roleMap = {
    service: '张客服',
    engineer: '李工程师',
    housekeeper: '楼栋管家-小赵',
    security: '安保-陈队长'
  }
  return roleMap[currentRole.value] || '操作员'
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
