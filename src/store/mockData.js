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

const serviceStaff = [
  { id: 'SRV001', name: '张客服' },
  { id: 'SRV002', name: '李客服' },
  { id: 'SRV003', name: '王客服' }
]

const satisfactionLevels = [
  { value: 5, label: '非常满意', emoji: '😄' },
  { value: 4, label: '满意', emoji: '🙂' },
  { value: 3, label: '一般', emoji: '😐' },
  { value: 2, label: '不满意', emoji: '😟' },
  { value: 1, label: '非常不满意', emoji: '😠' }
]

const visitStatusMap = {
  pending: '待回访',
  visiting: '回访中',
  completed: '已回访',
  followup: '待跟进',
  closed: '已关闭'
}

export const visitorPurposes = [
  { value: 'family', label: '探亲访友' },
  { value: 'delivery', label: '快递外卖' },
  { value: 'maintenance', label: '维修服务' },
  { value: 'housekeeping', label: '家政服务' },
  { value: 'business', label: '商务洽谈' },
  { value: 'moving', label: '搬家搬物' },
  { value: 'interview', label: '面试求职' },
  { value: 'medical', label: '医疗护理' },
  { value: 'education', label: '家教培训' },
  { value: 'other', label: '其他' }
]

export const visitorStatusMap = {
  pending: '待审核',
  approved: '已审核',
  rejected: '已拒绝',
  released: '已放行',
  signed: '已签到',
  left: '已离场',
  cancelled: '已取消',
  expired: '已过期'
}

export const visitorStatusColorMap = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  rejected: 'bg-gray-100 text-gray-700',
  released: 'bg-purple-100 text-purple-700',
  signed: 'bg-green-100 text-green-700',
  left: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
  expired: 'bg-orange-100 text-orange-700'
}

const today = dayjs('2026-06-17')

