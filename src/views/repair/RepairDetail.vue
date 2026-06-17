<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <router-link to="/repair" class="text-gray-500 hover:text-gray-700">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </router-link>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">工单详情</h1>
          <p class="text-sm text-gray-500 mt-1">
            工单号：<span class="font-mono">{{ order.id }}</span>
            <span v-if="order.isTimeout" class="ml-2 badge bg-red-100 text-red-600">已超时</span>
            <span v-if="order.needReturn" class="ml-2 badge bg-yellow-100 text-yellow-600">需二次上门</span>
            <span v-if="order.visitStatus" class="ml-2 badge" :class="getVisitStatusClass(order.visitStatus)">
              {{ getVisitStatusLabel(order.visitStatus) }}
            </span>
          </p>
        </div>
      </div>
      <div class="flex space-x-3">
        <button v-if="currentRole === 'service' && order.status === 'pending'" @click="showAssignModal = true" class="btn-primary">
          派单
        </button>
        <button v-if="currentRole === 'engineer' && order.status === 'assigned'" @click="handleAccept" class="btn-primary">
          接单
        </button>
        <button v-if="currentRole === 'engineer' && order.status === 'processing' && !order.arriveTime" @click="handleArrive" class="btn-primary">
          记录到达
        </button>
        <button v-if="currentRole === 'engineer' && order.status === 'processing' && order.arriveTime" @click="showCompleteModal = true" class="btn-success">
          处理完成
        </button>
        <button v-if="currentRole === 'service' && order.status === 'completed' && order.visitStatus !== 'completed'" @click="showVisitModal = true" class="btn-primary">
          {{ order.visitStatus === 'followup' ? '继续回访' : '住户回访' }}
        </button>
        <button v-if="currentRole === 'service' && order.visitStatus === 'followup'" @click="showFollowupResolveModal = true" class="btn-success">
          跟进处理完成
        </button>
        <button v-if="currentRole === 'service' && !['completed', 'cancelled'].includes(order.status)" @click="showEditModal = true" class="btn-secondary">
          修改信息
        </button>
        <button v-if="currentRole === 'service' && !['completed', 'cancelled'].includes(order.status)" @click="showCancelModal = true" class="btn-danger">
          取消工单
        </button>
      </div>
    </div>

    <div v-if="order" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="card p-5">
          <div class="flex items-start justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">报修信息</h2>
            <span class="badge" :class="getStatusClass(order.status)">{{ getStatusLabel(order.status) }}</span>
          </div>
          
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-500">房号：</span>
              <span class="font-medium">{{ order.roomNumber }}</span>
            </div>
            <div>
              <span class="text-gray-500">联系人：</span>
              <span class="font-medium">{{ order.contactName }}</span>
            </div>
            <div>
              <span class="text-gray-500">联系电话：</span>
              <span class="font-medium">{{ order.contactPhone }}</span>
            </div>
            <div>
              <span class="text-gray-500">报修分类：</span>
              <span class="badge bg-gray-100 text-gray-700">{{ getCategoryLabel(order.category) }}</span>
            </div>
            <div>
              <span class="text-gray-500">紧急程度：</span>
              <span class="badge" :class="getUrgencyClass(order.urgency)">{{ getUrgencyLabel(order.urgency) }}</span>
            </div>
            <div>
              <span class="text-gray-500">期望上门：</span>
              <span class="font-medium">{{ order.expectedTime || '-' }}</span>
            </div>
            <div>
              <span class="text-gray-500">创建时间：</span>
              <span class="font-medium">{{ order.createTime }}</span>
            </div>
            <div>
              <span class="text-gray-500">来源：</span>
              <span class="font-medium">{{ getSourceLabel(order.source) }}</span>
            </div>
          </div>
          
          <div class="mt-4 pt-4 border-t">
            <p class="text-sm text-gray-500 mb-1">问题描述：</p>
            <p class="text-sm text-gray-900">{{ order.description }}</p>
          </div>
          
          <div v-if="order.remarks" class="mt-4 pt-4 border-t">
            <p class="text-sm text-gray-500 mb-1">客服备注：</p>
            <p class="text-sm text-gray-900">{{ order.remarks }}</p>
          </div>
        </div>

        <div v-if="order.status !== 'pending'" class="card p-5">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">处理信息</h2>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-500">处理人：</span>
              <span class="font-medium">{{ getEngineerName(order.engineerId) }}</span>
            </div>
            <div>
              <span class="text-gray-500">派单时间：</span>
              <span class="font-medium">{{ order.assignTime || '-' }}</span>
            </div>
            <div>
              <span class="text-gray-500">接单时间：</span>
              <span class="font-medium">{{ order.acceptTime || '-' }}</span>
            </div>
            <div>
              <span class="text-gray-500">到达时间：</span>
              <span class="font-medium">{{ order.arriveTime || '-' }}</span>
            </div>
            <div>
              <span class="text-gray-500">完成时间：</span>
              <span class="font-medium">{{ order.completeTime || '-' }}</span>
            </div>
            <div>
              <span class="text-gray-500">是否二次上门：</span>
              <span class="font-medium" :class="order.needReturn ? 'text-yellow-600' : 'text-gray-900'">
                {{ order.needReturn ? '是 - ' + order.returnReason : '否' }}
              </span>
            </div>
          </div>
          
          <div v-if="order.processResult" class="mt-4 pt-4 border-t">
            <p class="text-sm text-gray-500 mb-1">处理结果：</p>
            <p class="text-sm text-gray-900">{{ order.processResult }}</p>
          </div>
        </div>

        <div v-if="order.visitRecords && order.visitRecords.length > 0" class="card p-5">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">回访记录</h2>
          <div class="space-y-4">
            <div v-for="(record, idx) in order.visitRecords" :key="record.id" class="p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-2">
                  <span class="text-base font-medium text-gray-900">
                    {{ getSatisfactionEmoji(record.satisfaction) }} {{ getSatisfactionLabel(record.satisfaction) }}
                  </span>
                  <span class="badge" :class="record.problemResolved ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
                    {{ record.problemResolved ? '问题已解决' : '问题未解决' }}
                  </span>
                </div>
                <span class="text-xs text-gray-400">第 {{ idx + 1 }} 次回访</span>
              </div>
              <div class="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <span class="text-gray-500">回访人：</span>
                  <span class="font-medium">{{ record.visitor }}</span>
                </div>
                <div>
                  <span class="text-gray-500">回访时间：</span>
                  <span class="font-medium">{{ record.visitTime }}</span>
                </div>
              </div>
              <div v-if="record.remark" class="mb-2">
                <p class="text-sm text-gray-500 mb-1">回访备注：</p>
                <p class="text-sm text-gray-900">{{ record.remark }}</p>
              </div>
              <div v-if="!record.problemResolved && record.unresolvedReason" class="p-3 bg-red-50 rounded-md">
                <p class="text-sm text-red-600">
                  <span class="font-medium">未解决原因：</span>{{ record.unresolvedReason }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentRole === 'engineer' && order.status === 'processing' && order.arriveTime" class="card p-5">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">添加处理记录</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">处理进度</label>
              <textarea v-model="progressContent" class="textarea h-24" placeholder="记录当前处理进度..."></textarea>
            </div>
            <div class="flex justify-end">
              <button @click="handleAddProgress" :disabled="!progressContent.trim()" class="btn-primary" :class="{ 'opacity-50 cursor-not-allowed': !progressContent.trim() }">
                添加记录
              </button>
            </div>
          </div>
        </div>

        <div class="card p-5">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">处理过程</h2>
          <div class="space-y-4">
            <div
              v-for="(log, index) in order.processLogs"
              :key="index"
              class="flex space-x-4"
            >
              <div class="flex flex-col items-center">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center"
                  :class="{
                    'bg-blue-100 text-blue-600': log.action === '报修登记',
                    'bg-purple-100 text-purple-600': log.action === '派单',
                    'bg-green-100 text-green-600': log.action === '接单',
                    'bg-yellow-100 text-yellow-600': log.action === '到达现场',
                    'bg-gray-100 text-gray-600': log.action === '处理中',
                    'bg-green-500 text-white': log.action === '完成',
                    'bg-red-100 text-red-600': log.action === '取消',
                    'bg-cyan-100 text-cyan-600': log.action === '回访完成',
                    'bg-orange-100 text-orange-600': log.action === '回访转跟进' || log.action === '转跟进',
                    'bg-teal-100 text-teal-600': log.action === '跟进处理完成',
                    'bg-indigo-100 text-indigo-600': log.action === '临时处理'
                  }"
                >
                  <svg v-if="log.action === '报修登记'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                  </svg>
                  <svg v-else-if="log.action === '派单'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <svg v-else-if="log.action === '接单'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg v-else-if="log.action === '到达现场'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <svg v-else-if="log.action === '完成'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else-if="log.action === '取消'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <svg v-else-if="log.action === '回访完成'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <svg v-else-if="log.action === '回访转跟进' || log.action === '转跟进'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <svg v-else-if="log.action === '跟进处理完成'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg v-else-if="log.action === '临时处理'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div v-if="index < order.processLogs.length - 1" class="w-0.5 h-full bg-gray-200 mt-2"></div>
              </div>
              <div class="flex-1 pb-4">
                <div class="flex items-center space-x-2">
                  <span class="font-medium text-gray-900">{{ log.action }}</span>
                  <span class="text-sm text-gray-500">{{ log.operator }}</span>
                </div>
                <p class="text-sm text-gray-600 mt-1">{{ log.content }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ log.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="card p-5">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">相关设备</h2>
          <div v-if="relatedEquipment.length > 0" class="space-y-3">
            <div v-for="eq in relatedEquipment" :key="eq.id" class="p-3 bg-gray-50 rounded-lg">
              <p class="font-medium text-sm">{{ eq.name }}</p>
              <p class="text-xs text-gray-500">{{ eq.location }}</p>
              <div class="flex items-center space-x-2 mt-2">
                <span class="badge" :class="eq.status === 'normal' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'">
                  {{ eq.status === 'normal' ? '正常' : '维护中' }}
                </span>
                <span class="text-xs text-gray-400">上次维修：{{ eq.lastRepairDate || '-' }}</span>
              </div>
            </div>
          </div>
          <p v-else class="text-sm text-gray-500">暂无相关设备</p>
        </div>

        <div class="card p-5">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">该房号历史报修</h2>
          <div v-if="historyOrders.length > 0" class="space-y-3">
            <div
              v-for="item in historyOrders"
              :key="item.id"
              class="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              @click="goToOrder(item.id)"
            >
              <div class="flex items-center justify-between">
                <span class="font-mono text-xs text-primary-600">{{ item.id }}</span>
                <span class="badge" :class="getStatusClass(item.status)">{{ getStatusLabel(item.status) }}</span>
              </div>
              <p class="text-sm text-gray-900 mt-1">{{ getCategoryLabel(item.category) }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ item.description.slice(0, 30) }}...</p>
              <p class="text-xs text-gray-400 mt-1">{{ item.createTime }}</p>
            </div>
          </div>
          <p v-else class="text-sm text-gray-500">暂无历史报修记录</p>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showAssignModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">派单</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">选择工程人员</label>
            <select v-model="selectedEngineer" class="select">
              <option value="">请选择</option>
              <option v-for="e in store.state.engineers" :key="e.id" :value="e.id">
                {{ e.name }}（{{ e.specialty }}）
              </option>
            </select>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button @click="showAssignModal = false" class="btn-secondary">取消</button>
            <button @click="handleAssign" :disabled="!selectedEngineer" class="btn-primary" :class="{ 'opacity-50 cursor-not-allowed': !selectedEngineer }">
              确认派单
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showCancelModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">取消工单</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">取消原因</label>
            <textarea v-model="cancelReason" class="textarea h-24" placeholder="请填写取消原因..."></textarea>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button @click="showCancelModal = false" class="btn-secondary">取消</button>
            <button @click="handleCancel" :disabled="!cancelReason.trim()" class="btn-danger" :class="{ 'opacity-50 cursor-not-allowed': !cancelReason.trim() }">
              确认取消
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">修改信息</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">联系人</label>
                <input v-model="editForm.contactName" type="text" class="input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                <input v-model="editForm.contactPhone" type="text" class="input" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">报修分类</label>
                <select v-model="editForm.category" class="select">
                  <option v-for="c in repairCategories" :key="c.value" :value="c.value">{{ c.label }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">紧急程度</label>
                <select v-model="editForm.urgency" class="select">
                  <option value="low">一般</option>
                  <option value="medium">紧急</option>
                  <option value="high">非常紧急</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">问题描述</label>
              <textarea v-model="editForm.description" class="textarea h-20"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">客服备注</label>
              <textarea v-model="editForm.remarks" class="textarea h-20"></textarea>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button @click="showEditModal = false" class="btn-secondary">取消</button>
            <button @click="handleEdit" class="btn-primary">保存修改</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showCompleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">处理完成</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">处理结果 <span class="text-red-500">*</span></label>
              <textarea v-model="completeForm.processResult" class="textarea h-28" placeholder="请详细描述处理过程和结果..."></textarea>
              <p v-if="completeErrors.processResult" class="text-red-500 text-xs mt-1">{{ completeErrors.processResult }}</p>
            </div>
            <div>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input v-model="completeForm.needReturn" type="checkbox" class="w-4 h-4 text-primary-600" />
                <span class="text-sm font-medium text-gray-700">需要二次上门</span>
              </label>
            </div>
            <div v-if="completeForm.needReturn">
              <label class="block text-sm font-medium text-gray-700 mb-2">二次上门原因</label>
              <input v-model="completeForm.returnReason" type="text" class="input" placeholder="请说明二次上门的原因和计划时间" />
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button @click="showCompleteModal = false" class="btn-secondary">取消</button>
            <button @click="handleComplete" class="btn-success">确认完成</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showVisitModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">住户回访</h3>
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">住户满意度 <span class="text-red-500">*</span></label>
              <div class="flex space-x-2">
                <button
                  v-for="level in satisfactionLevels"
                  :key="level.value"
                  type="button"
                  @click="visitForm.satisfaction = level.value"
                  class="flex-1 py-2 px-1 rounded-lg border-2 transition-all text-center"
                  :class="visitForm.satisfaction === level.value 
                    ? 'border-primary-500 bg-primary-50 text-primary-700' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'"
                >
                  <div class="text-xl">{{ level.emoji }}</div>
                  <div class="text-xs mt-1">{{ level.label }}</div>
                </button>
              </div>
              <p v-if="visitErrors.satisfaction" class="text-red-500 text-xs mt-2">{{ visitErrors.satisfaction }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">住户是否确认问题已彻底解决？ <span class="text-red-500">*</span></label>
              <div class="flex space-x-3">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input v-model="visitForm.problemResolved" type="radio" :value="true" class="w-4 h-4 text-primary-600" />
                  <span class="text-sm text-gray-700">已解决</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input v-model="visitForm.problemResolved" type="radio" :value="false" class="w-4 h-4 text-primary-600" />
                  <span class="text-sm text-gray-700">未解决/反复</span>
                </label>
              </div>
            </div>

            <div v-if="visitForm.problemResolved === false">
              <label class="block text-sm font-medium text-gray-700 mb-2">未解决/问题反复的原因 <span class="text-red-500">*</span></label>
              <textarea v-model="visitForm.unresolvedReason" class="textarea h-20" placeholder="请详细说明问题未解决或反复出现的具体情况..."></textarea>
              <p v-if="visitErrors.unresolvedReason" class="text-red-500 text-xs mt-1">{{ visitErrors.unresolvedReason }}</p>
              <p class="text-xs text-orange-600 mt-2">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                标记为未解决后，工单将自动转为「待跟进」状态
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">回访备注</label>
              <textarea v-model="visitForm.remark" class="textarea h-24" placeholder="记录回访过程中的其他信息、住户反馈等..."></textarea>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button @click="showVisitModal = false" class="btn-secondary">取消</button>
            <button @click="handleSubmitVisit" class="btn-primary">提交回访</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showFollowupResolveModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">跟进处理完成</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">跟进处理结果 <span class="text-red-500">*</span></label>
              <textarea v-model="followupResolveForm.processResult" class="textarea h-28" placeholder="请详细描述跟进处理的过程和最终结果..."></textarea>
              <p v-if="followupResolveErrors.processResult" class="text-red-500 text-xs mt-1">{{ followupResolveErrors.processResult }}</p>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button @click="showFollowupResolveModal = false" class="btn-secondary">取消</button>
            <button @click="handleFollowupResolve" class="btn-success">确认完成</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, inject, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore, repairCategories, urgentLevels, satisfactionLevels, visitStatusMap } from '../../store'

const route = useRoute()
const router = useRouter()
const showToast = inject('showToast')
const currentRole = inject('currentRole')
const store = useStore()

const orderId = route.params.id
const order = computed(() => store.getOrderById(orderId))

const showAssignModal = ref(false)
const showCancelModal = ref(false)
const showEditModal = ref(false)
const showCompleteModal = ref(false)
const showVisitModal = ref(false)
const showFollowupResolveModal = ref(false)
const selectedEngineer = ref('')
const cancelReason = ref('')
const progressContent = ref('')

const editForm = reactive({
  contactName: '',
  contactPhone: '',
  category: '',
  urgency: '',
  description: '',
  remarks: ''
})

const completeForm = reactive({
  processResult: '',
  needReturn: false,
  returnReason: ''
})

const completeErrors = reactive({
  processResult: ''
})

const visitForm = reactive({
  satisfaction: null,
  problemResolved: null,
  remark: '',
  unresolvedReason: ''
})

const visitErrors = reactive({
  satisfaction: '',
  unresolvedReason: ''
})

const followupResolveForm = reactive({
  processResult: ''
})

const followupResolveErrors = reactive({
  processResult: ''
})

const relatedEquipment = computed(() => {
  if (!order.value?.buildingId) return []
  return store.state.equipmentList.filter(e => e.buildingId === order.value.buildingId).slice(0, 3)
})

const historyOrders = computed(() => {
  if (!order.value?.roomNumber) return []
  return store.state.repairOrders
    .filter(o => o.roomNumber === order.value.roomNumber && o.id !== order.value.id)
    .slice(0, 5)
})

onMounted(() => {
  if (order.value) {
    editForm.contactName = order.value.contactName
    editForm.contactPhone = order.value.contactPhone
    editForm.category = order.value.category
    editForm.urgency = order.value.urgency
    editForm.description = order.value.description
    editForm.remarks = order.value.remarks || ''
  }
})

const getCategoryLabel = (value) => {
  const cat = repairCategories.find(c => c.value === value)
  return cat ? cat.label : value
}

const getUrgencyLabel = (value) => {
  const u = urgentLevels.find(item => item.value === value)
  return u ? u.label : value
}

const getUrgencyClass = (urgency) => {
  switch (urgency) {
    case 'high': return 'bg-red-100 text-red-600'
    case 'medium': return 'bg-yellow-100 text-yellow-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-gray-100 text-gray-600'
    case 'assigned': return 'bg-blue-100 text-blue-600'
    case 'processing': return 'bg-yellow-100 text-yellow-600'
    case 'completed': return 'bg-green-100 text-green-600'
    case 'cancelled': return 'bg-gray-100 text-gray-500'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'pending': return '待派单'
    case 'assigned': return '已派单'
    case 'processing': return '处理中'
    case 'completed': return '已完成'
    case 'cancelled': return '已取消'
    default: return status
  }
}

const getSourceLabel = (source) => {
  const map = {
    resident: '住户APP',
    phone: '电话报修',
    manual: '人工登记',
    inspection: '巡检发现',
    patrol: '巡逻发现'
  }
  return map[source] || source
}

const getVisitStatusLabel = (status) => {
  return visitStatusMap[status] || status
}

const getVisitStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-orange-100 text-orange-600'
    case 'visiting': return 'bg-blue-100 text-blue-600'
    case 'completed': return 'bg-green-100 text-green-600'
    case 'followup': return 'bg-red-100 text-red-600'
    case 'closed': return 'bg-gray-100 text-gray-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const getSatisfactionLabel = (value) => {
  const level = satisfactionLevels.find(l => l.value === value)
  return level ? level.label : value
}

