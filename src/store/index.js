import { reactive, computed } from 'vue'
import dayjs from 'dayjs'
import { 
  buildings, 
  equipmentList, 
  inspectionItems, 
  inspectionRecords,
  repairCategories, 
  urgentLevels, 
  engineers,
  serviceStaff,
  satisfactionLevels,
  visitStatusMap,
  visitorPurposes,
  visitorStatusMap,
  visitorStatusColorMap,
  visitorRecords,
  generateRepairOrders,
  generateVisitorRecords,
  blacklistReasons,
  blacklistStatusMap,
  blacklistStatusColorMap,
  blacklistRecords,
  decorationTypes,
  decorationStatusMap,
  decorationStatusColorMap,
  violationTypes,
  decorationRecords,
  extensionStatusMap,
  extensionStatusColorMap,
  movingTypes,
  movingStatusMap,
  movingStatusColorMap,
  depositAmountOptions,
  movingRecords
} from './mockData'

const today = dayjs('2026-06-17')
const nowTime = dayjs('2026-06-17 10:30:00')
const nowStr = nowTime.format('YYYY-MM-DD HH:mm:ss')

const state = reactive({
  repairOrders: generateRepairOrders(),
  buildings: [...buildings],
  equipmentList: [...equipmentList],
  inspectionItems: [...inspectionItems],
  inspectionRecords: [...inspectionRecords],
  repairCategories: [...repairCategories],
  urgentLevels: [...urgentLevels],
  engineers: [...engineers],
  serviceStaff: [...serviceStaff],
  satisfactionLevels: [...satisfactionLevels],
  visitStatusMap: { ...visitStatusMap },
  visitorRecords: [...visitorRecords],
  visitorPurposes: [...visitorPurposes],
  visitorStatusMap: { ...visitorStatusMap },
  visitorStatusColorMap: { ...visitorStatusColorMap },
  blacklistRecords: [...blacklistRecords],
  blacklistReasons: [...blacklistReasons],
  blacklistStatusMap: { ...blacklistStatusMap },
  blacklistStatusColorMap: { ...blacklistStatusColorMap },
  decorationRecords: [...decorationRecords],
  decorationTypes: [...decorationTypes],
  decorationStatusMap: { ...decorationStatusMap },
  decorationStatusColorMap: { ...decorationStatusColorMap },
  violationTypes: [...violationTypes],
  extensionStatusMap: { ...extensionStatusMap },
  extensionStatusColorMap: { ...extensionStatusColorMap },
  movingRecords: [...movingRecords],
  movingTypes: [...movingTypes],
  movingStatusMap: { ...movingStatusMap },
  movingStatusColorMap: { ...movingStatusColorMap },
  depositAmountOptions: [...depositAmountOptions],
  currentDate: today.format('YYYY-MM-DD')
})

