<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">来访预约管理</h1>
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
        <router-link to="/visitor/create" class="btn-primary">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            新增预约
          </span>
        </router-link>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card p-4 cursor-pointer hover:shadow-md transition-shadow" @click="quickFilter('today')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500">今日预约</p>
            <p class="text-2xl font-bold text-blue-600 mt-1">{{ store.todayVisitorCount.value.length }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="card p-4 cursor-pointer hover:shadow-md transition-shadow" @click="quickFilter('pending')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500">待审核</p>
            <p class="text-2xl font-bold text-yellow-600 mt-1">{{ store.todayPendingAudit.value.length }}</p>
          </div>
          <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
      </div>
      <div class="card p-4 cursor-pointer hover:shadow-md transition-shadow" @click="quickFilter('sign')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500">待签到</p>
            <p class="text-2xl font-bold text-purple-600 mt-1">{{ store.todayPendingSign.value.length }}</p>
          </div>
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="card p-4 cursor-pointer hover:shadow-md transition-shadow" @click="quickFilter('left')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500">今日已离场</p>
            <p class="text-2xl font-bold text-gray-600 mt-1">{{ store.todayLeftCount.value.length }}</p>
          </div>
          <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">最近7天来访量变化</h2>
          <span class="text-sm text-gray-500">单位：人次</span>
        </div>
        <div class="h-64">
          <canvas ref="trendChartRef"></canvas>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">各楼栋来访分布（近7天）</h2>
          <span class="text-sm text-gray-500">单位：人次</span>
        </div>
        <div class="h-64">
          <canvas ref="buildingChartRef"></canvas>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">今日待处理预约</h2>
          <router-link to="/visitor" class="text-sm text-primary-600 hover:text-primary-700">查看全部</router-link>
        </div>
        <div v-if="todayPendingList.length > 0" class="space-y-3">
          <div
            v-for="record in todayPendingList"
            :key="record.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            @click="goToDetail(record.id)"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :class="getPendingIconClass(record.status)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="record.status === 'pending'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  <path v-else-if="['approved', 'released'].includes(record.status)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ record.visitorName }} · {{ getPurposeLabel(record.purpose) }}</p>
                <p class="text-xs text-gray-500">{{ record.roomNumber }} · {{ record.visitTime }}</p>
              </div>
            </div>
            <div class="text-right">
              <span class="badge" :class="visitorStatusColorMap[record.status]">
                {{ visitorStatusMap[record.status] }}
              </span>
              <p class="text-xs text-gray-400 mt-1 font-mono">{{ record.id }}</p>
            </div>
          </div>
        </div>
        <EmptyState v-else title="暂无待处理预约" description="所有预约都已处理完毕" />
      </div>

      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">今日来访事由统计</h2>
          <span class="text-sm text-gray-500">单位：人次</span>
        </div>
        <div class="h-64">
          <canvas ref="purposeChartRef"></canvas>
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
            <option v-for="(label, key) in visitorStatusMap" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">来访事由</label>
          <select v-model="filters.purpose" class="select text-sm">
            <option value="">全部事由</option>
            <option v-for="p in visitorPurposes" :key="p.value" :value="p.value">{{ p.label }}</option>
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
        <div class="md:col-span-2 lg:col-span-3">
          <label class="block text-sm font-medium text-gray-600 mb-1">关键词搜索</label>
          <div class="relative">
            <input
              v-model="filters.keyword"
              type="text"
              class="input text-sm pl-8"
              placeholder="搜索预约号、访客姓名、电话、房号、被访人..."
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
              <th>访客信息</th>
              <th>事由</th>
              <th>拜访房号</th>
              <th>到访时间</th>
              <th>状态</th>
              <th>黑名单状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in filteredRecords" :key="record.id" class="cursor-pointer hover:bg-gray-50" @click="goToDetail(record.id)">
              <td>
                <span class="font-mono text-sm text-primary-600">{{ record.id }}</span>
              </td>
              <td>
                <div class="font-medium flex items-center">
                  {{ record.visitorName }}
                  <span v-if="getBlacklistStatus(record.visitorPhone) === 'active'" class="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">黑名单</span>
                </div>
                <div class="text-xs text-gray-500">{{ record.visitorPhone }}</div>
              </td>
              <td>
                <span class="badge bg-gray-100 text-gray-700">{{ getPurposeLabel(record.purpose) }}</span>
                <div v-if="record.purposeDetail" class="text-xs text-gray-500 mt-1">{{ record.purposeDetail }}</div>
              </td>
              <td class="font-medium">{{ record.roomNumber }}</td>
              <td>
                <div class="text-sm">{{ record.visitTime }}</div>
                <div class="text-xs text-gray-500">至 {{ record.endTime }}</div>
              </td>
              <td>
                <div class="flex flex-wrap gap-1">
                  <span class="badge" :class="visitorStatusColorMap[record.status]">
                    {{ visitorStatusMap[record.status] }}
                  </span>
                  <span v-if="record.temporaryReleaseId" class="badge bg-yellow-100 text-yellow-700">
                    临时放行
                  </span>
                </div>
              </td>
              <td>
                <template v-if="getBlacklistStatus(record.visitorPhone) === 'active'">
                  <span class="badge bg-red-100 text-red-700">黑名单中</span>
                </template>
                <template v-else-if="getBlacklistStatus(record.visitorPhone) === 'released'">
                  <span class="badge bg-yellow-100 text-yellow-700">临时放行</span>
                </template>
                <template v-else-if="getBlacklistStatus(record.visitorPhone) === 'removed'">
                  <span class="badge bg-gray-100 text-gray-500">已移出</span>
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
                  <button v-if="canRelease(record)" @click="openReleaseModal(record)" class="text-purple-600 hover:text-purple-800 text-sm font-medium">
                    放行
                  </button>
                  <button v-if="canSign(record)" @click="handleSign(record)" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    签到
                  </button>
                  <button v-if="canLeave(record)" @click="openLeaveModal(record)" class="text-gray-600 hover:text-gray-800 text-sm font-medium">
                    离场
                  </button>
                  <button v-if="canEdit(record)" @click="goToEdit(record.id)" class="text-yellow-600 hover:text-yellow-800 text-sm font-medium">
                    编辑
                  </button>
                  <button v-if="canCancel(record)" @click="openCancelModal(record)" class="text-red-600 hover:text-red-800 text-sm font-medium">
                    取消
                  </button>
                  <button v-if="canAddToBlacklist(record)" @click="openAddBlacklistModal(record)" class="text-red-600 hover:text-red-800 text-sm font-medium">
                    拉黑
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
            <p class="text-sm mt-1"><span class="text-gray-500">访客：</span><span class="font-medium">{{ auditForm.visitorName }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">房号：</span><span class="font-medium">{{ auditForm.roomNumber }}</span></p>
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
      <div v-if="showReleaseModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            访客放行
          </h3>
          <div v-if="releaseForm.recordId" class="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
            <p class="text-sm"><span class="text-gray-500">预约号：</span><span class="font-mono font-medium">{{ releaseForm.recordId }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">访客：</span><span class="font-medium">{{ releaseForm.visitorName }} · {{ releaseForm.visitorPhone }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">拜访：</span><span class="font-medium">{{ releaseForm.roomNumber }} - {{ releaseForm.hostName }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">预约时间：</span><span class="font-medium">{{ releaseForm.visitTime }}</span></p>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">放行门岗 <span class="text-red-500">*</span></label>
              <select v-model="releaseForm.gate" class="select">
                <option value="">请选择放行门岗</option>
                <option value="东门">东门</option>
                <option value="南门">南门</option>
                <option value="西门">西门</option>
                <option value="北门">北门</option>
              </select>
              <p class="text-xs text-gray-500 mt-1">请选择访客从哪个门岗进入</p>
            </div>
            <div class="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p class="text-sm text-yellow-800 flex items-start">
                <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                放行前请核对访客身份证及预约信息，确认无误后放行。如有车辆请记录车牌号。
              </p>
            </div>
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
          <div v-if="leaveForm.recordId" class="mb-4 p-3 bg-gray-50 rounded-lg">
            <p class="text-sm"><span class="text-gray-500">预约号：</span><span class="font-mono font-medium">{{ leaveForm.recordId }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">访客：</span><span class="font-medium">{{ leaveForm.visitorName }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">房号：</span><span class="font-medium">{{ leaveForm.roomNumber }}</span></p>
            <p v-if="leaveForm.releaseGate" class="text-sm mt-1"><span class="text-gray-500">入口：</span><span class="font-medium">{{ leaveForm.releaseGate }}</span></p>
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
          <div v-if="cancelForm.recordId" class="mb-4 p-3 bg-red-50 rounded-lg border border-red-100">
            <p class="text-sm"><span class="text-gray-500">预约号：</span><span class="font-mono font-medium">{{ cancelForm.recordId }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">访客：</span><span class="font-medium">{{ cancelForm.visitorName }}</span></p>
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

    <Transition name="fade">
      <div v-if="showAddBlacklistModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            将访客加入黑名单
          </h3>
          <div v-if="addBlacklistForm.recordId" class="mb-4 p-3 bg-red-50 rounded-lg border border-red-100">
            <p class="text-sm"><span class="text-gray-500">预约号：</span><span class="font-mono font-medium">{{ addBlacklistForm.recordId }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">访客：</span><span class="font-medium">{{ addBlacklistForm.visitorName }} · {{ addBlacklistForm.visitorPhone }}</span></p>
            <p class="text-sm mt-1"><span class="text-gray-500">历史被拒次数：</span><span class="font-medium text-red-600">{{ addBlacklistForm.rejectionCount }} 次</span></p>
          </div>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">列入原因 <span class="text-red-500">*</span></label>
                <select v-model="addBlacklistForm.reason" class="select">
                  <option value="">请选择列入原因</option>
                  <option v-for="r in blacklistReasons" :key="r.value" :value="r.value">{{ r.label }} - {{ r.description }}</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">原因详情 <span class="text-red-500">*</span></label>
                <textarea v-model="addBlacklistForm.reasonDetail" class="textarea h-24" placeholder="请详细描述列入黑名单的原因..."></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">信息来源</label>
                <select v-model="addBlacklistForm.reportSource" class="select">
                  <option value="手动录入">手动录入</option>
                  <option value="业主投诉">业主投诉</option>
                  <option value="安保发现">安保发现</option>
                  <option value="系统分析">系统分析</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">投诉次数</label>
                <input v-model.number="addBlacklistForm.complaintCount" type="number" min="0" class="input" placeholder="0" />
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
            <button @click="showAddBlacklistModal = false" class="btn-secondary">取消</button>
            <button @click="submitAddBlacklist" class="btn-danger">确认加入黑名单</button>
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
import { Chart, registerables } from 'chart.js'
import { useStore, visitorPurposes, visitorStatusMap, visitorStatusColorMap, blacklistReasons, blacklistStatusMap, blacklistStatusColorMap } from '../../store'
import EmptyState from '../../components/EmptyState.vue'

Chart.register(...registerables)

const router = useRouter()
const route = useRoute()
const showToast = inject('showToast')
const currentRole = inject('currentRole')
const store = useStore()

const trendChartRef = ref(null)
const buildingChartRef = ref(null)
const purposeChartRef = ref(null)

const filters = reactive({
  buildingId: '',
  status: '',
  purpose: '',
  dateRange: 'all',
  startDate: '',
  endDate: '',
  keyword: ''
})

const showAuditModal = ref(false)
const showReleaseModal = ref(false)
const showLeaveModal = ref(false)
const showCancelModal = ref(false)
const showAddBlacklistModal = ref(false)

const auditForm = reactive({
  recordId: '',
  visitorName: '',
  roomNumber: '',
  isApproved: true,
  remark: ''
})

const releaseForm = reactive({
  recordId: '',
  visitorName: '',
  visitorPhone: '',
  roomNumber: '',
  hostName: '',
  visitTime: '',
  gate: ''
})

const leaveForm = reactive({
  recordId: '',
  visitorName: '',
  roomNumber: '',
  releaseGate: '',
  gate: ''
})

const cancelForm = reactive({
  recordId: '',
  visitorName: '',
  reason: ''
})

const addBlacklistForm = reactive({
  recordId: '',
  visitorName: '',
  visitorPhone: '',
  idCard: '',
  reason: '',
  reasonDetail: '',
  reportSource: '手动录入',
  complaintCount: 0,
  rejectionCount: 0
})

const getBlacklistStatus = (visitorPhone) => {
  if (!visitorPhone) return null
  const blacklist = store.checkBlacklist(visitorPhone, null)
  if (blacklist) {
    return blacklist.status
  }
  return null
}

const canAddToBlacklist = (record) => {
  const status = getBlacklistStatus(record.visitorPhone)
  return status !== 'active' && ['service', 'housekeeper', 'security'].includes(currentRole.value)
}

const openAddBlacklistModal = (record) => {
  addBlacklistForm.recordId = record.id
  addBlacklistForm.visitorName = record.visitorName
  addBlacklistForm.visitorPhone = record.visitorPhone
  addBlacklistForm.idCard = record.idCard || ''
  addBlacklistForm.reason = ''
  addBlacklistForm.reasonDetail = ''
  addBlacklistForm.reportSource = '手动录入'
  addBlacklistForm.complaintCount = 0
  addBlacklistForm.rejectionCount = store.getVisitorRejectionCount(record.visitorPhone)
  showAddBlacklistModal.value = true
}

const submitAddBlacklist = () => {
  if (!addBlacklistForm.reason) {
    showToast('请选择列入原因', 'error')
    return
  }
  if (!addBlacklistForm.reasonDetail.trim()) {
    showToast('请填写原因详情', 'error')
    return
  }

  const existing = store.checkBlacklist(addBlacklistForm.visitorPhone, addBlacklistForm.idCard)
  if (existing) {
    showToast('该访客已在黑名单中', 'warning')
    return
  }

  const operator = getOperatorName()
  const result = store.addToBlacklist({
    visitorName: addBlacklistForm.visitorName,
    visitorPhone: addBlacklistForm.visitorPhone,
    idCard: addBlacklistForm.idCard,
    reason: addBlacklistForm.reason,
    reasonDetail: addBlacklistForm.reasonDetail,
    reportSource: addBlacklistForm.reportSource,
    complainant: '',
    complaintCount: addBlacklistForm.complaintCount,
    relatedVisitorIds: [addBlacklistForm.recordId],
    operator
  })

  if (result) {
    showToast('已成功加入黑名单', 'success')
    showAddBlacklistModal.value = false
  } else {
    showToast('操作失败，请重试', 'error')
  }
}

const filteredRecords = computed(() => {
  return store.state.visitorRecords.filter(record => {
    if (filters.buildingId && record.buildingId !== filters.buildingId) return false
    if (filters.status && record.status !== filters.status) return false
    if (filters.purpose && record.purpose !== filters.purpose) return false

    if (filters.dateRange !== 'all') {
      const recordDate = dayjs(record.visitTime)
      const today = dayjs('2026-06-17')
      if (filters.dateRange === 'today' && !recordDate.isSame(today, 'day')) return false
      if (filters.dateRange === 'yesterday' && !recordDate.isSame(today.subtract(1, 'day'), 'day')) return false
      if (filters.dateRange === 'week' && recordDate.isBefore(today.subtract(7, 'day'))) return false
      if (filters.dateRange === 'month' && recordDate.isBefore(today.subtract(30, 'day'))) return false
    }

    if (filters.startDate) {
      if (dayjs(record.visitTime).isBefore(dayjs(filters.startDate), 'day')) return false
    }
    if (filters.endDate) {
      if (dayjs(record.visitTime).isAfter(dayjs(filters.endDate), 'day')) return false
    }

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase()
      const match =
        record.id.toLowerCase().includes(kw) ||
        record.visitorName.toLowerCase().includes(kw) ||
        record.visitorPhone.includes(kw) ||
        record.roomNumber.toLowerCase().includes(kw) ||
        record.hostName.toLowerCase().includes(kw) ||
        record.hostPhone.includes(kw) ||
        (record.plateNumber && record.plateNumber.toLowerCase().includes(kw))
      if (!match) return false
    }

    return true
  })
})

const getPurposeLabel = (value) => {
  const p = visitorPurposes.find(p => p.value === value)
  return p ? p.label : value
}

const canAudit = (record) => {
  return record.status === 'pending' && ['service', 'housekeeper'].includes(currentRole.value)
}

const canRelease = (record) => {
  return record.status === 'approved' && ['security', 'service'].includes(currentRole.value)
}

const canSign = (record) => {
  return record.status === 'released' && ['housekeeper', 'service'].includes(currentRole.value)
}

const canLeave = (record) => {
  return record.status === 'signed' && ['security', 'service'].includes(currentRole.value)
}

const canEdit = (record) => {
  return !['left', 'rejected', 'cancelled'].includes(record.status) && ['service', 'housekeeper'].includes(currentRole.value)
}

const canCancel = (record) => {
  return !['left', 'cancelled', 'rejected'].includes(record.status)
}

const goToDetail = (id) => {
  router.push(`/visitor/${id}`)
}

const goToEdit = (id) => {
  router.push(`/visitor/create?id=${id}`)
}

const quickFilter = (type) => {
  resetFilters()
  const today = dayjs('2026-06-17').format('YYYY-MM-DD')
  filters.startDate = today
  filters.endDate = today
  if (type === 'pending') {
    filters.status = 'pending'
  } else if (type === 'sign') {
    filters.status = 'released'
  } else if (type === 'left') {
    filters.status = 'left'
  }
}

const resetFilters = () => {
  filters.buildingId = ''
  filters.status = ''
  filters.purpose = ''
  filters.dateRange = 'all'
  filters.startDate = ''
  filters.endDate = ''
  filters.keyword = ''
  showToast('筛选条件已重置', 'success')
}

const openAuditModal = (record, isApproved) => {
  auditForm.recordId = record.id
  auditForm.visitorName = record.visitorName
  auditForm.roomNumber = record.roomNumber
  auditForm.isApproved = isApproved
  auditForm.remark = ''
  showAuditModal.value = true
}

const submitAudit = () => {
  const operator = getOperatorName()
  const result = store.auditVisitor(auditForm.recordId, operator, auditForm.isApproved, auditForm.remark.trim())
  if (result) {
    showToast(auditForm.isApproved ? '审核通过成功' : '已拒绝该预约', auditForm.isApproved ? 'success' : 'warning')
    showAuditModal.value = false
  } else {
    showToast('操作失败，请重试', 'error')
  }
}

const openReleaseModal = (record) => {
  releaseForm.recordId = record.id
  releaseForm.visitorName = record.visitorName
  releaseForm.visitorPhone = record.visitorPhone
  releaseForm.roomNumber = record.roomNumber
  releaseForm.hostName = record.hostName
  releaseForm.visitTime = record.visitTime
  releaseForm.gate = ''
  showReleaseModal.value = true
}

const submitRelease = () => {
  if (!releaseForm.gate) {
    showToast('请选择放行门岗', 'error')
    return
  }
  const operator = getOperatorName()
  const result = store.releaseVisitor(releaseForm.recordId, operator, releaseForm.gate, currentRole.value)
  if (result.success) {
    showToast('放行成功', 'success')
    showReleaseModal.value = false
  } else {
    showToast(result.message, 'error')
  }
}

const handleSign = (record) => {
  const operator = getOperatorName()
  const result = store.signVisitor(record.id, operator)
  if (result) {
    showToast('签到确认成功', 'success')
  } else {
    showToast('签到失败，请检查状态', 'error')
  }
}

const openLeaveModal = (record) => {
  leaveForm.recordId = record.id
  leaveForm.visitorName = record.visitorName
  leaveForm.roomNumber = record.roomNumber
  leaveForm.releaseGate = record.releaseGate || ''
  leaveForm.gate = ''
  showLeaveModal.value = true
}

const submitLeave = () => {
  if (!leaveForm.gate) {
    showToast('请选择离场门岗', 'error')
    return
  }
  const operator = getOperatorName()
  const result = store.leaveVisitor(leaveForm.recordId, operator, leaveForm.gate)
  if (result) {
    showToast('离场登记成功', 'success')
    showLeaveModal.value = false
  } else {
    showToast('操作失败，请重试', 'error')
  }
}

const openCancelModal = (record) => {
  cancelForm.recordId = record.id
  cancelForm.visitorName = record.visitorName
  cancelForm.reason = ''
  showCancelModal.value = true
}

const submitCancel = () => {
  if (!cancelForm.reason.trim()) {
    showToast('请填写取消原因', 'error')
    return
  }
  const operator = getOperatorName()
  const result = store.cancelVisitor(cancelForm.recordId, operator, cancelForm.reason.trim())
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

const todayPendingList = computed(() => {
  return store.state.visitorRecords
    .filter(r => 
      dayjs(r.visitTime).format('YYYY-MM-DD') === store.state.currentDate &&
      ['pending', 'approved', 'released', 'signed'].includes(r.status)
    )
    .sort((a, b) => a.visitTime.localeCompare(b.visitTime))
    .slice(0, 5)
})

const getPendingIconClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-600'
    case 'approved': return 'bg-blue-100 text-blue-600'
    case 'released': return 'bg-purple-100 text-purple-600'
    case 'signed': return 'bg-green-100 text-green-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const todayPurposeStats = computed(() => {
  const stats = {}
  store.state.visitorRecords.forEach(r => {
    if (dayjs(r.visitTime).format('YYYY-MM-DD') === store.state.currentDate) {
      stats[r.purpose] = (stats[r.purpose] || 0) + 1
    }
  })
  return visitorPurposes.map(p => ({
    label: p.label,
    value: stats[p.value] || 0
  })).filter(s => s.value > 0).sort((a, b) => b.value - a.value)
})

onMounted(() => {
  if (trendChartRef.value) {
    new Chart(trendChartRef.value, {
      type: 'line',
      data: {
        labels: store.last7DaysVisitors.value.map(d => d.date.slice(5)),
        datasets: [
          {
            label: '预约量',
            data: store.last7DaysVisitors.value.map(d => d.count),
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
            label: '已离场',
            data: store.last7DaysVisitors.value.map(d => d.leftCount),
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
            ticks: { stepSize: 2 }
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
    const data = store.visitorBuildingDistribution.value.filter(d => d.count > 0).slice(0, 8)
    new Chart(buildingChartRef.value, {
      type: 'bar',
      data: {
        labels: data.map(d => d.name),
        datasets: [{
          label: '来访数量',
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

  if (purposeChartRef.value) {
    const data = todayPurposeStats.value
    if (data.length > 0) {
      new Chart(purposeChartRef.value, {
        type: 'doughnut',
        data: {
          labels: data.map(d => d.label),
          datasets: [{
            data: data.map(d => d.value),
            backgroundColor: [
              '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
              '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
            ],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'right',
              labels: { boxWidth: 12, padding: 10, usePointStyle: true, font: { size: 11 } }
            },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.label}: ${ctx.raw}人次`
              }
            }
          }
        }
      })
    }
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
