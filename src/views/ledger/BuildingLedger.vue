<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">楼栋台账</h1>
        <p class="text-sm text-gray-500 mt-1">共 {{ store.state.buildings.length }} 栋建筑</p>
      </div>
      <div class="flex space-x-3">
        <router-link to="/ledger/equipment" class="btn-secondary">设备台账</router-link>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="building in store.state.buildings"
        :key="building.id"
        class="card p-5 hover:shadow-md transition-shadow cursor-pointer"
        @click="viewDetail(building)"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span class="badge" :class="building.status === 'normal' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'">
            {{ building.status === 'normal' ? '正常' : '维护中' }}
          </span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ building.name }}</h3>
        <p class="text-sm text-gray-500 mb-3">{{ building.address }}</p>
        <div class="grid grid-cols-3 gap-2 text-center">
          <div>
            <p class="text-xl font-bold text-gray-900">{{ building.floors }}</p>
            <p class="text-xs text-gray-500">楼层</p>
          </div>
          <div>
            <p class="text-xl font-bold text-gray-900">{{ building.units }}</p>
            <p class="text-xs text-gray-500">单元</p>
          </div>
          <div>
            <p class="text-xl font-bold text-gray-900">{{ building.households }}</p>
            <p class="text-xs text-gray-500">住户</p>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t flex items-center justify-between text-sm">
          <div>
            <span class="text-gray-500">类型：</span>
            <span class="font-medium text-gray-900">{{ building.type }}</span>
          </div>
          <div>
            <span class="text-gray-500">报修：</span>
            <span class="font-medium text-primary-600">{{ getBuildingRepairCount(building.id) }}单</span>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showDetail" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">{{ currentBuilding?.name }}</h3>
            <button @click="showDetail = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">楼栋编号：</span>
                <span class="font-medium">{{ currentBuilding?.id }}</span>
              </div>
              <div>
                <span class="text-gray-500">建筑类型：</span>
                <span class="font-medium">{{ currentBuilding?.type }}</span>
              </div>
              <div>
                <span class="text-gray-500">总楼层：</span>
                <span class="font-medium">{{ currentBuilding?.floors }}层</span>
              </div>
              <div>
                <span class="text-gray-500">单元数：</span>
                <span class="font-medium">{{ currentBuilding?.units }}个</span>
              </div>
              <div>
                <span class="text-gray-500">总户数：</span>
                <span class="font-medium">{{ currentBuilding?.households }}户</span>
              </div>
              <div>
                <span class="text-gray-500">状态：</span>
                <span class="badge" :class="currentBuilding?.status === 'normal' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'">
                  {{ currentBuilding?.status === 'normal' ? '正常' : '维护中' }}
                </span>
              </div>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">关联设备</h4>
              <div v-if="buildingEquipment.length > 0" class="space-y-2">
                <div
                  v-for="eq in buildingEquipment"
                  :key="eq.id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p class="font-medium text-sm">{{ eq.name }}</p>
                    <p class="text-xs text-gray-500">{{ eq.type }} · {{ eq.location }}</p>
                  </div>
                  <span class="badge" :class="eq.status === 'normal' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'">
                    {{ eq.status === 'normal' ? '正常' : '维护中' }}
                  </span>
                </div>
              </div>
              <p v-else class="text-sm text-gray-500">暂无关联设备</p>
            </div>

            <div>
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-sm font-medium text-gray-900">最近报修</h4>
                <button @click="goToBuildingRepairs(currentBuilding.id)" class="text-sm text-primary-600 hover:text-primary-800">
                  查看全部
                </button>
              </div>
              <div v-if="buildingRepairs.length > 0" class="space-y-2">
                <div
                  v-for="order in buildingRepairs"
                  :key="order.id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  @click="goToRepair(order.id)"
                >
                  <div>
                    <p class="font-mono text-xs text-primary-600">{{ order.id }}</p>
                    <p class="text-sm text-gray-900">{{ order.description.slice(0, 25) }}...</p>
                  </div>
                  <span class="badge" :class="getStatusClass(order.status)">{{ getStatusLabel(order.status) }}</span>
                </div>
              </div>
              <p v-else class="text-sm text-gray-500">暂无报修记录</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-500">最近维修</p>
                <p class="text-lg font-semibold text-gray-900 mt-1">{{ getLastRepairDate(currentBuilding.id) }}</p>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-500">最近巡检</p>
                <p class="text-lg font-semibold text-gray-900 mt-1">{{ getLastInspectionDate(currentBuilding.id) }}</p>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button @click="showDetail = false" class="btn-secondary">关闭</button>
            <button @click="goToBuildingRepairs(currentBuilding.id)" class="btn-primary">查看相关工单</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../../store'

const router = useRouter()
const store = useStore()
const showDetail = ref(false)
const currentBuilding = ref(null)

const buildingEquipment = computed(() => {
  if (!currentBuilding.value) return []
  return store.state.equipmentList.filter(e => e.buildingId === currentBuilding.value.id)
})

const buildingRepairs = computed(() => {
  if (!currentBuilding.value) return []
  return store.state.repairOrders
    .filter(o => o.buildingId === currentBuilding.value.id)
    .slice(0, 5)
})

const getBuildingRepairCount = (buildingId) => {
  return store.state.repairOrders.filter(o => o.buildingId === buildingId).length
}

const getLastRepairDate = (buildingId) => {
  const repairs = store.state.repairOrders
    .filter(o => o.buildingId === buildingId && o.completeTime)
    .sort((a, b) => b.completeTime.localeCompare(a.completeTime))
  return repairs.length > 0 ? repairs[0].completeTime.slice(0, 10) : '暂无'
}

const getLastInspectionDate = (buildingId) => {
  const equipment = store.state.equipmentList.filter(e => e.buildingId === buildingId)
  const equipmentIds = equipment.map(e => e.id)
  
  const inspections = store.state.inspectionRecords
    .filter(r => r.status === 'completed' && equipmentIds.includes(r.equipmentId))
    .sort((a, b) => b.endTime?.localeCompare(a.endTime) || 0)
  
  return inspections.length > 0 ? inspections[0].date : '暂无'
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

const viewDetail = (building) => {
  currentBuilding.value = building
  showDetail.value = true
}

const goToRepair = (id) => {
  showDetail.value = false
  router.push(`/repair/${id}`)
}

const goToBuildingRepairs = (buildingId) => {
  showDetail.value = false
  router.push({ path: '/repair', query: { building: buildingId } })
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
