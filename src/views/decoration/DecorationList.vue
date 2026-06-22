<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">小区装修申请与施工协同台</h1>
        <p class="text-sm text-gray-500 mt-1">共 {{ filteredRecords.length }} 条装修记录</p>
      </div>
      <div class="flex space-x-3">
        <button @click="resetFilters" class="btn-secondary">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重置筛选
          </span>
        </button>
        <router-link to="/decoration/create" class="btn-primary">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            新增申请
          </span>
        </router-link>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      <div class="card p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 cursor-pointer hover:shadow-lg transition-shadow" @click="quickFilter('today')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-blue-600 font-medium">今日新申请</p>
            <p class="text-3xl font-bold text-blue-700 mt-2">{{ todayNewDecorations.length }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 cursor-pointer hover:shadow-lg transition-shadow" @click="quickFilter('pending_audit')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-yellow-600 font-medium">待审核</p>
            <p class="text-3xl font-bold text-yellow-700 mt-2">{{ pendingAuditDecorations.length }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 bg-gradient-to-br from-green-50 to-green-100 border-green-200 cursor-pointer hover:shadow-lg transition-shadow" @click="quickFilter('constructing')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-green-600 font-medium">施工中</p>
            <p class="text-3xl font-bold text-green-700 mt-2">{{ constructingDecorations.length }}</p>
          </div>
          <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 bg-gradient-to-br from-red-50 to-red-100 border-red-200 cursor-pointer hover:shadow-lg transition-shadow" @click="quickFilter('inspection')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-red-600 font-medium">今日待巡查</p>
            <p class="text-3xl font-bold text-red-700 mt-2">{{ todayPendingInspections.length }}</p>
          </div>
          <div class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 cursor-pointer hover:shadow-lg transition-shadow" @click="quickFilter('today_expiring')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-orange-600 font-medium">今日到期</p>
            <p class="text-3xl font-bold text-orange-700 mt-2">{{ todayExpiringDecorations.length }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 cursor-pointer hover:shadow-lg transition-shadow" @click="quickFilter('pending_extension')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-purple-600 font-medium">延期待审核</p>
            <p class="text-3xl font-bold text-purple-700 mt-2">{{ pendingExtensionAudits.length }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 cursor-pointer hover:shadow-lg transition-shadow" @click="quickFilter('extended')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-purple-600 font-medium">已延期施工</p>
            <p class="text-3xl font-bold text-purple-700 mt-2">{{ extendedDecorations.length }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div v-if="abnormalRecords.length > 0" class="card p-4 bg-red-50 border-red-200">
      <div class="flex items-start space-x-3">
        <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div class="flex-1">
          <h4 class="text-sm font-medium text-red-800 mb-2">异常提醒（共 {{ abnormalRecords.length }} 条）</h4>
          <div class="flex flex-wrap gap-2">
            <span v-for="record in abnormalRecords.slice(0, 5)" :key="record.id" 
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 cursor-pointer hover:bg-red-200"
                  @click="goToDetail(record.id)">
              {{ record.roomNumber }} - {{ getAbnormalType(record) }}
            </span>
            <span v-if="abnormalRecords.length > 5" class="text-xs text-red-600 self-center">
              还有 {{ abnormalRecords.length - 5 }} 条异常...
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="card p-5">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">楼栋</label>
          <select v-model="filters.buildingId" class="select text-sm">
            <option value="">全部楼栋</option>
            <option v-for="b in store.state.buildings" :key="b.id" :value="b.id">{{ b.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">状态</label>
          <select v-model="filters.status" class="select text-sm">
            <option value="">全部状态</option>
            <option v-for="(label, key) in decorationStatusMap" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">装修类型</label>
          <select v-model="filters.decorationType" class="select text-sm">
            <option value="">全部类型</option>
            <option v-for="t in store.state.decorationTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">是否逾期</label>
          <select v-model="filters.isOverdue" class="select text-sm">
            <option value="">全部</option>
            <option value="yes">已逾期</option>
            <option value="no">未逾期</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">延期状态</label>
          <select v-model="filters.extensionStatus" class="select text-sm">
            <option value="">全部</option>
            <option value="pending">待审核延期申请</option>
            <option value="approved">已通过延期</option>
            <option value="rejected">有驳回记录</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">时间范围</label>
          <select v-model="filters.timeRange" class="select text-sm">
            <option value="all">全部时间</option>
            <option value="today">今天</option>
            <option value="week">近7天</option>
            <option value="month">近30天</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">关键词</label>
          <div class="relative">
            <input
              v-model="filters.keyword"
              type="text"
              class="input text-sm pl-8"
              placeholder="搜索申请号、房号、业主..."
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
              <th>申请编号</th>
              <th>房号</th>
              <th>业主</th>
              <th>装修类型</th>
              <th>施工期限</th>
              <th>延期状态</th>
              <th>施工单位</th>
              <th>状态</th>
              <th>异常提醒</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in filteredRecords" :key="record.id" class="cursor-pointer hover:bg-gray-50" @click="goToDetail(record.id)">
              <td>
                <span class="font-mono text-sm text-primary-600 font-medium">{{ record.id }}</span>
              </td>
              <td class="font-medium">{{ record.roomNumber }}</td>
              <td>
                <div>{{ record.ownerName }}</div>
                <div class="text-xs text-gray-500">{{ record.ownerPhone }}</div>
              </td>
              <td>
                <span class="badge bg-gray-100 text-gray-700">{{ getDecorationTypeLabel(record.decorationType) }}</span>
              </td>
              <td>
                <div class="text-sm">{{ record.startDate }}</div>
                <div class="text-xs" :class="isExpiringSoon(record) && !record.isOverdue ? 'text-orange-600 font-medium' : 'text-gray-500'">
                  至 {{ record.endDate }}
                  <span v-if="getDaysRemaining(record) !== null" class="ml-1">
                    ({{ getDaysRemaining(record) > 0 ? '剩' + getDaysRemaining(record) + '天' : getDaysRemaining(record) === 0 ? '今日到期' : '已逾期' + Math.abs(getDaysRemaining(record)) + '天' }})
                  </span>
                </div>
              </td>
              <td>
                <div class="flex flex-wrap gap-1">
                  <span v-if="hasExtensionApproved(record)" class="badge bg-purple-100 text-purple-700 text-xs">已延期</span>
                  <span v-if="hasExtensionPending(record)" class="badge bg-yellow-100 text-yellow-700 text-xs">延期待审核</span>
                  <span v-if="!hasExtensionApproved(record) && !hasExtensionPending(record)" class="text-gray-400 text-xs">-</span>
                </div>
              </td>
              <td class="text-sm">{{ record.constructionCompany }}</td>
              <td>
                <span class="badge" :class="getStatusClass(record.status)">{{ getStatusLabel(record.status) }}</span>
              </td>
              <td>
                <div class="flex flex-wrap gap-1">
                  <span v-if="record.isOverdue" class="badge bg-red-100 text-red-600 text-xs">施工逾期</span>
                  <span v-if="isExpiringSoon(record) && !record.isOverdue" class="badge bg-orange-100 text-orange-600 text-xs">即将到期</span>
                  <span v-if="record.hasViolation" class="badge bg-orange-100 text-orange-600 text-xs">有违规</span>
                  <span v-if="hasMissingMaterials(record)" class="badge bg-yellow-100 text-yellow-700 text-xs">材料缺失</span>
                  <span v-if="hasUnrectified(record)" class="badge bg-red-100 text-red-600 text-xs">整改未完成</span>
                  <span v-if="record.status === 'acceptance_failed'" class="badge bg-red-100 text-red-600 text-xs">验收未通过</span>
                  <span v-if="record.status === 'acceptance_passed' && !record.depositRefunded" class="badge bg-yellow-100 text-yellow-700 text-xs">押金未退</span>
                  <span v-if="!hasAnyAbnormal(record) && !isExpiringSoon(record)" class="text-gray-400 text-xs">-</span>
                </div>
              </td>
              <td class="text-gray-500 text-sm">{{ record.createTime }}</td>
              <td>
                <div class="flex items-center space-x-2">
                  <button @click.stop="goToDetail(record.id)" class="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    查看详情
                  </button>
                  <button 
                    v-if="canApplyExtension(record)"
                    @click.stop="openExtensionModal(record)" 
                    class="text-purple-600 hover:text-purple-800 text-sm font-medium"
                  >
                    申请延期
                  </button>
                  <button 
                    v-if="hasExtensionPending(record)"
                    @click.stop="openExtensionAuditModal(record)" 
                    class="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                  >
                    审核延期
                  </button>
                  <button 
                    v-if="record.status === 'pending_audit'"
                    @click.stop="quickAudit(record, true)" 
                    class="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    通过
                  </button>
                  <button 
                    v-if="record.status === 'pending_audit'"
                    @click.stop="quickAudit(record, false)" 
                    class="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    驳回
                  </button>
                  <button 
                    v-if="record.status === 'audit_approved'"
                    @click.stop="quickEnter(record)" 
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    进场
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState v-else title="没有找到匹配的装修记录" description="请尝试调整筛选条件">
        <template #action>
          <button @click="resetFilters" class="btn-primary btn-sm">重置筛选</button>
        </template>
      </EmptyState>
    </div>

    <div v-if="showExtensionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div class="flex items-center justify-between p-4 border-b">
          <h3 class="text-lg font-semibold text-gray-900">施工延期申请</h3>
          <button @click="closeExtensionModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="currentRecord" class="p-4 space-y-4">
          <div class="bg-blue-50 p-3 rounded-lg text-sm">
            <p class="text-blue-800"><span class="font-medium">申请编号：</span>{{ currentRecord.id }}</p>
            <p class="text-blue-800 mt-1"><span class="font-medium">房号：</span>{{ currentRecord.roomNumber }}</p>
            <p class="text-blue-800 mt-1"><span class="font-medium">原计划完工时间：</span>{{ currentRecord.endDate }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">延期天数 <span class="text-red-500">*</span></label>
            <input 
              v-model.number="extensionForm.extensionDays" 
              type="number" 
              min="1" 
              class="input" 
              placeholder="请输入延期天数"
            />
            <p v-if="formErrors.extensionDays" class="text-red-500 text-xs mt-1">{{ formErrors.extensionDays }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">新的计划完工时间 <span class="text-red-500">*</span></label>
            <input 
              v-model="extensionForm.newEndDate" 
              type="date" 
              class="input" 
            />
            <p v-if="formErrors.newEndDate" class="text-red-500 text-xs mt-1">{{ formErrors.newEndDate }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">延期原因 <span class="text-red-500">*</span></label>
            <textarea 
              v-model="extensionForm.reason" 
              rows="4" 
              class="input resize-none" 
              placeholder="请详细说明延期原因，便于审核"
            ></textarea>
            <p v-if="formErrors.reason" class="text-red-500 text-xs mt-1">{{ formErrors.reason }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">申请人</label>
            <input 
              v-model="extensionForm.applicant" 
              type="text" 
              class="input" 
              placeholder="请输入申请人姓名"
            />
            <p v-if="formErrors.applicant" class="text-red-500 text-xs mt-1">{{ formErrors.applicant }}</p>
          </div>
        </div>
        <div class="flex justify-end space-x-3 p-4 border-t bg-gray-50">
          <button @click="closeExtensionModal" class="btn-secondary">取消</button>
          <button @click="submitExtension" class="btn-primary">提交申请</button>
        </div>
      </div>
    </div>

    <div v-if="showExtensionAuditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-4 border-b">
          <h3 class="text-lg font-semibold text-gray-900">延期申请审核</h3>
          <button @click="closeExtensionAuditModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="currentRecord && currentPendingExtension" class="p-4 space-y-4">
          <div class="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
            <p><span class="font-medium text-gray-600">申请编号：</span>{{ currentRecord.id }}</p>
            <p><span class="font-medium text-gray-600">房号：</span>{{ currentRecord.roomNumber }}</p>
            <p><span class="font-medium text-gray-600">业主：</span>{{ currentRecord.ownerName }}</p>
            <p><span class="font-medium text-gray-600">原计划完工时间：</span>{{ currentRecord.endDate }}</p>
          </div>

          <div class="border rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-3">延期申请详情</h4>
            <div class="space-y-2 text-sm">
              <div class="flex">
                <span class="text-gray-500 w-28">申请时间：</span>
                <span>{{ currentPendingExtension.applyTime }}</span>
              </div>
              <div class="flex">
                <span class="text-gray-500 w-28">申请人：</span>
                <span>{{ currentPendingExtension.applyOperator }}</span>
              </div>
              <div class="flex">
                <span class="text-gray-500 w-28">申请延期天数：</span>
                <span class="font-medium text-orange-600">{{ currentPendingExtension.extensionDays }} 天</span>
              </div>
              <div class="flex">
                <span class="text-gray-500 w-28">新计划完工时间：</span>
                <span class="font-medium text-blue-600">{{ currentPendingExtension.newEndDate }}</span>
              </div>
              <div class="flex">
                <span class="text-gray-500 w-28">延期原因：</span>
                <span class="flex-1">{{ currentPendingExtension.reason }}</span>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">审核意见</label>
            <textarea 
              v-model="extensionAuditForm.remark" 
              rows="3" 
              class="input resize-none" 
              placeholder="请输入审核意见（选填）"
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-3 p-4 border-t bg-gray-50">
          <button @click="closeExtensionAuditModal" class="btn-secondary">取消</button>
          <button @click="auditExtension(false)" class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600">
            驳回申请
          </button>
          <button @click="auditExtension(true)" class="btn-primary">
            通过申请
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, inject, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { useStore, decorationStatusMap, decorationStatusColorMap, extensionStatusMap, extensionStatusColorMap } from '../../store'
import EmptyState from '../../components/EmptyState.vue'

const router = useRouter()
const route = useRoute()
const showToast = inject('showToast')
const store = useStore()

const { 
  todayNewDecorations, 
  pendingAuditDecorations, 
  constructingDecorations, 
  todayPendingInspections,
  todayExpiringDecorations,
  expiringSoonDecorations,
  pendingExtensionAudits,
  overdueDecorations,
  extendedDecorations
} = store

const filters = reactive({
  buildingId: '',
  status: '',
  decorationType: '',
  isOverdue: '',
  extensionStatus: '',
  timeRange: 'all',
  keyword: ''
})

onMounted(() => {
  if (route.query.filter) {
    const f = route.query.filter
    if (f === 'today_expiring' || f === 'pending_extension' || f === 'overdue' || f === 'expiring_soon' || f === 'extended') {
      quickFilter(f)
    }
  }
})

watch(() => route.query.filter, (newVal) => {
  if (newVal) {
    quickFilter(newVal)
  }
})

const showExtensionModal = ref(false)
const showExtensionAuditModal = ref(false)
const currentRecord = ref(null)

const extensionForm = reactive({
  extensionDays: null,
  newEndDate: '',
  reason: '',
  applicant: ''
})

const formErrors = reactive({
  extensionDays: '',
  newEndDate: '',
  reason: '',
  applicant: ''
})

const extensionAuditForm = reactive({
  remark: ''
})

const currentPendingExtension = computed(() => {
  if (!currentRecord.value || !currentRecord.value.extensionRecords) return null
  return currentRecord.value.extensionRecords.find(e => e.status === 'pending')
})

const openExtensionModal = (record) => {
  currentRecord.value = record
  extensionForm.extensionDays = null
  extensionForm.newEndDate = ''
  extensionForm.reason = ''
  extensionForm.applicant = record.ownerName || ''
  formErrors.extensionDays = ''
  formErrors.newEndDate = ''
  formErrors.reason = ''
  formErrors.applicant = ''
  showExtensionModal.value = true
}

const closeExtensionModal = () => {
  showExtensionModal.value = false
  currentRecord.value = null
}

const openExtensionAuditModal = (record) => {
  currentRecord.value = record
  extensionAuditForm.remark = ''
  showExtensionAuditModal.value = true
}

const closeExtensionAuditModal = () => {
  showExtensionAuditModal.value = false
  currentRecord.value = null
}

const validateExtensionForm = () => {
  let valid = true
  formErrors.extensionDays = ''
  formErrors.newEndDate = ''
  formErrors.reason = ''
  formErrors.applicant = ''

  if (!extensionForm.extensionDays || extensionForm.extensionDays <= 0) {
    formErrors.extensionDays = '请输入有效的延期天数（大于0）'
    valid = false
  }

  if (!extensionForm.newEndDate) {
    formErrors.newEndDate = '请选择新的计划完工时间'
    valid = false
  } else if (currentRecord.value) {
    const origEnd = dayjs(currentRecord.value.endDate)
    const newEnd = dayjs(extensionForm.newEndDate)
    if (newEnd.isBefore(origEnd) || newEnd.isSame(origEnd, 'day')) {
      formErrors.newEndDate = '新的完工时间必须晚于原计划完工时间'
      valid = false
    }
    if (extensionForm.extensionDays) {
      const calcNewEnd = origEnd.add(extensionForm.extensionDays, 'day')
      if (!newEnd.isSame(calcNewEnd, 'day')) {
        formErrors.newEndDate = `新的完工时间与延期天数不匹配，应为 ${calcNewEnd.format('YYYY-MM-DD')}`
        valid = false
      }
    }
  }

  if (!extensionForm.reason || extensionForm.reason.trim().length < 5) {
    formErrors.reason = '请详细填写延期原因（至少5个字）'
    valid = false
  }

  if (!extensionForm.applicant || extensionForm.applicant.trim().length === 0) {
    formErrors.applicant = '请输入申请人姓名'
    valid = false
  }

  return valid
}

const submitExtension = () => {
  if (!validateExtensionForm()) {
    showToast('请检查表单填写是否正确', 'error')
    return
  }

  const result = store.submitExtension(currentRecord.value.id, {
    applicant: extensionForm.applicant,
    applyRole: 'property',
    extensionDays: extensionForm.extensionDays,
    reason: extensionForm.reason,
    newEndDate: extensionForm.newEndDate
  })

  if (result) {
    showToast('延期申请已提交，等待审核', 'success')
    closeExtensionModal()
  } else {
    showToast('提交失败，请重试', 'error')
  }
}

const auditExtension = (isApproved) => {
  if (!currentRecord.value || !currentPendingExtension.value) return

  const operator = '王经理'
  const result = store.auditExtension(
    currentRecord.value.id,
    currentPendingExtension.value.id,
    operator,
    isApproved,
    extensionAuditForm.remark
  )

  if (result) {
    showToast(isApproved ? '延期申请已通过' : '延期申请已驳回', 'success')
    closeExtensionAuditModal()
  } else {
    showToast('审核失败，请重试', 'error')
  }
}

const filteredRecords = computed(() => {
  return store.state.decorationRecords.filter(record => {
    if (filters.buildingId && record.buildingId !== filters.buildingId) return false
    if (filters.status && record.status !== filters.status) return false
    if (filters.decorationType && record.decorationType !== filters.decorationType) return false
    
    if (filters.isOverdue) {
      if (filters.isOverdue === 'yes' && !record.isOverdue) return false
      if (filters.isOverdue === 'no' && record.isOverdue) return false
    }

    if (filters.extensionStatus) {
      const exts = record.extensionRecords || []
      if (filters.extensionStatus === 'pending' && !exts.some(e => e.status === 'pending')) return false
      if (filters.extensionStatus === 'approved' && !exts.some(e => e.status === 'approved')) return false
      if (filters.extensionStatus === 'rejected' && !exts.some(e => e.status === 'rejected')) return false
    }
    
    if (filters.timeRange !== 'all') {
      const recordDate = dayjs(record.createTime)
      const today = dayjs('2026-06-17')
      if (filters.timeRange === 'today' && !recordDate.isSame(today, 'day')) return false
      if (filters.timeRange === 'week' && recordDate.isBefore(today.subtract(7, 'day'))) return false
      if (filters.timeRange === 'month' && recordDate.isBefore(today.subtract(30, 'day'))) return false
    }
    
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase()
      const match = 
        record.id.toLowerCase().includes(kw) ||
        record.roomNumber.toLowerCase().includes(kw) ||
        record.ownerName.toLowerCase().includes(kw) ||
        record.ownerPhone.includes(kw) ||
        record.constructionCompany.toLowerCase().includes(kw)
      if (!match) return false
    }
    
    return true
  })
})

const abnormalRecords = computed(() => {
  return store.state.decorationRecords.filter(r => hasAnyAbnormal(r))
})

const hasAnyAbnormal = (record) => {
  return record.isOverdue || 
         record.hasViolation || 
         hasMissingMaterials(record) || 
         hasUnrectified(record) ||
         record.status === 'acceptance_failed' ||
         (record.status === 'acceptance_passed' && !record.depositRefunded)
}

const hasMissingMaterials = (record) => {
  if (!record.materialList) return false
  return record.materialList.some(m => !m.provided)
}

const hasUnrectified = (record) => {
  if (!record.rectificationRecords || record.rectificationRecords.length === 0) return false
  return record.rectificationRecords.some(r => r.recheckResult !== 'passed')
}

const hasExtensionPending = (record) => {
  if (!record.extensionRecords || record.extensionRecords.length === 0) return false
  return record.extensionRecords.some(e => e.status === 'pending')
}

const hasExtensionApproved = (record) => {
  if (!record.extensionRecords || record.extensionRecords.length === 0) return false
  return record.extensionRecords.some(e => e.status === 'approved')
}

const canApplyExtension = (record) => {
  if (!['constructing', 'rectifying'].includes(record.status)) return false
  if (hasExtensionPending(record)) return false
  return true
}

const getDaysRemaining = (record) => {
  const today = dayjs('2026-06-17')
  const end = dayjs(record.endDate)
  return end.diff(today, 'day')
}

const isExpiringSoon = (record) => {
  if (!['constructing', 'rectifying'].includes(record.status)) return false
  const days = getDaysRemaining(record)
  return days !== null && days >= 0 && days <= 3
}

const getAbnormalType = (record) => {
  if (record.isOverdue) return '施工逾期'
  if (record.hasViolation) return '有违规'
  if (hasMissingMaterials(record)) return '材料缺失'
  if (hasUnrectified(record)) return '整改未完成'
  if (record.status === 'acceptance_failed') return '验收未通过'
  if (record.status === 'acceptance_passed' && !record.depositRefunded) return '押金未退'
  return '异常'
}

const getDecorationTypeLabel = (value) => {
  const t = store.state.decorationTypes.find(t => t.value === value)
  return t ? t.label : value
}

const getStatusLabel = (status) => {
  return decorationStatusMap[status] || status
}

const getStatusClass = (status) => {
  return decorationStatusColorMap[status] || 'bg-gray-100 text-gray-600'
}

const goToDetail = (id) => {
  router.push(`/decoration/${id}`)
}

const quickFilter = (type) => {
  filters.buildingId = ''
  filters.status = ''
  filters.decorationType = ''
  filters.isOverdue = ''
  filters.extensionStatus = ''
  filters.timeRange = 'all'
  filters.keyword = ''
  if (type === 'today') {
    filters.timeRange = 'today'
  } else if (type === 'pending_audit') {
    filters.status = 'pending_audit'
  } else if (type === 'constructing') {
    filters.status = 'constructing'
  } else if (type === 'inspection') {
    filters.status = 'constructing'
  } else if (type === 'today_expiring') {
    filters.status = 'constructing'
    filters.timeRange = 'all'
  } else if (type === 'expiring_soon') {
    filters.status = 'constructing'
  } else if (type === 'pending_extension') {
    filters.extensionStatus = 'pending'
  } else if (type === 'overdue') {
    filters.isOverdue = 'yes'
  } else if (type === 'extended') {
    filters.extensionStatus = 'approved'
  }
  showToast('已应用快捷筛选', 'success')
}

const resetFilters = () => {
  filters.buildingId = ''
  filters.status = ''
  filters.decorationType = ''
  filters.isOverdue = ''
  filters.extensionStatus = ''
  filters.timeRange = 'all'
  filters.keyword = ''
  showToast('筛选条件已重置', 'success')
}

const quickAudit = (record, isApproved) => {
  const operator = '李主管'
  const remark = isApproved ? '' : '请补充完善装修方案后重新提交'
  const result = store.auditDecoration(record.id, operator, isApproved, remark)
  if (result) {
    showToast(isApproved ? '审核通过' : '已驳回申请', 'success')
  } else {
    showToast('操作失败，请重试', 'error')
  }
}

const quickEnter = (record) => {
  const operator = '王安全员'
  const result = store.enterDecoration(record.id, operator)
  if (result) {
    showToast('已确认施工进场', 'success')
  } else {
    showToast('操作失败，请重试', 'error')
  }
}
</script>
