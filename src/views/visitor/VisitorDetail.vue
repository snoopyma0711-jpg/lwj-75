<template>
  <div v-if="record" class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center space-x-4">
        <router-link to="/visitor" class="btn-secondary btn-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </router-link>
        <div>
          <div class="flex items-center space-x-3">
            <h1 class="text-2xl font-bold text-gray-900">访客预约详情</h1>
            <span class="badge" :class="visitorStatusColorMap[record.status]">
              {{ visitorStatusMap[record.status] }}
            </span>
          </div>
          <p class="text-sm text-gray-500 mt-1">
            预约号：<span class="font-mono">{{ record.id }}</span> · 
            创建时间：{{ record.createTime }}
          </p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <button v-if="canAudit" @click="openAuditModal(true)" class="btn-success btn-sm">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            审核通过
          </span>
        </button>
        <button v-if="canAudit" @click="openAuditModal(false)" class="btn-danger btn-sm">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            审核拒绝
          </span>
        </button>
        <button v-if="canRelease" @click="openReleaseModal" class="btn-primary btn-sm">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            放行
          </span>
        </button>
        <button v-if="canSign" @click="handleSign" class="btn btn-sm bg-blue-600 text-white hover:bg-blue-700">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            签到确认
          </span>
        </button>
        <button v-if="canLeave" @click="openLeaveModal" class="btn-secondary btn-sm">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            登记离场
          </span>
        </button>
        <button v-if="canEdit" @click="goToEdit" class="btn-warning btn-sm">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            编辑
          </span>
        </button>
        <button v-if="canCancel" @click="openCancelModal" class="btn-danger btn-sm">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            取消预约
          </span>
        </button>
      </div>
    </div>

    <div v-if="blockedReasons.length > 0" class="p-4 bg-orange-50 border border-orange-200 rounded-xl">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-orange-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <h4 class="text-sm font-medium text-orange-800 mb-1">当前存在限制条件</h4>
          <ul class="text-xs text-orange-700 space-y-1">
            <li v-for="(reason, idx) in blockedReasons" :key="idx" class="flex items-start">
              <span class="mr-1">·</span>{{ reason }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            来访人信息
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">来访人姓名</p>
              <p class="mt-1 font-medium text-gray-900">{{ record.visitorName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">联系电话</p>
              <p class="mt-1 font-medium text-gray-900">{{ record.visitorPhone }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">同行人数</p>
              <p class="mt-1 font-medium text-gray-900">
                {{ record.companionCount > 0 ? `${record.companionCount}人` : '无同行人' }}
                <span class="text-xs text-gray-400">（不含访客本人）</span>
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">车牌号</p>
              <p class="mt-1 font-medium text-gray-900">
                {{ record.plateNumber || '未登记' }}
              </p>
            </div>
            <div class="col-span-2">
              <p class="text-sm text-gray-500">身份证号</p>
              <p class="mt-1 font-medium text-gray-900">
                {{ record.idCard || '未登记' }}
              </p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b flex items-center">
            <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            来访信息
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">来访事由</p>
              <p class="mt-1 font-medium text-gray-900">
                <span class="badge bg-gray-100 text-gray-700">{{ getPurposeLabel(record.purpose) }}</span>
                <span v-if="record.purposeDetail" class="ml-2 text-sm">{{ record.purposeDetail }}</span>
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">登记人</p>
              <p class="mt-1 font-medium text-gray-900">{{ record.createOperator }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">预计到访时间</p>
              <p class="mt-1 font-medium text-gray-900">{{ record.visitTime }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">预计离场时间</p>
              <p class="mt-1 font-medium text-gray-900">{{ record.endTime }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">拜访楼栋/房号</p>
              <p class="mt-1 font-medium text-gray-900">{{ record.roomNumber }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">被访人</p>
              <p class="mt-1 font-medium text-gray-900">
                {{ record.hostName }}
                <span class="text-xs text-gray-400 ml-2">{{ record.hostPhone }}</span>
              </p>
            </div>
            <div class="col-span-2">
              <p class="text-sm text-gray-500">备注</p>
              <p class="mt-1 font-medium text-gray-900">{{ record.remark || '无' }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b flex items-center">
            <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            过程追踪时间线
          </h3>
          <div class="relative">
            <div v-for="(log, index) in sortedLogs" :key="index" class="flex pb-6 last:pb-0">
              <div class="flex flex-col items-center mr-4">
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="getLogIconClass(log.action)"
                >
                  <component :is="getLogIcon(log.action)" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                </div>
                <div 
                  v-if="index < sortedLogs.length - 1" 
                  class="w-0.5 flex-1 mt-2"
                  :class="index < sortedLogs.length - 1 ? 'bg-gray-200' : 'bg-transparent'"
                ></div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <span class="font-medium text-gray-900">{{ log.action }}</span>
                  <span class="text-xs text-gray-400">{{ log.time }}</span>
                </div>
                <p class="text-sm text-gray-500 mt-1">操作人：{{ log.operator }}</p>
                <p class="text-sm text-gray-600 mt-2 bg-gray-50 rounded-lg p-3">{{ log.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">流程进度</h3>
          <div class="space-y-4">
            <div v-for="(step, index) in processSteps" :key="index" class="flex items-start space-x-3">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium"
                :class="step.status === 'done' ? 'bg-green-100 text-green-600' : step.status === 'current' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'"
              >
                <svg v-if="step.status === 'done'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div class="flex-1">
                <p 
                  class="text-sm font-medium"
                  :class="step.status === 'done' ? 'text-green-700' : step.status === 'current' ? 'text-blue-700' : 'text-gray-500'"
                >
                  {{ step.name }}
                </p>
                <p v-if="step.time" class="text-xs text-gray-400 mt-0.5">{{ step.time }}</p>
                <p v-if="step.operator" class="text-xs text-gray-400">{{ step.operator }}</p>
                <p v-if="step.extra" class="text-xs text-gray-500 mt-1">{{ step.extra }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">时间节点</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                <span class="text-sm text-gray-600">创建时间</span>
              </div>
              <span class="text-sm font-medium text-gray-900">{{ record.createTime }}</span>
            </div>
            <div v-if="record.auditTime" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 rounded-full" :class="record.status === 'rejected' ? 'bg-red-500' : 'bg-green-500'"></div>
                <span class="text-sm text-gray-600">审核时间</span>
              </div>
              <span class="text-sm font-medium text-gray-900">{{ record.auditTime }}</span>
            </div>
            <div v-if="record.releaseTime" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 rounded-full bg-purple-500"></div>
                <span class="text-sm text-gray-600">放行时间</span>
              </div>
              <span class="text-sm font-medium text-gray-900">{{ record.releaseTime }}</span>
            </div>
            <div v-if="record.signTime" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 rounded-full bg-teal-500"></div>
                <span class="text-sm text-gray-600">签到时间</span>
              </div>
              <span class="text-sm font-medium text-gray-900">{{ record.signTime }}</span>
            </div>
            <div v-if="record.leaveTime" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 rounded-full bg-gray-500"></div>
                <span class="text-sm text-gray-600">离场时间</span>
              </div>
              <span class="text-sm font-medium text-gray-900">{{ record.leaveTime }}</span>
            </div>
            <div v-if="durationText" class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm text-blue-700">实际停留时长</span>
              </div>
              <span class="text-sm font-medium text-blue-700">{{ durationText }}</span>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">快速操作</h3>
          <div class="space-y-3">
            <button 
              v-if="!['left', 'cancelled', 'rejected'].includes(record.status)"
              @click="openRemarkModal" 
              class="w-full btn-secondary btn-sm"
            >
              <span class="flex items-center justify-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                补充备注
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showAuditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ auditForm.isApproved ? '审核通过' : '审核拒绝' }}
          </h3>
          <div class="mb-4 p-3 bg-gray-50 rounded-lg">
            <p class="text-sm"><span class="text-gray-500">预约号：</span><span class="font-mono font-medium">{{ record.id }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">访客：</span><span class="font-medium">{{ record.visitorName }} · {{ record.visitorPhone }}</span></p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">审核备注</label>
            <textarea v-model="auditForm.remark" class="textarea h-24" :placeholder="auditForm.isApproved ? '可填写审核意见（可选）' : '请填写拒绝原因（必填）'"></textarea>
          </div>
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button @click="showAuditModal = false" class="btn-secondary">取消</button>
            <button @click="submitAudit" :class="auditForm.isApproved ? 'btn-success' : 'btn-danger'">
              确认{{ auditForm.isApproved ? '通过' : '拒绝' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showReleaseModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            访客放行
          </h3>
          <div class="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-100 space-y-1">
            <p class="text-sm"><span class="text-gray-500">预约号：</span><span class="font-mono font-medium">{{ record.id }}</span></p>
            <p class="text-sm"><span class="text-gray-500">访客：</span><span class="font-medium">{{ record.visitorName }} · {{ record.visitorPhone }}</span></p>
            <p class="text-sm"><span class="text-gray-500">拜访：</span><span class="font-medium">{{ record.roomNumber }} - {{ record.hostName }}</span></p>
            <p class="text-sm"><span class="text-gray-500">预约时间：</span><span class="font-medium">{{ record.visitTime }}</span></p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">放行门岗 <span class="text-red-500">*</span></label>
            <select v-model="releaseForm.gate" class="select">
              <option value="">请选择放行门岗</option>
              <option value="东门">东门</option>
              <option value="南门">南门</option>
              <option value="西门">西门</option>
              <option value="北门">北门</option>
            </select>
          </div>
          <div class="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p class="text-sm text-yellow-800 flex items-start">
              <svg class="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              放行前请核对访客身份证及预约信息，确认无误后放行。如有车辆请核对车牌号。
            </p>
          </div>
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button @click="showReleaseModal = false" class="btn-secondary">取消</button>
            <button @click="submitRelease" class="btn-primary">确认放行</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showLeaveModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            登记离场
          </h3>
          <div class="mb-4 p-3 bg-gray-50 rounded-lg space-y-1">
            <p class="text-sm"><span class="text-gray-500">预约号：</span><span class="font-mono font-medium">{{ record.id }}</span></p>
            <p class="text-sm"><span class="text-gray-500">访客：</span><span class="font-medium">{{ record.visitorName }}</span></p>
            <p class="text-sm"><span class="text-gray-500">入口：</span><span class="font-medium">{{ record.releaseGate || '-' }}</span></p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">离场门岗 <span class="text-red-500">*</span></label>
            <select v-model="leaveForm.gate" class="select">
              <option value="">请选择离场门岗</option>
              <option value="东门">东门</option>
              <option value="南门">南门</option>
              <option value="西门">西门</option>
              <option value="北门">北门</option>
            </select>
          </div>
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button @click="showLeaveModal = false" class="btn-secondary">取消</button>
            <button @click="submitLeave" class="btn-success">确认离场</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showCancelModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center text-red-600">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            取消预约
          </h3>
          <div class="mb-4 p-3 bg-red-50 rounded-lg border border-red-100 space-y-1">
            <p class="text-sm"><span class="text-gray-500">预约号：</span><span class="font-mono font-medium">{{ record.id }}</span></p>
            <p class="text-sm"><span class="text-gray-500">访客：</span><span class="font-medium">{{ record.visitorName }}</span></p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">取消原因 <span class="text-red-500">*</span></label>
            <textarea v-model="cancelForm.reason" class="textarea h-24" placeholder="请填写取消原因..."></textarea>
          </div>
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button @click="showCancelModal = false" class="btn-secondary">返回</button>
            <button @click="submitCancel" class="btn-danger">确认取消</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showRemarkModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">补充备注</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">备注内容 <span class="text-red-500">*</span></label>
            <textarea v-model="remarkForm.content" class="textarea h-24" placeholder="请输入需要补充的备注信息..."></textarea>
          </div>
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button @click="showRemarkModal = false" class="btn-secondary">取消</button>
            <button @click="submitRemark" class="btn-primary">保存备注</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>

  <EmptyState v-else title="未找到预约记录" description="该预约可能已被删除或编号错误">
    <template #action>
      <router-link to="/visitor" class="btn-primary btn-sm">返回列表</router-link>
    </template>
  </EmptyState>
</template>

<script setup>
import { ref, reactive, computed, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore, visitorPurposes, visitorStatusMap, visitorStatusColorMap } from '../../store'
import EmptyState from '../../components/EmptyState.vue'
import { h } from 'vue'

const router = useRouter()
const route = useRoute()
const showToast = inject('showToast')
const currentRole = inject('currentRole')
const store = useStore()

const record = computed(() => store.getVisitorById(route.params.id))

const showAuditModal = ref(false)
const showReleaseModal = ref(false)
const showLeaveModal = ref(false)
const showCancelModal = ref(false)
const showRemarkModal = ref(false)

const auditForm = reactive({
  isApproved: true,
  remark: ''
})

const releaseForm = reactive({
  gate: ''
})

const leaveForm = reactive({
  gate: ''
})

const cancelForm = reactive({
  reason: ''
})

const remarkForm = reactive({
  content: ''
})

const canAudit = computed(() => {
  return record.value?.status === 'pending' && ['service', 'housekeeper'].includes(currentRole.value)
})

const canRelease = computed(() => {
  return record.value?.status === 'approved' && ['security', 'service'].includes(currentRole.value)
})

const canSign = computed(() => {
  return record.value?.status === 'released' && ['housekeeper', 'service'].includes(currentRole.value)
})

const canLeave = computed(() => {
  return record.value?.status === 'signed' && ['security', 'service'].includes(currentRole.value)
})

const canEdit = computed(() => {
  return record.value && !['left', 'rejected', 'cancelled'].includes(record.value.status) && ['service', 'housekeeper'].includes(currentRole.value)
})

const canCancel = computed(() => {
  return record.value && !['left', 'cancelled', 'rejected'].includes(record.value.status)
})

const blockedReasons = computed(() => {
  const reasons = []
  if (!record.value) return reasons
  
  if (!record.value.visitorPhone || record.value.visitorPhone.length < 11) {
    reasons.push('访客手机号信息不完整，需要补充后才能放行')
  }
  if (!record.value.roomNumber) {
    reasons.push('拜访房号信息不完整，需要补充后才能放行')
  }
  if (record.value.status === 'rejected') {
    reasons.push('该预约已被审核拒绝，无法放行')
  }
  if (record.value.status === 'cancelled') {
    reasons.push('该预约已被取消，无法放行')
  }
  if (record.value.status === 'pending') {
    reasons.push('该预约尚未审核，需要先通过审核才能放行')
  }
  
  return reasons
})

const sortedLogs = computed(() => {
  if (!record.value) return []
  return [...record.value.processLogs].sort((a, b) => a.time.localeCompare(b.time))
})

const processSteps = computed(() => {
  if (!record.value) return []
  const r = record.value
  const steps = [
    {
      name: '提交预约',
      status: 'done',
      time: r.createTime,
      operator: r.createOperator
    },
    {
      name: '审核',
      status: r.auditTime ? 'done' : (r.status === 'pending' ? 'current' : (['rejected', 'cancelled', 'expired'].includes(r.status) ? 'done' : 'pending')),
      time: r.auditTime,
      operator: r.auditOperator,
      extra: r.auditRemark || null
    },
    {
      name: '门岗放行',
      status: r.releaseTime ? 'done' : (['approved'].includes(r.status) ? 'current' : 'pending'),
      time: r.releaseTime,
      operator: r.releaseOperator,
      extra: r.releaseGate ? `入口：${r.releaseGate}` : null
    },
    {
      name: '楼栋签到',
      status: r.signTime ? 'done' : (['released'].includes(r.status) ? 'current' : 'pending'),
      time: r.signTime,
      operator: r.signOperator
    },
    {
      name: '登记离场',
      status: r.leaveTime ? 'done' : (['signed'].includes(r.status) ? 'current' : 'pending'),
      time: r.leaveTime,
      operator: r.leaveOperator,
      extra: r.leaveGate ? `出口：${r.leaveGate}` : null
    }
  ]
  return steps
})

const durationText = computed(() => {
  if (!record.value?.signTime || !record.value?.leaveTime) return null
  const sign = new Date(record.value.signTime.replace(' ', 'T'))
  const leave = new Date(record.value.leaveTime.replace(' ', 'T'))
  const diffMs = leave - sign
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  }
  return `${minutes}分钟`
})

const getPurposeLabel = (value) => {
  const p = visitorPurposes.find(p => p.value === value)
  return p ? p.label : value
}

const getLogIconClass = (action) => {
  switch (action) {
    case '提交预约':
      return 'bg-blue-100 text-blue-600'
    case '审核通过':
      return 'bg-green-100 text-green-600'
    case '审核拒绝':
      return 'bg-red-100 text-red-600'
    case '放行':
      return 'bg-purple-100 text-purple-600'
    case '签到确认':
      return 'bg-teal-100 text-teal-600'
    case '登记离场':
      return 'bg-gray-100 text-gray-600'
    case '取消预约':
      return 'bg-orange-100 text-orange-600'
    case '修改信息':
      return 'bg-yellow-100 text-yellow-600'
    case '补充备注':
      return 'bg-indigo-100 text-indigo-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

const getLogIcon = (action) => {
  const iconMap = {
    '提交预约': {
      render() {
        return h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M12 4v16m8-8H4'
        })
      }
    },
    '审核通过': {
      render() {
        return h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M5 13l4 4L19 7'
        })
      }
    },
    '审核拒绝': {
      render() {
        return h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M6 18L18 6M6 6l12 12'
        })
      }
    },
    '放行': {
      render() {
        return h('g', {}, [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M9 12l2 2 4-4'
          }),
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M5.618 4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 016.382 1.072M12 22c4.418 0 8.058-2.984 9.178-6.938M2.822 15.062C3.942 19.016 7.582 22 12 22z'
          })
        ])
      }
    },
    '签到确认': {
      render() {
        return h('g', {}, [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
          }),
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M15 11a3 3 0 11-6 0 3 3 0 016 0z'
          })
        ])
      }
    },
    '登记离场': {
      render() {
        return h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
        })
      }
    },
    '取消预约': {
      render() {
        return h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M6 18L18 6M6 6l12 12'
        })
      }
    },
    '修改信息': {
      render() {
        return h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
        })
      }
    },
    '补充备注': {
      render() {
        return h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'
        })
      }
    }
  }
  const defaultIcon = {
    render() {
      return h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      })
    }
  }
  return iconMap[action] || defaultIcon
}

