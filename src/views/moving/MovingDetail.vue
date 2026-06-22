<template>
  <div v-if="record" class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button @click="goBack" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            搬家预约详情
            <span class="badge ml-3" :class="movingStatusColorMap[record.status]">
              {{ movingStatusMap[record.status] }}
            </span>
          </h1>
          <p class="text-sm text-gray-500 mt-1">预约号：{{ record.id }}</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <button v-if="canAudit" @click="showAuditModal = true; auditForm.isApproved = true" class="btn-success btn-sm">
          审核通过
        </button>
        <button v-if="canAudit" @click="showAuditModal = true; auditForm.isApproved = false" class="btn-danger btn-sm">
          审核拒绝
        </button>
        <button v-if="canDeposit" @click="showDepositModal = true" class="btn-secondary btn-sm">
          押金登记
        </button>
        <button v-if="canReleaseEntry" @click="showEntryReleaseModal = true" class="btn-primary btn-sm">
          入场放行
        </button>
        <button v-if="canVerify" @click="showVerifyModal = true" class="btn-secondary btn-sm">
          现场核验
        </button>
        <button v-if="canReleaseExit" @click="showExitReleaseModal = true" class="btn-secondary btn-sm">
          离场放行
        </button>
        <button v-if="canComplete" @click="showCompleteModal = true" class="btn-success btn-sm">
          完结登记
        </button>
        <button v-if="canCancel" @click="showCancelModal = true" class="btn-danger btn-sm">
          取消预约
        </button>
      </div>
    </div>

    <div v-if="record.hasAbnormal" class="card p-5 bg-red-50 border-2 border-red-200">
      <div class="flex items-start">
        <svg class="w-6 h-6 text-red-500 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <h3 class="text-lg font-semibold text-red-800 mb-3">异常提醒</h3>
          <div class="flex flex-wrap gap-3">
            <div 
              v-for="type in record.abnormalTypes" 
              :key="type"
              class="px-4 py-2 bg-white rounded-lg border border-red-200"
            >
              <span class="text-sm font-medium text-red-700">{{ getAbnormalLabel(type) }}</span>
              <p class="text-xs text-gray-600 mt-0.5">{{ getAbnormalDescription(type) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-5 flex items-center">
            <span class="w-1 h-5 bg-primary-500 rounded-full mr-3"></span>
            基本信息
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="flex items-start">
              <span class="text-sm text-gray-500 w-24 flex-shrink-0">搬家类型</span>
              <span 
                class="badge"
                :class="record.movingType === 'move_in' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'"
              >
                {{ getMovingTypeLabel(record.movingType) }}
              </span>
            </div>
            <div class="flex items-start">
              <span class="text-sm text-gray-500 w-24 flex-shrink-0">房屋信息</span>
              <span class="text-sm font-medium text-gray-900">{{ record.roomNumber }}</span>
            </div>
            <div class="flex items-start">
              <span class="text-sm text-gray-500 w-24 flex-shrink-0">业主姓名</span>
              <span class="text-sm font-medium text-gray-900">{{ record.ownerName }}</span>
            </div>
            <div class="flex items-start">
              <span class="text-sm text-gray-500 w-24 flex-shrink-0">业主电话</span>
              <span class="text-sm text-gray-900">{{ record.ownerPhone }}</span>
            </div>
            <div class="flex items-start">
              <span class="text-sm text-gray-500 w-24 flex-shrink-0">联系人</span>
              <span class="text-sm font-medium text-gray-900">{{ record.contactName }}</span>
            </div>
            <div class="flex items-start">
              <span class="text-sm text-gray-500 w-24 flex-shrink-0">联系电话</span>
              <span class="text-sm text-gray-900">{{ record.contactPhone }}</span>
            </div>
            <div class="flex items-start">
              <span class="text-sm text-gray-500 w-24 flex-shrink-0">同行人数</span>
              <span class="text-sm text-gray-900">{{ record.companionCount }} 人</span>
            </div>
            <div class="flex items-start">
              <span class="text-sm text-gray-500 w-24 flex-shrink-0">搬运工人</span>
              <span class="text-sm text-gray-900">{{ record.workerCount }} 人</span>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-5 flex items-center">
            <span class="w-1 h-5 bg-primary-500 rounded-full mr-3"></span>
            时间与车辆
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="flex items-start">
              <span class="text-sm text-gray-500 w-24 flex-shrink-0">开始时间</span>
              <span class="text-sm font-medium text-gray-900">{{ record.moveStartTime }}</span>
            </div>
            <div class="flex items-start">
              <span class="text-sm text-gray-500 w-24 flex-shrink-0">结束时间</span>
              <span class="text-sm font-medium text-gray-900">{{ record.moveEndTime }}</span>
            </div>
            <div class="flex items-start">
              <span class="text-sm text-gray-500 w-24 flex-shrink-0">车辆数量</span>
              <span class="text-sm text-gray-900">{{ record.vehicleCount }} 辆</span>
            </div>
            <div class="flex items-start">
              <span class="text-sm text-gray-500 w-24 flex-shrink-0">车牌号码</span>
              <span class="text-sm font-mono text-gray-900">{{ record.plateNumber || '-' }}</span>
            </div>
            <div v-if="record.movingCompany" class="flex items-start">
              <span class="text-sm text-gray-500 w-24 flex-shrink-0">搬家公司</span>
              <span class="text-sm text-gray-900">{{ record.movingCompany }}</span>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-5 flex items-center">
            <span class="w-1 h-5 bg-primary-500 rounded-full mr-3"></span>
            申报物品清单
          </h2>
          <div v-if="record.declaredItems && record.declaredItems.length > 0" class="flex flex-wrap gap-2">
            <span 
              v-for="(item, idx) in record.declaredItems" 
              :key="idx"
              class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {{ item }}
            </span>
          </div>
          <p v-else class="text-sm text-gray-400">暂无申报物品</p>
        </div>

        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-5 flex items-center">
            <span class="w-1 h-5 bg-primary-500 rounded-full mr-3"></span>
            押金信息
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-xs text-gray-500 mb-1">申报押金</p>
              <p class="text-xl font-bold text-gray-900">¥{{ record.depositAmount }}</p>
            </div>
            <div class="p-4 rounded-lg" :class="record.depositTime ? 'bg-green-50' : 'bg-gray-50'">
              <p class="text-xs text-gray-500 mb-1">实缴押金</p>
              <p class="text-xl font-bold" :class="record.depositTime ? 'text-green-600' : 'text-gray-400'">
                {{ record.depositTime ? '¥' + record.depositAmount : '未缴纳' }}
              </p>
            </div>
            <div class="p-4 rounded-lg" :class="record.depositRefunded ? 'bg-blue-50' : 'bg-gray-50'">
              <p class="text-xs text-gray-500 mb-1">押金状态</p>
              <p class="text-sm font-medium" :class="record.depositRefunded ? 'text-blue-600' : (record.depositTime ? 'text-green-600' : 'text-red-500')">
                {{ record.depositRefunded ? '已退还' : (record.depositTime ? '已缴纳' : '未缴纳') }}
              </p>
            </div>
          </div>
          <div v-if="record.depositTime" class="mt-4 pt-4 border-t">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span class="text-gray-500">缴费时间：</span>
                <span class="text-gray-900">{{ record.depositTime }}</span>
              </div>
              <div>
                <span class="text-gray-500">缴费方式：</span>
                <span class="text-gray-900">{{ record.depositMethod || '-' }}</span>
              </div>
              <div>
                <span class="text-gray-500">操作人：</span>
                <span class="text-gray-900">{{ record.depositOperator || '-' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="record.remark || record.specialNote" class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-5 flex items-center">
            <span class="w-1 h-5 bg-primary-500 rounded-full mr-3"></span>
            备注信息
          </h2>
          <div class="space-y-3">
            <div v-if="record.specialNote">
              <p class="text-sm text-gray-500 mb-1">特殊说明</p>
              <p class="text-sm text-gray-900">{{ record.specialNote }}</p>
            </div>
            <div v-if="record.remark">
              <p class="text-sm text-gray-500 mb-1">备注</p>
              <p class="text-sm text-gray-900">{{ record.remark }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-5 flex items-center">
            <span class="w-1 h-5 bg-primary-500 rounded-full mr-3"></span>
            流程进度
          </h2>
          <div class="space-y-4">
            <div 
              v-for="(step, idx) in processSteps" 
              :key="step.key"
              class="flex items-start"
            >
              <div class="flex flex-col items-center mr-4">
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                  :class="getStepClass(step)"
                >
                  <span v-if="step.status === 'done'">✓</span>
                  <span v-else-if="step.status === 'current'">{{ idx + 1 }}</span>
                  <span v-else class="text-gray-400">{{ idx + 1 }}</span>
                </div>
                <div 
                  v-if="idx < processSteps.length - 1" 
                  class="w-0.5 h-8 mt-2"
                  :class="step.status === 'done' ? 'bg-green-400' : 'bg-gray-200'"
                ></div>
              </div>
              <div class="flex-1 pt-1">
                <p class="text-sm font-medium" :class="step.status === 'current' ? 'text-primary-600' : (step.status === 'done' ? 'text-gray-900' : 'text-gray-400')">
                  {{ step.label }}
                </p>
                <p v-if="step.time" class="text-xs text-gray-500 mt-0.5">{{ step.time }}</p>
                <p v-if="step.remark" class="text-xs text-gray-500 mt-0.5">{{ step.remark }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-5 flex items-center">
            <span class="w-1 h-5 bg-primary-500 rounded-full mr-3"></span>
            操作记录
          </h2>
          <div v-if="record.processLogs && record.processLogs.length > 0" class="space-y-4">
            <div 
              v-for="(log, idx) in record.processLogs" 
              :key="idx"
              class="relative pl-6 pb-4 border-l-2 border-gray-200 last:pb-0 last:border-transparent"
            >
              <div class="absolute -left-2 top-0 w-4 h-4 rounded-full" :class="getLogDotClass(log.action)"></div>
              <div class="flex items-baseline justify-between">
                <span class="text-sm font-medium text-gray-900">{{ log.action }}</span>
                <span class="text-xs text-gray-400">{{ log.time }}</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">操作人：{{ log.operator }}</p>
              <p v-if="log.content" class="text-xs text-gray-600 mt-1 bg-gray-50 px-2 py-1 rounded whitespace-pre-wrap">{{ log.content }}</p>
            </div>
          </div>
          <p v-else class="text-sm text-gray-400">暂无操作记录</p>
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
            <p class="text-sm mt-1"><span class="text-gray-500">业主：</span><span class="font-medium">{{ record.ownerName }} · {{ record.roomNumber }}</span></p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">审核备注</label>
            <textarea 
              v-model="auditForm.remark" 
              class="textarea h-24" 
              :placeholder="auditForm.isApproved ? '请填写审核备注（可选）...' : '请填写拒绝原因...'"
            ></textarea>
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
      <div v-if="showDepositModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            押金登记
          </h3>
          <div class="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <p class="text-sm"><span class="text-gray-500">预约号：</span><span class="font-mono font-medium">{{ record.id }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">业主：</span><span class="font-medium">{{ record.ownerName }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">申报押金：</span><span class="font-medium text-indigo-600">¥{{ record.depositAmount }}</span></p>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">实缴押金金额 <span class="text-red-500">*</span></label>
              <select v-model.number="depositForm.amount" class="select">
                <option v-for="opt in depositAmountOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">缴费方式 <span class="text-red-500">*</span></label>
              <select v-model="depositForm.method" class="select">
                <option value="">请选择缴费方式</option>
                <option value="现金">现金</option>
                <option value="微信支付">微信支付</option>
                <option value="支付宝">支付宝</option>
                <option value="银行转账">银行转账</option>
                <option value="在线支付">在线支付</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button @click="showDepositModal = false" class="btn-secondary">取消</button>
            <button @click="submitDeposit" class="btn-primary">确认登记</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showEntryReleaseModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            入场放行
          </h3>
          <div class="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
            <p class="text-sm"><span class="text-gray-500">预约号：</span><span class="font-mono font-medium">{{ record.id }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">业主：</span><span class="font-medium">{{ record.ownerName }} · {{ record.roomNumber }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">车辆：</span><span class="font-medium">{{ record.plateNumber || '未登记' }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">预约时间：</span><span class="font-medium">{{ record.moveStartTime }}</span></p>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">入场门岗 <span class="text-red-500">*</span></label>
              <select v-model="entryReleaseForm.gate" class="select">
                <option value="">请选择入场门岗</option>
                <option value="东门">东门</option>
                <option value="南门">南门</option>
                <option value="西门">西门</option>
                <option value="北门">北门</option>
              </select>
            </div>
            <div class="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p class="text-sm text-yellow-800 flex items-start">
                <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                放行前请核对车辆信息、搬家工人数量，确认与预约信息一致。注意保护公共区域设施。
              </p>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button @click="showEntryReleaseModal = false" class="btn-secondary">取消</button>
            <button @click="submitEntryRelease" class="btn-primary">确认入场</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showVerifyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            现场核验
          </h3>
          <div class="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
            <p class="text-sm"><span class="text-gray-500">预约号：</span><span class="font-mono font-medium">{{ record.id }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">房号：</span><span class="font-medium">{{ record.roomNumber }}</span></p>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">申报物品清单</label>
              <div class="p-3 bg-gray-50 rounded-lg">
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="(item, idx) in record.declaredItems" 
                    :key="idx"
                    class="px-2 py-1 bg-white border border-gray-200 rounded text-sm"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">核验结果 <span class="text-red-500">*</span></label>
              <div class="flex gap-4">
                <label class="flex items-center">
                  <input type="radio" v-model="verifyForm.itemsConsistent" :value="true" class="mr-2" />
                  <span class="text-green-600 font-medium">物品一致，无异常</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="verifyForm.itemsConsistent" :value="false" class="mr-2" />
                  <span class="text-red-600 font-medium">物品不一致，有异常</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">核验说明</label>
              <textarea 
                v-model="verifyForm.remark" 
                class="textarea h-24" 
                placeholder="请填写核验情况说明..."
              ></textarea>
            </div>
            <div class="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p class="text-sm text-blue-800 flex items-start">
                <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                请仔细核对搬运物品是否与申报一致，检查公共区域是否有损坏。物品不一致的需记录清楚。
              </p>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button @click="showVerifyModal = false" class="btn-secondary">取消</button>
            <button @click="submitVerify" class="btn-primary">确认核验</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showExitReleaseModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            离场放行
          </h3>
          <div class="mb-4 p-3 bg-teal-50 rounded-lg border border-teal-100">
            <p class="text-sm"><span class="text-gray-500">预约号：</span><span class="font-mono font-medium">{{ record.id }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">业主：</span><span class="font-medium">{{ record.ownerName }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">入口：</span><span class="font-medium">{{ record.entryReleaseGate || '未记录' }}</span></p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">离场门岗 <span class="text-red-500">*</span></label>
            <select v-model="exitReleaseForm.gate" class="select">
              <option value="">请选择离场门岗</option>
              <option value="东门">东门</option>
              <option value="南门">南门</option>
              <option value="西门">西门</option>
              <option value="北门">北门</option>
            </select>
          </div>
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button @click="showExitReleaseModal = false" class="btn-secondary">取消</button>
            <button @click="submitExitRelease" class="btn-primary">确认离场</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showCompleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center text-green-600">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            完结登记
          </h3>
          <div class="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
            <p class="text-sm"><span class="text-gray-500">预约号：</span><span class="font-mono font-medium">{{ record.id }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">业主：</span><span class="font-medium">{{ record.ownerName }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">押金金额：</span><span class="font-medium">¥{{ record.depositAmount }}</span></p>
          </div>
          <div class="space-y-4">
            <div>
              <label class="flex items-center">
                <input type="checkbox" v-model="completeForm.refundDeposit" class="mr-2" />
                <span class="text-sm font-medium text-gray-700">退还押金</span>
              </label>
              <p class="text-xs text-gray-500 ml-6 mt-1">勾选后押金将退还业主</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">完结备注</label>
              <textarea 
                v-model="completeForm.remark" 
                class="textarea h-20" 
                placeholder="请填写完结备注（可选）..."
              ></textarea>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button @click="showCompleteModal = false" class="btn-secondary">取消</button>
            <button @click="submitComplete" class="btn-success">确认完结</button>
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
          <div class="mb-4 p-3 bg-red-50 rounded-lg border border-red-100">
            <p class="text-sm"><span class="text-gray-500">预约号：</span><span class="font-mono font-medium">{{ record.id }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">业主：</span><span class="font-medium">{{ record.ownerName }}</span></p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">取消原因 <span class="text-red-500">*</span></label>
            <textarea 
              v-model="cancelForm.reason" 
              class="textarea h-24" 
              placeholder="请填写取消原因..."
            ></textarea>
          </div>
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button @click="showCancelModal = false" class="btn-secondary">返回</button>
            <button @click="submitCancel" class="btn-danger">确认取消</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
  <EmptyState v-else title="记录不存在" description="该预约记录可能已被删除，请返回列表查看">
    <template #action>
      <router-link to="/moving" class="btn-primary">返回列表</router-link>
    </template>
  </EmptyState>
</template>

<script setup>
import { ref, reactive, computed, inject, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore, movingTypes, movingStatusMap, movingStatusColorMap, depositAmountOptions } from '../../store'
import EmptyState from '../../components/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const showToast = inject('showToast')
const currentRole = inject('currentRole')
const store = useStore()

const showAuditModal = ref(false)
const showDepositModal = ref(false)
const showEntryReleaseModal = ref(false)
const showVerifyModal = ref(false)
const showExitReleaseModal = ref(false)
const showCompleteModal = ref(false)
const showCancelModal = ref(false)

const auditForm = reactive({
  isApproved: true,
  remark: ''
})

const depositForm = reactive({
  amount: 1000,
  method: ''
})

const entryReleaseForm = reactive({
  gate: ''
})

const verifyForm = reactive({
  itemsConsistent: null,
  remark: ''
})

const exitReleaseForm = reactive({
  gate: ''
})

const completeForm = reactive({
  refundDeposit: true,
  remark: ''
})

const cancelForm = reactive({
  reason: ''
})

const record = computed(() => {
  const id = route.params.id
  return store.getMovingById(id)
})

const canAudit = computed(() => {
  if (!record.value) return false
  return record.value.status === 'pending_audit' && ['service', 'housekeeper'].includes(currentRole.value)
})

const canDeposit = computed(() => {
  if (!record.value) return false
  return record.value.status === 'audit_approved' && 
    !record.value.depositTime && 
    ['service', 'housekeeper'].includes(currentRole.value)
})

const canReleaseEntry = computed(() => {
  if (!record.value) return false
  return record.value.status === 'deposit_paid' && ['security', 'service'].includes(currentRole.value)
})

const canVerify = computed(() => {
  if (!record.value) return false
  return ['entry_released', 'verifying'].includes(record.value.status) && 
    ['housekeeper', 'service'].includes(currentRole.value)
})

const canReleaseExit = computed(() => {
  if (!record.value) return false
  return ['entry_released', 'verifying'].includes(record.value.status) && 
    ['security', 'service'].includes(currentRole.value)
})

const canComplete = computed(() => {
  if (!record.value) return false
  return ['exit_released', 'verifying'].includes(record.value.status) && 
    ['service', 'housekeeper'].includes(currentRole.value)
})

const canCancel = computed(() => {
  if (!record.value) return false
  return !['completed', 'cancelled', 'audit_rejected', 'expired'].includes(record.value.status)
})

const processSteps = computed(() => {
  if (!record.value) return []
  const r = record.value
  const steps = []
  
  steps.push({
    key: 'create',
    label: '预约登记',
    status: 'done',
    time: r.createTime,
    remark: r.createOperator ? `操作人：${r.createOperator}` : ''
  })
  
  if (r.auditTime || ['audit_approved', 'audit_rejected', 'deposit_paid', 'entry_released', 'verifying', 'exit_released', 'completed', 'cancelled'].includes(r.status)) {
    steps.push({
      key: 'audit',
      label: r.auditApproved !== false ? '物业审核通过' : '物业审核拒绝',
      status: 'done',
      time: r.auditTime,
      remark: r.auditOperator ? `操作人：${r.auditOperator}` : ''
    })
  } else {
    steps.push({
      key: 'audit',
      label: '物业审核',
      status: r.status === 'pending_audit' ? 'current' : 'pending'
    })
  }
  
  if (r.depositTime || ['deposit_paid', 'entry_released', 'verifying', 'exit_released', 'completed', 'cancelled'].includes(r.status)) {
    steps.push({
      key: 'deposit',
      label: '押金登记',
      status: 'done',
      time: r.depositTime,
      remark: r.depositAmount ? `金额：¥${r.depositAmount}` : ''
    })
  } else if (['audit_approved'].includes(r.status) || r.status === 'pending_audit') {
    steps.push({
      key: 'deposit',
      label: '押金登记',
      status: ['audit_approved'].includes(r.status) ? 'current' : 'pending'
    })
  }
  
  if (r.entryReleaseTime || ['entry_released', 'verifying', 'exit_released', 'completed'].includes(r.status)) {
    steps.push({
      key: 'entry',
      label: '入场放行',
      status: 'done',
      time: r.entryReleaseTime,
      remark: r.entryReleaseGate ? `门岗：${r.entryReleaseGate}` : ''
    })
  } else {
    steps.push({
      key: 'entry',
      label: '入场放行',
      status: r.status === 'deposit_paid' ? 'current' : 'pending'
    })
  }
  
  if (r.verifyTime || ['verifying', 'exit_released', 'completed'].includes(r.status)) {
    steps.push({
      key: 'verify',
      label: r.itemsConsistent !== false ? '现场核验通过' : '现场核验异常',
      status: 'done',
      time: r.verifyTime,
      remark: r.verifyOperator ? `操作人：${r.verifyOperator}` : ''
    })
  } else {
    steps.push({
      key: 'verify',
      label: '现场核验',
      status: ['entry_released'].includes(r.status) ? 'current' : 'pending'
    })
  }
  
  if (r.exitReleaseTime || ['exit_released', 'completed'].includes(r.status)) {
    steps.push({
      key: 'exit',
      label: '离场放行',
      status: 'done',
      time: r.exitReleaseTime,
      remark: r.exitReleaseGate ? `门岗：${r.exitReleaseGate}` : ''
    })
  } else {
    steps.push({
      key: 'exit',
      label: '离场放行',
      status: ['verifying', 'entry_released'].includes(r.status) ? 'current' : 'pending'
    })
  }
  
  if (r.completeTime || r.status === 'completed') {
    steps.push({
      key: 'complete',
      label: '完结登记',
      status: 'done',
      time: r.completeTime,
      remark: r.depositRefunded ? '押金已退还' : ''
    })
  } else if (r.status === 'cancelled') {
    steps.push({
      key: 'cancel',
      label: '已取消',
      status: 'done',
      time: r.cancelTime,
      remark: r.cancelReason || ''
    })
  } else {
    steps.push({
      key: 'complete',
      label: '完结登记',
      status: 'pending'
    })
  }
  
  return steps
})

const getStepClass = (step) => {
  if (step.status === 'done') return 'bg-green-500 text-white'
  if (step.status === 'current') return 'bg-primary-500 text-white'
  return 'bg-gray-200 text-gray-500'
}

const getLogDotClass = (action) => {
  const map = [
    { keyword: '提交', color: 'bg-blue-400' },
    { keyword: '审核', color: 'bg-yellow-400' },
    { keyword: '押金', color: 'bg-indigo-400' },
    { keyword: '入场', color: 'bg-purple-400' },
    { keyword: '核验', color: 'bg-orange-400' },
    { keyword: '离场', color: 'bg-teal-400' },
    { keyword: '完结', color: 'bg-green-400' },
    { keyword: '取消', color: 'bg-red-400' }
  ]
  const match = map.find(m => action.includes(m.keyword))
  return match ? match.color : 'bg-gray-400'
}

const getMovingTypeLabel = (value) => {
  const t = movingTypes.find(t => t.value === value)
  return t ? t.label : value
}

const getAbnormalLabel = (type) => {
  const map = {
    'material_incomplete': '资料不齐',
    'deposit_unpaid': '押金未缴',
    'overtime': '预约超时',
    'items_inconsistent': '物品不符'
  }
  return map[type] || type
}

const getAbnormalDescription = (type) => {
  const map = {
    'material_incomplete': '提交的资料不完整，请补充',
    'deposit_unpaid': '押金尚未缴纳，请尽快缴纳',
    'overtime': '搬家已超时，请关注进度',
    'items_inconsistent': '现场核验物品与申报不一致'
  }
  return map[type] || ''
}

const goBack = () => {
  router.back()
}

const submitAudit = () => {
  const operator = getOperatorName()
  const result = store.auditMoving(record.value.id, operator, auditForm.isApproved, auditForm.remark.trim())
  if (result) {
    showToast(auditForm.isApproved ? '审核通过成功' : '已拒绝该预约', auditForm.isApproved ? 'success' : 'warning')
    showAuditModal.value = false
  } else {
    showToast('操作失败，请重试', 'error')
  }
}

const submitDeposit = () => {
  if (!depositForm.method) {
    showToast('请选择缴费方式', 'error')
    return
  }
  const operator = getOperatorName()
  const result = store.registerDeposit(record.value.id, operator, depositForm.amount, depositForm.method)
  if (result) {
    showToast('押金登记成功', 'success')
    showDepositModal.value = false
  } else {
    showToast('操作失败，请重试', 'error')
  }
}

const submitEntryRelease = () => {
  if (!entryReleaseForm.gate) {
    showToast('请选择入场门岗', 'error')
    return
  }
  const operator = getOperatorName()
  const result = store.releaseEntryMoving(record.value.id, operator, entryReleaseForm.gate)
  if (result.success) {
    showToast('入场放行成功', 'success')
    showEntryReleaseModal.value = false
  } else {
    showToast(result.message, 'error')
  }
}

const submitVerify = () => {
  if (verifyForm.itemsConsistent === null) {
    showToast('请选择核验结果', 'error')
    return
  }
  const operator = getOperatorName()
  const result = store.verifyMoving(
    record.value.id, 
    operator, 
    verifyForm.itemsConsistent ? 'normal' : 'abnormal', 
    verifyForm.remark.trim(), 
    verifyForm.itemsConsistent
  )
  if (result) {
    showToast('核验记录已保存', 'success')
    showVerifyModal.value = false
  } else {
    showToast('操作失败，请重试', 'error')
  }
}

const submitExitRelease = () => {
  if (!exitReleaseForm.gate) {
    showToast('请选择离场门岗', 'error')
    return
  }
  const operator = getOperatorName()
  const result = store.releaseExitMoving(record.value.id, operator, exitReleaseForm.gate)
  if (result.success) {
    showToast('离场放行成功', 'success')
    showExitReleaseModal.value = false
  } else {
    showToast(result.message, 'error')
  }
}

const submitComplete = () => {
  const operator = getOperatorName()
  const result = store.completeMoving(
    record.value.id, 
    operator, 
    completeForm.remark.trim(), 
    completeForm.refundDeposit
  )
  if (result) {
    showToast('已完结登记', 'success')
    showCompleteModal.value = false
  } else {
    showToast('操作失败，请重试', 'error')
  }
}

const submitCancel = () => {
  if (!cancelForm.reason.trim()) {
    showToast('请填写取消原因', 'error')
    return
  }
  const operator = getOperatorName()
  const result = store.cancelMoving(record.value.id, operator, cancelForm.reason.trim())
  if (result) {
    showToast('预约已取消', 'warning')
    showCancelModal.value = false
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

onMounted(() => {
  if (record.value) {
    depositForm.amount = record.value.depositAmount || 1000
    verifyForm.itemsConsistent = record.value.itemsConsistent
    verifyForm.remark = record.value.verifyRemark || ''
  }
})
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
