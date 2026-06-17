<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 class="ml-3 text-xl font-bold text-gray-900">小区报修与巡检协同台</h1>
            </div>
            <nav class="hidden md:ml-10 md:flex md:space-x-1">
              <router-link
                v-for="item in menuItems"
                :key="item.path"
                :to="item.path"
                class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                :class="{
                  'bg-primary-100 text-primary-700': isActive(item.path),
                  'text-gray-600 hover:bg-gray-100 hover:text-gray-900': !isActive(item.path)
                }"
              >
                {{ item.name }}
              </router-link>
            </nav>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">当前角色：</span>
              <select v-model="currentRole" class="select text-sm py-1 w-auto">
                <option value="service">物业客服</option>
                <option value="engineer">工程人员</option>
              </select>
            </div>
            <div class="flex items-center">
              <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-gray-600">{{ currentRole === 'service' ? '客' : '工' }}</span>
              </div>
              <span class="ml-2 text-sm font-medium text-gray-700">{{ currentRole === 'service' ? '张客服' : '李工程师' }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </main>

    <Transition name="slide-up">
      <div v-if="toast.show" class="fixed bottom-6 right-6 z-50">
        <div
          class="rounded-lg shadow-lg px-6 py-4 flex items-center space-x-3"
          :class="{
            'bg-green-500 text-white': toast.type === 'success',
            'bg-red-500 text-white': toast.type === 'error',
            'bg-yellow-500 text-white': toast.type === 'warning',
            'bg-blue-500 text-white': toast.type === 'info'
          }"
        >
          <svg v-if="toast.type === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else-if="toast.type === 'error'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg v-else-if="toast.type === 'warning'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-medium">{{ toast.message }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentRole = ref('service')

const menuItems = [
  { path: '/', name: '首页' },
  { path: '/repair', name: '报修管理' },
  { path: '/inspection', name: '巡检管理' },
  { path: '/ledger/buildings', name: '台账管理' }
]

const toast = ref({
  show: false,
  message: '',
  type: 'info'
})

let toastTimer = null

const showToast = (message, type = 'info') => {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

provide('currentRole', currentRole)
provide('showToast', showToast)

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
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

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