const goToEdit = () => {
  router.push(`/visitor/create?id=${record.value.id}`)
}

const openAuditModal = (isApproved) => {
  auditForm.isApproved = isApproved
  auditForm.remark = ''
  showAuditModal.value = true
}

const submitAudit = () => {
  if (!auditForm.isApproved && !auditForm.remark.trim()) {
    showToast('请填写拒绝原因', 'error')
    return
  }
  const operator = getOperatorName()
  const result = store.auditVisitor(record.value.id, operator, auditForm.isApproved, auditForm.remark.trim())
  if (result) {
    showToast(auditForm.isApproved ? '审核通过成功' : '已拒绝该预约', auditForm.isApproved ? 'success' : 'warning')
    showAuditModal.value = false
  } else {
    showToast('操作失败，请重试', 'error')
  }
}

const openReleaseModal = () => {
  releaseForm.gate = ''
  showReleaseModal.value = true
}

const submitRelease = () => {
  if (!releaseForm.gate) {
    showToast('请选择放行门岗', 'error')
    return
  }
  const operator = getOperatorName()
  const result = store.releaseVisitor(record.value.id, operator, releaseForm.gate, currentRole.value)
  if (result.success) {
    showToast('放行成功', 'success')
    showReleaseModal.value = false
  } else {
    showToast(result.message, 'error')
  }
}

