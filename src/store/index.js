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
  generateRepairOrders 
} from './mockData'

const today = dayjs('2026-06-17')

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
      source: 'manual'
    }
    
    state.repairOrders.unshift(newOrder)
    return newOrder
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
  }
}

export function useStore() {
  return {
    state,
    ...getters,
    ...actions
  }
}

export { repairCategories, urgentLevels, engineers, serviceStaff, satisfactionLevels, visitStatusMap }
