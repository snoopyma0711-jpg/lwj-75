<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">访客预约协同工作台</h1>
        <p class="text-sm text-gray-500 mt-1">{{ currentDate }} 星期三</p>
      </div>
      <router-link to="/visitor/create" class="btn-primary">
        <span class="flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          新增预约
        </span>
      </router-link>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-5 cursor-pointer hover:shadow-md transition-shadow" @click="goToVisitorWithFilter('today')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">今日预约数</p>
            <p class="text-3xl font-bold text-blue-600 mt-1">{{ todayVisitorCount.length }}</p>
            <p class="text-xs text-gray-400 mt-1">所有状态合计</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 cursor-pointer hover:shadow-md transition-shadow" @click="goToVisitorWithFilter('pending')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">待审核数</p>
            <p class="text-3xl font-bold text-yellow-600 mt-1">{{ todayPendingAudit.length }}</p>
            <p class="text-xs text-yellow-500 mt-1">等待物业审核</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 cursor-pointer hover:shadow-md transition-shadow" @click="goToVisitorWithFilter('sign')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">待签到数</p>
            <p class="text-3xl font-bold text-purple-600 mt-1">{{ todayPendingSign.length }}</p>
            <p class="text-xs text-purple-500 mt-1">已放行未签到</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 cursor-pointer hover:shadow-md transition-shadow" @click="goToVisitorWithFilter('left')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">今日已离场</p>
            <p class="text-3xl font-bold text-emerald-600 mt-1">{{ todayLeftCount.length }}</p>
            <p class="text-xs text-gray-400 mt-1">已完成离园登记</p>
          </div>
          <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 cursor-pointer hover:shadow-md transition-shadow border-2 border-orange-100" @click="goToVisitorWithFilter('abnormal')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">今日异常预约</p>
            <p class="text-3xl font-bold text-orange-600 mt-1">{{ todayAbnormalVisitorCount }}</p>
            <p class="text-xs text-orange-500 mt-1">黑名单/临时放行/被拒</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 cursor-pointer hover:shadow-md transition-shadow border-2 border-red-100" @click="goToBlacklist">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">黑名单总数</p>
            <p class="text-3xl font-bold text-red-600 mt-1">{{ store.activeBlacklistCount.value }}</p>
            <p class="text-xs text-red-500 mt-1">生效中黑名单</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 cursor-pointer hover:shadow-md transition-shadow border-2 border-yellow-100" @click="goToBlacklist">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">临时放开放</p>
            <p class="text-3xl font-bold text-yellow-600 mt-1">{{ store.todayReleasedCount.value }}</p>
            <p class="text-xs text-yellow-600 mt-1">有效期内的放行</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 cursor-pointer hover:shadow-md transition-shadow border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-white" @click="goToDecorationWithFilter('today_expiring')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">装修今日到期</p>
            <p class="text-3xl font-bold text-orange-600 mt-1">{{ store.todayExpiringDecorations.value.length }}</p>
            <p class="text-xs text-orange-500 mt-1">今日计划完工</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 cursor-pointer hover:shadow-md transition-shadow border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white" @click="goToDecorationWithFilter('pending_extension')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">延期待审核</p>
            <p class="text-3xl font-bold text-purple-600 mt-1">{{ store.pendingExtensionAudits.value.length }}</p>
            <p class="text-xs text-purple-500 mt-1">等待审批的延期申请</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 cursor-pointer hover:shadow-md transition-shadow border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white" @click="goToDecorationWithFilter('extended')">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">已延期施工</p>
            <p class="text-3xl font-bold text-purple-600 mt-1">{{ store.extendedDecorations.value.length }}</p>
            <p class="text-xs text-purple-500 mt-1">延期申请已通过的施工</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
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
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">快速操作指南</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 bg-blue-50 rounded-xl">
          <div class="flex items-center space-x-3 mb-2">
            <div class="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900">物业前台</h3>
          </div>
          <p class="text-sm text-gray-600">录入预约、审核来访申请、补充备注、修改信息、取消预约、放行</p>
        </div>
        <div class="p-4 bg-green-50 rounded-xl">
          <div class="flex items-center space-x-3 mb-2">
            <div class="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900">楼栋管家</h3>
          </div>
          <p class="text-sm text-gray-600">审核楼栋内来访申请、签到确认、查看本楼栋来访记录</p>
        </div>
        <div class="p-4 bg-purple-50 rounded-xl">
          <div class="flex items-center space-x-3 mb-2">
            <div class="w-9 h-9 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900">安保人员</h3>
          </div>
          <p class="text-sm text-gray-600">门岗放行、核实身份、离场登记、查询来访记录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { Chart, registerables } from 'chart.js'
import dayjs from 'dayjs'
import { useStore, visitorPurposes, visitorStatusMap, visitorStatusColorMap } from '../store'
import EmptyState from '../components/EmptyState.vue'

Chart.register(...registerables)

const router = useRouter()
const showToast = inject('showToast')
const store = useStore()

const trendChartRef = ref(null)
const buildingChartRef = ref(null)
const purposeChartRef = ref(null)
const currentDate = dayjs('2026-06-17').format('YYYY年MM月DD日')

const { todayVisitorCount, todayPendingAudit, todayPendingSign, todayLeftCount, todayAbnormalVisitorCount, last7DaysVisitors, visitorBuildingDistribution } = store

const todayPendingList = computed(() => {
  return store.state.visitorRecords
    .filter(r => 
      dayjs(r.visitTime).format('YYYY-MM-DD') === store.state.currentDate &&
      ['pending', 'approved', 'released', 'signed'].includes(r.status)
    )
    .sort((a, b) => a.visitTime.localeCompare(b.visitTime))
    .slice(0, 5)
})

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

const getPurposeLabel = (value) => {
  const p = visitorPurposes.find(p => p.value === value)
  return p ? p.label : value
}

const getPendingIconClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-600'
    case 'approved': return 'bg-blue-100 text-blue-600'
    case 'released': return 'bg-purple-100 text-purple-600'
    case 'signed': return 'bg-green-100 text-green-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const goToVisitorWithFilter = (type) => {
  if (type === 'abnormal') {
    router.push({ path: '/visitor', query: { abnormal: '1' } })
  } else {
    router.push({ path: '/visitor', query: type !== 'today' ? { status: type } : {} })
  }
}

const goToDetail = (id) => {
  router.push(`/visitor/${id}`)
}

const goToBlacklist = () => {
  router.push('/blacklist')
}

const goToDecorationWithFilter = (filter) => {
  router.push({ path: '/decoration', query: { filter } })
}

onMounted(() => {
  if (trendChartRef.value) {
    new Chart(trendChartRef.value, {
      type: 'line',
      data: {
        labels: last7DaysVisitors.value.map(d => d.date.slice(5)),
        datasets: [
          {
            label: '预约量',
            data: last7DaysVisitors.value.map(d => d.count),
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
            data: last7DaysVisitors.value.map(d => d.leftCount),
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
    const data = visitorBuildingDistribution.value.filter(d => d.count > 0).slice(0, 8)
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