const generateVisitorRecords = () => {
  const records = []
  const visitorNames = ['张伟', '李娜', '王芳', '刘洋', '陈静', '杨帆', '赵磊', '黄敏',
    '周杰', '吴婷', '徐强', '孙丽', '马超', '朱琳', '胡军', '郭燕', '林峰', '何雪']
  const reasons = ['很久没见面了，回家看看父母', '送双十一网购的包裹，大件较多', '空调售后上门检修', '每周三固定的家政保洁服务',
    '公司合作项目洽谈', '搬新家，约了搬家公司', '物业招聘面试保安岗位', '社区医院上门做健康检查',
    '孩子的钢琴老师上门授课', '朋友来家里聚餐', '顺丰快递送文件', '美团外卖送午餐',
    '家电维修师傅修冰箱', '水管工疏通下水道', '装修公司量房报价', '月嫂上门面试', '亲戚来看望新生儿']
  const platePrefixes = ['京A', '京B', '京N', '沪C', '粤B', '浙A', '苏E', '津K']

  // 今天的预约 - 各种状态混合
  const todayRecords = [
    // 待审核
    {
      id: 'FK202606170010',
      visitorName: '徐强',
      visitorPhone: '13912345678',
      purpose: 'family',
      purposeDetail: '',
      visitTime: today.format('YYYY-MM-DD') + ' 10:00',
      endTime: today.format('YYYY-MM-DD') + ' 18:00',
      companionCount: 2,
      plateNumber: '京A88888',
      buildingId: 'B001',
      roomNumber: '1号楼1单元1501室',
      hostName: '王女士',
      hostPhone: '13811112222',
      status: 'pending',
      createTime: today.format('YYYY-MM-DD') + ' 08:15:00',
      createOperator: '王女士（业主APP）',
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
      remark: '带了两个孩子，希望帮忙留意',
      processLogs: [
        { time: today.format('YYYY-MM-DD') + ' 08:15:00', operator: '王女士', action: '提交预约', content: '业主通过APP提交访客预约申请' }
      ],
      idCard: '110101********1234'
    },
    {
      id: 'FK202606170011',
      visitorName: '快递小哥',
      visitorPhone: '17600001234',
      purpose: 'delivery',
      purposeDetail: '京东快递',
      visitTime: today.format('YYYY-MM-DD') + ' 09:30',
      endTime: today.format('YYYY-MM-DD') + ' 11:00',
      companionCount: 0,
      plateNumber: '',
      buildingId: 'B002',
      roomNumber: '2号楼2单元2003室',
      hostName: '李先生',
      hostPhone: '13922223333',
      status: 'pending',
      createTime: today.format('YYYY-MM-DD') + ' 08:50:00',
      createOperator: '李先生（业主APP）',
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
      remark: '',
      processLogs: [
        { time: today.format('YYYY-MM-DD') + ' 08:50:00', operator: '李先生', action: '提交预约', content: '业主通过APP提交访客预约申请' }
      ],
      idCard: ''
    },
    {
      id: 'FK202606170012',
      visitorName: '周杰',
      visitorPhone: '13511112222',
      purpose: 'maintenance',
      purposeDetail: '海尔空调售后',
      visitTime: today.format('YYYY-MM-DD') + ' 14:00',
      endTime: today.format('YYYY-MM-DD') + ' 16:00',
      companionCount: 1,
      plateNumber: '京N66666',
      buildingId: 'B005',
      roomNumber: '6号楼1单元0803室',
      hostName: '陈女士',
      hostPhone: '13555556666',
      status: 'pending',
      createTime: today.format('YYYY-MM-DD') + ' 09:00:00',
      createOperator: '张客服（前台登记）',
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
      remark: '需携带工具包进入',
      processLogs: [
        { time: today.format('YYYY-MM-DD') + ' 09:00:00', operator: '张客服', action: '提交预约', content: '物业前台代业主登记预约' }
      ],
      idCard: '310101********5678'
    },
    // 已审核 - 待放行
    {
      id: 'FK202606170001',
      visitorName: '张伟',
      visitorPhone: '13800001111',
      purpose: 'family',
      purposeDetail: '',
      visitTime: today.format('YYYY-MM-DD') + ' 09:00',
      endTime: today.format('YYYY-MM-DD') + ' 20:00',
      companionCount: 1,
      plateNumber: '京A12345',
      buildingId: 'B001',
      roomNumber: '1号楼2单元1002室',
      hostName: '孙女士',
      hostPhone: '13277778888',
      status: 'approved',
      createTime: today.format('YYYY-MM-DD') + ' 07:30:00',
      createOperator: '孙女士（业主APP）',
      auditTime: today.format('YYYY-MM-DD') + ' 08:00:00',
      auditOperator: '张客服',
      auditRemark: '信息齐全，审核通过',
      releaseTime: null,
      releaseOperator: null,
      releaseGate: null,
      signTime: null,
      signOperator: null,
      leaveTime: null,
      leaveOperator: null,
      leaveGate: null,
      remark: '',
      processLogs: [
        { time: today.format('YYYY-MM-DD') + ' 07:30:00', operator: '孙女士', action: '提交预约', content: '业主通过APP提交访客预约申请' },
        { time: today.format('YYYY-MM-DD') + ' 08:00:00', operator: '张客服', action: '审核通过', content: '信息齐全，审核通过' }
      ],
      idCard: '110101********1111'
    },
    {
      id: 'FK202606170002',
      visitorName: '家政阿姨',
      visitorPhone: '15000002222',
      purpose: 'housekeeping',
      purposeDetail: '深度保洁',
      visitTime: today.format('YYYY-MM-DD') + ' 08:30',
      endTime: today.format('YYYY-MM-DD') + ' 14:00',
      companionCount: 0,
      plateNumber: '',
      buildingId: 'B006',
      roomNumber: '8号楼2单元0301室',
      hostName: '刘先生',
      hostPhone: '13366667777',
      status: 'approved',
      createTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 20:00:00',
      createOperator: '刘先生（业主APP）',
      auditTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 20:30:00',
      auditOperator: '李客服',
      auditRemark: '审核通过',
      releaseTime: null,
      releaseOperator: null,
      releaseGate: null,
      signTime: null,
      signOperator: null,
      leaveTime: null,
      leaveOperator: null,
      leaveGate: null,
      remark: '每周固定钟点工',
      processLogs: [
        { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 20:00:00', operator: '刘先生', action: '提交预约', content: '业主通过APP提交访客预约申请' },
        { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 20:30:00', operator: '李客服', action: '审核通过', content: '审核通过' }
      ],
      idCard: '420101********3333'
    },
    {
      id: 'FK202606170003',
      visitorName: '王芳',
      visitorPhone: '13688889999',
      purpose: 'education',
      purposeDetail: '钢琴老师',
      visitTime: today.format('YYYY-MM-DD') + ' 15:00',
      endTime: today.format('YYYY-MM-DD') + ' 16:30',
      companionCount: 0,
      plateNumber: '',
      buildingId: 'B003',
      roomNumber: '3号楼1单元0502室',
      hostName: '张阿姨',
      hostPhone: '13633334444',
      status: 'approved',
      createTime: today.format('YYYY-MM-DD') + ' 08:20:00',
      createOperator: '张阿姨（业主APP）',
      auditTime: today.format('YYYY-MM-DD') + ' 08:45:00',
      auditOperator: '王客服',
      auditRemark: '',
      releaseTime: null,
      releaseOperator: null,
      releaseGate: null,
      signTime: null,
      signOperator: null,
      leaveTime: null,
      leaveOperator: null,
      leaveGate: null,
      remark: '',
      processLogs: [
        { time: today.format('YYYY-MM-DD') + ' 08:20:00', operator: '张阿姨', action: '提交预约', content: '业主通过APP提交访客预约申请' },
        { time: today.format('YYYY-MM-DD') + ' 08:45:00', operator: '王客服', action: '审核通过', content: '审核通过' }
      ],
      idCard: ''
    },
    // 已放行
    {
      id: 'FK202606170004',
      visitorName: '李娜',
      visitorPhone: '13799990000',
      purpose: 'family',
      purposeDetail: '',
      visitTime: today.format('YYYY-MM-DD') + ' 10:30',
      endTime: today.format('YYYY-MM-DD') + ' 19:00',
      companionCount: 3,
      plateNumber: '京B99999',
      buildingId: 'B004',
      roomNumber: '5号楼3单元1201室',
      hostName: '赵先生',
      hostPhone: '13744445555',
      status: 'released',
      createTime: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 19:00:00',
      createOperator: '赵先生（业主APP）',
      auditTime: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 19:30:00',
      auditOperator: '李客服',
      auditRemark: '',
      releaseTime: today.format('YYYY-MM-DD') + ' 08:10:00',
      releaseOperator: '安保-陈队长',
      releaseGate: '东门',
      signTime: null,
      signOperator: null,
      leaveTime: null,
      leaveOperator: null,
      leaveGate: null,
      remark: '',
      processLogs: [
        { time: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 19:00:00', operator: '赵先生', action: '提交预约', content: '业主通过APP提交访客预约申请' },
        { time: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 19:30:00', operator: '李客服', action: '审核通过', content: '审核通过' },
        { time: today.format('YYYY-MM-DD') + ' 08:10:00', operator: '安保-陈队长', action: '放行', content: '从东门车辆通道放行，已核实行车证和预约信息' }
      ],
      idCard: '110105********4444'
    },
    {
      id: 'FK202606170005',
      visitorName: '外卖骑手',
      visitorPhone: '18511112222',
      purpose: 'delivery',
      purposeDetail: '美团外卖',
      visitTime: today.format('YYYY-MM-DD') + ' 12:00',
      endTime: today.format('YYYY-MM-DD') + ' 12:30',
      companionCount: 0,
      plateNumber: '',
      buildingId: 'B002',
      roomNumber: '2号楼1单元1501室',
      hostName: '周先生',
      hostPhone: '13188889999',
      status: 'released',
      createTime: today.format('YYYY-MM-DD') + ' 11:30:00',
      createOperator: '周先生（业主APP）',
      auditTime: today.format('YYYY-MM-DD') + ' 11:32:00',
      auditOperator: '系统自动审核',
      auditRemark: '外卖订单，自动审核通过',
      releaseTime: today.format('YYYY-MM-DD') + ' 11:55:00',
      releaseOperator: '安保-小王',
      releaseGate: '南门',
      signTime: null,
      signOperator: null,
      leaveTime: null,
      leaveOperator: null,
      leaveGate: null,
      remark: '',
      processLogs: [
        { time: today.format('YYYY-MM-DD') + ' 11:30:00', operator: '周先生', action: '提交预约', content: '业主通过APP提交访客预约申请' },
        { time: today.format('YYYY-MM-DD') + ' 11:32:00', operator: '系统', action: '审核通过', content: '外卖订单，自动审核通过' },
        { time: today.format('YYYY-MM-DD') + ' 11:55:00', operator: '安保-小王', action: '放行', content: '从南门人行通道放行' }
      ],
      idCard: ''
    },
    // 已签到（进入楼栋）
    {
      id: 'FK202606170006',
      visitorName: '胡军',
      visitorPhone: '13622223333',
      purpose: 'business',
      purposeDetail: '商业合作洽谈',
      visitTime: today.format('YYYY-MM-DD') + ' 09:30',
      endTime: today.format('YYYY-MM-DD') + ' 11:30',
      companionCount: 0,
      plateNumber: '京N77777',
      buildingId: 'B007',
      roomNumber: '商业楼201室',
      hostName: '吴店长',
      hostPhone: '13099998888',
      status: 'signed',
      createTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 17:00:00',
      createOperator: '吴店长（业主APP）',
      auditTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 17:15:00',
      auditOperator: '张客服',
      auditRemark: '',
      releaseTime: today.format('YYYY-MM-DD') + ' 08:55:00',
      releaseOperator: '安保-陈队长',
      releaseGate: '东门',
      signTime: today.format('YYYY-MM-DD') + ' 09:05:00',
      signOperator: '楼栋管家-小赵',
      leaveTime: null,
      leaveOperator: null,
      leaveGate: null,
      remark: '与商铺洽谈广告合作事宜',
      processLogs: [
        { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 17:00:00', operator: '吴店长', action: '提交预约', content: '业主通过APP提交访客预约申请' },
        { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 17:15:00', operator: '张客服', action: '审核通过', content: '审核通过' },
        { time: today.format('YYYY-MM-DD') + ' 08:55:00', operator: '安保-陈队长', action: '放行', content: '从东门车辆通道放行' },
        { time: today.format('YYYY-MM-DD') + ' 09:05:00', operator: '楼栋管家-小赵', action: '签到确认', content: '访客已到达商业楼，与吴店长确认后签到' }
      ],
      idCard: '320101********5555'
    },
    // 已完成流程 - 已离场
    {
      id: 'FK202606170007',
      visitorName: '郭燕',
      visitorPhone: '13566667777',
      purpose: 'medical',
      purposeDetail: '社区医院护士',
      visitTime: today.format('YYYY-MM-DD') + ' 08:00',
      endTime: today.format('YYYY-MM-DD') + ' 09:00',
      companionCount: 0,
      plateNumber: '',
      buildingId: 'B006',
      roomNumber: '8号楼1单元0202室',
      hostName: '刘奶奶',
      hostPhone: '18900001111',
      status: 'left',
      createTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 16:00:00',
      createOperator: '张客服（前台登记）',
      auditTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 16:10:00',
      auditOperator: '王客服',
      auditRemark: '',
      releaseTime: today.format('YYYY-MM-DD') + ' 07:50:00',
      releaseOperator: '安保-小王',
      releaseGate: '北门',
      signTime: today.format('YYYY-MM-DD') + ' 08:05:00',
      signOperator: '楼栋管家-小钱',
      leaveTime: today.format('YYYY-MM-DD') + ' 09:12:00',
      leaveOperator: '安保-小王',
      leaveGate: '北门',
      remark: '每周三上门给老人测血压血糖',
      processLogs: [
        { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 16:00:00', operator: '张客服', action: '提交预约', content: '前台代业主登记，社区医院护士每周三上门' },
        { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 16:10:00', operator: '王客服', action: '审核通过', content: '审核通过' },
        { time: today.format('YYYY-MM-DD') + ' 07:50:00', operator: '安保-小王', action: '放行', content: '从北门人行通道放行' },
        { time: today.format('YYYY-MM-DD') + ' 08:05:00', operator: '楼栋管家-小钱', action: '签到确认', content: '护士已到达业主家' },
        { time: today.format('YYYY-MM-DD') + ' 09:12:00', operator: '安保-小王', action: '登记离场', content: '从北门离场' }
      ],
      idCard: ''
    },
    {
      id: 'FK202606170008',
      visitorName: '黄敏',
      visitorPhone: '13733334444',
      purpose: 'housekeeping',
      purposeDetail: '',
      visitTime: today.format('YYYY-MM-DD') + ' 07:30',
      endTime: today.format('YYYY-MM-DD') + ' 12:00',
      companionCount: 0,
      plateNumber: '',
      buildingId: 'B001',
      roomNumber: '1号楼1单元2001室',
      hostName: '王先生',
      hostPhone: '13600009999',
      status: 'left',
      createTime: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 21:00:00',
      createOperator: '王先生（业主APP）',
      auditTime: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 21:05:00',
      auditOperator: '系统自动审核',
      auditRemark: '固定钟点工，自动审核',
      releaseTime: today.format('YYYY-MM-DD') + ' 07:20:00',
      releaseOperator: '安保-老周',
      releaseGate: '东门',
      signTime: today.format('YYYY-MM-DD') + ' 07:35:00',
      signOperator: '楼栋管家-小孙',
      leaveTime: today.format('YYYY-MM-DD') + ' 12:20:00',
      leaveOperator: '安保-老周',
      leaveGate: '东门',
      remark: '',
      processLogs: [
        { time: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 21:00:00', operator: '王先生', action: '提交预约', content: '业主通过APP提交访客预约申请' },
        { time: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 21:05:00', operator: '系统', action: '审核通过', content: '固定钟点工，自动审核通过' },
        { time: today.format('YYYY-MM-DD') + ' 07:20:00', operator: '安保-老周', action: '放行', content: '从东门人行通道放行' },
        { time: today.format('YYYY-MM-DD') + ' 07:35:00', operator: '楼栋管家-小孙', action: '签到确认', content: '业主确认访客到达' },
        { time: today.format('YYYY-MM-DD') + ' 12:20:00', operator: '安保-老周', action: '登记离场', content: '从东门离场，保洁工作完成' }
      ],
      idCard: '510101********6666'
    },
    {
      id: 'FK202606170009',
      visitorName: '杨帆',
      visitorPhone: '13844445555',
      purpose: 'family',
      purposeDetail: '',
      visitTime: today.format('YYYY-MM-DD') + ' 08:30',
      endTime: today.format('YYYY-MM-DD') + ' 10:00',
      companionCount: 0,
      plateNumber: '',
      buildingId: 'B004',
      roomNumber: '5号楼2单元0802室',
      hostName: '赵先生',
      hostPhone: '13744445555',
      status: 'left',
      createTime: today.format('YYYY-MM-DD') + ' 08:00:00',
      createOperator: '赵先生（业主APP）',
      auditTime: today.format('YYYY-MM-DD') + ' 08:02:00',
      auditOperator: '张客服',
      auditRemark: '',
      releaseTime: today.format('YYYY-MM-DD') + ' 08:25:00',
      releaseOperator: '安保-陈队长',
      releaseGate: '北门',
      signTime: today.format('YYYY-MM-DD') + ' 08:40:00',
      signOperator: '楼栋管家-小李',
      leaveTime: today.format('YYYY-MM-DD') + ' 10:05:00',
      leaveOperator: '安保-小王',
      leaveGate: '北门',
      remark: '顺路来看看',
      processLogs: [
        { time: today.format('YYYY-MM-DD') + ' 08:00:00', operator: '赵先生', action: '提交预约', content: '业主通过APP提交访客预约申请' },
        { time: today.format('YYYY-MM-DD') + ' 08:02:00', operator: '张客服', action: '审核通过', content: '审核通过' },
        { time: today.format('YYYY-MM-DD') + ' 08:25:00', operator: '安保-陈队长', action: '放行', content: '从北门放行' },
        { time: today.format('YYYY-MM-DD') + ' 08:40:00', operator: '楼栋管家-小李', action: '签到确认', content: '访客已到达' },
        { time: today.format('YYYY-MM-DD') + ' 10:05:00', operator: '安保-小王', action: '登记离场', content: '从北门离场' }
      ],
      idCard: ''
    },
    // 黑名单访客使用临时放行
    {
      id: 'FK202606170015',
      visitorName: '王大强',
      visitorPhone: '13800001234',
      purpose: 'family',
      purposeDetail: '',
      visitTime: today.format('YYYY-MM-DD') + ' 14:00',
      endTime: today.format('YYYY-MM-DD') + ' 18:00',
      companionCount: 0,
      plateNumber: '',
      buildingId: 'B003',
      roomNumber: '3号楼2单元1002室',
      hostName: '王先生',
      hostPhone: '13800001111',
      status: 'approved',
      createTime: today.format('YYYY-MM-DD') + ' 10:00:00',
      createOperator: '张客服（前台登记）',
      auditTime: today.format('YYYY-MM-DD') + ' 10:05:00',
      auditOperator: '物业经理-刘经理',
      auditRemark: '已核实为黑名单访客，但有有效的临时放行审批（REL20260617001），情况特殊紧急，准予放行',
      releaseTime: null,
      releaseOperator: null,
      releaseGate: null,
      signTime: null,
      signOperator: null,
      leaveTime: null,
      leaveOperator: null,
      leaveGate: null,
      temporaryReleaseId: 'REL20260617001',
      remark: '使用临时放行：REL20260617001，审批人：物业经理-刘经理',
      processLogs: [
        { time: today.format('YYYY-MM-DD') + ' 10:00:00', operator: '张客服', action: '提交预约', content: '访客王大强来前台登记预约，系统检测到黑名单拦截' },
        { time: today.format('YYYY-MM-DD') + ' 10:02:00', operator: '张客服', action: '查询临时放行', content: '查询到有效的临时放行审批REL20260617001，有效期至今日20:00' },
        { time: today.format('YYYY-MM-DD') + ' 10:05:00', operator: '物业经理-刘经理', action: '审核通过', content: '确认临时放行有效，访客为业主亲弟弟，老父亲病危急需见面，情况属实，准予放行' }
      ],
      idCard: '110101********1234'
    },
    // 已拒绝
    {
      id: 'FK202606170013',
      visitorName: '未知人员',
      visitorPhone: '10086',
      purpose: 'other',
      purposeDetail: '',
      visitTime: today.format('YYYY-MM-DD') + ' 09:00',
      endTime: today.format('YYYY-MM-DD') + ' 18:00',
      companionCount: 0,
      plateNumber: '',
      buildingId: 'B003',
      roomNumber: '3号楼2单元1203室',
      hostName: '查无此人',
      hostPhone: '13800000000',
      status: 'rejected',
      createTime: today.format('YYYY-MM-DD') + ' 08:30:00',
      createOperator: '未知',
      auditTime: today.format('YYYY-MM-DD') + ' 08:35:00',
      auditOperator: '张客服',
      auditRemark: '电话联系业主核实，该业主表示未预约任何访客，房号与业主信息不匹配',
      releaseTime: null,
      releaseOperator: null,
      releaseGate: null,
      signTime: null,
      signOperator: null,
      leaveTime: null,
      leaveOperator: null,
      leaveGate: null,
      remark: '',
      processLogs: [
        { time: today.format('YYYY-MM-DD') + ' 08:30:00', operator: '未知', action: '提交预约', content: '通过访客端提交预约' },
        { time: today.format('YYYY-MM-DD') + ' 08:35:00', operator: '张客服', action: '审核拒绝', content: '电话联系业主核实，该业主表示未预约任何访客，房号与业主信息不匹配，拒绝通过' }
      ],
      idCard: ''
    },
    // 已取消
    {
      id: 'FK202606170014',
      visitorName: '刘洋',
      visitorPhone: '13155556666',
      purpose: 'moving',
      purposeDetail: '',
      visitTime: today.format('YYYY-MM-DD') + ' 10:00',
      endTime: today.format('YYYY-MM-DD') + ' 16:00',
      companionCount: 3,
      plateNumber: '京A55555',
      buildingId: 'B004',
      roomNumber: '5号楼1单元2201室',
      hostName: '孙先生',
      hostPhone: '13812123434',
      status: 'cancelled',
      createTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 14:00:00',
      createOperator: '孙先生（业主APP）',
      auditTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 14:10:00',
      auditOperator: '李客服',
      auditRemark: '',
      releaseTime: null,
      releaseOperator: null,
      releaseGate: null,
      signTime: null,
      signOperator: null,
      leaveTime: null,
      leaveOperator: null,
      leaveGate: null,
      remark: '业主取消，搬家改期',
      processLogs: [
        { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 14:00:00', operator: '孙先生', action: '提交预约', content: '业主通过APP提交访客预约申请' },
        { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 14:10:00', operator: '李客服', action: '审核通过', content: '审核通过' },
        { time: today.format('YYYY-MM-DD') + ' 07:00:00', operator: '孙先生', action: '取消预约', content: '业主通过APP取消预约，搬家改期至下周' }
      ],
      idCard: ''
    }
  ]

  records.push(...todayRecords)

  // 过去几天的记录，用于图表展示
  for (let dayOffset = 1; dayOffset <= 6; dayOffset++) {
    const day = today.subtract(dayOffset, 'day')
    const dayStr = day.format('YYYY-MM-DD')
    const recordsForDay = 6 + Math.floor(Math.random() * 8)
    
    for (let i = 0; i < recordsForDay; i++) {
      const buildingIdx = Math.floor(Math.random() * 6)
      const purposeIdx = Math.floor(Math.random() * visitorPurposes.length)
      const visitorIdx = Math.floor(Math.random() * visitorNames.length)
      const reasonIdx = Math.floor(Math.random() * reasons.length)
      const statusRoll = Math.random()
      const status = statusRoll < 0.7 ? 'left' : (statusRoll < 0.85 ? 'cancelled' : 'expired')
      const hour = 8 + Math.floor(Math.random() * 12)
      const minute = Math.floor(Math.random() * 60)
      const visitHour = hour
      const endHour = Math.min(22, visitHour + 1 + Math.floor(Math.random() * 4))
      const companionCount = Math.floor(Math.random() * 5)
      const hasPlate = Math.random() > 0.5
      
      const id = `FK${dayStr.replace(/-/g, '')}${String(i + 1).padStart(4, '0')}`
      
      records.push({
        id: id,
        visitorName: visitorNames[visitorIdx],
        visitorPhone: `13${Math.floor(Math.random() * 9)}${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
        purpose: visitorPurposes[purposeIdx].value,
        purposeDetail: purposeIdx >= visitorPurposes.length - 2 ? reasons[reasonIdx].slice(0, 15) : '',
        visitTime: `${dayStr} ${String(visitHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
        endTime: `${dayStr} ${String(endHour).padStart(2, '0')}:00`,
        companionCount: companionCount,
        plateNumber: hasPlate ? `${platePrefixes[Math.floor(Math.random() * platePrefixes.length)]}${String(Math.floor(Math.random() * 90000) + 10000)}` : '',
        buildingId: buildings[buildingIdx].id,
        roomNumber: `${buildings[buildingIdx].name}${Math.floor(Math.random() * 2) + 1}单元${String(Math.floor(Math.random() * (buildings[buildingIdx].floors - 1)) + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 4) + 1).padStart(2, '0')}室`,
        hostName: ['王先生', '李女士', '张先生', '刘阿姨', '陈先生', '赵女士'][Math.floor(Math.random() * 6)],
        hostPhone: `13${Math.floor(Math.random() * 9)}${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
        status: status,
        createTime: `${dayStr} ${String(Math.max(0, visitHour - 2)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
        createOperator: ['业主APP', '张客服（前台）', '李客服（前台）', '王客服（前台）'][Math.floor(Math.random() * 4)],
        auditTime: status !== 'expired' ? `${dayStr} ${String(Math.max(0, visitHour - 1)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00` : null,
        auditOperator: status !== 'expired' ? ['张客服', '李客服', '王客服', '系统自动'][Math.floor(Math.random() * 4)] : null,
        auditRemark: '',
        releaseTime: status === 'left' ? `${dayStr} ${String(visitHour).padStart(2, '0')}:${String(Math.min(59, minute + Math.floor(Math.random() * 20))).padStart(2, '0')}:00` : null,
        releaseOperator: status === 'left' ? ['安保-陈队长', '安保-小王', '安保-老周'][Math.floor(Math.random() * 3)] : null,
        releaseGate: status === 'left' ? ['东门', '南门', '西门', '北门'][Math.floor(Math.random() * 4)] : null,
        signTime: status === 'left' ? `${dayStr} ${String(Math.min(23, visitHour + 1)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00` : null,
        signOperator: status === 'left' ? ['楼栋管家-小孙', '楼栋管家-小李', '楼栋管家-小赵', '楼栋管家-小钱'][Math.floor(Math.random() * 4)] : null,
        leaveTime: status === 'left' ? `${dayStr} ${String(Math.min(23, endHour)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00` : null,
        leaveOperator: status === 'left' ? ['安保-陈队长', '安保-小王', '安保-老周'][Math.floor(Math.random() * 3)] : null,
        leaveGate: status === 'left' ? ['东门', '南门', '西门', '北门'][Math.floor(Math.random() * 4)] : null,
        remark: '',
        processLogs: [
          { time: `${dayStr} ${String(Math.max(0, visitHour - 2)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`, operator: '业主', action: '提交预约', content: reasons[reasonIdx] }
        ],
        idCard: Math.random() > 0.5 ? `${110101 + Math.floor(Math.random() * 500000)}********${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}` : ''
      })

      if (status !== 'expired') {
        records[records.length - 1].processLogs.push({
          time: records[records.length - 1].auditTime,
          operator: records[records.length - 1].auditOperator,
          action: '审核通过',
          content: '信息无误，审核通过'
        })
      }
      if (status === 'left') {
        records[records.length - 1].processLogs.push({
          time: records[records.length - 1].releaseTime,
          operator: records[records.length - 1].releaseOperator,
          action: '放行',
          content: `从${records[records.length - 1].releaseGate}放行`
        })
        records[records.length - 1].processLogs.push({
          time: records[records.length - 1].signTime,
          operator: records[records.length - 1].signOperator,
          action: '签到确认',
          content: '访客已到达'
        })
        records[records.length - 1].processLogs.push({
          time: records[records.length - 1].leaveTime,
          operator: records[records.length - 1].leaveOperator,
          action: '登记离场',
          content: `从${records[records.length - 1].leaveGate}离场`
        })
      }
      if (status === 'cancelled') {
        records[records.length - 1].processLogs.push({
          time: `${dayStr} ${String(Math.min(23, visitHour - 1)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
          operator: '业主',
          action: '取消预约',
          content: '业主临时有事，取消预约'
        })
      }
    }
  }

  // 按创建时间倒序
  records.sort((a, b) => b.createTime.localeCompare(a.createTime))

  return records
}

export const visitorRecords = generateVisitorRecords()

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
    source: 'resident',
    urgeRecords: [],
    escalation: {
      isEscalated: false,
      escalateTime: null,
      escalateOperator: null,
      escalateReason: null,
      deadlineTime: null
    }
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
      { time: today.format('YYYY-MM-DD') + ' 08:50:00', operator: '张客服', action: '派单', content: '已派单给李工程师处理' },
      { time: today.format('YYYY-MM-DD') + ' 10:30:00', operator: '张客服', action: '催办', content: '催办原因：派单后长时间未接单，住户来电询问。催办对象：李工程师' }
    ],
    processResult: null,
    needReturn: false,
    returnReason: null,
    remarks: '客户白天都在家',
    isTimeout: false,
    source: 'phone',
    urgeRecords: [
      {
        id: 'UR002',
        urgeTime: today.format('YYYY-MM-DD') + ' 10:30:00',
        urgeOperator: '张客服',
        urgeReason: '派单后超过1小时未接单，住户来电询问进度，希望尽快安排人员上门处理',
        urgeTarget: '李工程师',
        urgeTargetType: 'engineer'
      }
    ],
    escalation: {
      isEscalated: false,
      escalateTime: null,
      escalateOperator: null,
      escalateReason: null,
      deadlineTime: null
    }
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
    source: 'phone',
    urgeRecords: [],
    escalation: {
      isEscalated: false,
      escalateTime: null,
      escalateOperator: null,
      escalateReason: null,
      deadlineTime: null
    }
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
      { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 16:30:00', operator: '王师傅', action: '处理中', content: '经检查是主管道堵塞，需要专业设备疏通，已联系专业疏通公司明天上门' },
      { time: today.format('YYYY-MM-DD') + ' 08:15:00', operator: '张客服', action: '催办', content: '催办原因：住户多次来电询问进度，昨晚无法正常使用卫生间。催办对象：王师傅' },
      { time: today.format('YYYY-MM-DD') + ' 09:00:00', operator: '张客服', action: '升级重点跟进', content: '升级原因：催办后仍无明显进展，住户情绪激动，担心今天仍无法解决。要求完成时限：今日12:00前必须有明确处理方案' }
    ],
    processResult: null,
    needReturn: true,
    returnReason: '需要专业疏通设备，已联系外协单位',
    remarks: '客户比较着急，已经沟通好明天上午处理',
    isTimeout: true,
    source: 'resident',
    urgeRecords: [
      {
        id: 'UR001',
        urgeTime: today.format('YYYY-MM-DD') + ' 08:15:00',
        urgeOperator: '张客服',
        urgeReason: '住户多次来电询问进度，昨晚无法正常使用卫生间，情绪比较焦急，要求今天上午必须解决',
        urgeTarget: '王师傅',
        urgeTargetType: 'engineer'
      }
    ],
    escalation: {
      isEscalated: true,
      escalateTime: today.format('YYYY-MM-DD') + ' 09:00:00',
      escalateOperator: '张客服',
      escalateReason: '催办后仍无明显进展，住户情绪激动，已投诉到物业经理，担心今天仍无法解决，影响正常生活',
      deadlineTime: today.format('YYYY-MM-DD') + ' 12:00:00'
    }
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
    source: 'phone',
    visitStatus: 'pending',
    visitRecords: [],
    urgeRecords: [],
    escalation: {
      isEscalated: false,
      escalateTime: null,
      escalateOperator: null,
      escalateReason: null,
      deadlineTime: null
    }
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
      { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 16:30:00', operator: '张工', action: '完成', content: '经闭水试验确认是楼上防水问题，已协助联系楼上业主安排维修' },
      { time: today.format('YYYY-MM-DD') + ' 09:15:00', operator: '张客服', action: '回访转跟进', content: '住户反映渗水问题仍然存在，转为待跟进状态，需要再次上门处理' }
    ],
    processResult: '已确认渗水原因是楼上阳台防水层破损，已协调楼上业主安排维修。本次已做临时防水处理。',
    needReturn: true,
    returnReason: '需要跟进楼上维修进度，确认渗水问题彻底解决',
    remarks: '已建立跟进计划',
    isTimeout: false,
    source: 'resident',
    visitStatus: 'followup',
    visitRecords: [
      {
        id: 'VR001',
        visitTime: today.format('YYYY-MM-DD') + ' 09:00:00',
        visitor: '张客服',
        satisfaction: 2,
        problemResolved: false,
        remark: '住户反映阳台天花板仍然有渗水痕迹，问题没有彻底解决，需要再次安排工程人员上门检查。楼上业主说还没来得及安排维修。',
        unresolvedReason: '楼上防水层未修复，渗水问题持续，需要再次协调并跟进处理'
      }
    ],
    urgeRecords: [],
    escalation: {
      isEscalated: false,
      escalateTime: null,
      escalateOperator: null,
      escalateReason: null,
      deadlineTime: null
    }
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
      { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 10:25:00', operator: '刘师傅', action: '完成', content: '已对门锁进行清洁和润滑，开关顺畅' },
      { time: today.format('YYYY-MM-DD') + ' 10:30:00', operator: '张客服', action: '回访完成', content: '住户满意，问题已彻底解决，回访完成' }
    ],
    processResult: '门锁锁芯和机械结构进行了清洁和润滑油处理，现在开关顺畅。',
    needReturn: false,
    returnReason: null,
    remarks: '',
    isTimeout: false,
    source: 'resident',
    visitStatus: 'completed',
    visitRecords: [
      {
        id: 'VR002',
        visitTime: today.format('YYYY-MM-DD') + ' 10:15:00',
        visitor: '张客服',
        satisfaction: 5,
        problemResolved: true,
        remark: '住户表示门锁现在开关非常顺畅，对刘师傅的服务态度和处理速度都非常满意，没有其他问题。',
        unresolvedReason: null
      }
    ],
    urgeRecords: [],
    escalation: {
      isEscalated: false,
      escalateTime: null,
      escalateOperator: null,
      escalateReason: null,
      deadlineTime: null
    }
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
      { time: today.subtract(2, 'day').format('YYYY-MM-DD') + ' 15:00:00', operator: '李工程师', action: '完成', content: '线路接头松动，重新接线后恢复正常' },
      { time: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 09:30:00', operator: '李客服', action: '回访完成', content: '住户满意，问题已解决，回访完成' }
    ],
    processResult: '检查发现可视对讲室内机线路接头氧化松动，重新处理接头并做防锈处理，设备恢复正常。',
    needReturn: false,
    returnReason: null,
    remarks: '',
    isTimeout: false,
    source: 'phone',
    visitStatus: 'completed',
    visitRecords: [
      {
        id: 'VR003',
        visitTime: today.subtract(1, 'day').format('YYYY-MM-DD') + ' 09:30:00',
        visitor: '李客服',
        satisfaction: 4,
        problemResolved: true,
        remark: '住户反映可视对讲使用正常，对处理结果满意，就是上门时间稍微晚了一点。',
        unresolvedReason: null
      }
    ],
    urgeRecords: [],
    escalation: {
      isEscalated: false,
      escalateTime: null,
      escalateOperator: null,
      escalateReason: null,
      deadlineTime: null
    }
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
    source: 'phone',
    urgeRecords: [],
    escalation: {
      isEscalated: false,
      escalateTime: null,
      escalateOperator: null,
      escalateReason: null,
      deadlineTime: null
    }
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
      { time: today.subtract(6, 'day').format('YYYY-MM-DD') + ' 09:30:00', operator: '李工程师', action: '完成', content: '更换5盏LED灯管，照明恢复正常' },
      { time: today.subtract(5, 'day').format('YYYY-MM-DD') + ' 10:00:00', operator: '王客服', action: '回访完成', content: '回访确认照明已恢复，无其他问题' }
    ],
    processResult: '地下车库B区共更换5盏18W LED灯管，检查线路正常，照明全部恢复。',
    needReturn: false,
    returnReason: null,
    remarks: '',
    isTimeout: false,
    source: 'patrol',
    visitStatus: 'completed',
    visitRecords: [
      {
        id: 'VR004',
        visitTime: today.subtract(5, 'day').format('YYYY-MM-DD') + ' 10:00:00',
        visitor: '王客服',
        satisfaction: 4,
        problemResolved: true,
        remark: '保安确认地下车库B区照明已全部恢复正常，夜间临时照明的应急处理也很及时，整体满意。',
        unresolvedReason: null
      }
    ],
    urgeRecords: [],
    escalation: {
      isEscalated: false,
      escalateTime: null,
      escalateOperator: null,
      escalateReason: null,
      deadlineTime: null
    }
  })
  
  for (let i = 1; i <= 15; i++) {
    const randomDay = Math.floor(Math.random() * 7)
    const buildingIndex = Math.floor(Math.random() * 6)
    const categoryIndex = Math.floor(Math.random() * repairCategories.length)
    const urgencyIndex = Math.floor(Math.random() * 3)
    const needVisit = randomDay <= 3
    const visited = needVisit && Math.random() > 0.3
    const satisfactionVal = needVisit ? (visited ? [3, 4, 5][Math.floor(Math.random() * 3)] : null) : null
    const randomStaff = serviceStaff[Math.floor(Math.random() * serviceStaff.length)]
    
    const visitRecord = visited ? [{
      id: `VR${String(100 + i).padStart(3, '0')}`,
      visitTime: today.subtract(Math.max(0, randomDay - 1), 'day').format('YYYY-MM-DD') + ` ${String(Math.floor(Math.random() * 6) + 10).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
      visitor: randomStaff.name,
      satisfaction: satisfactionVal,
      problemResolved: satisfactionVal >= 3,
      remark: satisfactionVal >= 4 ? '住户表示满意，问题已解决。' : satisfactionVal === 3 ? '住户反馈一般，问题基本解决。' : '住户有轻微不满，已记录。',
      unresolvedReason: satisfactionVal < 3 ? '需要进一步跟进' : null
    }] : []
    
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
      source: ['resident', 'phone'][Math.floor(Math.random() * 2)],
      visitStatus: !needVisit ? null : (visited ? 'completed' : 'pending'),
      visitRecords: visitRecord,
      urgeRecords: [],
      escalation: {
        isEscalated: false,
        escalateTime: null,
        escalateOperator: null,
        escalateReason: null,
        deadlineTime: null
      }
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

export const blacklistReasons = [
  { value: 'complaint', label: '业主投诉', description: '访客行为不当，被业主投诉' },
  { value: 'identity_fraud', label: '冒用身份', description: '使用他人身份证或虚假身份信息' },
  { value: 'multiple_rejections', label: '多次被拒', description: '预约多次被拒绝，存在可疑行为' },
  { value: 'suspicious_behavior', label: '可疑行为', description: '有偷盗、闹事等可疑行为记录' },
  { value: 'violence', label: '暴力行为', description: '有暴力倾向或曾发生冲突' },
  { value: 'trespass', label: '擅闯小区', description: '未登记强行进入小区' },
  { value: 'other', label: '其他原因', description: '其他需要列入黑名单的情况' }
]

export const blacklistStatusMap = {
  active: '黑名单中',
  released: '临时放开',
  removed: '已移出'
}

export const blacklistStatusColorMap = {
  active: 'bg-red-100 text-red-700',
  released: 'bg-yellow-100 text-yellow-700',
  removed: 'bg-gray-100 text-gray-700'
}

const generateBlacklistRecords = () => {
  const records = []
  
  records.push({
    id: 'BL20260601001',
    visitorName: '王大强',
    visitorPhone: '13800001234',
    idCard: '110101********1234',
    reason: 'complaint',
    reasonDetail: '多次在小区内醉酒闹事，骚扰业主，被3号楼多位业主投诉',
    status: 'active',
    createTime: '2026-06-01 14:30:00',
    createOperator: '张客服',
    reportSource: '业主投诉',
    complainant: '3号楼李女士等3位业主',
    complaintCount: 3,
    relatedVisitorIds: ['FK202605280012', 'FK202605200008'],
    releaseRecords: [
      {
        id: 'REL20260617001',
        visitorName: '王大强',
        visitorPhone: '13800001234',
        visitTime: '2026-06-17 14:00',
        endTime: '2026-06-17 18:00',
        buildingId: 'B003',
        roomNumber: '3号楼2单元1002室',
        hostName: '王先生',
        hostPhone: '13800001111',
        approvedBy: '物业经理-刘经理',
        approveTime: '2026-06-17 09:30:00',
        approveReason: '家中老父亲病危，急需见最后一面，情况特殊紧急',
        expireTime: '2026-06-17 20:00:00',
        used: true,
        usedRecordId: 'FK202606170015',
        usedTime: '2026-06-17 10:05:00'
      }
    ],
    processLogs: [
      { time: '2026-06-01 14:30:00', operator: '张客服', action: '列入黑名单', content: '根据3号楼多位业主投诉，该访客多次醉酒闹事，骚扰业主，决定列入黑名单。' },
      { time: '2026-06-17 09:30:00', operator: '物业经理-刘经理', action: '临时放行审批', content: '家中老父亲病危，急需见最后一面，亲属关系属实，情况特殊紧急，批准本次临时放行，有效期至今日20:00。' },
      { time: '2026-06-17 10:05:00', operator: '系统', action: '临时放行使用', content: '临时放行REL20260617001已被预约FK202606170015使用' }
    ]
  })
  
  records.push({
    id: 'BL20260610002',
    visitorName: '张明',
    visitorPhone: '13900005678',
    idCard: '310101********5678',
    reason: 'identity_fraud',
    reasonDetail: '冒用他人身份证办理预约，经核实身份证持有人并非本人',
    status: 'active',
    createTime: '2026-06-10 09:15:00',
    createOperator: '安保-陈队长',
    reportSource: '安保发现',
    complainant: null,
    complaintCount: 0,
    relatedVisitorIds: ['FK202606100005'],
    releaseRecords: [],
    processLogs: [
      { time: '2026-06-10 09:15:00', operator: '安保-陈队长', action: '列入黑名单', content: '门岗核实时发现该访客使用他人身份证预约，身份证照片与本人不符，存在冒用身份行为。' }
    ]
  })
  
  records.push({
    id: 'BL20260612003',
    visitorName: '未知人员',
    visitorPhone: '17600009999',
    idCard: '',
    reason: 'multiple_rejections',
    reasonDetail: '近1个月内预约8次，7次被拒绝，信息填写不真实，房号与业主不匹配',
    status: 'active',
    createTime: '2026-06-12 16:45:00',
    createOperator: '张客服',
    reportSource: '系统分析',
    complainant: null,
    complaintCount: 0,
    relatedVisitorIds: ['FK202606120008', 'FK202606110015', 'FK202606100022'],
    releaseRecords: [],
    processLogs: [
      { time: '2026-06-12 16:45:00', operator: '张客服', action: '列入黑名单', content: '系统分析发现该手机号近1个月预约8次被拒绝7次，每次填写的房号和被访人都不真实，存在诈骗嫌疑。' }
    ]
  })
  
  records.push({
    id: 'BL20260605004',
    visitorName: '李小华',
    visitorPhone: '13500001111',
    idCard: '440101********2222',
    reason: 'trespass',
    reasonDetail: '翻越围栏擅闯小区，被安保拦截',
    status: 'active',
    createTime: '2026-06-05 22:10:00',
    createOperator: '安保-老周',
    reportSource: '安保发现',
    complainant: null,
    complaintCount: 0,
    relatedVisitorIds: [],
    releaseRecords: [
      {
        id: 'REL20260615001',
        visitorName: '李小华',
        visitorPhone: '13500001111',
        visitTime: '2026-06-15 14:00',
        endTime: '2026-06-15 18:00',
        buildingId: 'B003',
        roomNumber: '3号楼1单元0802室',
        hostName: '王医生',
        hostPhone: '13600003333',
        approvedBy: '物业经理-刘经理',
        approveTime: '2026-06-15 10:30:00',
        approveReason: '家人生病需要紧急送医，亲属关系属实，情况特殊',
        expireTime: '2026-06-15 18:00:00',
        used: true,
        usedRecordId: 'FK202606150006'
      }
    ],
    processLogs: [
      { time: '2026-06-05 22:10:00', operator: '安保-老周', action: '列入黑名单', content: '深夜翻越西侧围栏进入小区，被巡逻安保拦截，自称找朋友但无法提供具体房号和联系方式。' },
      { time: '2026-06-15 10:30:00', operator: '物业经理-刘经理', action: '临时放行审批', content: '因家人生病需紧急送医，亲属关系属实，批准本次临时放行，有效期至今日18:00。' }
    ]
  })
  
  records.push({
    id: 'BL20260520005',
    visitorName: '赵二宝',
    visitorPhone: '13700004444',
    idCard: '320101********3333',
    reason: 'violence',
    reasonDetail: '因预约被拒与门岗安保发生冲突，推搡安保人员',
    status: 'removed',
    createTime: '2026-05-20 11:20:00',
    createOperator: '安保-陈队长',
    reportSource: '安保发现',
    complainant: null,
    complaintCount: 0,
    relatedVisitorIds: ['FK202605200003'],
    releaseRecords: [],
    removeTime: '2026-06-10 09:00:00',
    removeOperator: '物业经理-刘经理',
    removeReason: '本人提交保证书，承诺文明访客，观察期1个月表现良好',
    processLogs: [
      { time: '2026-05-20 11:20:00', operator: '安保-陈队长', action: '列入黑名单', content: '因预约信息不符被拒后，情绪激动推搡门岗安保，造成恶劣影响。' },
      { time: '2026-06-10 09:00:00', operator: '物业经理-刘经理', action: '移出黑名单', content: '本人提交书面保证书，认错态度诚恳，观察期内无不良记录，决定移出黑名单，继续观察。' }
    ]
  })
  
  return records
}

export const blacklistRecords = generateBlacklistRecords()

export { repairCategories, urgentLevels, engineers, serviceStaff, satisfactionLevels, visitStatusMap, generateRepairOrders, generateVisitorRecords }
