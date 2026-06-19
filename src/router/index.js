import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/repair',
    name: 'RepairList',
    component: () => import('../views/repair/RepairList.vue')
  },
  {
    path: '/repair/create',
    name: 'RepairCreate',
    component: () => import('../views/repair/RepairCreate.vue')
  },
  {
    path: '/repair/:id',
    name: 'RepairDetail',
    component: () => import('../views/repair/RepairDetail.vue')
  },
  {
    path: '/inspection',
    name: 'InspectionList',
    component: () => import('../views/inspection/InspectionList.vue')
  },
  {
    path: '/inspection/task',
    name: 'InspectionTask',
    component: () => import('../views/inspection/InspectionTask.vue')
  },
  {
    path: '/inspection/item',
    name: 'InspectionItem',
    component: () => import('../views/inspection/InspectionItem.vue')
  },
  {
    path: '/ledger/buildings',
    name: 'BuildingLedger',
    component: () => import('../views/ledger/BuildingLedger.vue')
  },
  {
    path: '/ledger/equipment',
    name: 'EquipmentLedger',
    component: () => import('../views/ledger/EquipmentLedger.vue')
  },
  {
    path: '/visitor',
    name: 'VisitorList',
    component: () => import('../views/visitor/VisitorList.vue')
  },
  {
    path: '/visitor/create',
    name: 'VisitorCreate',
    component: () => import('../views/visitor/VisitorCreate.vue')
  },
  {
    path: '/visitor/:id',
    name: 'VisitorDetail',
    component: () => import('../views/visitor/VisitorDetail.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