const handleSign = () => {
  const operator = getOperatorName()
  const result = store.signVisitor(record.value.id, operator)
  if (result) {
    showToast('签到确认成功', 'success')
  } else {
    showToast('签到失败，请检查状态', 'error')
  }
}

const openLeaveModal = () => {
  leaveForm.gate = ''
  showLeaveModal.value = true
}

const submitLeave = () => {
  if (!leaveForm.gate) {
    showToast('请选择离场门岗', 'error')
    return
  }
  const operator = getOperatorName()
  const result = store.leaveVisitor(record.value.id, operator, leaveForm.gate)
  if (result) {
    showToast('离场登记成功', 'success')
    showLeaveModal.value = false
  } else {
    showToast('操作失败，请重试', 'error')
  }
}

const openCancelModal = () => {
  cancelForm.reason = ''
  showCancelModal.value = true
}

const submitCancel = () => {
  if (!cancelForm.reason.trim()) {
    showToast('请填写取消原因', 'error')
    return
  }
  const operator = getOperatorName()
  const result = store.cancelVisitor(record.value.id, operator, cancelForm.reason.trim())
  if (result) {
    showToast('预约已取消', 'warning')
    showCancelModal.value = false
  } else {
    showToast('操作失败，请重试', 'error')
  }
}

const openRemarkModal = () => {
  remarkForm.content = ''
  showRemarkModal.value = true
}

const submitRemark = () => {
  if (!remarkForm.content.trim()) {
    showToast('请输入备注内容', 'error')
    return
  }
  const operator = getOperatorName()
  const result = store.addVisitorRemark(record.value.id, remarkForm.content.trim(), operator)
  if (result) {
    showToast('备注已保存', 'success')
    showRemarkModal.value = false
  } else {
    showToast('保存失败，请重试', 'error')
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
