<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">搬家预约与放行协同台</h1>
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
        <router-link to="/moving/create" class="btn-primary">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            新增预约
          </span>
        </router-link>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div class="card p-4 cursor-pointer hover:shadow-md transition-shadow" @click="quickFilter('move_in')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500">今日搬入</p>
            <p class="text-2xl font-bold text-blue-600 mt-1">{{ store.todayMoveInCount.value.length }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
        </div>
      </div>
      <div class="card p-4 cursor-pointer hover:shadow-md transition-shadow" @click="quickFilter('move_out')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500">今日搬出</p>
            <p class="text-2xl font-bold text-emerald-600 mt-1">{{ store.todayMoveOutCount.value.length }}</p>
          </div>
          <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
        </div>
      </div>
      <div class="card p-4 cursor-pointer hover:shadow-md transition-shadow" @click="quickFilter('pending_audit')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500">待审核</p>
            <p class="text-2xl font-bold text-yellow-600 mt-1">{{ store.todayPendingAuditMoving.value.length }}</p>
          </div>
          <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
      </div>
      <div class="card p-4 cursor-pointer hover:shadow-md transition-shadow" @click="quickFilter('pending_release')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500">待放行</p>
            <p class="text-2xl font-bold text-purple-600 mt-1">{{ store.todayPendingReleaseMoving.value.length }}</p>
          </div>
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="card p-4 cursor-pointer hover:shadow-md transition-shadow" @click="quickFilter('completed')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500">今日已完成</p>
            <p class="text-2xl font-bold text-green-600 mt-1">{{ store.todayCompletedMoving.value.length }}</p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="card p-4 cursor-pointer hover:shadow-md transition-shadow border-2 border-red-100" @click="quickFilter('abnormal')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500">今日异常</p>
            <p class="text-2xl font-bold text-red-600 mt-1">{{ store.todayAbnormalMoving.value.length }}</p>
          </div>
          <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">最近7天搬家量变化</h2>
          <span class="text-sm text-gray-500">单位：车次</span>
        </div>
        <div class="h-64">
          <canvas ref="trendChartRef"></canvas>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">各楼栋搬家分布（近7天）</h2>
          <span class="text-sm text-gray-500">单位：次</span>
        </div>
        <div class="h-64">
          <canvas ref="buildingChartRef"></canvas>
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
            <option v-for="(label, key) in movingStatusMap" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">搬家类型</label>
          <select v-model="filters.movingType" class="select text-sm">
            <option value="">全部类型</option>
            <option v-for="t in movingTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">日期范围</label>
          <select v-model="filters.dateRange" class="select text-sm">
            <option value="all">全部时间</option>
            <option value="today">今天</option>
            <option value="yesterday">昨天</option>
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
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4 pt-4 border-t">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">异常状态</label>
          <select v-model="filters.abnormal" class="select text-sm">
            <option value="">全部</option>
            <option value="1">有异常</option>
            <option value="0">无异常</option>
          </select>
        </div>
        <div class="md:col-span-2 lg:col-span-3">
          <label class="block text-sm font-medium text-gray-600 mb-1">关键词搜索</label>
          <div class="relative">
            <input
              v-model="filters.keyword"
              type="text"
              class="input text-sm pl-8"
              placeholder="搜索预约号、业主姓名、联系人、电话、房号..."
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
              <th>预约号</th>
              <th>类型</th>
              <th>业主/房号</th>
              <th>联系人</th>
              <th>搬家时间</th>
              <th>车辆/工人</th>
              <th>押金</th>
              <th>状态</th>
              <th>异常</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in filteredRecords" :key="record.id" class="cursor-pointer hover:bg-gray-50" @click="goToDetail(record.id)">
              <td>
                <span class="font-mono text-sm text-primary-600">{{ record.id }}</span>
              </td>
              <td>
                <span 
                  class="badge"
                  :class="record.movingType === 'move_in' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'"
                >
                  {{ getMovingTypeLabel(record.movingType) }}
                </span>
              </td>
              <td>
                <div class="font-medium">{{ record.ownerName }}</div>
                <div class="text-xs text-gray-500">{{ record.roomNumber }}</div>
              </td>
              <td>
                <div>{{ record.contactName }}</div>
                <div class="text-xs text-gray-500">{{ record.contactPhone }}</div>
              </td>
              <td>
                <div class="text-sm">{{ record.moveStartTime }}</div>
                <div class="text-xs text-gray-500">至 {{ record.moveEndTime }}</div>
              </td>
              <td>
                <div class="text-sm">{{ record.vehicleCount }}辆 / {{ record.workerCount }}人</div>
                <div v-if="record.plateNumber" class="text-xs text-gray-500">{{ record.plateNumber }}</div>
              </td>
              <td>
                <div class="text-sm font-medium">¥{{ record.depositAmount }}</div>
                <div v-if="record.depositTime" class="text-xs text-gray-500">已缴</div>
                <div v-else class="text-xs text-red-500">未缴</div>
              </td>
              <td>
                <span class="badge" :class="movingStatusColorMap[record.status]">
                  {{ movingStatusMap[record.status] }}
                </span>
              </td>
              <td>
                <template v-if="record.hasAbnormal">
                  <div class="flex flex-wrap gap-1">
                    <span 
                      v-for="type in record.abnormalTypes" 
                      :key="type"
                      class="badge bg-red-100 text-red-700 text-xs"
                    >
                      {{ getAbnormalLabel(type) }}
                    </span>
                  </div>
                </template>
                <template v-else>
                  <span class="text-xs text-gray-400">正常</span>
                </template>
              </td>
              <td>
                <div class="flex items-center space-x-2 flex-wrap gap-y-1" @click.stop>
                  <button @click="goToDetail(record.id)" class="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    详情
                  </button>
                  <button v-if="canAudit(record)" @click="openAuditModal(record, true)" class="text-green-600 hover:text-green-800 text-sm font-medium">
                    审核
                  </button>
                  <button v-if="canDeposit(record)" @click="openDepositModal(record)" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    押金
                  </button>
                  <button v-if="canReleaseEntry(record)" @click="openEntryReleaseModal(record)" class="text-purple-600 hover:text-purple-800 text-sm font-medium">
                    入场
                  </button>
                  <button v-if="canVerify(record)" @click="openVerifyModal(record)" class="text-orange-600 hover:text-orange-800 text-sm font-medium">
                    核验
                  </button>
                  <button v-if="canReleaseExit(record)" @click="openExitReleaseModal(record)" class="text-teal-600 hover:text-teal-800 text-sm font-medium">
                    离场
                  </button>
                  <button v-if="canComplete(record)" @click="openCompleteModal(record)" class="text-green-600 hover:text-green-800 text-sm font-medium">
                    完结
                  </button>
                  <button v-if="canCancel(record)" @click="openCancelModal(record)" class="text-red-600 hover:text-red-800 text-sm font-medium">
                    取消
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
      <div v-if="showAuditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ auditForm.isApproved ? '审核通过' : '审核拒绝' }}
          </h3>
          <div v-if="auditForm.recordId" class="mb-4 p-3 bg-gray-50 rounded-lg">
            <p class="text-sm"><span class="text-gray-500">预约号：</span><span class="font-mono font-medium">{{ auditForm.recordId }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">业主：</span><span class="font-medium">{{ auditForm.ownerName }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">房号：</span><span class="font-medium">{{ auditForm.roomNumber }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">类型：</span><span class="font-medium">{{ auditForm.movingTypeLabel }}</span></p>
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
            <button 
              @click="submitAudit" 
              :class="auditForm.isApproved ? 'btn-success' : 'btn-danger'"
            >
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
          <div v-if="depositForm.recordId" class="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <p class="text-sm"><span class="text-gray-500">预约号：</span><span class="font-mono font-medium">{{ depositForm.recordId }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">业主：</span><span class="font-medium">{{ depositForm.ownerName }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">申报押金：</span><span class="font-medium text-indigo-600">¥{{ depositForm.declaredAmount }}</span></p>
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
          <div v-if="entryReleaseForm.recordId" class="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
            <p class="text-sm"><span class="text-gray-500">预约号：</span><span class="font-mono font-medium">{{ entryReleaseForm.recordId }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">业主：</span><span class="font-medium">{{ entryReleaseForm.ownerName }} · {{ entryReleaseForm.roomNumber }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">车辆：</span><span class="font-medium">{{ entryReleaseForm.plateNumber || '未登记' }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">预约时间：</span><span class="font-medium">{{ entryReleaseForm.moveTime }}</span></p>
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
              <p class="text-xs text-gray-500 mt-1">请选择搬家车辆从哪个门岗进入</p>
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
          <div v-if="verifyForm.recordId" class="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
            <p class="text-sm"><span class="text-gray-500">预约号：</span><span class="font-mono font-medium">{{ verifyForm.recordId }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">房号：</span><span class="font-medium">{{ verifyForm.roomNumber }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">业主：</span><span class="font-medium">{{ verifyForm.ownerName }}</span></p>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">申报物品清单</label>
              <div class="p-3 bg-gray-50 rounded-lg">
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="(item, idx) in verifyForm.declaredItems" 
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
          <div v-if="exitReleaseForm.recordId" class="mb-4 p-3 bg-teal-50 rounded-lg border border-teal-100">
            <p class="text-sm"><span class="text-gray-500">预约号：</span><span class="font-mono font-medium">{{ exitReleaseForm.recordId }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">业主：</span><span class="font-medium">{{ exitReleaseForm.ownerName }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">入口：</span><span class="font-medium">{{ exitReleaseForm.entryGate || '未记录' }}</span></p>
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
          <div v-if="completeForm.recordId" class="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
            <p class="text-sm"><span class="text-gray-500">预约号：</span><span class="font-mono font-medium">{{ completeForm.recordId }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">业主：</span><span class="font-medium">{{ completeForm.ownerName }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">押金金额：</span><span class="font-medium">¥{{ completeForm.depositAmount }}</span></p>
          </div>
          <div class="space-y-4">
            <div>
              <label class="flex items-center">
                <input type="checkbox" v-model="completeForm.refundDeposit" class="mr-2" />
                <span class="text-sm font-medium text-gray-700">退还押金</span>
              </label>
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
          <div v-if="cancelForm.recordId" class="mb-4 p-3 bg-red-50 rounded-lg border border-red-100">
            <p class="text-sm"><span class="text-gray-500">预约号：</span><span class="font-mono font-medium">{{ cancelForm.recordId }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">业主：</span><span class="font-medium">{{ cancelForm.ownerName }}</span></p>
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
</template>

<script setup>
import { ref, reactive, computed, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { Chart, registerables } from 'chart.js'
import { useStore, movingTypes, movingStatusMap, movingStatusColorMap, depositAmountOptions } from '../../store'
import EmptyState from '../../components/EmptyState.vue'

Chart.register(...registerables)

const router = useRouter()
const showToast = inject('showToast')
const currentRole = inject('currentRole')
const store = useStore()

const trendChartRef = ref(null)
const buildingChartRef = ref(null)

const filters = reactive({
  buildingId: '',
  status: '',
  movingType: '',
  dateRange: 'all',
  startDate: '',
  endDate: '',
  keyword: '',
  abnormal: ''
})

const showAuditModal = ref(false)
const showDepositModal = ref(false)
const showEntryReleaseModal = ref(false)
const showVerifyModal = ref(false)
const showExitReleaseModal = ref(false)
const showCompleteModal = ref(false)
const showCancelModal = ref(false)

const auditForm = reactive({
  recordId: '',
  ownerName: '',
  roomNumber: '',
  movingTypeLabel: '',
  isApproved: true,
  remark: ''
})

const depositForm = reactive({
  recordId: '',
  ownerName: '',
  declaredAmount: 0,
  amount: 1000,
  method: ''
})

const entryReleaseForm = reactive({
  recordId: '',
  ownerName: '',
  roomNumber: '',
  plateNumber: '',
  moveTime: '',
  gate: ''
})

const verifyForm = reactive({
  recordId: '',
  roomNumber: '',
  ownerName: '',
  declaredItems: [],
  itemsConsistent: null,
  remark: ''
})

const exitReleaseForm = reactive({
  recordId: '',
  ownerName: '',
  entryGate: '',
  gate: ''
})

const completeForm = reactive({
  recordId: '',
  ownerName: '',
  depositAmount: 0,
  refundDeposit: true,
  remark: ''
})

const cancelForm = reactive({
  recordId: '',
  ownerName: '',
  reason: ''
})

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

const filteredRecords = computed(() => {
  return store.state.movingRecords.filter(record => {
    if (filters.buildingId && record.buildingId !== filters.buildingId) return false
    if (filters.status && record.status !== filters.status) return false
    if (filters.movingType && record.movingType !== filters.movingType) return false

    if (filters.dateRange !== 'all') {
      const recordDate = dayjs(record.moveStartTime)
      const today = dayjs(store.state.currentDate)
      if (filters.dateRange === 'today' && !recordDate.isSame(today, 'day')) return false
      if (filters.dateRange === 'yesterday' && !recordDate.isSame(today.subtract(1, 'day'), 'day')) return false
      if (filters.dateRange === 'week' && recordDate.isBefore(today.subtract(7, 'day'))) return false
      if (filters.dateRange === 'month' && recordDate.isBefore(today.subtract(30, 'day'))) return false
    }

    if (filters.startDate) {
      if (dayjs(record.moveStartTime).isBefore(dayjs(filters.startDate), 'day')) return false
    }
    if (filters.endDate) {
      if (dayjs(record.moveStartTime).isAfter(dayjs(filters.endDate), 'day')) return false
    }

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase()
      const match =
        record.id.toLowerCase().includes(kw) ||
        record.ownerName.toLowerCase().includes(kw) ||
        record.ownerPhone.includes(kw) ||
        record.contactName.toLowerCase().includes(kw) ||
        record.contactPhone.includes(kw) ||
        record.roomNumber.toLowerCase().includes(kw) ||
        (record.plateNumber && record.plateNumber.toLowerCase().includes(kw)) ||
        (record.movingCompany && record.movingCompany.toLowerCase().includes(kw))
      if (!match) return false
    }

    if (filters.abnormal === '1' && !record.hasAbnormal) return false
    if (filters.abnormal === '0' && record.hasAbnormal) return false

    return true
  })
})

const canAudit = (record) => {
  return record.status === 'pending_audit' && ['service', 'housekeeper'].includes(currentRole.value)
}

const canDeposit = (record) => {
  return record.status === 'audit_approved' && 
    !record.depositTime && 
    ['service', 'housekeeper'].includes(currentRole.value)
}

const canReleaseEntry = (record) => {
  return record.status === 'deposit_paid' && ['security', 'service'].includes(currentRole.value)
}

const canVerify = (record) => {
  return ['entry_released', 'verifying'].includes(record.status) && 
    ['housekeeper', 'service'].includes(currentRole.value)
}

const canReleaseExit = (record) => {
  return ['entry_released', 'verifying'].includes(record.status) && 
    ['security', 'service'].includes(currentRole.value)
}

const canComplete = (record) => {
  return ['exit_released', 'verifying'].includes(record.status) && 
    ['service', 'housekeeper'].includes(currentRole.value)
}

const canCancel = (record) => {
  return !['completed', 'cancelled', 'audit_rejected', 'expired'].includes(record.status)
}

const goToDetail = (id) => {
  router.push(`/moving/${id}`)
}

const quickFilter = (type) => {
  resetFilters()
  const today = dayjs(store.state.currentDate).format('YYYY-MM-DD')
  filters.startDate = today
  filters.endDate = today
  if (type === 'move_in') {
    filters.movingType = 'move_in'
  } else if (type === 'move_out') {
    filters.movingType = 'move_out'
  } else if (type === 'pending_audit') {
    filters.status = 'pending_audit'
  } else if (type === 'pending_release') {
    filters.status = 'deposit_paid'
  } else if (type === 'completed') {
    filters.status = 'completed'
  } else if (type === 'abnormal') {
    filters.abnormal = '1'
  }
}

const resetFilters = () => {
  filters.buildingId = ''
  filters.status = ''
  filters.movingType = ''
  filters.dateRange = 'all'
  filters.startDate = ''
  filters.endDate = ''
  filters.keyword = ''
  filters.abnormal = ''
  showToast('筛选条件已重置', 'success')
}

const openAuditModal = (record, isApproved) => {
  auditForm.recordId = record.id
  auditForm.ownerName = record.ownerName
  auditForm.roomNumber = record.roomNumber
  auditForm.movingTypeLabel = getMovingTypeLabel(record.movingType)
  auditForm.isApproved = isApproved
  auditForm.remark = ''
  showAuditModal.value = true
}

const submitAudit = () => {
  const operator = getOperatorName()
  const result = store.auditMoving(auditForm.recordId, operator, auditForm.isApproved, auditForm.remark.trim())
  if (result) {
    showToast(auditForm.isApproved ? '审核通过成功' : '已拒绝该预约', auditForm.isApproved ? 'success' : 'warning')
    showAuditModal.value = false
  } else {
    showToast('操作失败，请重试', 'error')
  }
}

const openDepositModal = (record) => {
  depositForm.recordId = record.id
  depositForm.ownerName = record.ownerName
  depositForm.declaredAmount = record.depositAmount
  depositForm.amount = record.depositAmount || 1000
  depositForm.method = ''
  showDepositModal.value = true
}

const submitDeposit = () => {
  if (!depositForm.method) {
    showToast('请选择缴费方式', 'error')
    return
  }
  const operator = getOperatorName()
  const result = store.registerDeposit(depositForm.recordId, operator, depositForm.amount, depositForm.method)
  if (result) {
    showToast('押金登记成功', 'success')
    showDepositModal.value = false
  } else {
    showToast('操作失败，请重试', 'error')
  }
}

const openEntryReleaseModal = (record) => {
  entryReleaseForm.recordId = record.id
  entryReleaseForm.ownerName = record.ownerName
  entryReleaseForm.roomNumber = record.roomNumber
  entryReleaseForm.plateNumber = record.plateNumber
  entryReleaseForm.moveTime = record.moveStartTime
  entryReleaseForm.gate = ''
  showEntryReleaseModal.value = true
}

const submitEntryRelease = () => {
  if (!entryReleaseForm.gate) {
    showToast('请选择入场门岗', 'error')
    return
  }
  const operator = getOperatorName()
  const result = store.releaseEntryMoving(entryReleaseForm.recordId, operator, entryReleaseForm.gate)
  if (result.success) {
    showToast('入场放行成功', 'success')
    showEntryReleaseModal.value = false
  } else {
    showToast(result.message, 'error')
  }
}

const openVerifyModal = (record) => {
  verifyForm.recordId = record.id
  verifyForm.roomNumber = record.roomNumber
  verifyForm.ownerName = record.ownerName
  verifyForm.declaredItems = [...(record.declaredItems || [])]
  verifyForm.itemsConsistent = record.itemsConsistent
  verifyForm.remark = record.verifyRemark || ''
  showVerifyModal.value = true
}

const submitVerify = () => {
  if (verifyForm.itemsConsistent === null) {
    showToast('请选择核验结果', 'error')
    return
  }
  const operator = getOperatorName()
  const result = store.verifyMoving(
    verifyForm.recordId, 
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

const openExitReleaseModal = (record) => {
  exitReleaseForm.recordId = record.id
  exitReleaseForm.ownerName = record.ownerName
  exitReleaseForm.entryGate = record.entryReleaseGate
  exitReleaseForm.gate = ''
  showExitReleaseModal.value = true
}

const submitExitRelease = () => {
  if (!exitReleaseForm.gate) {
    showToast('请选择离场门岗', 'error')
    return
  }
  const operator = getOperatorName()
  const result = store.releaseExitMoving(exitReleaseForm.recordId, operator, exitReleaseForm.gate)
  if (result.success) {
    showToast('离场放行成功', 'success')
    showExitReleaseModal.value = false
  } else {
    showToast(result.message, 'error')
  }
}

const openCompleteModal = (record) => {
  completeForm.recordId = record.id
  completeForm.ownerName = record.ownerName
  completeForm.depositAmount = record.depositAmount
  completeForm.refundDeposit = true
  completeForm.remark = ''
  showCompleteModal.value = true
}

const submitComplete = () => {
  const operator = getOperatorName()
  const result = store.completeMoving(
    completeForm.recordId, 
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

const openCancelModal = (record) => {
  cancelForm.recordId = record.id
  cancelForm.ownerName = record.ownerName
  cancelForm.reason = ''
  showCancelModal.value = true
}

const submitCancel = () => {
  if (!cancelForm.reason.trim()) {
    showToast('请填写取消原因', 'error')
    return
  }
  const operator = getOperatorName()
  const result = store.cancelMoving(cancelForm.recordId, operator, cancelForm.reason.trim())
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
  if (trendChartRef.value) {
    new Chart(trendChartRef.value, {
      type: 'line',
      data: {
        labels: store.last7DaysMovingTrend.value.map(d => d.date.slice(5)),
        datasets: [
          {
            label: '搬入',
            data: store.last7DaysMovingTrend.value.map(d => d.moveInCount),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5
          },
          {
            label: '搬出',
            data: store.last7DaysMovingTrend.value.map(d => d.moveOutCount),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: true,
            position: 'top',
            labels: { boxWidth: 12, padding: 15, usePointStyle: true }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    })
  }

  if (buildingChartRef.value) {
    const data = store.movingBuildingDistribution.value.filter(d => d.count > 0).slice(0, 8)
    new Chart(buildingChartRef.value, {
      type: 'bar',
      data: {
        labels: data.map(d => d.name),
        datasets: [{
          label: '搬家次数',
          data: data.map(d => d.count),
          backgroundColor: [
            '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
            '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
          ],
          borderRadius: 6,
          barThickness: 28
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    })
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
