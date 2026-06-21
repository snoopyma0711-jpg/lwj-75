<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">访客黑名单管理</h1>
        <p class="text-sm text-gray-500 mt-1">共 {{ filteredRecords.length }} 条记录</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <button @click="resetFilters" class="btn-secondary">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重置筛选
          </span>
        </button>
        <button @click="openAddModal" class="btn-primary">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            加入黑名单
          </span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500">黑名单总数</p>
            <p class="text-2xl font-bold text-red-600 mt-1">{{ store.state.blacklistRecords.length }}</p>
          </div>
          <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
        </div>
      </div>
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500">生效中</p>
            <p class="text-2xl font-bold text-orange-600 mt-1">{{ activeCount }}</p>
          </div>
          <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500">临时放开放</p>
            <p class="text-2xl font-bold text-yellow-600 mt-1">{{ store.todayReleasedCount.value }}</p>
          </div>
          <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500">已移出</p>
            <p class="text-2xl font-bold text-gray-600 mt-1">{{ removedCount }}</p>
          </div>
          <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="card p-5">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">状态</label>
          <select v-model="filters.status" class="select text-sm">
            <option value="">全部状态</option>
            <option v-for="(label, key) in blacklistStatusMap" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">列入原因</label>
          <select v-model="filters.reason" class="select text-sm">
            <option value="">全部原因</option>
            <option v-for="r in blacklistReasons" :key="r.value" :value="r.value">{{ r.label }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">日期范围</label>
          <select v-model="filters.dateRange" class="select text-sm">
            <option value="all">全部时间</option>
            <option value="week">近7天</option>
            <option value="month">近30天</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">开始日期</label>
          <input v-model="filters.startDate" type="date" class="input text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">结束日期</label>
          <input v-model="filters.endDate" type="date" class="input text-sm" />
        </div>
        <div class="md:col-span-3 lg:col-span-2">
          <label class="block text-sm font-medium text-gray-600 mb-1">关键词搜索</label>
          <div class="relative">
            <input
              v-model="filters.keyword"
              type="text"
              class="input text-sm pl-8"
              placeholder="搜索姓名、电话、身份证..."
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
              <th>黑名单编号</th>
              <th>访客信息</th>
              <th>列入原因</th>
              <th>投诉次数</th>
              <th>状态</th>
              <th>列入时间</th>
              <th>操作人</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in filteredRecords" :key="record.id" class="cursor-pointer hover:bg-gray-50" @click="goToDetail(record.id)">
              <td>
                <span class="font-mono text-sm text-red-600">{{ record.id }}</span>
              </td>
              <td>
                <div class="font-medium">{{ record.visitorName }}</div>
                <div class="text-xs text-gray-500">{{ record.visitorPhone }}</div>
                <div v-if="record.idCard" class="text-xs text-gray-400">{{ record.idCard }}</div>
              </td>
              <td>
                <span class="badge bg-red-50 text-red-700">{{ getReasonLabel(record.reason) }}</span>
                <div v-if="record.reasonDetail" class="text-xs text-gray-500 mt-1 max-w-xs truncate" :title="record.reasonDetail">{{ record.reasonDetail }}</div>
              </td>
              <td>
                <span :class="record.complaintCount > 0 ? 'text-red-600 font-medium' : 'text-gray-500'">
                  {{ record.complaintCount > 0 ? record.complaintCount + '次' : '-' }}
                </span>
              </td>
              <td>
                <span class="badge" :class="blacklistStatusColorMap[record.status]">
                  {{ blacklistStatusMap[record.status] }}
                </span>
                <div v-if="record.status === 'removed' && record.removeTime" class="text-xs text-gray-400 mt-1">
                  {{ record.removeTime }}
                </div>
              </td>
              <td>
                <div class="text-sm">{{ record.createTime }}</div>
                <div v-if="record.reportSource" class="text-xs text-gray-400 mt-1">来源：{{ record.reportSource }}</div>
              </td>
              <td class="text-sm">{{ record.createOperator }}</td>
              <td>
                <div class="flex items-center space-x-2" @click.stop>
                  <button @click="goToDetail(record.id)" class="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    详情
                  </button>
                  <button v-if="record.status === 'active'" @click="openReleaseModal(record)" class="text-yellow-600 hover:text-yellow-800 text-sm font-medium">
                    临时放行
                  </button>
                  <button v-if="record.status === 'active'" @click="openRemoveModal(record)" class="text-green-600 hover:text-green-800 text-sm font-medium">
                    移出
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
      <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            加入访客黑名单
          </h3>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">访客姓名 <span class="text-red-500">*</span></label>
                <input v-model="addForm.visitorName" type="text" class="input" placeholder="请输入访客姓名" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">联系电话 <span class="text-red-500">*</span></label>
                <input v-model="addForm.visitorPhone" type="tel" class="input" placeholder="请输入11位手机号" maxlength="11" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">身份证号（选填）</label>
                <input v-model="addForm.idCard" type="text" class="input" placeholder="用于身份核验，选填" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">列入原因 <span class="text-red-500">*</span></label>
                <select v-model="addForm.reason" class="select">
                  <option value="">请选择列入原因</option>
                  <option v-for="r in blacklistReasons" :key="r.value" :value="r.value">{{ r.label }} - {{ r.description }}</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">原因详情 <span class="text-red-500">*</span></label>
                <textarea v-model="addForm.reasonDetail" class="textarea h-24" placeholder="请详细描述列入黑名单的原因..."></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">信息来源</label>
                <select v-model="addForm.reportSource" class="select">
                  <option value="手动录入">手动录入</option>
                  <option value="业主投诉">业主投诉</option>
                  <option value="安保发现">安保发现</option>
                  <option value="系统分析">系统分析</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">投诉人（选填）</label>
                <input v-model="addForm.complainant" type="text" class="input" placeholder="投诉人姓名或房号" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">投诉次数</label>
                <input v-model.number="addForm.complaintCount" type="number" min="0" class="input" placeholder="0" />
              </div>
            </div>
            <div class="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p class="text-sm text-yellow-800 flex items-start">
                <svg class="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                列入黑名单后，该访客再次预约时将被系统自动拦截，需要特殊审批才能放行。请谨慎操作。
              </p>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button @click="showAddModal = false" class="btn-secondary">取消</button>
            <button @click="submitAdd" class="btn-danger">确认加入黑名单</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showRemoveModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            移出黑名单
          </h3>
          <div v-if="removeForm.id" class="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
            <p class="text-sm"><span class="text-gray-500">黑名单编号：</span><span class="font-mono font-medium">{{ removeForm.id }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">访客：</span><span class="font-medium">{{ removeForm.visitorName }} · {{ removeForm.visitorPhone }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">列入原因：</span><span class="font-medium">{{ getReasonLabel(removeForm.reason) }}</span></p>
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
          <div v-if="releaseForm.blacklistId" class="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p class="text-sm"><span class="text-gray-500">黑名单编号：</span><span class="font-mono font-medium">{{ releaseForm.blacklistId }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">访客：</span><span class="font-medium">{{ releaseForm.visitorName }} · {{ releaseForm.visitorPhone }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">列入原因：</span><span class="font-medium">{{ getReasonLabel(releaseForm.reason) }}</span></p>
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
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { useStore, blacklistReasons, blacklistStatusMap, blacklistStatusColorMap } from '../../store'
import EmptyState from '../../components/EmptyState.vue'

const router = useRouter()
const showToast = inject('showToast')
const currentRole = inject('currentRole')
const store = useStore()

const filters = reactive({
  status: '',
  reason: '',
  dateRange: 'all',
  startDate: '',
  endDate: '',
  keyword: ''
})

const showAddModal = ref(false)
const showRemoveModal = ref(false)
const showReleaseModal = ref(false)

const addForm = reactive({
  visitorName: '',
  visitorPhone: '',
  idCard: '',
  reason: '',
  reasonDetail: '',
  reportSource: '手动录入',
  complainant: '',
  complaintCount: 0
})

const removeForm = reactive({
  id: '',
  visitorName: '',
  visitorPhone: '',
  reason: '',
  reasonDetail: ''
})

const releaseForm = reactive({
  blacklistId: '',
  visitorName: '',
  visitorPhone: '',
  reason: '',
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

const activeCount = computed(() => {
  return store.state.blacklistRecords.filter(r => r.status === 'active').length
})

const removedCount = computed(() => {
  return store.state.blacklistRecords.filter(r => r.status === 'removed').length
})

const filteredRecords = computed(() => {
  return store.state.blacklistRecords.filter(record => {
    if (filters.status && record.status !== filters.status) return false
    if (filters.reason && record.reason !== filters.reason) return false

    if (filters.dateRange !== 'all') {
      const recordDate = dayjs(record.createTime)
      const today = dayjs('2026-06-17')
      if (filters.dateRange === 'week' && recordDate.isBefore(today.subtract(7, 'day'))) return false
      if (filters.dateRange === 'month' && recordDate.isBefore(today.subtract(30, 'day'))) return false
    }

    if (filters.startDate) {
      if (dayjs(record.createTime).isBefore(dayjs(filters.startDate), 'day')) return false
    }
    if (filters.endDate) {
      if (dayjs(record.createTime).isAfter(dayjs(filters.endDate), 'day')) return false
    }

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase()
      const match =
        record.id.toLowerCase().includes(kw) ||
        record.visitorName.toLowerCase().includes(kw) ||
        record.visitorPhone.includes(kw) ||
        (record.idCard && record.idCard.includes(kw))
      if (!match) return false
    }

    return true
  })
})

const getReasonLabel = (value) => {
  const r = blacklistReasons.find(r => r.value === value)
  return r ? r.label : value
}

const resetFilters = () => {
  filters.status = ''
  filters.reason = ''
  filters.dateRange = 'all'
  filters.startDate = ''
  filters.endDate = ''
  filters.keyword = ''
  showToast('筛选条件已重置', 'success')
}

const goToDetail = (id) => {
  router.push(`/blacklist/${id}`)
}

const openAddModal = () => {
  addForm.visitorName = ''
  addForm.visitorPhone = ''
  addForm.idCard = ''
  addForm.reason = ''
  addForm.reasonDetail = ''
  addForm.reportSource = '手动录入'
  addForm.complainant = ''
  addForm.complaintCount = 0
  showAddModal.value = true
}

const submitAdd = () => {
  if (!addForm.visitorName.trim()) {
    showToast('请填写访客姓名', 'error')
    return
  }
  if (!addForm.visitorPhone.trim() || !/^1[3-9]\d{9}$/.test(addForm.visitorPhone.trim())) {
    showToast('请填写正确的手机号', 'error')
    return
  }
  if (!addForm.reason) {
    showToast('请选择列入原因', 'error')
    return
  }
  if (!addForm.reasonDetail.trim()) {
    showToast('请填写原因详情', 'error')
    return
  }

  const existing = store.checkBlacklist(addForm.visitorPhone, addForm.idCard)
  if (existing) {
    showToast('该访客已在黑名单中', 'warning')
    return
  }

  const operator = getOperatorName()
  const result = store.addToBlacklist({
    ...addForm,
    operator
  })
  if (result) {
    showToast('已成功加入黑名单', 'success')
    showAddModal.value = false
  } else {
    showToast('操作失败，请重试', 'error')
  }
}

const openRemoveModal = (record) => {
  removeForm.id = record.id
  removeForm.visitorName = record.visitorName
  removeForm.visitorPhone = record.visitorPhone
  removeForm.reason = record.reason
  removeForm.reasonDetail = ''
  showRemoveModal.value = true
}

const submitRemove = () => {
  if (!removeForm.reasonDetail.trim()) {
    showToast('请填写移出原因', 'error')
    return
  }
  const operator = getOperatorName()
  const result = store.removeFromBlacklist(removeForm.id, operator, removeForm.reasonDetail.trim())
  if (result) {
    showToast('已成功移出黑名单', 'success')
    showRemoveModal.value = false
  } else {
    showToast('操作失败，请重试', 'error')
  }
}

const openReleaseModal = (record) => {
  const now = dayjs('2026-06-17 10:30:00')
  releaseForm.blacklistId = record.id
  releaseForm.visitorName = record.visitorName
  releaseForm.visitorPhone = record.visitorPhone
  releaseForm.reason = record.reason
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

  const result = store.addTemporaryRelease(releaseForm.blacklistId, {
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
