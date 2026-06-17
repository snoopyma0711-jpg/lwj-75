import dayjs from 'dayjs'

export const buildings = [
  { id: 'B001', name: '1号楼', floors: 28, units: 2, households: 224, address: '小区东区北侧', type: '高层住宅', status: 'normal' },
  { id: 'B002', name: '2号楼', floors: 28, units: 2, households: 224, address: '小区东区中间', type: '高层住宅', status: 'normal' },
  { id: 'B003', name: '3号楼', floors: 26, units: 2, households: 208, address: '小区东区南侧', type: '高层住宅', status: 'normal' },
  { id: 'B004', name: '5号楼', floors: 18, units: 3, households: 216, address: '小区西区北侧', type: '小高层住宅', status: 'normal' },
  { id: 'B005', name: '6号楼', floors: 18, units: 3, households: 216, address: '小区西区中间', type: '小高层住宅', status: 'normal' },
  { id: 'B006', name: '8号楼', floors: 6, units: 2, households: 48, address: '小区西南角', type: '洋房', status: 'normal' },
  { id: 'B007', name: '商业楼', floors: 3, units: 1, households: 12, address: '小区东门北侧', type: '商业配套', status: 'normal' },
  { id: 'B008', name: '会所', floors: 2, units: 1, households: 1, address: '小区中心花园东侧', type: '配套设施', status: 'normal' }
]

export const equipmentList = [
  { id: 'E001', name: '1号楼1单元电梯', buildingId: 'B001', location: '1号楼1单元', type: '电梯', model: 'OTIS-2000', installDate: '2018-03-15', status: 'normal', lastMaintainDate: '2026-06-10', lastRepairDate: '2026-05-20', manufacturer: '奥的斯电梯有限公司' },
  { id: 'E002', name: '1号楼2单元电梯', buildingId: 'B001', location: '1号楼2单元', type: '电梯', model: 'OTIS-2000', installDate: '2018-03-15', status: 'normal', lastMaintainDate: '2026-06-10', lastRepairDate: '2026-04-15', manufacturer: '奥的斯电梯有限公司' },
  { id: 'E003', name: '2号楼1单元电梯', buildingId: 'B002', location: '2号楼1单元', type: '电梯', model: 'OTIS-2000', installDate: '2018-05-20', status: 'maintenance', lastMaintainDate: '2026-06-01', lastRepairDate: '2026-06-08', manufacturer: '奥的斯电梯有限公司' },
  { id: 'E004', name: '2号楼2单元电梯', buildingId: 'B002', location: '2号楼2单元', type: '电梯', model: 'OTIS-2000', installDate: '2018-05-20', status: 'normal', lastMaintainDate: '2026-06-01', lastRepairDate: '2026-03-22', manufacturer: '奥的斯电梯有限公司' },
  { id: 'E005', name: '3号楼1单元电梯', buildingId: 'B003', location: '3号楼1单元', type: '电梯', model: 'MITSUBISHI-300', installDate: '2018-08-10', status: 'normal', lastMaintainDate: '2026-06-05', lastRepairDate: '2026-05-28', manufacturer: '三菱电梯有限公司' },
  { id: 'E006', name: '5号楼1单元电梯', buildingId: 'B004', location: '5号楼1单元', type: '电梯', model: 'MITSUBISHI-300', installDate: '2019-02-18', status: 'normal', lastMaintainDate: '2026-06-12', lastRepairDate: '2026-06-01', manufacturer: '三菱电梯有限公司' },
  { id: 'E007', name: '1号楼消防水泵', buildingId: 'B001', location: '1号楼地下一层泵房', type: '消防设施', model: 'XBD12/20', installDate: '2018-01-10', status: 'normal', lastMaintainDate: '2026-06-01', lastRepairDate: '2026-02-15', manufacturer: '上海水泵厂' },
  { id: 'E008', name: '2号楼消防水泵', buildingId: 'B002', location: '2号楼地下一层泵房', type: '消防设施', model: 'XBD12/20', installDate: '2018-03-01', status: 'normal', lastMaintainDate: '2026-06-01', lastRepairDate: null, manufacturer: '上海水泵厂' },
  { id: 'E009', name: '小区主供水泵', buildingId: null, location: '地下泵房', type: '给排水设备', model: 'CDL20-10', installDate: '2017-12-01', status: 'normal', lastMaintainDate: '2026-06-08', lastRepairDate: '2026-05-10', manufacturer: '南方泵业' },
  { id: 'E010', name: '配电室变压器1号', buildingId: null, location: '地下配电室', type: '电气设备', model: 'SCB10-1000', installDate: '2017-10-15', status: 'normal', lastMaintainDate: '2026-05-20', lastRepairDate: '2026-04-05', manufacturer: '正泰电器' },
  { id: 'E011', name: '监控中心主机', buildingId: null, location: '物业楼监控室', type: '安防设备', model: 'DS-9632N', installDate: '2020-06-01', status: 'normal', lastMaintainDate: '2026-06-15', lastRepairDate: '2026-06-10', manufacturer: '海康威视' },
  { id: 'E012', name: '1号楼中央空调主机', buildingId: 'B001', location: '1号楼楼顶', type: '空调设备', model: 'RFC400', installDate: '2018-04-20', status: 'maintenance', lastMaintainDate: '2026-06-16', lastRepairDate: '2026-06-16', manufacturer: '大金空调' }
]

