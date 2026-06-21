<template>
  <div class="space-y-6" v-if="record">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <router-link to="/decoration" class="text-gray-500 hover:text-gray-700">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </router-link>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">装修申请详情</h1>
          <p class="text-sm text-gray-500 mt-1">
            申请编号：<span class="font-mono">{{ record.id }}</span>
            <span class="ml-3 badge" :class="getStatusClass(record.status)">{{ getStatusLabel(record.status) }}</span>
          </p>
        </div>
      </div>
      <div class="flex space-x-3 flex-wrap">
        <button v-if="record.status === 'pending_audit'" @click="showAuditModal = true" class="btn-primary">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            物业审核
          </span>
        </button>
        <button v-if="record.status === 'audit_approved'" @click="handleEnter" class="btn-primary">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            施工进场
          </span>
        </button>
        <button v-if="['constructing', 'rectifying'].includes(record.status)" @click="showInspectionModal = true" class="btn-primary">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            日常巡查
          </span>
        </button>
        <button v-if="record.status === 'rectifying'" @click="showRectificationModal = true" class="btn-warning">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            发放整改
          </span>
        </button>
        <button v-if="['constructing', 'rectifying'].includes(record.status)" @click="handleApplyAcceptance" class="btn-success">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            申请验收
          </span>
        </button>
        <button v-if="record.status === 'completed'" @click="showAcceptanceModal = true" class="btn-primary">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            完工验收
          </span>
        </button>
        <button v-if="record.status === 'acceptance_passed' && !record.depositRefunded" @click="showRefundModal = true" class="btn-success">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            押金退还
          </span>
        </button>
        <button v-if="canApplyExtension()" @click="showExtensionModal = true" class="btn-primary" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-color: #7c3aed;">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            申请延期
          </span>
        </button>
        <button v-if="hasExtensionPending()" @click="showExtensionAuditModal = true" class="btn-warning">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            审核延期申请
          </span>
        </button>
      </div>
    </div>

    <div v-if="hasAnyAbnormal()" class="card p-4 bg-red-50 border-red-200">
      <div class="flex items-start space-x-3">
        <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div class="flex-1">
          <h4 class="text-sm font-medium text-red-800 mb-2">异常提醒</h4>
          <div class="flex flex-wrap gap-2">
            <span v-if="record.isOverdue" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              施工逾期：已超过计划完工日期{{ getOverdueDays() }}天
            </span>
            <span v-if="record.hasViolation" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              存在违规行为
            </span>
            <span v-if="hasMissingMaterials()" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              材料缺失：{{ getMissingMaterialsText() }}
            </span>
            <span v-if="hasUnrectified()" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              整改未完成：{{ getUnrectifiedCount() }}项
            </span>
            <span v-if="record.status === 'acceptance_failed'" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              验收未通过
            </span>
            <span v-if="record.status === 'acceptance_passed' && !record.depositRefunded" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              押金未退还：{{ record.depositAmount }}元
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="card p-5">
          <div class="flex items-start justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">申请信息</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-500">房号</label>
              <p class="font-medium mt-0.5">{{ record.roomNumber }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">业主姓名</label>
              <p class="font-medium mt-0.5">{{ record.ownerName }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">业主电话</label>
              <p class="font-medium mt-0.5">{{ record.ownerPhone }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">装修类型</label>
              <p class="font-medium mt-0.5">{{ getDecorationTypeLabel(record.decorationType) }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">施工期限</label>
              <p class="font-medium mt-0.5">{{ record.startDate }} 至 {{ record.endDate }}</p>
              <div v-if="record.originalEndDate && record.originalEndDate !== record.endDate" class="text-xs text-purple-600 mt-1">
                原计划完工：{{ record.originalEndDate }}（已延期）
              </div>
              <div v-if="hasExtensionPending()" class="text-xs text-yellow-600 mt-1">
                有延期申请待审核
              </div>
            </div>
            <div>
              <label class="text-sm text-gray-500">押金金额</label>
              <p class="font-medium mt-0.5">
                {{ record.depositAmount }}元
                <span v-if="record.depositPaid" class="ml-2 text-xs text-green-600">(已缴纳)</span>
                <span v-else class="ml-2 text-xs text-red-600">(未缴纳)</span>
              </p>
            </div>
            <div class="md:col-span-2">
              <label class="text-sm text-gray-500">装修内容</label>
              <p class="font-medium mt-0.5 text-gray-700">{{ record.decorationContent }}</p>
            </div>
            <div class="md:col-span-2" v-if="record.specialRequirements">
              <label class="text-sm text-gray-500">特殊要求</label>
              <p class="font-medium mt-0.5 text-gray-700">{{ record.specialRequirements }}</p>
            </div>
          </div>
        </div>

        <div class="card p-5">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">施工单位信息</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-500">施工单位</label>
              <p class="font-medium mt-0.5">{{ record.constructionCompany }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">施工许可证号</label>
              <p class="font-medium mt-0.5">{{ record.constructionLicense || '-' }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">施工负责人</label>
              <p class="font-medium mt-0.5">{{ record.foremanName }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">负责人电话</label>
              <p class="font-medium mt-0.5">{{ record.foremanPhone }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">施工人数</label>
              <p class="font-medium mt-0.5">{{ record.workerCount }}人</p>
            </div>
          </div>
        </div>

        <div class="card p-5">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">提交材料清单</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div v-for="(material, index) in record.materialList" :key="index" 
                 class="flex items-center justify-between p-3 rounded-lg"
                 :class="material.provided ? 'bg-green-50' : 'bg-yellow-50'">
              <div class="flex items-center space-x-3">
                <div v-if="material.provided" class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div v-else class="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span class="text-sm font-medium">{{ material.name }}</span>
              </div>
              <span class="text-xs" :class="material.provided ? 'text-green-600' : 'text-yellow-600'">
                {{ material.provided ? '已提供' : '待提供' }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="record.auditResult" class="card p-5">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">审核记录</h2>
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-2">
                <div :class="record.auditResult === 'approved' ? 'bg-green-500' : 'bg-red-500'" class="w-8 h-8 rounded-full flex items-center justify-center">
                  <svg v-if="record.auditResult === 'approved'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium">{{ record.auditResult === 'approved' ? '审核通过' : '审核不通过' }}</p>
                  <p class="text-xs text-gray-500">{{ record.auditOperator }} · {{ record.auditTime }}</p>
                </div>
              </div>
            </div>
            <p v-if="record.auditRemark" class="text-sm text-gray-600 bg-white p-3 rounded border">
              {{ record.auditRemark }}
            </p>
          </div>
        </div>

        <div v-if="record.inspectionRecords && record.inspectionRecords.length > 0" class="card p-5">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">巡查记录 ({{ record.inspectionRecords.length }}次)</h2>
          <div class="space-y-4">
            <div v-for="inspection in record.inspectionRecords" :key="inspection.id" 
                 class="border rounded-lg p-4"
                 :class="inspection.hasViolation ? 'border-orange-300 bg-orange-50' : 'border-gray-200'">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <div :class="inspection.hasViolation ? 'bg-orange-500' : 'bg-blue-500'" class="w-8 h-8 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium">{{ inspection.inspector }}</p>
                    <p class="text-xs text-gray-500">{{ inspection.time }}</p>
                  </div>
                </div>
                <span v-if="inspection.hasViolation" class="badge bg-red-100 text-red-600">发现违规</span>
              </div>
              <p class="text-sm text-gray-700 mb-2">{{ inspection.content }}</p>
              <div v-if="inspection.hasViolation" class="bg-red-50 border border-red-200 rounded p-3">
                <p class="text-sm font-medium text-red-800 mb-1">违规情况</p>
                <p class="text-sm text-red-700">{{ getViolationTypeLabel(inspection.violationType) }}：{{ inspection.violationDesc }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="record.rectificationRecords && record.rectificationRecords.length > 0" class="card p-5">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">整改记录 ({{ record.rectificationRecords.length }}项)</h2>
          <div class="space-y-4">
            <div v-for="rect in record.rectificationRecords" :key="rect.id" 
                 class="border rounded-lg p-4"
                 :class="getRectificationClass(rect)">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-2">
                  <div :class="getRectificationBadgeClass(rect)" class="w-8 h-8 rounded-full flex items-center justify-center">
                    <svg v-if="rect.recheckResult === 'passed'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <svg v-else-if="rect.recheckResult === 'failed'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <svg v-else-if="rect.rectifyTime" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium">{{ getViolationTypeLabel(rect.violationType) }}</p>
                    <p class="text-xs text-gray-500">发放人：{{ rect.issuePerson }} · {{ rect.issueTime }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span :class="getRectificationStatusBadgeClass(rect)" class="badge text-xs">
                    {{ getRectificationStatusLabel(rect) }}
                  </span>
                  <button v-if="!rect.rectifyTime" @click.stop="openSubmitRectification(rect)" class="text-xs text-blue-600 hover:text-blue-800">
                    提交整改
                  </button>
                  <button v-if="rect.rectifyTime && !rect.recheckTime" @click.stop="openRecheckRectification(rect)" class="text-xs text-green-600 hover:text-green-800">
                    复查
                  </button>
                </div>
              </div>
              <div class="space-y-2">
                <div class="bg-white p-3 rounded border">
                  <p class="text-xs text-gray-500 mb-1">违规描述</p>
                  <p class="text-sm text-gray-700">{{ rect.violationDesc }}</p>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-500">整改期限：{{ rect.deadline }}</span>
                  <span v-if="isRectificationOverdue(rect)" class="text-red-600 text-xs font-medium">已逾期</span>
                </div>
                <div v-if="rect.rectifyTime" class="bg-blue-50 p-3 rounded border border-blue-200">
                  <p class="text-xs text-gray-500 mb-1">整改内容 ({{ rect.rectifyTime }})</p>
                  <p class="text-sm text-gray-700">{{ rect.rectifyDesc }}</p>
                </div>
                <div v-if="rect.recheckTime" class="p-3 rounded border" :class="rect.recheckResult === 'passed' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'">
                  <p class="text-xs text-gray-500 mb-1">复查结果 ({{ rect.recheckTime }})</p>
                  <p class="text-sm" :class="rect.recheckResult === 'passed' ? 'text-green-700' : 'text-red-700'">
                    {{ rect.recheckResult === 'passed' ? '复查通过' : '复查不通过' }}：{{ rect.recheckRemark }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="record.acceptanceRecord" class="card p-5">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">验收记录</h2>
          <div :class="record.acceptanceRecord.result === 'passed' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'" class="border rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-2">
                <div :class="record.acceptanceRecord.result === 'passed' ? 'bg-green-500' : 'bg-red-500'" class="w-8 h-8 rounded-full flex items-center justify-center">
                  <svg v-if="record.acceptanceRecord.result === 'passed'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium">{{ record.acceptanceRecord.result === 'passed' ? '验收通过' : '验收不通过' }}</p>
                  <p class="text-xs text-gray-500">验收人：{{ record.acceptanceRecord.checker }} · {{ record.acceptanceRecord.checkTime }}</p>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-4 mb-3">
              <div class="bg-white p-3 rounded text-center">
                <p class="text-2xl font-bold" :class="getScoreColor(record.acceptanceRecord.qualityScore)">{{ record.acceptanceRecord.qualityScore }}</p>
                <p class="text-xs text-gray-500 mt-1">施工质量</p>
              </div>
              <div class="bg-white p-3 rounded text-center">
                <p class="text-2xl font-bold" :class="getScoreColor(record.acceptanceRecord.cleanScore)">{{ record.acceptanceRecord.cleanScore }}</p>
                <p class="text-xs text-gray-500 mt-1">现场清洁</p>
              </div>
              <div class="bg-white p-3 rounded text-center">
                <p class="text-2xl font-bold" :class="getScoreColor(record.acceptanceRecord.structureScore)">{{ record.acceptanceRecord.structureScore }}</p>
                <p class="text-xs text-gray-500 mt-1">结构安全</p>
              </div>
            </div>
            <div class="bg-white p-3 rounded border">
              <p class="text-xs text-gray-500 mb-1">验收意见</p>
              <p class="text-sm text-gray-700">{{ record.acceptanceRecord.remark || '无' }}</p>
            </div>
          </div>
        </div>

        <div v-if="record.extensionRecords && record.extensionRecords.length > 0" class="card p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">延期申请与审批记录 ({{ record.extensionRecords.length }}次)</h2>
          </div>
          <div class="space-y-4">
            <div v-for="ext in record.extensionRecords" :key="ext.id" 
                 class="border rounded-lg p-4"
                 :class="ext.status === 'approved' ? 'border-green-200 bg-green-50' : ext.status === 'rejected' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-2">
                  <div :class="ext.status === 'approved' ? 'bg-green-500' : ext.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'" class="w-8 h-8 rounded-full flex items-center justify-center">
                    <svg v-if="ext.status === 'approved'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <svg v-else-if="ext.status === 'rejected'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <svg v-else class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium">{{ ext.applyOperator }} · 申请延期</p>
                    <p class="text-xs text-gray-500">{{ ext.applyTime }}</p>
                  </div>
                </div>
                <span :class="ext.status === 'approved' ? 'bg-green-100 text-green-700' : ext.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'" class="badge text-xs">
                  {{ ext.status === 'approved' ? '已通过' : ext.status === 'rejected' ? '已驳回' : '待审核' }}
                </span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div class="bg-white p-3 rounded border">
                  <p class="text-xs text-gray-500">申请延期天数</p>
                  <p class="text-sm font-medium mt-0.5">{{ ext.extensionDays }} 天</p>
                </div>
                <div class="bg-white p-3 rounded border">
                  <p class="text-xs text-gray-500">新计划完工时间</p>
                  <p class="text-sm font-medium mt-0.5">{{ ext.newEndDate }}</p>
                </div>
              </div>
              <div class="bg-white p-3 rounded border mb-3">
                <p class="text-xs text-gray-500">延期原因</p>
                <p class="text-sm mt-0.5">{{ ext.reason }}</p>
              </div>
              <div v-if="ext.auditTime" class="p-3 rounded border" :class="ext.status === 'approved' ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'">
                <p class="text-xs text-gray-600 mb-1">
                  {{ ext.status === 'approved' ? '审批通过' : '审批驳回' }} · {{ ext.auditOperator }} · {{ ext.auditTime }}
                </p>
                <p v-if="ext.auditRemark" class="text-sm">{{ ext.auditRemark }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="record.depositRefunded" class="card p-5">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">押金退还记录</h2>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-green-800">押金已退还</p>
                <p class="text-sm text-green-600">退还金额：{{ record.depositRefundAmount }}元</p>
                <p class="text-xs text-gray-500 mt-1">{{ record.depositRefundDate }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="card p-5">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">流程进度</h2>
          <div class="space-y-4">
            <div v-for="(step, index) in processSteps" :key="index" class="flex items-start space-x-4">
              <div class="flex flex-col items-center">
                <div :class="step.status === 'done' ? 'bg-green-500' : step.status === 'current' ? 'bg-blue-500' : 'bg-gray-300'" 
                     class="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium">
                  <svg v-if="step.status === 'done'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <div v-if="index < processSteps.length - 1" 
                     :class="step.status === 'done' ? 'bg-green-500' : 'bg-gray-300'" 
                     class="w-0.5 h-8 mt-2">
                </div>
              </div>
              <div class="flex-1 pt-1">
                <h4 :class="step.status === 'pending' ? 'text-gray-400' : 'text-gray-900'" class="font-medium">{{ step.name }}</h4>
                <p v-if="step.time" class="text-xs text-gray-500 mt-0.5">{{ step.time }}</p>
                <p v-if="step.operator" class="text-xs text-gray-500">{{ step.operator }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card p-5">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">操作日志</h2>
          <div class="space-y-4 max-h-96 overflow-y-auto">
            <div v-for="(log, index) in record.processLogs" :key="index" class="flex space-x-3">
              <div class="flex-shrink-0 w-2 h-2 rounded-full bg-primary-500 mt-2"></div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ log.action }}</p>
                <p class="text-xs text-gray-500">{{ log.operator }} · {{ log.time }}</p>
                <p class="text-sm text-gray-600 mt-1">{{ log.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showAuditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">物业审核</h3>
          <div class="mb-4 p-3 bg-gray-50 rounded-lg">
            <p class="text-sm"><span class="text-gray-500">申请编号：</span><span class="font-mono font-medium">{{ record.id }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">房号：</span><span class="font-medium">{{ record.roomNumber }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">业主：</span><span class="font-medium">{{ record.ownerName }}</span></p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">审核结果 <span class="text-red-500">*</span></label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input v-model="auditForm.result" type="radio" value="approved" class="mr-2" />
                <span class="text-green-600 font-medium">审核通过</span>
              </label>
              <label class="flex items-center">
                <input v-model="auditForm.result" type="radio" value="rejected" class="mr-2" />
                <span class="text-red-600 font-medium">审核不通过</span>
              </label>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">审核意见 <span class="text-red-500">*</span></label>
            <textarea v-model="auditForm.remark" class="textarea h-24" placeholder="请填写审核意见..."></textarea>
            <p v-if="auditErrors.remark" class="text-red-500 text-xs mt-1">{{ auditErrors.remark }}</p>
          </div>
          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button @click="showAuditModal = false" class="btn-secondary">取消</button>
            <button @click="submitAudit" class="btn-primary">确认审核</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showInspectionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">日常巡查</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">巡查人员 <span class="text-red-500">*</span></label>
              <input v-model="inspectionForm.inspector" type="text" class="input" placeholder="请输入巡查人员姓名" />
              <p v-if="inspectionErrors.inspector" class="text-red-500 text-xs mt-1">{{ inspectionErrors.inspector }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">巡查内容 <span class="text-red-500">*</span></label>
              <textarea v-model="inspectionForm.content" class="textarea h-24" placeholder="请详细描述巡查情况..."></textarea>
              <p v-if="inspectionErrors.content" class="text-red-500 text-xs mt-1">{{ inspectionErrors.content }}</p>
            </div>
            <div>
              <label class="flex items-center">
                <input v-model="inspectionForm.hasViolation" type="checkbox" class="mr-2" />
                <span class="text-sm font-medium text-gray-700">发现违规行为</span>
              </label>
            </div>
            <div v-if="inspectionForm.hasViolation" class="space-y-4 p-4 bg-red-50 rounded-lg">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">违规类型 <span class="text-red-500">*</span></label>
                <select v-model="inspectionForm.violationType" class="select">
                  <option value="">请选择违规类型</option>
                  <option v-for="v in store.state.violationTypes" :key="v.value" :value="v.value">{{ v.label }}</option>
                </select>
                <p v-if="inspectionErrors.violationType" class="text-red-500 text-xs mt-1">{{ inspectionErrors.violationType }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">违规描述 <span class="text-red-500">*</span></label>
                <textarea v-model="inspectionForm.violationDesc" class="textarea h-20" placeholder="请详细描述违规情况..."></textarea>
                <p v-if="inspectionErrors.violationDesc" class="text-red-500 text-xs mt-1">{{ inspectionErrors.violationDesc }}</p>
              </div>
            </div>
          </div>
          <div class="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button @click="showInspectionModal = false" class="btn-secondary">取消</button>
            <button @click="submitInspection" class="btn-primary">提交巡查记录</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showRectificationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">发放整改通知书</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">违规类型 <span class="text-red-500">*</span></label>
              <select v-model="rectificationForm.violationType" class="select">
                <option value="">请选择违规类型</option>
                <option v-for="v in store.state.violationTypes" :key="v.value" :value="v.value">{{ v.label }}</option>
              </select>
              <p v-if="rectificationErrors.violationType" class="text-red-500 text-xs mt-1">{{ rectificationErrors.violationType }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">违规描述 <span class="text-red-500">*</span></label>
              <textarea v-model="rectificationForm.violationDesc" class="textarea h-24" placeholder="请详细描述违规情况..."></textarea>
              <p v-if="rectificationErrors.violationDesc" class="text-red-500 text-xs mt-1">{{ rectificationErrors.violationDesc }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">整改期限 <span class="text-red-500">*</span></label>
              <input v-model="rectificationForm.deadline" type="date" class="input" />
              <p v-if="rectificationErrors.deadline" class="text-red-500 text-xs mt-1">{{ rectificationErrors.deadline }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">发放人 <span class="text-red-500">*</span></label>
              <input v-model="rectificationForm.issuePerson" type="text" class="input" placeholder="请输入发放人姓名" />
              <p v-if="rectificationErrors.issuePerson" class="text-red-500 text-xs mt-1">{{ rectificationErrors.issuePerson }}</p>
            </div>
          </div>
          <div class="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button @click="showRectificationModal = false" class="btn-secondary">取消</button>
            <button @click="submitRectification" class="btn-warning">发放整改通知</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showSubmitRectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">提交整改完成</h3>
          <div class="mb-4 p-3 bg-gray-50 rounded-lg">
            <p class="text-sm"><span class="text-gray-500">违规类型：</span><span class="font-medium">{{ getViolationTypeLabel(currentRectification?.violationType) }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">违规描述：</span><span class="font-medium">{{ currentRectification?.violationDesc }}</span></p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">整改内容 <span class="text-red-500">*</span></label>
            <textarea v-model="submitRectForm.rectifyDesc" class="textarea h-24" placeholder="请详细描述整改情况..."></textarea>
            <p v-if="submitRectErrors.rectifyDesc" class="text-red-500 text-xs mt-1">{{ submitRectErrors.rectifyDesc }}</p>
          </div>
          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button @click="showSubmitRectModal = false" class="btn-secondary">取消</button>
            <button @click="doSubmitRectification" class="btn-primary">提交整改</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showRecheckRectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">整改复查</h3>
          <div class="mb-4 p-3 bg-gray-50 rounded-lg">
            <p class="text-sm"><span class="text-gray-500">违规类型：</span><span class="font-medium">{{ getViolationTypeLabel(currentRectification?.violationType) }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">整改内容：</span><span class="font-medium">{{ currentRectification?.rectifyDesc }}</span></p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">复查结果 <span class="text-red-500">*</span></label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input v-model="recheckForm.result" type="radio" value="passed" class="mr-2" />
                <span class="text-green-600 font-medium">复查通过</span>
              </label>
              <label class="flex items-center">
                <input v-model="recheckForm.result" type="radio" value="failed" class="mr-2" />
                <span class="text-red-600 font-medium">复查不通过</span>
              </label>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">复查意见 <span class="text-red-500">*</span></label>
            <textarea v-model="recheckForm.remark" class="textarea h-20" placeholder="请填写复查意见..."></textarea>
            <p v-if="recheckErrors.remark" class="text-red-500 text-xs mt-1">{{ recheckErrors.remark }}</p>
          </div>
          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button @click="showRecheckRectModal = false" class="btn-secondary">取消</button>
            <button @click="doRecheckRectification" class="btn-primary">提交复查</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showAcceptanceModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">完工验收</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">验收人 <span class="text-red-500">*</span></label>
              <input v-model="acceptanceForm.checker" type="text" class="input" placeholder="请输入验收人姓名" />
              <p v-if="acceptanceErrors.checker" class="text-red-500 text-xs mt-1">{{ acceptanceErrors.checker }}</p>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">施工质量 <span class="text-red-500">*</span></label>
                <input v-model.number="acceptanceForm.qualityScore" type="number" class="input text-center text-xl font-bold" min="0" max="100" />
                <p v-if="acceptanceErrors.qualityScore" class="text-red-500 text-xs mt-1">{{ acceptanceErrors.qualityScore }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">现场清洁 <span class="text-red-500">*</span></label>
                <input v-model.number="acceptanceForm.cleanScore" type="number" class="input text-center text-xl font-bold" min="0" max="100" />
                <p v-if="acceptanceErrors.cleanScore" class="text-red-500 text-xs mt-1">{{ acceptanceErrors.cleanScore }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">结构安全 <span class="text-red-500">*</span></label>
                <input v-model.number="acceptanceForm.structureScore" type="number" class="input text-center text-xl font-bold" min="0" max="100" />
                <p v-if="acceptanceErrors.structureScore" class="text-red-500 text-xs mt-1">{{ acceptanceErrors.structureScore }}</p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">验收结果 <span class="text-red-500">*</span></label>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input v-model="acceptanceForm.result" type="radio" value="passed" class="mr-2" />
                  <span class="text-green-600 font-medium">验收通过</span>
                </label>
                <label class="flex items-center">
                  <input v-model="acceptanceForm.result" type="radio" value="failed" class="mr-2" />
                  <span class="text-red-600 font-medium">验收不通过</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">验收意见 <span class="text-red-500">*</span></label>
              <textarea v-model="acceptanceForm.remark" class="textarea h-20" placeholder="请填写验收意见..."></textarea>
              <p v-if="acceptanceErrors.remark" class="text-red-500 text-xs mt-1">{{ acceptanceErrors.remark }}</p>
            </div>
          </div>
          <div class="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button @click="showAcceptanceModal = false" class="btn-secondary">取消</button>
            <button @click="submitAcceptance" class="btn-primary">提交验收</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showRefundModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">押金退还</h3>
          <div class="mb-4 p-3 bg-gray-50 rounded-lg">
            <p class="text-sm"><span class="text-gray-500">申请编号：</span><span class="font-mono font-medium">{{ record.id }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">应退押金：</span><span class="font-bold text-green-600 text-lg">{{ record.depositAmount }}元</span></p>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">退还金额（元） <span class="text-red-500">*</span></label>
              <input v-model.number="refundForm.amount" type="number" class="input" :placeholder="'最多可退' + record.depositAmount + '元'" :max="record.depositAmount" min="0" />
              <p v-if="refundErrors.amount" class="text-red-500 text-xs mt-1">{{ refundErrors.amount }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">经办人 <span class="text-red-500">*</span></label>
              <input v-model="refundForm.operator" type="text" class="input" placeholder="请输入经办人姓名" />
              <p v-if="refundErrors.operator" class="text-red-500 text-xs mt-1">{{ refundErrors.operator }}</p>
            </div>
          </div>
          <div class="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button @click="showRefundModal = false" class="btn-secondary">取消</button>
            <button @click="submitRefund" class="btn-success">确认退还</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showExtensionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">施工延期申请</h3>
          <div class="mb-4 p-3 bg-blue-50 rounded-lg">
            <p class="text-sm"><span class="text-gray-500">申请编号：</span><span class="font-mono font-medium">{{ record.id }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">房号：</span><span class="font-medium">{{ record.roomNumber }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">原计划完工时间：</span><span class="font-medium">{{ record.endDate }}</span></p>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">延期天数 <span class="text-red-500">*</span></label>
              <input v-model.number="extensionForm.extensionDays" type="number" min="1" class="input" placeholder="请输入延期天数" />
              <p v-if="extensionErrors.extensionDays" class="text-red-500 text-xs mt-1">{{ extensionErrors.extensionDays }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">新的计划完工时间 <span class="text-red-500">*</span></label>
              <input v-model="extensionForm.newEndDate" type="date" class="input" />
              <p v-if="extensionErrors.newEndDate" class="text-red-500 text-xs mt-1">{{ extensionErrors.newEndDate }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">延期原因 <span class="text-red-500">*</span></label>
              <textarea v-model="extensionForm.reason" class="textarea h-24" placeholder="请详细说明延期原因，便于审核"></textarea>
              <p v-if="extensionErrors.reason" class="text-red-500 text-xs mt-1">{{ extensionErrors.reason }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">申请人 <span class="text-red-500">*</span></label>
              <input v-model="extensionForm.applicant" type="text" class="input" placeholder="请输入申请人姓名" />
              <p v-if="extensionErrors.applicant" class="text-red-500 text-xs mt-1">{{ extensionErrors.applicant }}</p>
            </div>
          </div>
          <div class="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button @click="showExtensionModal = false" class="btn-secondary">取消</button>
            <button @click="submitExtension" class="btn-primary">提交申请</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showExtensionAuditModal && currentPendingExtension" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">延期申请审核</h3>
          <div class="mb-4 p-3 bg-gray-50 rounded-lg space-y-1">
            <p class="text-sm"><span class="text-gray-500">申请编号：</span><span class="font-mono font-medium">{{ record.id }}</span></p>
            <p class="text-sm"><span class="text-gray-500">房号：</span><span class="font-medium">{{ record.roomNumber }}</span></p>
            <p class="text-sm"><span class="text-gray-500">业主：</span><span class="font-medium">{{ record.ownerName }}</span></p>
            <p class="text-sm"><span class="text-gray-500">原计划完工时间：</span><span class="font-medium">{{ record.originalEndDate || record.endDate }}</span></p>
          </div>
          <div class="border rounded-lg p-4 mb-4">
            <h4 class="font-medium text-gray-900 mb-3">延期申请详情</h4>
            <div class="space-y-2 text-sm">
              <div class="flex"><span class="text-gray-500 w-28">申请时间：</span><span>{{ currentPendingExtension.applyTime }}</span></div>
              <div class="flex"><span class="text-gray-500 w-28">申请人：</span><span>{{ currentPendingExtension.applyOperator }}</span></div>
              <div class="flex"><span class="text-gray-500 w-28">申请延期天数：</span><span class="font-medium text-orange-600">{{ currentPendingExtension.extensionDays }} 天</span></div>
              <div class="flex"><span class="text-gray-500 w-28">新计划完工时间：</span><span class="font-medium text-blue-600">{{ currentPendingExtension.newEndDate }}</span></div>
              <div class="flex"><span class="text-gray-500 w-28">延期原因：</span><span class="flex-1">{{ currentPendingExtension.reason }}</span></div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">审核意见</label>
            <textarea v-model="extensionAuditForm.remark" class="textarea h-20" placeholder="请输入审核意见（选填）"></textarea>
          </div>
          <div class="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button @click="showExtensionAuditModal = false" class="btn-secondary">取消</button>
            <button @click="doAuditExtension(false)" class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600">驳回申请</button>
            <button @click="doAuditExtension(true)" class="btn-primary">通过申请</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { useStore, decorationStatusMap, decorationStatusColorMap, violationTypes, extensionStatusMap, extensionStatusColorMap } from '../../store'

const router = useRouter()
const route = useRoute()
const showToast = inject('showToast')
const store = useStore()

const record = ref(null)

const showAuditModal = ref(false)
const showInspectionModal = ref(false)
const showRectificationModal = ref(false)
const showSubmitRectModal = ref(false)
const showRecheckRectModal = ref(false)
const showAcceptanceModal = ref(false)
const showRefundModal = ref(false)
const showExtensionModal = ref(false)
const showExtensionAuditModal = ref(false)

const currentRectification = ref(null)

const currentPendingExtension = computed(() => {
  if (!record.value || !record.value.extensionRecords) return null
  return record.value.extensionRecords.find(e => e.status === 'pending')
})

const auditForm = reactive({
  result: 'approved',
  remark: ''
})

const auditErrors = reactive({
  remark: ''
})

const inspectionForm = reactive({
  inspector: '',
  content: '',
  hasViolation: false,
  violationType: '',
  violationDesc: ''
})

const inspectionErrors = reactive({
  inspector: '',
  content: '',
  violationType: '',
  violationDesc: ''
})

const rectificationForm = reactive({
  violationType: '',
  violationDesc: '',
  deadline: '',
  issuePerson: ''
})

const rectificationErrors = reactive({
  violationType: '',
  violationDesc: '',
  deadline: '',
  issuePerson: ''
})

const submitRectForm = reactive({
  rectifyDesc: ''
})

const submitRectErrors = reactive({
  rectifyDesc: ''
})

const recheckForm = reactive({
  result: 'passed',
  remark: ''
})

const recheckErrors = reactive({
  remark: ''
})

const acceptanceForm = reactive({
  checker: '',
  result: 'passed',
  qualityScore: 85,
  cleanScore: 85,
  structureScore: 85,
  remark: ''
})

const acceptanceErrors = reactive({
  checker: '',
  result: '',
  qualityScore: '',
  cleanScore: '',
  structureScore: '',
  remark: ''
})

const refundForm = reactive({
  amount: 0,
  operator: ''
})

const refundErrors = reactive({
  amount: '',
  operator: ''
})

const extensionForm = reactive({
  extensionDays: null,
  newEndDate: '',
  reason: '',
  applicant: ''
})

const extensionErrors = reactive({
  extensionDays: '',
  newEndDate: '',
  reason: '',
  applicant: ''
})

const extensionAuditForm = reactive({
  remark: ''
})

const processSteps = computed(() => {
  if (!record.value) return []
  
  const steps = [
    { name: '提交申请', status: 'done', time: record.value.createTime, operator: record.value.createOperator },
    { name: '物业审核', status: 'pending', time: null, operator: null },
    { name: '施工进场', status: 'pending', time: null, operator: null },
    { name: '施工中', status: 'pending', time: null, operator: null },
    { name: '完工验收', status: 'pending', time: null, operator: null },
    { name: '押金退还', status: 'pending', time: null, operator: null }
  ]
  
  if (record.value.auditTime) {
    steps[1].status = record.value.auditResult === 'approved' ? 'done' : 'done'
    steps[1].time = record.value.auditTime
    steps[1].operator = record.value.auditOperator
    if (record.value.auditResult === 'rejected') {
      for (let i = 2; i < steps.length; i++) {
        steps[i].status = 'pending'
      }
      return steps
    }
  }
  
  if (record.value.enterTime) {
    steps[2].status = 'done'
    steps[2].time = record.value.enterTime
    steps[2].operator = record.value.enterOperator
  }
  
  if (['constructing', 'rectifying', 'completed'].includes(record.value.status)) {
    steps[3].status = 'current'
    steps[3].time = '进行中'
    steps[3].operator = record.value.foremanName
  } else if (['acceptance_passed', 'acceptance_failed', 'deposit_refunded'].includes(record.value.status)) {
    steps[3].status = 'done'
    steps[3].time = record.value.exitTime
    steps[3].operator = record.value.exitOperator
  }
  
  if (record.value.acceptanceRecord) {
    steps[4].status = 'done'
    steps[4].time = record.value.acceptanceRecord.checkTime
    steps[4].operator = record.value.acceptanceRecord.checker
  }
  
  if (record.value.depositRefunded) {
    steps[5].status = 'done'
    steps[5].time = record.value.depositRefundDate
    steps[5].operator = '财务'
  } else if (record.value.status === 'acceptance_passed') {
    steps[5].status = 'current'
  }
  
  let foundCurrent = false
  for (let i = steps.length - 1; i >= 0; i--) {
    if (steps[i].status === 'current') {
      foundCurrent = true
      break
    }
    if (steps[i].status === 'done' && !foundCurrent) {
      if (i < steps.length - 1 && steps[i + 1].status === 'pending') {
        steps[i + 1].status = 'current'
        break
      }
    }
  }
  
  return steps
})

onMounted(() => {
  const id = route.params.id
  record.value = store.getDecorationById(id)
  if (record.value) {
    refundForm.amount = record.value.depositAmount
    extensionForm.applicant = record.value.ownerName
  }
})

const getStatusLabel = (status) => decorationStatusMap[status] || status
const getStatusClass = (status) => decorationStatusColorMap[status] || 'bg-gray-100 text-gray-600'

const getDecorationTypeLabel = (value) => {
  const t = store.state.decorationTypes.find(t => t.value === value)
  return t ? t.label : value
}

const getViolationTypeLabel = (value) => {
  const v = store.state.violationTypes.find(v => v.value === value)
  return v ? v.label : value
}

const hasAnyAbnormal = () => {
  if (!record.value) return false
  return record.value.isOverdue || 
         record.value.hasViolation || 
         hasMissingMaterials() || 
         hasUnrectified() ||
         record.value.status === 'acceptance_failed' ||
         (record.value.status === 'acceptance_passed' && !record.value.depositRefunded)
}

const hasMissingMaterials = () => {
  if (!record.value?.materialList) return false
  return record.value.materialList.some(m => !m.provided)
}

const getMissingMaterialsText = () => {
  if (!record.value?.materialList) return ''
  const missing = record.value.materialList.filter(m => !m.provided)
  return missing.map(m => m.name).join('、')
}

const hasUnrectified = () => {
  if (!record.value?.rectificationRecords || record.value.rectificationRecords.length === 0) return false
  return record.value.rectificationRecords.some(r => r.recheckResult !== 'passed')
}

const getUnrectifiedCount = () => {
  if (!record.value?.rectificationRecords) return 0
  return record.value.rectificationRecords.filter(r => r.recheckResult !== 'passed').length
}

const getOverdueDays = () => {
  if (!record.value?.isOverdue || !record.value?.endDate) return 0
  const today = dayjs('2026-06-17')
  const endDate = dayjs(record.value.endDate)
  return today.diff(endDate, 'day')
}

const getRectificationClass = (rect) => {
  if (rect.recheckResult === 'passed') return 'border-green-200 bg-green-50'
  if (rect.recheckResult === 'failed') return 'border-red-200 bg-red-50'
  if (rect.rectifyTime) return 'border-blue-200 bg-blue-50'
  return 'border-yellow-200 bg-yellow-50'
}

const getRectificationBadgeClass = (rect) => {
  if (rect.recheckResult === 'passed') return 'bg-green-500'
  if (rect.recheckResult === 'failed') return 'bg-red-500'
  if (rect.rectifyTime) return 'bg-blue-500'
  return 'bg-yellow-500'
}

const getRectificationStatusBadgeClass = (rect) => {
  if (rect.recheckResult === 'passed') return 'bg-green-100 text-green-600'
  if (rect.recheckResult === 'failed') return 'bg-red-100 text-red-600'
  if (rect.rectifyTime) return 'bg-blue-100 text-blue-600'
  return 'bg-yellow-100 text-yellow-600'
}

const getRectificationStatusLabel = (rect) => {
  if (rect.recheckResult === 'passed') return '已完成'
  if (rect.recheckResult === 'failed') return '复查不通过'
  if (rect.rectifyTime) return '待复查'
  return '待整改'
}

const isRectificationOverdue = (rect) => {
  if (!rect.deadline || rect.recheckResult === 'passed') return false
  const today = dayjs('2026-06-17')
  const deadline = dayjs(rect.deadline)
  return today.isAfter(deadline, 'day')
}

const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 80) return 'text-blue-600'
  if (score >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

const handleEnter = () => {
  const result = store.enterDecoration(record.value.id, '王安全员')
  if (result) {
    showToast('已确认施工进场', 'success')
  } else {
    showToast('操作失败，请重试', 'error')
  }
}

const handleApplyAcceptance = () => {
  const result = store.applyAcceptance(record.value.id, record.value.ownerName)
  if (result) {
    showToast('已提交验收申请', 'success')
  } else {
    showToast('操作失败，请重试', 'error')
  }
}

const submitAudit = () => {
  let hasError = false
  auditErrors.remark = ''

  if (!auditForm.remark.trim()) {
    auditErrors.remark = '请填写审核意见'
    hasError = true
  }

  if (hasError) return

  const isApproved = auditForm.result === 'approved'
  const result = store.auditDecoration(record.value.id, '李主管', isApproved, auditForm.remark)
  if (result) {
    showToast(isApproved ? '审核通过' : '已驳回申请', 'success')
    showAuditModal.value = false
  } else {
    showToast('操作失败，请重试', 'error')
  }
}

const submitInspection = () => {
  let hasError = false
  Object.keys(inspectionErrors).forEach(key => inspectionErrors[key] = '')

  if (!inspectionForm.inspector.trim()) {
    inspectionErrors.inspector = '请填写巡查人员姓名'
    hasError = true
  }
  if (!inspectionForm.content.trim()) {
    inspectionErrors.content = '请填写巡查内容'
    hasError = true
  }
  if (inspectionForm.hasViolation) {
    if (!inspectionForm.violationType) {
      inspectionErrors.violationType = '请选择违规类型'
      hasError = true
    }
    if (!inspectionForm.violationDesc.trim()) {
      inspectionErrors.violationDesc = '请填写违规描述'
      hasError = true
    }
  }

  if (hasError) return

  const result = store.addInspectionRecord(record.value.id, {
    inspector: inspectionForm.inspector.trim(),
    content: inspectionForm.content.trim(),
    hasViolation: inspectionForm.hasViolation,
    violationType: inspectionForm.hasViolation ? inspectionForm.violationType : null,
    violationDesc: inspectionForm.hasViolation ? inspectionForm.violationDesc.trim() : null
  })

  if (result) {
    showToast('巡查记录已提交', 'success')
    showInspectionModal.value = false
    inspectionForm.inspector = ''
    inspectionForm.content = ''
    inspectionForm.hasViolation = false
    inspectionForm.violationType = ''
    inspectionForm.violationDesc = ''
  } else {
    showToast('提交失败，请重试', 'error')
  }
}

const submitRectification = () => {
  let hasError = false
  Object.keys(rectificationErrors).forEach(key => rectificationErrors[key] = '')

  if (!rectificationForm.violationType) {
    rectificationErrors.violationType = '请选择违规类型'
    hasError = true
  }
  if (!rectificationForm.violationDesc.trim()) {
    rectificationErrors.violationDesc = '请填写违规描述'
    hasError = true
  }
  if (!rectificationForm.deadline) {
    rectificationErrors.deadline = '请选择整改期限'
    hasError = true
  }
  if (!rectificationForm.issuePerson.trim()) {
    rectificationErrors.issuePerson = '请填写发放人姓名'
    hasError = true
  }

  if (hasError) return

  const result = store.addRectificationRecord(record.value.id, {
    violationType: rectificationForm.violationType,
    violationDesc: rectificationForm.violationDesc.trim(),
    deadline: rectificationForm.deadline,
    issuePerson: rectificationForm.issuePerson.trim()
  })

  if (result) {
    showToast('整改通知书已发放', 'success')
    showRectificationModal.value = false
    rectificationForm.violationType = ''
    rectificationForm.violationDesc = ''
    rectificationForm.deadline = ''
    rectificationForm.issuePerson = ''
  } else {
    showToast('提交失败，请重试', 'error')
  }
}

const openSubmitRectification = (rect) => {
  currentRectification.value = rect
  submitRectForm.rectifyDesc = ''
  submitRectErrors.rectifyDesc = ''
  showSubmitRectModal.value = true
}

const doSubmitRectification = () => {
  let hasError = false
  submitRectErrors.rectifyDesc = ''

  if (!submitRectForm.rectifyDesc.trim()) {
    submitRectErrors.rectifyDesc = '请填写整改内容'
    hasError = true
  } else if (submitRectForm.rectifyDesc.trim().length < 10) {
    submitRectErrors.rectifyDesc = '整改内容至少需要10个字'
    hasError = true
  }

  if (hasError) return

  const result = store.submitRectification(
    record.value.id, 
    currentRectification.value.id, 
    submitRectForm.rectifyDesc.trim()
  )

  if (result) {
    showToast('整改已提交，等待复查', 'success')
    showSubmitRectModal.value = false
  } else {
    showToast('提交失败，请重试', 'error')
  }
}

const openRecheckRectification = (rect) => {
  currentRectification.value = rect
  recheckForm.result = 'passed'
  recheckForm.remark = ''
  recheckErrors.remark = ''
  showRecheckRectModal.value = true
}

const doRecheckRectification = () => {
  let hasError = false
  recheckErrors.remark = ''

  if (!recheckForm.remark.trim()) {
    recheckErrors.remark = '请填写复查意见'
    hasError = true
  }

  if (hasError) return

  const isPassed = recheckForm.result === 'passed'
  const result = store.recheckRectification(
    record.value.id,
    currentRectification.value.id,
    '王监理',
    isPassed,
    recheckForm.remark.trim()
  )

  if (result) {
    showToast(isPassed ? '复查通过' : '复查不通过', 'success')
    showRecheckRectModal.value = false
  } else {
    showToast('提交失败，请重试', 'error')
  }
}

const submitAcceptance = () => {
  let hasError = false
  Object.keys(acceptanceErrors).forEach(key => acceptanceErrors[key] = '')

  if (!acceptanceForm.checker.trim()) {
    acceptanceErrors.checker = '请填写验收人姓名'
    hasError = true
  }
  if (isNaN(acceptanceForm.qualityScore) || acceptanceForm.qualityScore < 0 || acceptanceForm.qualityScore > 100) {
    acceptanceErrors.qualityScore = '请输入0-100之间的分数'
    hasError = true
  }
  if (isNaN(acceptanceForm.cleanScore) || acceptanceForm.cleanScore < 0 || acceptanceForm.cleanScore > 100) {
    acceptanceErrors.cleanScore = '请输入0-100之间的分数'
    hasError = true
  }
  if (isNaN(acceptanceForm.structureScore) || acceptanceForm.structureScore < 0 || acceptanceForm.structureScore > 100) {
    acceptanceErrors.structureScore = '请输入0-100之间的分数'
    hasError = true
  }
  if (!acceptanceForm.remark.trim()) {
    acceptanceErrors.remark = '请填写验收意见'
    hasError = true
  }

  if (hasError) return

  const result = store.completeAcceptance(record.value.id, acceptanceForm.checker.trim(), {
    result: acceptanceForm.result,
    qualityScore: Number(acceptanceForm.qualityScore),
    cleanScore: Number(acceptanceForm.cleanScore),
    structureScore: Number(acceptanceForm.structureScore),
    remark: acceptanceForm.remark.trim()
  })

  if (result) {
    showToast(acceptanceForm.result === 'passed' ? '验收通过' : '验收不通过', 'success')
    showAcceptanceModal.value = false
  } else {
    showToast('提交失败，请重试', 'error')
  }
}

const submitRefund = () => {
  let hasError = false
  Object.keys(refundErrors).forEach(key => refundErrors[key] = '')

  if (refundForm.amount === '' || refundForm.amount === null || refundForm.amount === undefined) {
    refundErrors.amount = '请填写退还金额'
    hasError = true
  } else if (isNaN(Number(refundForm.amount)) || Number(refundForm.amount) < 0) {
    refundErrors.amount = '退还金额不能为负数'
    hasError = true
  } else if (Number(refundForm.amount) > record.value.depositAmount) {
    refundErrors.amount = '退还金额不能超过押金金额'
    hasError = true
  }
  if (!refundForm.operator.trim()) {
    refundErrors.operator = '请填写经办人姓名'
    hasError = true
  }

  if (hasError) return

  const result = store.refundDeposit(
    record.value.id,
    refundForm.operator.trim(),
    Number(refundForm.amount)
  )

  if (result) {
    showToast('押金已退还', 'success')
    showRefundModal.value = false
  } else {
    showToast('提交失败，请重试', 'error')
  }
}

const canApplyExtension = () => {
  if (!record.value) return false
  if (!['constructing', 'rectifying'].includes(record.value.status)) return false
  if (hasExtensionPending()) return false
  return true
}

const hasExtensionPending = () => {
  if (!record.value?.extensionRecords || record.value.extensionRecords.length === 0) return false
  return record.value.extensionRecords.some(e => e.status === 'pending')
}

const validateExtensionForm = () => {
  let valid = true
  extensionErrors.extensionDays = ''
  extensionErrors.newEndDate = ''
  extensionErrors.reason = ''
  extensionErrors.applicant = ''

  if (!extensionForm.extensionDays || extensionForm.extensionDays <= 0) {
    extensionErrors.extensionDays = '请输入有效的延期天数（大于0）'
    valid = false
  }

  if (!extensionForm.newEndDate) {
    extensionErrors.newEndDate = '请选择新的计划完工时间'
    valid = false
  } else if (record.value) {
    const origEnd = dayjs(record.value.endDate)
    const newEnd = dayjs(extensionForm.newEndDate)
    if (newEnd.isBefore(origEnd) || newEnd.isSame(origEnd, 'day')) {
      extensionErrors.newEndDate = '新的完工时间必须晚于原计划完工时间'
      valid = false
    }
    if (extensionForm.extensionDays) {
      const calcNewEnd = origEnd.add(extensionForm.extensionDays, 'day')
      if (!newEnd.isSame(calcNewEnd, 'day')) {
        extensionErrors.newEndDate = `新的完工时间与延期天数不匹配，应为 ${calcNewEnd.format('YYYY-MM-DD')}`
        valid = false
      }
    }
  }

  if (!extensionForm.reason || extensionForm.reason.trim().length < 5) {
    extensionErrors.reason = '请详细填写延期原因（至少5个字）'
    valid = false
  }

  if (!extensionForm.applicant || extensionForm.applicant.trim().length === 0) {
    extensionErrors.applicant = '请输入申请人姓名'
    valid = false
  }

  return valid
}

const submitExtension = () => {
  if (!validateExtensionForm()) {
    showToast('请检查表单填写是否正确', 'error')
    return
  }

  const result = store.submitExtension(record.value.id, {
    applicant: extensionForm.applicant,
    applyRole: 'property',
    extensionDays: extensionForm.extensionDays,
    reason: extensionForm.reason,
    newEndDate: extensionForm.newEndDate
  })

  if (result) {
    showToast('延期申请已提交，等待审核', 'success')
    showExtensionModal.value = false
    extensionForm.extensionDays = null
    extensionForm.newEndDate = ''
    extensionForm.reason = ''
  } else {
    showToast('提交失败，请重试', 'error')
  }
}

const doAuditExtension = (isApproved) => {
  if (!record.value || !currentPendingExtension.value) return

  const operator = '王经理'
  const result = store.auditExtension(
    record.value.id,
    currentPendingExtension.value.id,
    operator,
    isApproved,
    extensionAuditForm.remark
  )

  if (result) {
    showToast(isApproved ? '延期申请已通过' : '延期申请已驳回', 'success')
    showExtensionAuditModal.value = false
    extensionAuditForm.remark = ''
  } else {
    showToast('审核失败，请重试', 'error')
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