const getSatisfactionEmoji = (value) => {
  const level = satisfactionLevels.find(l => l.value === value)
  return level ? level.emoji : '😐'
}

const getEngineerName = (id) => {
  if (!id) return '-'
  const eng = store.state.engineers.find(e => e.id === id)
  return eng ? eng.name : id
}

const goToOrder = (id) => {
  router.push(`/repair/${id}`)
}

const handleAssign = () => {
  if (!selectedEngineer.value) return
  const success = store.assignOrder(orderId, selectedEngineer.value)
  if (success) {
    showToast('派单成功', 'success')
    showAssignModal.value = false
    selectedEngineer.value = ''
  } else {
    showToast('派单失败', 'error')
  }
}

const handleAccept = () => {
  const operatorName = currentRole.value === 'engineer' ? '李工程师' : '操作员'
  const success = store.acceptOrder(orderId, operatorName)
  if (success) {
    showToast('接单成功', 'success')
  } else {
    showToast('接单失败', 'error')
  }
}

const handleArrive = () => {
  const operatorName = currentRole.value === 'engineer' ? '李工程师' : '操作员'
  const success = store.updateArriveTime(orderId, operatorName)
  if (success) {
    showToast('已记录到达时间', 'success')
  } else {
    showToast('操作失败', 'error')
  }
}