const getters = {
  todayNewOrders: computed(() => {
    return state.repairOrders.filter(order => 
      dayjs(order.createTime).format('YYYY-MM-DD') === state.currentDate
    )
  }),
  
  todayCompletedOrders: computed(() => {
    return state.repairOrders.filter(order => 
      order.completeTime && dayjs(order.completeTime).format('YYYY-MM-DD') === state.currentDate
    )
  }),

  todayUrgeOrders: computed(() => {
    return state.repairOrders.filter(order => {
      if (!order.urgeRecords || order.urgeRecords.length === 0) return false
      return order.urgeRecords.some(ur => 
        dayjs(ur.urgeTime).format('YYYY-MM-DD') === state.currentDate
      )
    })
  }),

  todayEscalateOrders: computed(() => {
    return state.repairOrders.filter(order => {
      if (!order.escalation || !order.escalation.isEscalated) return false
      return dayjs(order.escalation.escalateTime).format('YYYY-MM-DD') === state.currentDate
    })
  }),

  keyFollowupOrders: computed(() => {
    return state.repairOrders.filter(order => {
      if (!order.escalation || !order.escalation.isEscalated) return false
      return order.status !== 'completed' && order.status !== 'cancelled'
    })
  }),
  
  processingOrders: computed(() => {
    return state.repairOrders.filter(order => 
      ['pending', 'assigned', 'processing'].includes(order.status)
    )
  }),
  
  timeoutOrders: computed(() => {
    return state.repairOrders.filter(order => order.isTimeout)
  }),
  
  last7DaysOrders: computed(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = today.subtract(i, 'day').format('YYYY-MM-DD')
      const count = state.repairOrders.filter(order => 
        dayjs(order.createTime).format('YYYY-MM-DD') === date
      ).length
      days.push({ date, count })
    }
    return days
  }),
  
  buildingDistribution: computed(() => {
    return state.buildings.map(building => {
      const count = state.repairOrders.filter(order => 
        order.buildingId === building.id
      ).length
      return { name: building.name, count, id: building.id }
    }).sort((a, b) => b.count - a.count)
  }),

  todayPendingVisits: computed(() => {
    return state.repairOrders.filter(order => {
      if (order.status !== 'completed') return false
      if (!order.completeTime) return false
      return order.visitStatus === 'pending' || 
             (order.visitStatus === null && dayjs(order.completeTime).format('YYYY-MM-DD') <= state.currentDate)
    })
  }),

  todayCompletedVisits: computed(() => {
    return state.repairOrders.filter(order => {
      if (!order.visitRecords || order.visitRecords.length === 0) return false
      const lastVisit = order.visitRecords[order.visitRecords.length - 1]
      return dayjs(lastVisit.visitTime).format('YYYY-MM-DD') === state.currentDate
    })
  }),

  followupOrders: computed(() => {
    return state.repairOrders.filter(order => order.visitStatus === 'followup')
  }),

  visitSatisfactionRate: computed(() => {
    const visitedOrders = state.repairOrders.filter(order => 
      order.visitRecords && order.visitRecords.length > 0
    )
    if (visitedOrders.length === 0) return 100
    const satisfiedCount = visitedOrders.filter(order => {
      const lastVisit = order.visitRecords[order.visitRecords.length - 1]
      return lastVisit.satisfaction >= 4
    }).length
    return Math.round((satisfiedCount / visitedOrders.length) * 100)
  }),

  last7DaysSatisfaction: computed(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = today.subtract(i, 'day').format('YYYY-MM-DD')
      const dayVisits = []
      state.repairOrders.forEach(order => {
        if (order.visitRecords && order.visitRecords.length > 0) {
          order.visitRecords.forEach(record => {
            if (dayjs(record.visitTime).format('YYYY-MM-DD') === date) {
              dayVisits.push(record)
            }
          })
        }
      })
      let rate = 0
      if (dayVisits.length > 0) {
        const satisfied = dayVisits.filter(r => r.satisfaction >= 4).length
        rate = Math.round((satisfied / dayVisits.length) * 100)
      }
      days.push({ date, rate, count: dayVisits.length })
    }
    return days
  }),

  activeBlacklistCount: computed(() => {
    return state.blacklistRecords.filter(r => r.status === 'active').length
  }),

  todayReleasedCount: computed(() => {
    return state.blacklistRecords.filter(r => {
      if (!r.releaseRecords || r.releaseRecords.length === 0) return false
      return r.releaseRecords.some(rel => 
        !rel.used && dayjs(rel.expireTime).isAfter(nowTime)
      )
    }).length
  }),

  todayBlacklistInterceptions: computed(() => {
    return state.visitorRecords.filter(r => {
      const blacklist = state.blacklistRecords.find(bl => 
        bl.status === 'active' && 
        (bl.visitorPhone === r.visitorPhone || 
         (bl.idCard && bl.idCard === r.idCard))
      )
      return blacklist && dayjs(r.createTime).format('YYYY-MM-DD') === state.currentDate
    }).length
  }),

  todayAbnormalVisitorCount: computed(() => {
    return state.visitorRecords.filter(r => {
      if (dayjs(r.createTime).format('YYYY-MM-DD') !== state.currentDate) return false
      
      const isBlacklistVisitor = state.blacklistRecords.some(bl => 
        bl.status === 'active' && 
        (bl.visitorPhone === r.visitorPhone || 
         (bl.idCard && bl.idCard === r.idCard))
      )
      
      const hasTemporaryRelease = r.temporaryReleaseId !== undefined && r.temporaryReleaseId !== null
      
      const isRejected = r.status === 'rejected'
      
      return isBlacklistVisitor || hasTemporaryRelease || isRejected
    }).length
  }),

  getBlacklistByPhone: (phone) => {
    return state.blacklistRecords.find(r => r.visitorPhone === phone && r.status === 'active')
  },

  getBlacklistByIdCard: (idCard) => {
    if (!idCard) return null
    return state.blacklistRecords.find(r => r.idCard === idCard && r.status === 'active')
  },

  checkBlacklist: (visitorPhone, idCard) => {
    if (!visitorPhone) return null
    const byPhone = state.blacklistRecords.find(r => 
      r.visitorPhone === visitorPhone && r.status === 'active'
    )
    if (byPhone) return byPhone
    if (idCard) {
      const byIdCard = state.blacklistRecords.find(r => 
        r.idCard === idCard && r.status === 'active'
      )
      if (byIdCard) return byIdCard
    }
    return null
  },

  checkTemporaryRelease: (visitorPhone, visitTime) => {
    const blacklist = state.blacklistRecords.find(r => 
      r.visitorPhone === visitorPhone && r.status === 'active'
    )
    if (!blacklist || !blacklist.releaseRecords) return null
    const visit = dayjs(visitTime)
    return blacklist.releaseRecords.find(rel => 
      !rel.used && 
      dayjs(rel.expireTime).isAfter(nowTime) &&
      visit.isAfter(dayjs(rel.approveTime)) &&
      visit.isBefore(dayjs(rel.expireTime).add(1, 'minute'))
    )
  },

  todayNewDecorations: computed(() => {
    return state.decorationRecords.filter(r => 
      dayjs(r.createTime).format('YYYY-MM-DD') === state.currentDate
    )
  }),

  pendingAuditDecorations: computed(() => {
    return state.decorationRecords.filter(r => r.status === 'pending_audit')
  }),

  constructingDecorations: computed(() => {
    return state.decorationRecords.filter(r => r.status === 'constructing')
  }),

  todayPendingInspections: computed(() => {
    return state.decorationRecords.filter(r => {
      if (r.status !== 'constructing') return false
      const lastInspection = r.inspectionRecords && r.inspectionRecords.length > 0
        ? r.inspectionRecords[r.inspectionRecords.length - 1]
        : null
      if (!lastInspection) return true
      return dayjs(lastInspection.time).format('YYYY-MM-DD') < state.currentDate
    })
  }),

  abnormalDecorations: computed(() => {
    return state.decorationRecords.filter(r => r.hasViolation || r.isOverdue)
  }),

  todayExpiringDecorations: computed(() => {
    return state.decorationRecords.filter(r => {
      if (!['constructing', 'rectifying'].includes(r.status)) return false
      const endDate = dayjs(r.endDate)
      const today_ = dayjs('2026-06-17')
      return endDate.format('YYYY-MM-DD') === today_.format('YYYY-MM-DD')
    })
  }),

  expiringSoonDecorations: computed(() => {
    return state.decorationRecords.filter(r => {
      if (!['constructing', 'rectifying'].includes(r.status)) return false
      const endDate = dayjs(r.endDate)
      const today_ = dayjs('2026-06-17')
      const diffDays = endDate.diff(today_, 'day')
      return diffDays > 0 && diffDays <= 3
    })
  }),

  pendingExtensionAudits: computed(() => {
    return state.decorationRecords.filter(r => {
      if (!r.extensionRecords || r.extensionRecords.length === 0) return false
      return r.extensionRecords.some(e => e.status === 'pending')
    })
  }),

  overdueDecorations: computed(() => {
    return state.decorationRecords.filter(r => {
      if (!['constructing', 'rectifying'].includes(r.status)) return false
      return r.isOverdue
    })
  }),

  extendedDecorations: computed(() => {
    return state.decorationRecords.filter(r => {
      if (!r.extensionRecords || r.extensionRecords.length === 0) return false
      return r.extensionRecords.some(e => e.status === 'approved')
    })
  }),

  pendingDepositRefund: computed(() => {
    return state.decorationRecords.filter(r => 
      r.status === 'acceptance_passed' && !r.depositRefunded
    )
  }),

  getDecorationById: (id) => {
    return state.decorationRecords.find(r => r.id === id)
  },

  todayMoveInCount: computed(() => {
    return state.movingRecords.filter(r => 
      dayjs(r.moveStartTime).format('YYYY-MM-DD') === state.currentDate && 
      r.movingType === 'move_in'
    )
  }),

  todayMoveOutCount: computed(() => {
    return state.movingRecords.filter(r => 
      dayjs(r.moveStartTime).format('YYYY-MM-DD') === state.currentDate && 
      r.movingType === 'move_out'
    )
  }),

  todayPendingAuditMoving: computed(() => {
    return state.movingRecords.filter(r => 
      dayjs(r.moveStartTime).format('YYYY-MM-DD') === state.currentDate && 
      r.status === 'pending_audit'
    )
  }),

  todayPendingReleaseMoving: computed(() => {
    return state.movingRecords.filter(r => 
      dayjs(r.moveStartTime).format('YYYY-MM-DD') === state.currentDate && 
      ['deposit_paid', 'audit_approved'].includes(r.status)
    )
  }),

  todayCompletedMoving: computed(() => {
    return state.movingRecords.filter(r => 
      dayjs(r.completeTime).format('YYYY-MM-DD') === state.currentDate && 
      r.status === 'completed'
    )
  }),

  todayAbnormalMoving: computed(() => {
    return state.movingRecords.filter(r => 
      dayjs(r.moveStartTime).format('YYYY-MM-DD') === state.currentDate && 
      r.hasAbnormal
    )
  }),

  getMovingById: (id) => {
    return state.movingRecords.find(r => r.id === id)
  },

  last7DaysMovingTrend: computed(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = today.subtract(i, 'day').format('YYYY-MM-DD')
      const moveInCount = state.movingRecords.filter(r => 
        dayjs(r.moveStartTime).format('YYYY-MM-DD') === date && r.movingType === 'move_in'
      ).length
      const moveOutCount = state.movingRecords.filter(r => 
        dayjs(r.moveStartTime).format('YYYY-MM-DD') === date && r.movingType === 'move_out'
      ).length
      days.push({ date, moveInCount, moveOutCount, total: moveInCount + moveOutCount })
    }
    return days
  }),

  movingBuildingDistribution: computed(() => {
    const buildingMap = {}
    state.movingRecords.forEach(r => {
      if (r.buildingId && dayjs(r.moveStartTime).format('YYYY-MM-DD') >= today.subtract(7, 'day').format('YYYY-MM-DD')) {
        buildingMap[r.buildingId] = (buildingMap[r.buildingId] || 0) + 1
      }
    })
    return state.buildings.map(building => {
      return { 
        name: building.name, 
        count: buildingMap[building.id] || 0, 
        id: building.id 
      }
    }).sort((a, b) => b.count - a.count)
  })
}