const repairCategories = [
  { value: 'electrical', label: '电气维修' },
  { value: 'plumbing', label: '水暖维修' },
  { value: 'structure', label: '土建维修' },
  { value: 'elevator', label: '电梯故障' },
  { value: 'security', label: '安防设备' },
  { value: 'public', label: '公共设施' },
  { value: 'other', label: '其他' }
]

const urgentLevels = [
  { value: 'low', label: '一般' },
  { value: 'medium', label: '紧急' },
  { value: 'high', label: '非常紧急' }
]

const engineers = [
  { id: 'ENG001', name: '李工程师', phone: '138****1234', specialty: '电气' },
  { id: 'ENG002', name: '王师傅', phone: '139****5678', specialty: '水暖' },
  { id: 'ENG003', name: '张工', phone: '136****9012', specialty: '土建' },
  { id: 'ENG004', name: '刘师傅', phone: '137****3456', specialty: '综合' }
]

const today = dayjs('2026-06-17')

const generateRepairOrders = () => {
  const orders = []
  
  orders.push({
    id: 'WX202606170001',
    roomNumber: '1号楼1单元1501室',
    buildingId: 'B001',
    contactName: '王女士',
    contactPhone: '138****1111',
    category: 'plumbing',
    description: '厨房水龙头漏水，已经漏了两天了，橱柜下面都是水',
    expectedTime: today.format('YYYY-MM-DD') + ' 14:00-16:00',
    urgency: 'medium',
    status: 'pending',
    createTime: today.format('YYYY-MM-DD') + ' 08:30:00',
    assignTime: null,
    acceptTime: null,
    arriveTime: null,
    completeTime: null,
    engineerId: null,
    processLogs: [
      { time: today.format('YYYY-MM-DD') + ' 08:30:00', operator: '系统', action: '报修登记', content: '王女士通过APP报修厨房水龙头漏水' }
    ],
    processResult: null,
    needReturn: false,
    returnReason: null,
    remarks: '',
    isTimeout: false,
    source: 'resident'
  })
  
  orders.push({
    id: 'WX202606170002',
    roomNumber: '2号楼2单元2003室',
    buildingId: 'B002',
    contactName: '李先生',
    contactPhone: '139****2222',
    category: 'electrical',
    description: '客厅空调插座没电，插了电器没反应，其他插座正常',
    expectedTime: today.format('YYYY-MM-DD') + ' 10:00-12:00',
    urgency: 'low',
    status: 'assigned',
    createTime: today.format('YYYY-MM-DD') + ' 08:45:00',
    assignTime: today.format('YYYY-MM-DD') + ' 08:50:00',
    acceptTime: null,
    arriveTime: null,
    completeTime: null,
    engineerId: 'ENG001',
    processLogs: [
      { time: today.format('YYYY-MM-DD') + ' 08:45:00', operator: '系统', action: '报修登记', content: '李先生电话报修客厅插座无电' },
      { time: today.format('YYYY-MM-DD') + ' 08:50:00', operator: '张客服', action: '派单', content: '已派单给李工程师处理' }
    ],
    processResult: null,
    needReturn: false,
    returnReason: null,
    remarks: '客户白天都在家',
    isTimeout: false,
    source: 'phone'
  })
  
  orders.push({
    id: 'WX202606170003',
    roomNumber: '3号楼1单元0502室',
    buildingId: 'B003',
    contactName: '张阿姨',
    contactPhone: '136****3333',
    category: 'elevator',
    description: '电梯经常出现异响，特别是到3楼的时候声音很大，有点担心安全问题',
    expectedTime: today.format('YYYY-MM-DD') + ' 全天',
    urgency: 'high',
    status: 'processing',
    createTime: today.format('YYYY-MM-DD') + ' 09:00:00',
    assignTime: today.format('YYYY-MM-DD') + ' 09:05:00',
    acceptTime: today.format('YYYY-MM-DD') + ' 09:10:00',
    arriveTime: today.format('YYYY-MM-DD') + ' 09:30:00',
    completeTime: null,
    engineerId: 'ENG004',
    processLogs: [
      { time: today.format('YYYY-MM-DD') + ' 09:00:00', operator: '系统', action: '报修登记', content: '张阿姨反映电梯运行有异响' },
      { time: today.format('YYYY-MM-DD') + ' 09:05:00', operator: '张客服', action: '派单', content: '紧急派单，刘师傅尽快处理' },
      { time: today.format('YYYY-MM-DD') + ' 09:10:00', operator: '刘师傅', action: '接单', content: '已接单，立即前往查看' },
      { time: today.format('YYYY-MM-DD') + ' 09:30:00', operator: '刘师傅', action: '到达现场', content: '已到达3号楼1单元，正在检查电梯' },
      { time: today.format('YYYY-MM-DD') + ' 09:45:00', operator: '刘师傅', action: '处理中', content: '初步判断是导轨需要润滑，已联系电梯维保单位' }
    ],
    processResult: null,
    needReturn: false,
    returnReason: null,
    remarks: '电梯问题，已联系专业维保单位配合处理',
    isTimeout: false,
    source: 'phone'
  })
  
  orders.push({
    id: 'WX202606160008',
    roomNumber: '5号楼3单元1201室',
    buildingId: 'B004',
    contactName: '赵先生',
    contactPhone: '137****4444',
    category: 'plumbing',
    description: '卫生间下水管道堵塞，马桶冲水不畅，已经用了管道疏通剂还是不行',
    expectedTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 15:00-17:00',
    urgency: 'high',
    status: 'processing',
    createTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 14:30:00',
    assignTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 14:40:00',
    acceptTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 14:45:00',
    arriveTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 15:20:00',
    completeTime: null,
    engineerId: 'ENG002',
    processLogs: [
      { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 14:30:00', operator: '系统', action: '报修登记', content: '赵先生报修卫生间下水道堵塞' },
      { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 14:40:00', operator: '张客服', action: '派单', content: '派单给王师傅处理' },
      { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 14:45:00', operator: '王师傅', action: '接单', content: '已接单' },
      { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 15:20:00', operator: '王师傅', action: '到达现场', content: '已到达，开始疏通管道' },
      { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 16:30:00', operator: '王师傅', action: '处理中', content: '经检查是主管道堵塞，需要专业设备疏通，已联系专业疏通公司明天上门' }
    ],
    processResult: null,
    needReturn: true,
    returnReason: '需要专业疏通设备，已联系外协单位',
    remarks: '客户比较着急，已经沟通好明天上午处理',
    isTimeout: true,
    source: 'resident'
  })
  
  orders.push({
    id: 'WX202606170004',
    roomNumber: '6号楼1单元0803室',
    buildingId: 'B005',
    contactName: '陈女士',
    contactPhone: '135****5555',
    category: 'electrical',
    description: '家里突然跳闸了，推不上去，整个屋子都没电',
    expectedTime: today.format('YYYY-MM-DD') + ' 立即',
    urgency: 'high',
    status: 'completed',
    createTime: today.format('YYYY-MM-DD') + ' 07:00:00',
    assignTime: today.format('YYYY-MM-DD') + ' 07:02:00',
    acceptTime: today.format('YYYY-MM-DD') + ' 07:05:00',
    arriveTime: today.format('YYYY-MM-DD') + ' 07:20:00',
    completeTime: today.format('YYYY-MM-DD') + ' 07:50:00',
    engineerId: 'ENG001',
    processLogs: [
      { time: today.format('YYYY-MM-DD') + ' 07:00:00', operator: '系统', action: '报修登记', content: '陈女士紧急报修家中跳闸' },
      { time: today.format('YYYY-MM-DD') + ' 07:02:00', operator: '张客服', action: '派单', content: '紧急情况！立即派单' },
      { time: today.format('YYYY-MM-DD') + ' 07:05:00', operator: '李工程师', action: '接单', content: '已接单，马上过去' },
      { time: today.format('YYYY-MM-DD') + ' 07:20:00', operator: '李工程师', action: '到达现场', content: '已到达客户家中' },
      { time: today.format('YYYY-MM-DD') + ' 07:50:00', operator: '李工程师', action: '完成', content: '故障已排除，是空调短路造成的，已更换空开' }
    ],
    processResult: '更换了客厅16A空开一个，检测空调运行正常。建议客户检查空调是否有故障。',
    needReturn: false,
    returnReason: null,
    remarks: '客户对处理速度很满意',
    isTimeout: false,
    source: 'phone'
  })
  
  orders.push({
    id: 'WX202606170005',
    roomNumber: '8号楼2单元0301室',
    buildingId: 'B006',
    contactName: '刘先生',
    contactPhone: '133****6666',
    category: 'structure',
    description: '阳台天花板有渗水痕迹，怀疑是楼上防水有问题',
    expectedTime: today.format('YYYY-MM-DD') + ' 09:00-11:00',
    urgency: 'medium',
    status: 'completed',
    createTime: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 10:00:00',
    assignTime: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 10:10:00',
    acceptTime: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 10:15:00',
    arriveTime: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 14:00:00',
    completeTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 16:30:00',
    engineerId: 'ENG003',
    processLogs: [
      { time: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 10:00:00', operator: '系统', action: '报修登记', content: '刘先生报修阳台渗水' },
      { time: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 10:10:00', operator: '张客服', action: '派单', content: '派单给张工处理' },
      { time: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 10:15:00', operator: '张工', action: '接单', content: '已接单' },
      { time: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 14:00:00', operator: '张工', action: '到达现场', content: '已到达现场查看' },
      { time: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 15:00:00', operator: '张工', action: '处理中', content: '已联系楼上业主，约定明天下午做闭水试验' },
      { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 16:30:00', operator: '张工', action: '完成', content: '经闭水试验确认是楼上防水问题，已协助联系楼上业主安排维修' }
    ],
    processResult: '已确认渗水原因是楼上阳台防水层破损，已协调楼上业主安排维修。本次已做临时防水处理。',
    needReturn: true,
    returnReason: '需要跟进楼上维修进度，确认渗水问题彻底解决',
    remarks: '已建立跟进计划',
    isTimeout: false,
    source: 'resident'
  })
  
  orders.push({
    id: 'WX202606160005',
    roomNumber: '1号楼2单元1002室',
    buildingId: 'B001',
    contactName: '孙女士',
    contactPhone: '132****7777',
    category: 'other',
    description: '入户门门锁不太好用，开门费劲，需要上油',
    expectedTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 10:00-12:00',
    urgency: 'low',
    status: 'completed',
    createTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 09:15:00',
    assignTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 09:30:00',
    acceptTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 09:35:00',
    arriveTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 10:10:00',
    completeTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 10:25:00',
    engineerId: 'ENG004',
    processLogs: [
      { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 09:15:00', operator: '系统', action: '报修登记', content: '孙女士报修门锁不好用' },
      { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 09:30:00', operator: '张客服', action: '派单', content: '派单给刘师傅' },
      { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 09:35:00', operator: '刘师傅', action: '接单', content: '已接单' },
      { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 10:10:00', operator: '刘师傅', action: '到达现场', content: '已到达' },
      { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 10:25:00', operator: '刘师傅', action: '完成', content: '已对门锁进行清洁和润滑，开关顺畅' }
    ],
    processResult: '门锁锁芯和机械结构进行了清洁和润滑油处理，现在开关顺畅。',
    needReturn: false,
    returnReason: null,
    remarks: '',
    isTimeout: false,
    source: 'resident'
  })
  
  orders.push({
    id: 'WX202606150012',
    roomNumber: '2号楼1单元1501室',
    buildingId: 'B002',
    contactName: '周先生',
    contactPhone: '131****8888',
    category: 'security',
    description: '家里可视对讲坏了，看不到门口来人',
    expectedTime: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 全天',
    urgency: 'low',
    status: 'completed',
    createTime: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 11:00:00',
    assignTime: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 11:15:00',
    acceptTime: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 11:20:00',
    arriveTime: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 14:30:00',
    completeTime: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 15:00:00',
    engineerId: 'ENG001',
    processLogs: [
      { time: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 11:00:00', operator: '系统', action: '报修登记', content: '周先生报修可视对讲故障' },
      { time: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 11:15:00', operator: '张客服', action: '派单', content: '派单给李工程师' },
      { time: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 11:20:00', operator: '李工程师', action: '接单', content: '已接单' },
      { time: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 14:30:00', operator: '李工程师', action: '到达现场', content: '已到达' },
      { time: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 15:00:00', operator: '李工程师', action: '完成', content: '线路接头松动，重新接线后恢复正常' }
    ],
    processResult: '检查发现可视对讲室内机线路接头氧化松动，重新处理接头并做防锈处理，设备恢复正常。',
    needReturn: false,
    returnReason: null,
    remarks: '',
    isTimeout: false,
    source: 'phone'
  })
  
  orders.push({
    id: 'WX202606140008',
    roomNumber: '商业楼101商铺',
    buildingId: 'B007',
    contactName: '吴店长',
    contactPhone: '130****9999',
    category: 'electrical',
    description: '商铺内空调不制冷，室外机在转但出风口不凉',
    expectedTime: today.subtract(3, 'day').format('YYYY-MM-DD') + ' 全天',
    urgency: 'medium',
    status: 'cancelled',
    createTime: today.subtract(3, 'day').format('YYYY-MM-DD') + ' 09:30:00',
    assignTime: null,
    acceptTime: null,
    arriveTime: null,
    completeTime: null,
    engineerId: null,
    processLogs: [
      { time: today.subtract(3, 'day').format('YYYY-MM-DD') + ' 09:30:00', operator: '系统', action: '报修登记', content: '吴店长报修空调不制冷' },
      { time: today.subtract(3, 'day').format('YYYY-MM-DD') + ' 09:40:00', operator: '张客服', action: '取消', content: '客户来电说已经联系空调厂家保修，取消报修单' }
    ],
    processResult: null,
    needReturn: false,
    returnReason: null,
    remarks: '误报，客户自行联系厂家处理',
    isTimeout: false,
    source: 'phone'
  })
  
  orders.push({
    id: 'WX202606100015',
    roomNumber: '公共区域-地下车库',
    buildingId: null,
    contactName: '保安巡逻',
    contactPhone: '188****0000',
    category: 'public',
    description: '地下车库B区照明不亮，有几盏灯不亮，环境较暗',
    expectedTime: today.subtract(7, 'day').format('YYYY-MM-DD') + ' 全天',
    urgency: 'medium',
    status: 'completed',
    createTime: today.subtract(7, 'day').format('YYYY-MM-DD') + ' 22:15:00',
    assignTime: today.subtract(7, 'day').format('YYYY-MM-DD') + ' 22:20:00',
    acceptTime: today.subtract(7, 'day').format('YYYY-MM-DD') + ' 22:25:00',
    arriveTime: today.subtract(7, 'day').format('YYYY-MM-DD') + ' 22:45:00',
    completeTime: today.subtract(6, 'day').format('YYYY-MM-DD') + ' 09:30:00',
    engineerId: 'ENG001',
    processLogs: [
      { time: today.subtract(7, 'day').format('YYYY-MM-DD') + ' 22:15:00', operator: '系统', action: '报修登记', content: '保安巡逻发现地下车库B区照明故障' },
      { time: today.subtract(7, 'day').format('YYYY-MM-DD') + ' 22:20:00', operator: '张客服', action: '派单', content: '夜间报修，安排明早处理，先放置临时照明' },
      { time: today.subtract(7, 'day').format('YYYY-MM-DD') + ' 22:25:00', operator: '李工程师', action: '接单', content: '已接单，明早第一时间处理' },
      { time: today.subtract(7, 'day').format('YYYY-MM-DD') + ' 22:45:00', operator: '保安', action: '临时处理', content: '已在B区放置3个移动照明灯' },
      { time: today.subtract(6, 'day').format('YYYY-MM-DD') + ' 09:30:00', operator: '李工程师', action: '完成', content: '更换5盏LED灯管，照明恢复正常' }
    ],
    processResult: '地下车库B区共更换5盏18W LED灯管，检查线路正常，照明全部恢复。',
    needReturn: false,
    returnReason: null,
    remarks: '',
    isTimeout: false,
    source: 'patrol'
  })
  
  for (let i = 1; i <= 15; i++) {
    const randomDay = Math.floor(Math.random() * 7)
    const buildingIndex = Math.floor(Math.random() * 6)
    const categoryIndex = Math.floor(Math.random() * repairCategories.length)
    const urgencyIndex = Math.floor(Math.random() * 3)
    
    orders.push({
      id: `WX202606${String(today.subtract(randomDay, 'day').date()).padStart(2, '0')}${String(100 + i).padStart(4, '0')}`,
      roomNumber: `${buildings[buildingIndex].name}${Math.floor(Math.random() * 2) + 1}单元${String(Math.floor(Math.random() * (buildings[buildingIndex].floors - 1)) + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 4) + 1).padStart(2, '0')}室`,
      buildingId: buildings[buildingIndex].id,
      contactName: ['王先生', '李女士', '张先生', '刘阿姨', '陈先生', '赵女士'][Math.floor(Math.random() * 6)],
      contactPhone: `13${Math.floor(Math.random() * 9)}****${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      category: repairCategories[categoryIndex].value,
      description: ['灯泡坏了需要更换', '窗户密封不严漏风', '墙面有裂纹', '地板起翘', '水龙头滴水', '门锁不好开'][Math.floor(Math.random() * 6)],
      expectedTime: today.subtract(randomDay, 'day').format('YYYY-MM-DD') + ' 全天',
      urgency: urgentLevels[urgencyIndex].value,
      status: 'completed',
      createTime: today.subtract(randomDay, 'day').format('YYYY-MM-DD') + ` ${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
      assignTime: today.subtract(randomDay, 'day').format('YYYY-MM-DD') + ` ${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
      acceptTime: today.subtract(randomDay, 'day').format('YYYY-MM-DD') + ` ${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
      arriveTime: today.subtract(randomDay, 'day').format('YYYY-MM-DD') + ` ${String(Math.floor(Math.random() * 12) + 9).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
      completeTime: today.subtract(randomDay, 'day').format('YYYY-MM-DD') + ` ${String(Math.floor(Math.random() * 6) + 10).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
      engineerId: engineers[Math.floor(Math.random() * engineers.length)].id,
      processLogs: [
        { time: '', operator: '系统', action: '报修登记', content: '住户报修' },
        { time: '', operator: '张客服', action: '派单', content: '已派单' },
        { time: '', operator: '', action: '接单', content: '已接单' },
        { time: '', operator: '', action: '完成', content: '处理完成' }
      ],
      processResult: '问题已解决，住户满意。',
      needReturn: false,
      returnReason: null,
      remarks: '',
      isTimeout: false,
      source: ['resident', 'phone'][Math.floor(Math.random() * 2)]
    })
  }
  
  return orders
}

export const inspectionItems = [
  { id: 'II001', name: '电梯运行检查', type: 'elevator', frequency: 'daily', standard: '运行平稳无异常声响，按钮显示正常，门开关顺畅', enable: true },
  { id: 'II002', name: '消防设施检查', type: 'fire', frequency: 'weekly', standard: '灭火器压力正常，消防栓完好，应急照明正常', enable: true },
  { id: 'II003', name: '水泵房巡查', type: 'plumbing', frequency: 'daily', standard: '水泵运行正常，水压稳定，无渗漏', enable: true },
  { id: 'II004', name: '配电室巡检', type: 'electrical', frequency: 'weekly', standard: '设备运行正常，温度正常，标识清楚', enable: true },
  { id: 'II005', name: '公共照明检查', type: 'lighting', frequency: 'weekly', standard: '楼道、车库照明正常，无大面积损坏', enable: true },
  { id: 'II006', name: '监控系统检查', type: 'security', frequency: 'daily', standard: '画面清晰，存储正常，云台控制正常', enable: true },
  { id: 'II007', name: '门禁系统检查', type: 'security', frequency: 'weekly', standard: '刷卡正常，对讲清晰，门锁可靠', enable: true },
  { id: 'II008', name: '给排水管道检查', type: 'plumbing', frequency: 'monthly', standard: '管道无渗漏，排水通畅，井盖完好', enable: true },
  { id: 'II009', name: '避雷设施检查', type: 'electrical', frequency: 'quarterly', standard: '接地电阻合格，连接牢固', enable: true },
  { id: 'II010', name: '中央空调系统检查', type: 'hvac', frequency: 'monthly', standard: '制冷/制热正常，滤网清洁，无异常噪音', enable: true }
]

const generateInspectionTasks = () => {
  const tasks = []
  
  tasks.push({
    id: 'IT202606170001',
    itemId: 'II001',
    itemName: '电梯运行检查',
    equipmentId: 'E001',
    equipmentName: '1号楼1单元电梯',
    date: today.format('YYYY-MM-DD'),
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
  
  tasks.push({
    id: 'IT202606170002',
    itemId: 'II001',
    itemName: '电梯运行检查',
    equipmentId: 'E002',
    equipmentName: '1号楼2单元电梯',
    date: today.format('YYYY-MM-DD'),
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
  
  tasks.push({
    id: 'IT202606170003',
    itemId: 'II003',
    itemName: '水泵房巡查',
    equipmentId: 'E009',
    equipmentName: '小区主供水泵',
    date: today.format('YYYY-MM-DD'),
    status: 'inspecting',
    inspectorId: 'ENG002',
    inspectorName: '王师傅',
    startTime: today.format('YYYY-MM-DD') + ' 08:30:00',
    endTime: null,
    result: null,
    abnormal: false,
    abnormalDesc: null,
    suggestion: null,
    repairOrderId: null
  })
  
  tasks.push({
    id: 'IT202606170004',
    itemId: 'II006',
    itemName: '监控系统检查',
    equipmentId: 'E011',
    equipmentName: '监控中心主机',
    date: today.format('YYYY-MM-DD'),
    status: 'completed',
    inspectorId: 'ENG001',
    inspectorName: '李工程师',
    startTime: today.format('YYYY-MM-DD') + ' 07:30:00',
    endTime: today.format('YYYY-MM-DD') + ' 08:00:00',
    result: 'normal',
    abnormal: false,
    abnormalDesc: null,
    suggestion: '系统运行正常，建议定期清理硬盘空间',
    repairOrderId: null
  })
  
  tasks.push({
    id: 'IT202606170005',
    itemId: 'II002',
    itemName: '消防设施检查',
    equipmentId: 'E007',
    equipmentName: '1号楼消防水泵',
    date: today.format('YYYY-MM-DD'),
    status: 'completed',
    inspectorId: 'ENG004',
    inspectorName: '刘师傅',
    startTime: today.format('YYYY-MM-DD') + ' 08:00:00',
    endTime: today.format('YYYY-MM-DD') + ' 08:45:00',
    result: 'abnormal',
    abnormal: true,
    abnormalDesc: '发现1号楼东侧楼梯间有2具灭火器压力不足，指针在红色区域',
    suggestion: '需要立即更换灭火器，建议本周内完成',
    repairOrderId: null
  })
  
  tasks.push({
    id: 'IT202606160003',
    itemId: 'II005',
    itemName: '公共照明检查',
    equipmentId: null,
    equipmentName: '3号楼公共照明',
    date: today.subtract(1, 'day').format('YYYY-MM-DD'),
    status: 'completed',
    inspectorId: 'ENG001',
    inspectorName: '李工程师',
    startTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 14:00:00',
    endTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 15:30:00',
    result: 'abnormal',
    abnormal: true,
    abnormalDesc: '3号楼1单元15-20层楼道照明有3盏灯不亮',
    suggestion: '已安排更换灯泡',
    repairOrderId: 'WX202606160009'
  })
  
  tasks.push({
    id: 'IT202606150002',
    itemId: 'II007',
    itemName: '门禁系统检查',
    equipmentId: null,
    equipmentName: '小区各门禁',
    date: today.subtract(2, 'day').format('YYYY-MM-DD'),
    status: 'completed',
    inspectorId: 'ENG004',
    inspectorName: '刘师傅',
    startTime: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 09:00:00',
    endTime: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 11:00:00',
    result: 'normal',
    abnormal: false,
    abnormalDesc: null,
    suggestion: '所有门禁运行正常',
    repairOrderId: null
  })
  
  return tasks
}

export const inspectionRecords = generateInspectionTasks()

export { repairCategories, urgentLevels, engineers, generateRepairOrders }