const handleAddProgress = () => {
  if (!progressContent.value.trim()) return
  const operatorName = currentRole.value === 'engineer' ? '李工程师' : '操作员'
  const success = store.addProcessLog(orderId, operatorName, progressContent.value)
  if (success) {
    showToast('已添加处理记录', 'success')
    progressContent.value = ''
  } else {
    showToast('添加失败', 'error')
  }
}

const handleComplete = () => {
  if (!completeForm.processResult.trim()) {
    completeErrors.processResult = '请填写处理结果'
    return
  }
  completeErrors.processResult = ''
  
  const operatorName = currentRole.value === 'engineer' ? '李工程师' : '操作员'
  const success = store.completeOrder(orderId, operatorName, {
    processResult: completeForm.processResult,
    needReturn: completeForm.needReturn,
    returnReason: completeForm.needReturn ? completeForm.returnReason : null
  })
  
  if (success) {
    showToast('工单已完成', 'success')
    showCompleteModal.value = false
    completeForm.processResult = ''
    completeForm.needReturn = false
    completeForm.returnReason = ''
  } else {
    showToast('操作失败', 'error')
  }
}

const handleCancel = () => {
  if (!cancelReason.value.trim()) return
  const operatorName = currentRole.value === 'service' ? '张客服' : '操作员'
  const success = store.cancelOrder(orderId, operatorName, cancelReason.value)
  if (success) {
    showToast('工单已取消', 'success')
    showCancelModal.value = false
    cancelReason.value = ''
  } else {
    showToast('取消失败', 'error')
  }
}