const actions = {
  createRepairOrder(orderData) {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const todayStr = today.format('YYYYMMDD')
    const todayCount = state.repairOrders.filter(o => 
      o.id.startsWith('WX' + todayStr)
    ).length + 1
    
    const newOrder = {
      id: `WX${todayStr}${String(todayCount).padStart(4, '0')}`,
      ...orderData,
      status: 'pending',
      createTime: now,
      assignTime: null,
      acceptTime: null,
      arriveTime: null,
      completeTime: null,
      engineerId: null,
      processLogs: [
        { time: now, operator: '系统', action: '报修登记', content: `${orderData.contactName}报修：${orderData.description}` }
      ],
      processResult: null,
      needReturn: false,
      returnReason: null,
      isTimeout: false,
      source: 'manual',
      urgeRecords: [],
      escalation: {
        isEscalated: false,
        escalateTime: null,
        escalateOperator: null,
        escalateReason: null,
        deadlineTime: null
      }
    }
    
    state.repairOrders.unshift(newOrder)
    return newOrder
  },

  urgeOrder(orderId, urgeData) {
    const order = state.repairOrders.find(o => o.id === orderId)
    if (!order) return false
    
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const urgeId = `UR${Date.now()}`
    
    if (!order.urgeRecords) {
      order.urgeRecords = []
    }
    
    const urgeRecord = {
      id: urgeId,
      urgeTime: now,
      urgeOperator: urgeData.operator,
      urgeReason: urgeData.reason,
      urgeTarget: urgeData.targetName,
      urgeTargetType: urgeData.targetType
    }
    order.urgeRecords.push(urgeRecord)
    
    order.processLogs.push({
      time: now,
      operator: urgeData.operator,
      action: '催办',
      content: `催办原因：${urgeData.reason}。催办对象：${urgeData.targetName}`
    })
    
    return urgeRecord
  },

  escalateOrder(orderId, escalateData) {
    const order = state.repairOrders.find(o => o.id === orderId)
    if (!order) return false
    
    if (!order.urgeRecords || order.urgeRecords.length === 0) {
      return false
    }
    
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    
    if (!order.escalation) {
      order.escalation = {
        isEscalated: false,
        escalateTime: null,
        escalateOperator: null,
        escalateReason: null,
        deadlineTime: null
      }
    }
    
    order.escalation.isEscalated = true
    order.escalation.escalateTime = now
    order.escalation.escalateOperator = escalateData.operator
    order.escalation.escalateReason = escalateData.reason
    order.escalation.deadlineTime = escalateData.deadlineTime
    
    order.processLogs.push({
      time: now,
      operator: escalateData.operator,
      action: '升级重点跟进',
      content: `升级原因：${escalateData.reason}。要求完成时限：${escalateData.deadlineTime}`
    })
    
    return true
  },
  
  assignOrder(orderId, engineerId) {
    const order = state.repairOrders.find(o => o.id === orderId)
    if (!order) return false
    
    const engineer = state.engineers.find(e => e.id === engineerId)
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    
    order.status = 'assigned'
    order.engineerId = engineerId
    order.assignTime = now
    order.processLogs.push({
      time: now,
      operator: '张客服',
      action: '派单',
      content: `已派单给${engineer ? engineer.name : '工程人员'}处理`
    })
    
    return true
  },
  
  acceptOrder(orderId, operatorName) {
    const order = state.repairOrders.find(o => o.id === orderId)
    if (!order) return false
    
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    
    order.status = 'processing'
    order.acceptTime = now
    order.processLogs.push({
      time: now,
      operator: operatorName,
      action: '接单',
      content: '已接单，立即前往处理'
    })
    
    return true
  },
  
  updateArriveTime(orderId, operatorName) {
    const order = state.repairOrders.find(o => o.id === orderId)
    if (!order) return false
    
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    
    order.arriveTime = now
    order.processLogs.push({
      time: now,
      operator: operatorName,
      action: '到达现场',
      content: '已到达现场，开始处理'
    })
    
    return true
  },
  
  addProcessLog(orderId, operatorName, content) {
    const order = state.repairOrders.find(o => o.id === orderId)
    if (!order) return false
    
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    
    order.processLogs.push({
      time: now,
      operator: operatorName,
      action: '处理中',
      content: content
    })
    
    return true
  },
  
  completeOrder(orderId, operatorName, resultData) {
    const order = state.repairOrders.find(o => o.id === orderId)
    if (!order) return false
    
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    
    order.status = 'completed'
    order.completeTime = now
    order.processResult = resultData.processResult
    order.needReturn = resultData.needReturn || false
    order.returnReason = resultData.returnReason || null
    order.processLogs.push({
      time: now,
      operator: operatorName,
      action: '完成',
      content: '处理完成'
    })
    
    return true
  },
  
  cancelOrder(orderId, operatorName, reason) {
    const order = state.repairOrders.find(o => o.id === orderId)
    if (!order) return false
    
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    
    order.status = 'cancelled'
    order.remarks = reason
    order.processLogs.push({
      time: now,
      operator: operatorName,
      action: '取消',
      content: reason
    })
    
    return true
  },
  
  updateOrderRemarks(orderId, remarks) {
    const order = state.repairOrders.find(o => o.id === orderId)
    if (!order) return false
    
    order.remarks = remarks
    return true
  },
  
  updateOrder(orderId, updateData) {
    const order = state.repairOrders.find(o => o.id === orderId)
    if (!order) return false
    
    Object.assign(order, updateData)
    return true
  },
  
  getOrderById(orderId) {
    return state.repairOrders.find(o => o.id === orderId)
  },
  
  startInspection(taskId, inspectorId, inspectorName) {
    const task = state.inspectionRecords.find(t => t.id === taskId)
    if (!task) return false
    
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    
    task.status = 'inspecting'
    task.inspectorId = inspectorId
    task.inspectorName = inspectorName
    task.startTime = now
    
    return true
  },
  
  completeInspection(taskId, resultData) {
    const task = state.inspectionRecords.find(t => t.id === taskId)
    if (!task) return false
    
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    
    task.status = 'completed'
    task.endTime = now
    task.result = resultData.result
    task.abnormal = resultData.abnormal
    task.abnormalDesc = resultData.abnormalDesc
    task.suggestion = resultData.suggestion
    
    return task
  },
  
  convertInspectionToRepair(taskId, operatorName) {
    const task = state.inspectionRecords.find(t => t.id === taskId)
    if (!task) return null
    
    const building = task.equipmentId 
      ? state.equipmentList.find(e => e.id === task.equipmentId)
      : null
    
    const repairData = {
      roomNumber: task.equipmentName || '公共区域',
      buildingId: building?.buildingId || null,
      contactName: task.inspectorName || operatorName,
      contactPhone: '188****0000',
      category: 'public',
      description: `巡检发现异常：${task.abnormalDesc}`,
      expectedTime: today.format('YYYY-MM-DD') + ' 全天',
      urgency: task.abnormal ? 'medium' : 'low',
      source: 'inspection',
      remarks: `来源：${task.itemName}巡检任务 ${task.id}`
    }
    
    const newOrder = actions.createRepairOrder(repairData)
    task.repairOrderId = newOrder.id
    
    return newOrder
  },
  
  addInspectionItem(itemData) {
    const newId = `II${String(state.inspectionItems.length + 1).padStart(3, '0')}`
    const newItem = {
      id: newId,
      ...itemData,
      enable: true
    }
    state.inspectionItems.push(newItem)
    return newItem
  },
  
  updateInspectionItem(itemId, updateData) {
    const item = state.inspectionItems.find(i => i.id === itemId)
    if (!item) return false
    Object.assign(item, updateData)
    return true
  },
  
  generateTodayInspectionTasks() {
    const existingToday = state.inspectionRecords.filter(t => t.date === state.currentDate)
    if (existingToday.length > 0) return
    
    const dailyItems = state.inspectionItems.filter(i => i.enable && i.frequency === 'daily')
    const weeklyItems = state.inspectionItems.filter(i => i.enable && i.frequency === 'weekly' && dayjs(state.currentDate).day() === 1)
    
    const itemsToGenerate = [...dailyItems, ...weeklyItems]
    
    itemsToGenerate.forEach(item => {
      const relatedEquipment = state.equipmentList.filter(e => {
        if (item.type === 'elevator') return e.type === '电梯'
        if (item.type === 'fire') return e.type === '消防设施'
        if (item.type === 'plumbing') return e.type === '给排水设备'
        if (item.type === 'electrical') return e.type === '电气设备'
        if (item.type === 'security') return e.type === '安防设备'
        if (item.type === 'hvac') return e.type === '空调设备'
        return false
      })
      
      if (relatedEquipment.length > 0) {
        relatedEquipment.forEach(equipment => {
          const taskId = `IT${state.currentDate.replace(/-/g, '')}${String(state.inspectionRecords.length + 1).padStart(4, '0')}`
          state.inspectionRecords.unshift({
            id: taskId,
            itemId: item.id,
            itemName: item.name,
            equipmentId: equipment.id,
            equipmentName: equipment.name,
            date: state.currentDate,
            status: 'pending',
            inspectorId: null,
            inspectorName: null,
            startTime: null,
            endTime: null,
            result: null,
            abnormal: false,
            abnormalDesc: null,
            suggestion: null,
            repairOrderId: null
          })
        })
      } else {
        const taskId = `IT${state.currentDate.replace(/-/g, '')}${String(state.inspectionRecords.length + 1).padStart(4, '0')}`
        state.inspectionRecords.unshift({
          id: taskId,
          itemId: item.id,
          itemName: item.name,
          equipmentId: null,
          equipmentName: item.name + '(公共区域)',
          date: state.currentDate,
          status: 'pending',
          inspectorId: null,
          inspectorName: null,
          startTime: null,
          endTime: null,
          result: null,
          abnormal: false,
          abnormalDesc: null,
          suggestion: null,
          repairOrderId: null
        })
      }
    })
  },

  addEquipment(equipmentData) {
    state.equipmentList.push(equipmentData)
    return equipmentData
  },

  updateEquipment(equipmentId, updateData) {
    const equipment = state.equipmentList.find(e => e.id === equipmentId)
    if (!equipment) return false
    Object.assign(equipment, updateData)
    return true
  },

  addVisitRecord(orderId, visitor, visitData) {
    const order = state.repairOrders.find(o => o.id === orderId)
    if (!order) return false

    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const visitId = `VR${Date.now()}`

    const newRecord = {
      id: visitId,
      visitTime: now,
      visitor: visitor,
      satisfaction: visitData.satisfaction,
      problemResolved: visitData.problemResolved,
      remark: visitData.remark,
      unresolvedReason: visitData.unresolvedReason || null
    }

    if (!order.visitRecords) {
      order.visitRecords = []
    }
    order.visitRecords.push(newRecord)

    if (visitData.problemResolved && visitData.satisfaction >= 4) {
      order.visitStatus = 'completed'
      order.processLogs.push({
        time: now,
        operator: visitor,
        action: '回访完成',
        content: `回访完成，住户满意度${visitData.satisfaction}分，问题已解决。${visitData.remark ? '备注：' + visitData.remark : ''}`
      })
    } else {
      order.visitStatus = 'followup'
      order.processLogs.push({
        time: now,
        operator: visitor,
        action: '回访转跟进',
        content: `回访发现问题未彻底解决或住户不满意（${visitData.satisfaction}分），转为待跟进状态。原因：${visitData.unresolvedReason || visitData.remark || '未填写'}`
      })
    }

    return true
  },

  convertToFollowup(orderId, operator, reason) {
    const order = state.repairOrders.find(o => o.id === orderId)
    if (!order) return false

    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    order.visitStatus = 'followup'
    order.processLogs.push({
      time: now,
      operator: operator,
      action: '转跟进',
      content: reason || '需要继续跟进处理'
    })

    return true
  },

  resolveFollowup(orderId, operator, resultData) {
    const order = state.repairOrders.find(o => o.id === orderId)
    if (!order) return false

    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    order.visitStatus = 'completed'
    order.processResult = resultData.processResult || order.processResult
    order.processLogs.push({
      time: now,
      operator: operator,
      action: '跟进处理完成',
      content: resultData.processResult || '跟进处理已完成'
    })

    return true
  },

  // ============ 访客预约相关 ============

  todayVisitorCount: computed(() => {
    return state.visitorRecords.filter(r => 
      dayjs(r.visitTime).format('YYYY-MM-DD') === state.currentDate
    )
  }),

  todayPendingAudit: computed(() => {
    return state.visitorRecords.filter(r => 
      dayjs(r.visitTime).format('YYYY-MM-DD') === state.currentDate && r.status === 'pending'
    )
  }),

  todayPendingSign: computed(() => {
    return state.visitorRecords.filter(r => 
      dayjs(r.visitTime).format('YYYY-MM-DD') === state.currentDate && 
      r.status === 'released'
    )
  }),

  todayLeftCount: computed(() => {
    return state.visitorRecords.filter(r => 
      dayjs(r.visitTime).format('YYYY-MM-DD') === state.currentDate && r.status === 'left'
    )
  }),

  last7DaysVisitors: computed(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = today.subtract(i, 'day').format('YYYY-MM-DD')
      const count = state.visitorRecords.filter(r => 
        dayjs(r.visitTime).format('YYYY-MM-DD') === date
      ).length
      const leftCount = state.visitorRecords.filter(r => 
        dayjs(r.visitTime).format('YYYY-MM-DD') === date && r.status === 'left'
      ).length
      days.push({ date, count, leftCount })
    }
    return days
  }),

  visitorBuildingDistribution: computed(() => {
    const buildingMap = {}
    state.visitorRecords.forEach(r => {
      if (r.buildingId && dayjs(r.visitTime).format('YYYY-MM-DD') >= today.subtract(7, 'day').format('YYYY-MM-DD')) {
        buildingMap[r.buildingId] = (buildingMap[r.buildingId] || 0) + 1
      }
    })
    return state.buildings.map(building => {
      return { 
        name: building.name, 
        count: buildingMap[building.id] || 0, 
        id: building.id 
      }
    }).sort((a, b) => b.count - a.count)
  }),

  createVisitorRecord(recordData) {
    const todayStr = today.format('YYYYMMDD')
    const todayCount = state.visitorRecords.filter(o => 
      o.id.startsWith('FK' + todayStr)
    ).length + 1
    
    const newRecord = {
      id: `FK${todayStr}${String(todayCount).padStart(4, '0')}`,
      ...recordData,
      status: 'pending',
      createTime: nowStr,
      auditTime: null,
      auditOperator: null,
      auditRemark: null,
      releaseTime: null,
      releaseOperator: null,
      releaseGate: null,
      signTime: null,
      signOperator: null,
      leaveTime: null,
      leaveOperator: null,
      leaveGate: null,
      processLogs: [
        { time: nowStr, operator: recordData.createOperator || '张客服', action: '提交预约', content: `登记访客预约：${recordData.visitorName}` }
      ],
      processResult: null
    }
    
    state.visitorRecords.unshift(newRecord)
    return newRecord
  },

  auditVisitor(recordId, operator, isApproved, remark) {
    const record = state.visitorRecords.find(r => r.id === recordId)
    if (!record || record.status !== 'pending') return false

    record.auditTime = nowStr
    record.auditOperator = operator
    record.auditRemark = remark || ''
    
    if (isApproved) {
      record.status = 'approved'
      record.processLogs.push({
        time: nowStr,
        operator: operator,
        action: '审核通过',
        content: remark || '信息无误，审核通过'
      })
    } else {
      record.status = 'rejected'
      record.processLogs.push({
        time: nowStr,
        operator: operator,
        action: '审核拒绝',
        content: remark || '审核未通过'
      })
    }
    
    return true
  },

  releaseVisitor(recordId, operator, gate, operatorRole) {
    const record = state.visitorRecords.find(r => r.id === recordId)
    if (!record) return { success: false, message: '未找到该预约记录' }

    const visitTime = dayjs(record.visitTime)
    
    if (!record.visitorPhone || record.visitorPhone.length < 11) {
      return { success: false, message: '访客手机号信息不完整，无法放行，请先补充信息' }
    }
    if (!record.roomNumber) {
      return { success: false, message: '拜访房号信息不完整，无法放行，请先补充信息' }
    }
    if (record.status === 'rejected') {
      return { success: false, message: '该预约已被审核拒绝，无法放行' }
    }
    if (record.status === 'cancelled') {
      return { success: false, message: '该预约已被取消，无法放行' }
    }
    if (record.status === 'expired') {
      return { success: false, message: '该预约已过期，无法放行' }
    }
    if (record.status === 'left') {
      return { success: false, message: '该访客已登记离场，无需重复放行' }
    }
    if (record.status === 'signed') {
      return { success: false, message: '该访客已签到，无需重复放行' }
    }
    if (record.status === 'released') {
      return { success: false, message: '该访客已放行，无需重复放行' }
    }
    if (record.status === 'pending') {
      return { success: false, message: '该预约尚未审核，无法放行，请先审核通过' }
    }
    if (record.status !== 'approved') {
      return { success: false, message: `当前状态为"${visitorStatusMap[record.status]}"，不允许放行` }
    }
    
    const expiryTime = visitTime.add(4, 'hour')
    if (nowTime.isAfter(expiryTime)) {
      return { success: false, message: `已过预约时段（预约时间${record.visitTime}，超过4小时），无法放行，请重新预约` }
    }

    record.releaseTime = nowStr
    record.releaseOperator = operator
    record.releaseGate = gate
    record.status = 'released'
    record.processLogs.push({
      time: nowStr,
      operator: operator,
      action: '放行',
      content: `从${gate}放行${operatorRole === 'security' ? '（安保操作）' : ''}`
    })
    
    return { success: true }
  },

  signVisitor(recordId, operator) {
    const record = state.visitorRecords.find(r => r.id === recordId)
    if (!record) return { success: false, message: '未找到该预约记录' }

    if (record.status === 'pending') {
      return { success: false, message: '该预约尚未审核，无法签到' }
    }
    if (record.status === 'approved') {
      return { success: false, message: '该预约尚未放行，请先在门岗放行后再签到' }
    }
    if (record.status === 'rejected') {
      return { success: false, message: '该预约已被审核拒绝，无法签到' }
    }
    if (record.status === 'cancelled') {
      return { success: false, message: '该预约已被取消，无法签到' }
    }
    if (record.status === 'expired') {
      return { success: false, message: '该预约已过期，无法签到' }
    }
    if (record.status === 'signed') {
      return { success: false, message: '该访客已签到，无需重复签到' }
    }
    if (record.status === 'left') {
      return { success: false, message: '该访客已登记离场，无需签到' }
    }
    if (record.status !== 'released') {
      return { success: false, message: `当前状态为"${visitorStatusMap[record.status]}"，不允许签到` }
    }

    record.signTime = nowStr
    record.signOperator = operator
    record.status = 'signed'
    record.processLogs.push({
      time: nowStr,
      operator: operator,
      action: '签到确认',
      content: '访客已到达，与业主确认后签到'
    })
    
    return { success: true }
  },

  leaveVisitor(recordId, operator, gate) {
    const record = state.visitorRecords.find(r => r.id === recordId)
    if (!record) return { success: false, message: '未找到该预约记录' }

    if (record.status === 'pending') {
      return { success: false, message: '该预约尚未审核，无法登记离场' }
    }
    if (record.status === 'approved') {
      return { success: false, message: '该预约尚未放行，无法登记离场' }
    }
    if (record.status === 'released') {
      return { success: false, message: '该访客尚未签到，请先完成楼栋签到后再登记离场' }
    }
    if (record.status === 'rejected') {
      return { success: false, message: '该预约已被审核拒绝，无需登记离场' }
    }
    if (record.status === 'cancelled') {
      return { success: false, message: '该预约已被取消，无需登记离场' }
    }
    if (record.status === 'expired') {
      return { success: false, message: '该预约已过期，无需登记离场' }
    }
    if (record.status === 'left') {
      return { success: false, message: '该访客已登记离场，无需重复操作' }
    }
    if (record.status !== 'signed') {
      return { success: false, message: `当前状态为"${visitorStatusMap[record.status]}"，不允许登记离场` }
    }

    record.leaveTime = nowStr
    record.leaveOperator = operator
    record.leaveGate = gate
    record.status = 'left'
    record.processLogs.push({
      time: nowStr,
      operator: operator,
      action: '登记离场',
      content: `从${gate}登记离场，本次来访流程结束`
    })
    
    return { success: true }
  },

  cancelVisitor(recordId, operator, reason) {
    const record = state.visitorRecords.find(r => r.id === recordId)
    if (!record || ['left', 'cancelled', 'rejected'].includes(record.status)) return false

    record.status = 'cancelled'
    record.remark = reason
    record.processLogs.push({
      time: nowStr,
      operator: operator,
      action: '取消预约',
      content: reason || '取消预约'
    })
    
    return true
  },

  updateVisitorRecord(recordId, updateData) {
    const record = state.visitorRecords.find(r => r.id === recordId)
    if (!record) return false
    
    Object.assign(record, updateData)
    
    record.processLogs.push({
      time: nowStr,
      operator: updateData.updateOperator || '张客服',
      action: '修改信息',
      content: `更新访客预约信息`
    })
    
    return true
  },

  addVisitorRemark(recordId, remark, operator) {
    const record = state.visitorRecords.find(r => r.id === recordId)
    if (!record) return false
    
    record.remark = record.remark ? record.remark + '；' + remark : remark
    record.processLogs.push({
      time: nowStr,
      operator: operator,
      action: '补充备注',
      content: remark
    })
    
    return true
  },

  getVisitorById(recordId) {
    return state.visitorRecords.find(r => r.id === recordId)
  },

  validateVisitorForm(formData) {
    const errors = {}
    
    if (!formData.visitorName || formData.visitorName.trim() === '') {
      errors.visitorName = '请填写来访人姓名'
    } else if (formData.visitorName.trim().length < 2) {
      errors.visitorName = '姓名至少需要2个字符'
    }
    
    if (!formData.visitorPhone || formData.visitorPhone.trim() === '') {
      errors.visitorPhone = '请填写联系电话'
    } else if (!/^1[3-9]\d{9}$/.test(formData.visitorPhone.trim())) {
      errors.visitorPhone = '手机号格式不正确，请输入11位有效手机号（以1开头）'
    }
    
    if (!formData.visitTime || formData.visitTime.trim() === '') {
      errors.visitTime = '请选择到访时间'
    } else {
      const visit = dayjs(formData.visitTime)
      if (!visit.isValid()) {
        errors.visitTime = '到访时间格式不正确'
      }
    }
    
    if (!formData.endTime || formData.endTime.trim() === '') {
      errors.endTime = '请选择预计离场时间'
    } else if (formData.visitTime) {
      const visit = dayjs(formData.visitTime)
      const end = dayjs(formData.endTime)
      if (end.isBefore(visit)) {
        errors.endTime = '离场时间不能早于到访时间'
      } else if (end.diff(visit, 'hour') > 12) {
        errors.endTime = '单次来访时长不能超过12小时，如有需要请分次预约'
      }
    }
    
    if (formData.companionCount === '' || formData.companionCount === null || formData.companionCount === undefined) {
      errors.companionCount = '请填写同行人数（没有同行人填0）'
    } else if (isNaN(Number(formData.companionCount)) || Number(formData.companionCount) < 0) {
      errors.companionCount = '同行人数不能为负数'
    } else if (Number(formData.companionCount) > 15) {
      errors.companionCount = '同行人数超过15人，请联系物业特别登记'
    }
    
    if (formData.plateNumber && formData.plateNumber.trim() !== '') {
      const platePattern = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-Z0-9]{4,6}$/
      if (!platePattern.test(formData.plateNumber.trim().toUpperCase())) {
        errors.plateNumber = '车牌号格式不正确，请输入正确的车牌号'
      }
    }
    
    if (!formData.roomNumber || formData.roomNumber.trim() === '') {
      errors.roomNumber = '请填写拜访房号'
    }
    
    if (!formData.hostName || formData.hostName.trim() === '') {
      errors.hostName = '请填写被访人姓名'
    }
    
    if (!formData.hostPhone || formData.hostPhone.trim() === '') {
      errors.hostPhone = '请填写被访人联系电话'
    } else if (!/^1[3-9]\d{9}$/.test(formData.hostPhone.trim())) {
      errors.hostPhone = '被访人手机号格式不正确'
    }
    
    return errors
  },

  addToBlacklist(blacklistData) {
    const id = `BL${today.format('YYYYMMDD')}${String(state.blacklistRecords.length + 1).padStart(3, '0')}`
    const newRecord = {
      id,
      visitorName: blacklistData.visitorName,
      visitorPhone: blacklistData.visitorPhone,
      idCard: blacklistData.idCard || '',
      reason: blacklistData.reason,
      reasonDetail: blacklistData.reasonDetail,
      status: 'active',
      createTime: nowStr,
      createOperator: blacklistData.operator,
      reportSource: blacklistData.reportSource || '手动录入',
      complainant: blacklistData.complainant || null,
      complaintCount: blacklistData.complaintCount || 0,
      relatedVisitorIds: blacklistData.relatedVisitorIds || [],
      releaseRecords: [],
      processLogs: [
        {
          time: nowStr,
          operator: blacklistData.operator,
          action: '列入黑名单',
          content: blacklistData.reasonDetail || '列入黑名单'
        }
      ]
    }
    state.blacklistRecords.unshift(newRecord)
    return newRecord
  },

  removeFromBlacklist(blacklistId, operator, reason) {
    const record = state.blacklistRecords.find(r => r.id === blacklistId)
    if (!record) return false
    record.status = 'removed'
    record.removeTime = nowStr
    record.removeOperator = operator
    record.removeReason = reason
    record.processLogs.push({
      time: nowStr,
      operator,
      action: '移出黑名单',
      content: reason
    })
    return true
  },

  getBlacklistById(blacklistId) {
    return state.blacklistRecords.find(r => r.id === blacklistId)
  },

  addTemporaryRelease(blacklistId, releaseData) {
    const record = state.blacklistRecords.find(r => r.id === blacklistId)
    if (!record) return null
    const releaseId = `REL${today.format('YYYYMMDD')}${String((record.releaseRecords?.length || 0) + 1).padStart(3, '0')}`
    const newRelease = {
      id: releaseId,
      visitorName: record.visitorName,
      visitorPhone: record.visitorPhone,
      visitTime: releaseData.visitTime,
      endTime: releaseData.endTime,
      buildingId: releaseData.buildingId,
      roomNumber: releaseData.roomNumber,
      hostName: releaseData.hostName,
      hostPhone: releaseData.hostPhone,
      approvedBy: releaseData.approvedBy,
      approveTime: nowStr,
      approveReason: releaseData.approveReason,
      expireTime: releaseData.expireTime,
      used: false,
      usedRecordId: null
    }
    if (!record.releaseRecords) {
      record.releaseRecords = []
    }
    record.releaseRecords.unshift(newRelease)
    record.processLogs.push({
      time: nowStr,
      operator: releaseData.approvedBy,
      action: '临时放行审批',
      content: `${releaseData.approveReason}，有效期至${releaseData.expireTime}`
    })
    return newRelease
  },

  useTemporaryRelease(blacklistId, releaseId, visitorRecordId) {
    const record = state.blacklistRecords.find(r => r.id === blacklistId)
    if (!record || !record.releaseRecords) return false
    const release = record.releaseRecords.find(r => r.id === releaseId)
    if (!release) return false
    release.used = true
    release.usedRecordId = visitorRecordId
    return true
  },

  markTemporaryReleaseUsed(releaseId, visitorRecordId) {
    for (const blacklist of state.blacklistRecords) {
      if (!blacklist.releaseRecords) continue
      const release = blacklist.releaseRecords.find(r => r.id === releaseId)
      if (release) {
        release.used = true
        release.usedRecordId = visitorRecordId
        release.usedTime = nowStr
        blacklist.processLogs.push({
          time: nowStr,
          operator: '系统',
          action: '临时放行使用',
          content: `临时放行${releaseId}已被预约${visitorRecordId}使用`
        })
        return true
      }
    }
    return false
  },

  updateBlacklistRecord(blacklistId, updateData) {
    const record = state.blacklistRecords.find(r => r.id === blacklistId)
    if (!record) return false
    Object.assign(record, updateData)
    return true
  },

  addBlacklistProcessLog(blacklistId, operator, action, content) {
    const record = state.blacklistRecords.find(r => r.id === blacklistId)
    if (!record) return false
    record.processLogs.push({
      time: nowStr,
      operator,
      action,
      content
    })
    return true
  },

  getVisitorRejectionCount(visitorPhone) {
    return state.visitorRecords.filter(r => 
      r.visitorPhone === visitorPhone && r.status === 'rejected'
    ).length
  },

  createDecorationRecord(recordData) {
    const todayStr = today.format('YYYYMMDD')
    const todayCount = state.decorationRecords.filter(o => 
      o.id.startsWith('ZX' + todayStr)
    ).length + 1
    
    const newRecord = {
      id: `ZX${todayStr}${String(todayCount).padStart(4, '0')}`,
      ...recordData,
      originalEndDate: recordData.endDate,
      status: 'pending_audit',
      createTime: nowStr,
      createOperator: recordData.createOperator || '张客服（前台）',
      auditTime: null,
      auditOperator: null,
      auditResult: null,
      auditRemark: null,
      enterTime: null,
      enterOperator: null,
      exitTime: null,
      exitOperator: null,
      inspectionRecords: [],
      rectificationRecords: [],
      acceptanceRecord: null,
      isOverdue: false,
      hasViolation: false,
      extensionRecords: [],
      processLogs: [
        { time: nowStr, operator: recordData.createOperator || '张客服', action: '提交申请', content: `提交装修申请，缴纳押金${recordData.depositAmount}元` }
      ]
    }
    
    state.decorationRecords.unshift(newRecord)
    return newRecord
  },

  submitExtension(recordId, extensionData) {
    const record = state.decorationRecords.find(r => r.id === recordId)
    if (!record) return false
    if (!['constructing', 'rectifying'].includes(record.status)) return false

    const extensionId = `EXT${Date.now()}`
    const newExtension = {
      id: extensionId,
      applyTime: nowStr,
      applyOperator: extensionData.applicant,
      applyRole: extensionData.applyRole || 'owner',
      extensionDays: extensionData.extensionDays,
      reason: extensionData.reason,
      newEndDate: extensionData.newEndDate,
      status: 'pending',
      auditTime: null,
      auditOperator: null,
      auditResult: null,
      auditRemark: null
    }

    if (!record.extensionRecords) {
      record.extensionRecords = []
    }
    record.extensionRecords.push(newExtension)

    record.processLogs.push({
      time: nowStr,
      operator: extensionData.applicant,
      action: '申请延期',
      content: `申请延期${extensionData.extensionDays}天，原因：${extensionData.reason}，新计划完工时间：${extensionData.newEndDate}`
    })

    return newExtension
  },

  auditExtension(recordId, extensionId, operator, isApproved, remark) {
    const record = state.decorationRecords.find(r => r.id === recordId)
    if (!record || !record.extensionRecords) return false

    const extension = record.extensionRecords.find(e => e.id === extensionId)
    if (!extension || extension.status !== 'pending') return false

    extension.auditTime = nowStr
    extension.auditOperator = operator
    extension.auditResult = isApproved ? 'approved' : 'rejected'
    extension.auditRemark = remark || ''
    extension.status = isApproved ? 'approved' : 'rejected'

    if (isApproved) {
      record.endDate = extension.newEndDate
      const today_ = dayjs('2026-06-17')
      record.isOverdue = dayjs(record.endDate).isBefore(today_)
    }

    record.processLogs.push({
      time: nowStr,
      operator: operator,
      action: isApproved ? '延期审批通过' : '延期审批驳回',
      content: isApproved 
        ? `延期申请已通过，延期${extension.extensionDays}天，新完工时间：${extension.newEndDate}。${remark || ''}`
        : `延期申请已驳回。${remark || '未说明原因'}`
    })

    return true
  },

  auditDecoration(recordId, operator, isApproved, remark) {
    const record = state.decorationRecords.find(r => r.id === recordId)
    if (!record || record.status !== 'pending_audit') return false

    record.auditTime = nowStr
    record.auditOperator = operator
    record.auditResult = isApproved ? 'approved' : 'rejected'
    record.auditRemark = remark || ''
    
    const missingMaterials = record.materialList.filter(m => !m.provided)
    if (isApproved && missingMaterials.length > 0) {
      record.processLogs.push({
        time: nowStr,
        operator: operator,
        action: '审核通过（材料待补）',
        content: `审核通过，但缺少材料：${missingMaterials.map(m => m.name).join('、')}。${remark || ''}`
      })
      record.status = 'audit_approved'
    } else if (isApproved) {
      record.status = 'audit_approved'
      record.processLogs.push({
        time: nowStr,
        operator: operator,
        action: '审核通过',
        content: remark || '材料齐全，装修方案合理，审核通过'
      })
    } else {
      record.status = 'audit_rejected'
      record.processLogs.push({
        time: nowStr,
        operator: operator,
        action: '审核不通过',
        content: remark || '审核未通过'
      })
    }
    
    return true
  },

  enterDecoration(recordId, operator) {
    const record = state.decorationRecords.find(r => r.id === recordId)
    if (!record || record.status !== 'audit_approved') return false

    record.status = 'constructing'
    record.enterTime = nowStr
    record.enterOperator = operator
    record.processLogs.push({
      time: nowStr,
      operator: operator,
      action: '施工进场',
      content: '施工人员和材料进场，已做好公共区域保护'
    })
    
    return true
  },

  addInspectionRecord(recordId, inspectionData) {
    const record = state.decorationRecords.find(r => r.id === recordId)
    if (!record) return false

    const inspectionId = `INSP${Date.now()}`
    const newInspection = {
      id: inspectionId,
      time: nowStr,
      inspector: inspectionData.inspector,
      content: inspectionData.content,
      hasViolation: inspectionData.hasViolation,
      violationType: inspectionData.violationType || null,
      violationDesc: inspectionData.violationDesc || null,
      images: []
    }

    if (!record.inspectionRecords) {
      record.inspectionRecords = []
    }
    record.inspectionRecords.push(newInspection)

    if (inspectionData.hasViolation) {
      record.hasViolation = true
      record.status = 'rectifying'
    }

    record.processLogs.push({
      time: nowStr,
      operator: inspectionData.inspector,
      action: inspectionData.hasViolation ? '发现违规' : '日常巡查',
      content: inspectionData.hasViolation 
        ? `巡查发现违规：${inspectionData.violationDesc}，已发放整改通知书`
        : '日常巡查，施工正常，无违规'
    })

    return newInspection
  },

  addRectificationRecord(recordId, rectificationData) {
    const record = state.decorationRecords.find(r => r.id === recordId)
    if (!record) return false

    const rectificationId = `RECT${Date.now()}`
    const newRectification = {
      id: rectificationId,
      issueTime: nowStr,
      issuePerson: rectificationData.issuePerson,
      violationType: rectificationData.violationType,
      violationDesc: rectificationData.violationDesc,
      deadline: rectificationData.deadline,
      rectifyTime: null,
      rectifyDesc: null,
      recheckTime: null,
      recheckResult: null,
      recheckRemark: null
    }

    if (!record.rectificationRecords) {
      record.rectificationRecords = []
    }
    record.rectificationRecords.push(newRectification)
    record.status = 'rectifying'

    return newRectification
  },

  submitRectification(recordId, rectificationId, rectifyDesc) {
    const record = state.decorationRecords.find(r => r.id === recordId)
    if (!record) return false

    const rectification = record.rectificationRecords?.find(r => r.id === rectificationId)
    if (!rectification) return false

    rectification.rectifyTime = nowStr
    rectification.rectifyDesc = rectifyDesc

    record.processLogs.push({
      time: nowStr,
      operator: rectification.issuePerson,
      action: '提交整改',
      content: rectifyDesc
    })

    return true
  },

  recheckRectification(recordId, rectificationId, operator, isPassed, remark) {
    const record = state.decorationRecords.find(r => r.id === recordId)
    if (!record) return false

    const rectification = record.rectificationRecords?.find(r => r.id === rectificationId)
    if (!rectification) return false

    rectification.recheckTime = nowStr
    rectification.recheckResult = isPassed ? 'passed' : 'failed'
    rectification.recheckRemark = remark

    const allRectified = record.rectificationRecords.every(r => r.recheckResult === 'passed')
    
    if (isPassed && allRectified) {
      record.status = 'constructing'
      record.hasViolation = false
    }

    record.processLogs.push({
      time: nowStr,
      operator: operator,
      action: '整改复查',
      content: isPassed 
        ? `整改复查通过。${remark || ''}`
        : `整改复查不通过：${remark || '需继续整改'}`
    })

    return true
  },

  applyAcceptance(recordId, applicant) {
    const record = state.decorationRecords.find(r => r.id === recordId)
    if (!record || !['constructing', 'rectifying'].includes(record.status)) return false

    record.status = 'completed'
    record.processLogs.push({
      time: nowStr,
      operator: applicant,
      action: '申请验收',
      content: '施工完成，申请完工验收'
    })

    return true
  },

  completeAcceptance(recordId, checker, acceptanceData) {
    const record = state.decorationRecords.find(r => r.id === recordId)
    if (!record || record.status !== 'completed') return false

    const acceptanceId = `ACCEPT${Date.now()}`
    record.acceptanceRecord = {
      id: acceptanceId,
      applyTime: record.processLogs.find(l => l.action === '申请验收')?.time || nowStr,
      applyPerson: record.processLogs.find(l => l.action === '申请验收')?.operator || '业主',
      checkTime: nowStr,
      checker: checker,
      result: acceptanceData.result,
      qualityScore: acceptanceData.qualityScore,
      cleanScore: acceptanceData.cleanScore,
      structureScore: acceptanceData.structureScore,
      remark: acceptanceData.remark,
      images: []
    }

    if (acceptanceData.result === 'passed') {
      record.status = 'acceptance_passed'
      record.exitTime = nowStr
      record.exitOperator = checker
    } else {
      record.status = 'acceptance_failed'
    }

    const avgScore = Math.round((acceptanceData.qualityScore + acceptanceData.cleanScore + acceptanceData.structureScore) / 3)
    record.processLogs.push({
      time: nowStr,
      operator: checker,
      action: acceptanceData.result === 'passed' ? '验收通过' : '验收不通过',
      content: acceptanceData.result === 'passed'
        ? `验收通过，综合评分${avgScore}分，可申请押金退还。${acceptanceData.remark || ''}`
        : `验收不通过：${acceptanceData.remark || '存在质量问题，需整改后重新申请验收'}`
    })

    return true
  },

  refundDeposit(recordId, operator, refundAmount) {
    const record = state.decorationRecords.find(r => r.id === recordId)
    if (!record || record.status !== 'acceptance_passed' || record.depositRefunded) return false

    record.depositRefunded = true
    record.depositRefundAmount = refundAmount
    record.depositRefundDate = nowStr
    record.status = 'deposit_refunded'

    record.processLogs.push({
      time: nowStr,
      operator: operator,
      action: '押金退还',
      content: `押金${refundAmount}元已退还`
    })

    return true
  },

  updateDecorationRecord(recordId, updateData) {
    const record = state.decorationRecords.find(r => r.id === recordId)
    if (!record) return false
    
    Object.assign(record, updateData)
    return true
  },

  validateDecorationForm(formData) {
    const errors = {}
    
    if (!formData.buildingId) {
      errors.buildingId = '请选择楼栋'
    }
    if (!formData.roomNumber || formData.roomNumber.trim() === '') {
      errors.roomNumber = '请填写房号'
    }
    if (!formData.ownerName || formData.ownerName.trim() === '') {
      errors.ownerName = '请填写业主姓名'
    } else if (formData.ownerName.trim().length < 2) {
      errors.ownerName = '业主姓名至少2个字符'
    }
    if (!formData.ownerPhone || formData.ownerPhone.trim() === '') {
      errors.ownerPhone = '请填写业主电话'
    } else if (!/^1[3-9]\d{9}$/.test(formData.ownerPhone.trim())) {
      errors.ownerPhone = '请输入正确的手机号码'
    }
    if (!formData.decorationType) {
      errors.decorationType = '请选择装修类型'
    }
    if (!formData.startDate) {
      errors.startDate = '请选择开始时间'
    }
    if (!formData.endDate) {
      errors.endDate = '请选择结束时间'
    } else if (formData.startDate && dayjs(formData.endDate).isBefore(dayjs(formData.startDate))) {
      errors.endDate = '结束时间不能早于开始时间'
    }
    if (!formData.constructionCompany || formData.constructionCompany.trim() === '') {
      errors.constructionCompany = '请填写施工单位'
    }
    if (!formData.foremanName || formData.foremanName.trim() === '') {
      errors.foremanName = '请填写施工负责人'
    } else if (formData.foremanName.trim().length < 2) {
      errors.foremanName = '施工负责人姓名至少2个字符'
    }
    if (!formData.foremanPhone || formData.foremanPhone.trim() === '') {
      errors.foremanPhone = '请填写负责人电话'
    } else if (!/^1[3-9]\d{9}$/.test(formData.foremanPhone.trim())) {
      errors.foremanPhone = '请输入正确的负责人手机号码'
    }
    if (formData.workerCount === '' || formData.workerCount === null || formData.workerCount === undefined) {
      errors.workerCount = '请填写施工人数'
    } else if (isNaN(Number(formData.workerCount)) || Number(formData.workerCount) <= 0) {
      errors.workerCount = '施工人数必须大于0'
    }
    if (formData.depositAmount === '' || formData.depositAmount === null || formData.depositAmount === undefined) {
      errors.depositAmount = '请填写押金金额'
    } else if (isNaN(Number(formData.depositAmount)) || Number(formData.depositAmount) < 0) {
      errors.depositAmount = '押金金额不能为负数'
    }
    if (!formData.decorationContent || formData.decorationContent.trim() === '') {
      errors.decorationContent = '请填写装修内容'
    } else if (formData.decorationContent.trim().length < 10) {
      errors.decorationContent = '装修内容至少需要10个字'
    }
    
    return errors
  },

  createMovingRecord(recordData) {
    const todayStr = today.format('YYYYMMDD')
    const todayCount = state.movingRecords.filter(o => 
      o.id.startsWith('BJ' + todayStr)
    ).length + 1
    
    const newRecord = {
      id: `BJ${todayStr}${String(todayCount).padStart(4, '0')}`,
      ...recordData,
      status: 'pending_audit',
      createTime: nowStr,
      createOperator: recordData.createOperator || '张客服（前台）',
      auditTime: null,
      auditOperator: null,
      auditRemark: null,
      depositTime: null,
      depositOperator: null,
      depositMethod: null,
      entryReleaseTime: null,
      entryReleaseOperator: null,
      entryReleaseGate: null,
      verifyTime: null,
      verifyOperator: null,
      verifyResult: null,
      verifyRemark: null,
      itemsConsistent: null,
      exitReleaseTime: null,
      exitReleaseOperator: null,
      exitReleaseGate: null,
      completeTime: null,
      completeOperator: null,
      completeRemark: null,
      depositRefunded: null,
      depositRefundTime: null,
      hasAbnormal: false,
      abnormalTypes: [],
      processLogs: [
        { time: nowStr, operator: recordData.createOperator || '张客服', action: '提交预约', content: `提交${recordData.movingType === 'move_in' ? '搬入' : '搬出'}预约申请` }
      ]
    }
    
    state.movingRecords.unshift(newRecord)
    return { success: true, record: newRecord }
  },

  auditMoving(recordId, operator, isApproved, remark) {
    const record = state.movingRecords.find(r => r.id === recordId)
    if (!record || record.status !== 'pending_audit') return false

    record.auditTime = nowStr
    record.auditOperator = operator
    record.auditRemark = remark || ''
    
    if (isApproved) {
      const missingMaterials = []
      if (!record.plateNumber || record.plateNumber.trim() === '') {
        missingMaterials.push('搬运车辆牌号')
      }
      if (!record.movingCompany || record.movingCompany.trim() === '') {
        missingMaterials.push('搬家公司')
      }
      if (!record.declaredItems || record.declaredItems.length === 0) {
        missingMaterials.push('申报物品清单')
      }
      
      if (missingMaterials.length > 0) {
        record.hasAbnormal = true
        if (!record.abnormalTypes.includes('material_incomplete')) {
          record.abnormalTypes.push('material_incomplete')
        }
        record.status = 'audit_approved'
        record.processLogs.push({
          time: nowStr,
          operator: operator,
          action: '审核通过（资料待补）',
          content: `审核通过，但缺少资料：${missingMaterials.join('、')}。${remark || ''}`
        })
      } else {
        record.status = 'audit_approved'
        record.processLogs.push({
          time: nowStr,
          operator: operator,
          action: '审核通过',
          content: remark || '资料齐全，审核通过'
        })
      }
    } else {
      record.status = 'audit_rejected'
      record.hasAbnormal = true
      if (!record.abnormalTypes.includes('material_incomplete')) {
        record.abnormalTypes.push('material_incomplete')
      }
      record.processLogs.push({
        time: nowStr,
        operator: operator,
        action: '审核拒绝',
        content: remark || '审核未通过'
      })
    }
    
    return true
  },

  registerDeposit(recordId, operator, amount, method) {
    const record = state.movingRecords.find(r => r.id === recordId)
    if (!record || record.status !== 'audit_approved') return false

    record.depositTime = nowStr
    record.depositOperator = operator
    record.depositMethod = method || '现金'
    record.depositAmount = amount
    record.status = 'deposit_paid'
    
    if (record.abnormalTypes.includes('deposit_unpaid')) {
      record.abnormalTypes = record.abnormalTypes.filter(t => t !== 'deposit_unpaid')
      if (record.abnormalTypes.length === 0) {
        record.hasAbnormal = false
      }
    }
    
    record.processLogs.push({
      time: nowStr,
      operator: operator,
      action: '押金登记',
      content: `收取押金${amount}元（${method || '现金'}）`
    })
    
    return true
  },

  releaseEntryMoving(recordId, operator, gate) {
    const record = state.movingRecords.find(r => r.id === recordId)
    if (!record) return { success: false, message: '未找到该预约记录' }

    if (record.status === 'audit_rejected') {
      return { success: false, message: '该预约已被审核拒绝，无法放行' }
    }
    if (record.status === 'cancelled') {
      return { success: false, message: '该预约已被取消，无法放行' }
    }
    if (record.status === 'completed') {
      return { success: false, message: '该搬家已完结，无需重复操作' }
    }
    if (['entry_released', 'verifying', 'exit_released'].includes(record.status)) {
      return { success: false, message: '该搬家车辆已入场，无需重复放行' }
    }
    if (record.status === 'pending_audit') {
      return { success: false, message: '该预约尚未审核，请先审核通过' }
    }
    if (record.status === 'audit_approved') {
      return { success: false, message: '尚未缴纳押金，请先完成押金登记' }
    }
    if (record.status !== 'deposit_paid') {
      return { success: false, message: `当前状态为"${movingStatusMap[record.status]}"，不允许入场放行` }
    }

    const moveTime = dayjs(record.moveStartTime)
    const expiryTime = moveTime.add(4, 'hour')
    if (nowTime.isAfter(expiryTime)) {
      record.hasAbnormal = true
      if (!record.abnormalTypes.includes('overtime')) {
        record.abnormalTypes.push('overtime')
      }
    }

    record.entryReleaseTime = nowStr
    record.entryReleaseOperator = operator
    record.entryReleaseGate = gate
    record.status = 'entry_released'
    record.processLogs.push({
      time: nowStr,
      operator: operator,
      action: '入场放行',
      content: `从${gate}车辆通道放行入场`
    })
    
    return { success: true }
  },

  verifyMoving(recordId, operator, verifyResult, verifyRemark, itemsConsistent) {
    const record = state.movingRecords.find(r => r.id === recordId)
    if (!record) return false

    if (!['entry_released', 'verifying'].includes(record.status)) return false

    record.verifyTime = nowStr
    record.verifyOperator = operator
    record.verifyResult = verifyResult
    record.verifyRemark = verifyRemark
    record.itemsConsistent = itemsConsistent

    if (itemsConsistent === false) {
      record.hasAbnormal = true
      if (!record.abnormalTypes.includes('items_inconsistent')) {
        record.abnormalTypes.push('items_inconsistent')
      }
      record.status = 'verifying'
    } else {
      if (record.abnormalTypes.includes('items_inconsistent')) {
        record.abnormalTypes = record.abnormalTypes.filter(t => t !== 'items_inconsistent')
        if (record.abnormalTypes.length === 0) {
          record.hasAbnormal = false
        }
      }
      record.status = 'verifying'
    }
    
    record.processLogs.push({
      time: nowStr,
      operator: operator,
      action: '现场核验',
      content: itemsConsistent 
        ? `现场核验通过，物品与申报一致。${verifyRemark || ''}` 
        : `现场核验发现异常：${verifyRemark || '物品与申报不符'}`
    })
    
    return true
  },

  releaseExitMoving(recordId, operator, gate) {
    const record = state.movingRecords.find(r => r.id === recordId)
    if (!record) return { success: false, message: '未找到该预约记录' }

    if (!['entry_released', 'verifying'].includes(record.status)) {
      return { success: false, message: `当前状态为"${movingStatusMap[record.status]}"，不允许离场放行` }
    }

    record.exitReleaseTime = nowStr
    record.exitReleaseOperator = operator
    record.exitReleaseGate = gate
    record.status = 'exit_released'
    record.processLogs.push({
      time: nowStr,
      operator: operator,
      action: '离场放行',
      content: `从${gate}车辆通道放行离场`
    })
    
    return { success: true }
  },

  completeMoving(recordId, operator, remark, refundDeposit) {
    const record = state.movingRecords.find(r => r.id === recordId)
    if (!record) return false

    if (!['exit_released', 'verifying'].includes(record.status)) return false

    record.completeTime = nowStr
    record.completeOperator = operator
    record.completeRemark = remark || ''
    record.status = 'completed'
    
    if (refundDeposit) {
      record.depositRefunded = true
      record.depositRefundTime = nowStr
    }
    
    record.processLogs.push({
      time: nowStr,
      operator: operator,
      action: '完结登记',
      content: `搬家流程结束。${refundDeposit ? '押金已退还。' : ''}${remark || ''}`
    })
    
    return true
  },

  cancelMoving(recordId, operator, reason) {
    const record = state.movingRecords.find(r => r.id === recordId)
    if (!record || ['completed', 'cancelled', 'audit_rejected', 'expired'].includes(record.status)) return false

    record.status = 'cancelled'
    record.remark = reason
    
    if (record.depositTime) {
      record.depositRefunded = true
      record.depositRefundTime = nowStr
    }
    
    record.processLogs.push({
      time: nowStr,
      operator: operator,
      action: '取消预约',
      content: reason || '取消预约'
    })
    
    return true
  },

  updateMovingRecord(recordId, updateData) {
    const record = state.movingRecords.find(r => r.id === recordId)
    if (!record) return false
    
    Object.assign(record, updateData)
    
    record.processLogs.push({
      time: nowStr,
      operator: updateData.updateOperator || '张客服',
      action: '修改信息',
      content: '更新搬家预约信息'
    })
    
    return true
  },

  validateMovingForm(formData) {
    const errors = {}
    
    if (!formData.movingType) {
      errors.movingType = '请选择搬家类型'
    }
    
    if (!formData.buildingId) {
      errors.buildingId = '请选择楼栋'
    }
    
    if (!formData.roomNumber || formData.roomNumber.trim() === '') {
      errors.roomNumber = '请填写房号'
    }
    
    if (!formData.ownerName || formData.ownerName.trim() === '') {
      errors.ownerName = '请填写业主姓名'
    } else if (formData.ownerName.trim().length < 2) {
      errors.ownerName = '业主姓名至少2个字符'
    }
    
    if (!formData.ownerPhone || formData.ownerPhone.trim() === '') {
      errors.ownerPhone = '请填写业主联系电话'
    } else if (!/^1[3-9]\d{9}$/.test(formData.ownerPhone.trim())) {
      errors.ownerPhone = '业主手机号格式不正确'
    }
    
    if (!formData.contactName || formData.contactName.trim() === '') {
      errors.contactName = '请填写联系人姓名'
    } else if (formData.contactName.trim().length < 2) {
      errors.contactName = '联系人姓名至少2个字符'
    }
    
    if (!formData.contactPhone || formData.contactPhone.trim() === '') {
      errors.contactPhone = '请填写联系电话'
    } else if (!/^1[3-9]\d{9}$/.test(formData.contactPhone.trim())) {
      errors.contactPhone = '联系电话格式不正确，请输入11位有效手机号'
    }
    
    if (!formData.moveStartTime || formData.moveStartTime.trim() === '') {
      errors.moveStartTime = '请选择搬家开始时间'
    }
    
    if (!formData.moveEndTime || formData.moveEndTime.trim() === '') {
      errors.moveEndTime = '请选择搬家结束时间'
    } else if (formData.moveStartTime) {
      const start = dayjs(formData.moveStartTime)
      const end = dayjs(formData.moveEndTime)
      if (end.isBefore(start)) {
        errors.moveEndTime = '结束时间不能早于开始时间'
      }
    }
    
    if (formData.workerCount === '' || formData.workerCount === null || formData.workerCount === undefined) {
      errors.workerCount = '请填写搬运工人人数'
    } else if (isNaN(Number(formData.workerCount)) || Number(formData.workerCount) < 1) {
      errors.workerCount = '搬运工人人数不能小于1人'
    }
    
    if (formData.vehicleCount === '' || formData.vehicleCount === null || formData.vehicleCount === undefined) {
      errors.vehicleCount = '请填写搬运车辆数量'
    } else if (isNaN(Number(formData.vehicleCount)) || Number(formData.vehicleCount) < 1) {
      errors.vehicleCount = '搬运车辆数量不能小于1辆'
    }
    
    if (!formData.plateNumber || formData.plateNumber.trim() === '') {
      errors.plateNumber = '请填写搬运车辆牌号'
    }
    
    if (formData.depositAmount === '' || formData.depositAmount === null || formData.depositAmount === undefined) {
      errors.depositAmount = '请选择押金金额'
    } else if (isNaN(Number(formData.depositAmount)) || Number(formData.depositAmount) < 0) {
      errors.depositAmount = '押金金额不能为负数'
    }
    
    if (!formData.declaredItems || formData.declaredItems.length === 0) {
      errors.declaredItems = '请至少申报一件搬运物品'
    }
    
    return errors
  }
}

export function useStore() {
  return {
    state,
    ...getters,
    ...actions
  }
}

export { 
  repairCategories, 
  urgentLevels, 
  engineers, 
  serviceStaff, 
  satisfactionLevels, 
  visitStatusMap, 
  visitorPurposes, 
  visitorStatusMap, 
  visitorStatusColorMap, 
  blacklistReasons, 
  blacklistStatusMap, 
  blacklistStatusColorMap,
  decorationTypes,
  decorationStatusMap,
  decorationStatusColorMap,
  violationTypes,
  extensionStatusMap,
  extensionStatusColorMap,
  movingTypes,
  movingStatusMap,
  movingStatusColorMap,
  depositAmountOptions
}
