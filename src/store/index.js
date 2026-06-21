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
  blacklistRecords
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
  }
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
  }
}

export function useStore() {
  return {
    state,
    ...getters,
    ...actions
  }
}

export { repairCategories, urgentLevels, engineers, serviceStaff, satisfactionLevels, visitStatusMap, visitorPurposes, visitorStatusMap, visitorStatusColorMap, blacklistReasons, blacklistStatusMap, blacklistStatusColorMap }