const handleEdit = () => {
  const updateData = {
    contactName: editForm.contactName,
    contactPhone: editForm.contactPhone,
    category: editForm.category,
    urgency: editForm.urgency,
    description: editForm.description,
    remarks: editForm.remarks
  }
  
  const success = store.updateOrder(orderId, updateData)
  if (success) {
    showToast('信息已更新', 'success')
    showEditModal.value = false
  } else {
    showToast('更新失败', 'error')
  }
}

const resetVisitForm = () => {
  visitForm.satisfaction = null
  visitForm.problemResolved = null
  visitForm.remark = ''
  visitForm.unresolvedReason = ''
  visitErrors.satisfaction = ''
  visitErrors.unresolvedReason = ''
}

const handleSubmitVisit = () => {
  let hasError = false
  visitErrors.satisfaction = ''
  visitErrors.unresolvedReason = ''

  if (!visitForm.satisfaction) {
    visitErrors.satisfaction = '请选择住户满意度'
    hasError = true
  }

  if (visitForm.problemResolved === null) {
    showToast('请选择问题是否已彻底解决', 'error')
    hasError = true
  }

  if (visitForm.problemResolved === false && !visitForm.unresolvedReason.trim()) {
    visitErrors.unresolvedReason = '请填写问题未解决或反复的原因'
    hasError = true
  }

  if (hasError) return

  const visitor = currentRole.value === 'service' ? '张客服' : '操作员'
  const success = store.addVisitRecord(orderId, visitor, {
    satisfaction: visitForm.satisfaction,
    problemResolved: visitForm.problemResolved,
    remark: visitForm.remark,
    unresolvedReason: visitForm.problemResolved === false ? visitForm.unresolvedReason : null
  })

  if (success) {
    if (visitForm.problemResolved && visitForm.satisfaction >= 4) {
      showToast('回访提交成功，工单已标记为已回访完成', 'success')
    } else {
      showToast('回访提交成功，工单已转为待跟进状态', 'warning')
    }
    showVisitModal.value = false
    resetVisitForm()
  } else {
    showToast('回访提交失败', 'error')
  }
}

const resetFollowupResolveForm = () => {
  followupResolveForm.processResult = ''
  followupResolveErrors.processResult = ''
}

const handleFollowupResolve = () => {
  if (!followupResolveForm.processResult.trim()) {
    followupResolveErrors.processResult = '请填写跟进处理结果'
    return
  }
  followupResolveErrors.processResult = ''

  const operator = currentRole.value === 'service' ? '张客服' : '操作员'
  const success = store.resolveFollowup(orderId, operator, {
    processResult: followupResolveForm.processResult
  })

  if (success) {
    showToast('跟进处理已完成', 'success')
    showFollowupResolveModal.value = false
    resetFollowupResolveForm()
  } else {
    showToast('操作失败', 'error')
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
