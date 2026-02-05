
import React, { useState, useMemo } from 'react';
import { ICONS } from '../constants';

interface LockCodeRecord {
  code: string;
  description: string;
  applicant: string;
  additionTime: string;
  status: string;
  categories: string[];
}

interface SystemAdmissionRecord {
  id: string;
  name: string;
  remark: string;
  status: string;
  lastUpdated: string;
}

interface InterfaceRecord {
  id: string;
  name: string;
  path: string;
  method: string;
  status: 'Authorized' | 'Unauthorized';
}

const ProductCommonPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('lockcode');
  
  // States for Lock Code Management
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<LockCodeRecord | null>(null);

  // States for System Admission Management
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [isAddInterfaceModalOpen, setIsAddInterfaceModalOpen] = useState(false);
  const [activeSystem, setActiveSystem] = useState<SystemAdmissionRecord | null>(null);
  const [activeInterfaces, setActiveInterfaces] = useState<InterfaceRecord[]>([]);

  // Form state for adding new interface
  const [newInterface, setNewInterface] = useState({
    name: '',
    path: '',
    method: 'POST',
    status: 'Authorized' as 'Authorized' | 'Unauthorized'
  });

  const modules = [
    { id: 'deduction', label: '抵扣规则管理', icon: <ICONS.Layers size={16} /> },
    { id: 'allocation', label: '还款分配顺序', icon: <ICONS.Activity size={16} /> },
    { id: 'lockcode', label: '锁定码管理', icon: <ICONS.Lock size={16} /> },
    { id: 'admission', label: '系统准入管理', icon: <ICONS.ShieldCheck size={16} /> },
  ];

  // Mock Data Generators
  const randomNames = ['张伟', '李芳', '王秀英', '刘洋', '张敏', '李静', '王伟', '李强', '张静', '陈静', '刘伟', '王刚', '袁海艳', '李辉', '张磊', '王瑞', '赵云', '马志强', '周杰'];
  
  const generateRandomAlphaCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const length = Math.floor(Math.random() * 2) + 1;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Lock Code Data
  const [lockCodeData, setLockCodeData] = useState<LockCodeRecord[]>(() => {
    const descriptions = [
      '已出账单未拖欠', '1-30天拖欠', '31-60天拖欠', '61-90天拖欠', '91-120天拖欠',
      '121-150天拖欠', '151-180天拖欠', '181-210天拖欠', '211天以上拖欠', '账户冻结业务锁定'
    ];
    return descriptions.map((desc, i) => ({
      code: generateRandomAlphaCode(),
      description: `${i + 1}_${desc}`,
      applicant: randomNames[Math.floor(Math.random() * randomNames.length)],
      additionTime: '2019-11-18',
      status: 'DEACTIVATE-停用',
      categories: ['用信控制']
    }));
  });

  // System Admission Data
  const admissionData: SystemAdmissionRecord[] = [
    { id: 'SYS_RISK_001', name: '风控决策引擎', remark: '负责信贷生命周期全流程风控准入', status: 'Running', lastUpdated: '2024-05-20' },
    { id: 'SYS_CORE_002', name: '账务核算系统', remark: '底层会计分录与日终结算处理', status: 'Running', lastUpdated: '2024-05-18' },
    { id: 'SYS_USER_003', name: '统一客户管理中心', remark: '管理全渠道用户画像与身份认证', status: 'Running', lastUpdated: '2024-05-15' },
    { id: 'SYS_AUTH_004', name: 'CA电子签名系统', remark: '负责合同签署合规性与存证服务', status: 'Running', lastUpdated: '2024-05-19' },
    { id: 'SYS_MSG_005', name: '消息触达中台', remark: '短信、App推送到各外部业务线', status: 'Maintenance', lastUpdated: '2024-05-21' },
  ];

  // Handlers
  const handleLockCodeDoubleClick = (record: LockCodeRecord) => {
    setEditingRecord({ ...record });
    setIsEditModalOpen(true);
  };

  const handleAdmissionDoubleClick = (record: SystemAdmissionRecord) => {
    setActiveSystem(record);
    const mockInterfaces: InterfaceRecord[] = Array.from({ length: 30 }, (_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: `接口服务_${(i + 1).toString().padStart(3, '0')}`,
      path: `/api/v2/${record.id.toLowerCase()}/service/action_${i + 100}`,
      method: i % 3 === 0 ? 'POST' : 'GET',
      status: i % 5 === 0 ? 'Unauthorized' : 'Authorized'
    }));
    setActiveInterfaces(mockInterfaces);
    setIsAdmissionModalOpen(true);
  };

  const handleUpdateLockCode = () => {
    if (!editingRecord) return;
    setLockCodeData(prev => prev.map(item => item.code === editingRecord.code ? editingRecord : item));
    setIsEditModalOpen(false);
  };

  const handleAddNewInterface = () => {
    const newEntry: InterfaceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      ...newInterface
    };
    setActiveInterfaces(prev => [newEntry, ...prev]);
    setIsAddInterfaceModalOpen(false);
    setNewInterface({ name: '', path: '', method: 'POST', status: 'Authorized' });
  };

  // Renderers
  const renderLockCodeManagement = () => (
    <div className="space-y-4 animate-in fade-in duration-300 h-full flex flex-col">
      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 grid grid-cols-3 gap-4 items-end flex-shrink-0">
        <div className="space-y-1.5">
          <label className="text-[12px] font-bold text-slate-600">锁定码:</label>
          <input type="text" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none transition-all shadow-sm" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[12px] font-bold text-slate-600">锁定码增加时间:</label>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm shadow-sm">
            <input type="date" className="w-full outline-none bg-transparent" />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-100">
            <ICONS.Search size={14} />查询
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-shrink-0">
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 bg-white transition-colors">
          <ICONS.Activity size={14} className="text-blue-500" /> 刷新
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 bg-white transition-colors">
          <ICONS.Plus size={14} className="text-emerald-500" /> 新增
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 bg-white transition-colors">
          <ICONS.Plus className="rotate-45 text-red-500" size={14} /> 删除
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 bg-white transition-colors">
          <ICONS.Layers size={14} className="text-indigo-500" /> 复制
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 bg-white transition-colors">
          <ICONS.Download size={14} className="text-amber-500" /> 导出配置
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex-1 flex flex-col">
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                <th className="px-4 py-3 w-10 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="px-6 py-3 w-32">锁定码</th>
                <th className="px-6 py-3">描述</th>
                <th className="px-6 py-3 w-40">申请人</th>
                <th className="px-6 py-3 w-48">锁定码增加时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lockCodeData.map((row, i) => (
                <tr key={i} className="group hover:bg-blue-50/20 transition-colors cursor-pointer select-none" onDoubleClick={() => handleLockCodeDoubleClick(row)}>
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  </td>
                  <td className="px-6 py-3 font-bold text-slate-900 text-sm">{row.code}</td>
                  <td className="px-6 py-3 text-slate-600 text-sm">{row.description}</td>
                  <td className="px-6 py-3 text-slate-800 text-sm font-medium">{row.applicant}</td>
                  <td className="px-6 py-3 text-slate-500 text-sm font-mono">{row.additionTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAdmissionManagement = () => (
    <div className="space-y-4 animate-in fade-in duration-300 h-full flex flex-col">
      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 grid grid-cols-3 gap-4 items-end flex-shrink-0">
        <div className="space-y-1.5">
          <label className="text-[12px] font-bold text-slate-600">系统ID:</label>
          <input type="text" placeholder="例如: SYS_001" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none transition-all shadow-sm" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[12px] font-bold text-slate-600">系统名称:</label>
          <input type="text" placeholder="搜索系统关键字..." className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none transition-all shadow-sm" />
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-100">
            <ICONS.Search size={14} />查询系统
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-shrink-0">
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 bg-white transition-colors">
          <ICONS.Activity size={14} className="text-blue-500" /> 刷新
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 bg-white transition-colors">
          <ICONS.Plus size={14} className="text-emerald-500" /> 新增系统
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 bg-white transition-colors">
          <ICONS.Plus className="rotate-45 text-red-500" size={14} /> 删除
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex-1 flex flex-col">
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                <th className="px-4 py-3 w-10 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="px-6 py-3 w-40">系统ID</th>
                <th className="px-6 py-3 w-60">系统名称</th>
                <th className="px-6 py-3">备注</th>
                <th className="px-6 py-3 w-32">状态</th>
                <th className="px-6 py-3 w-32 text-right">最后更新</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {admissionData.map((row) => (
                <tr 
                  key={row.id} 
                  className="group hover:bg-blue-50/20 transition-colors cursor-pointer select-none" 
                  onDoubleClick={() => handleAdmissionDoubleClick(row)}
                  title="双击进入接口准入维护"
                >
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  </td>
                  <td className="px-6 py-3 font-mono font-bold text-blue-700 text-sm">{row.id}</td>
                  <td className="px-6 py-3 font-bold text-slate-800 text-sm">{row.name}</td>
                  <td className="px-6 py-3 text-slate-500 text-sm">{row.remark}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${row.status === 'Running' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right text-slate-400 text-xs font-mono">{row.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDefaultContent = () => (
    <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <section>
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
          核心参数设置 - {modules.find(m => m.id === activeTab)?.label}
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500">优先级权重</label>
            <input type="number" defaultValue="1" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500">生效范围</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all">
              <option>全量产品</option>
              <option>指定贷款类型</option>
              <option>白名单资方</option>
            </select>
          </div>
        </div>
      </section>
      <section>
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
          控制开关
        </h3>
        <div className="space-y-3">
          {[{ label: '允许人工干预规则执行', enabled: true }, { label: '异常状态下自动触发锁定', enabled: true }].map((rule, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
              <span className="text-sm text-slate-700">{rule.label}</span>
              <div className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${rule.enabled ? 'bg-blue-600' : 'bg-slate-200'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${rule.enabled ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-slate-200 px-8 py-4 bg-slate-50/30 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">通用逻辑配置</h2>
            <p className="text-xs text-slate-500">配置全局生效的产品基础运行逻辑与风控参数</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">取消修改</button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all active:scale-95">发布配置</button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 border-r border-slate-100 flex flex-col p-4 space-y-1 bg-slate-50/10 flex-shrink-0">
          {modules.map(mod => (
            <button
              key={mod.id}
              onClick={() => setActiveTab(mod.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === mod.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className={activeTab === mod.id ? 'text-white' : 'text-slate-400'}>{mod.icon}</span>
              {mod.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-hidden p-8 bg-white flex flex-col">
          {activeTab === 'lockcode' ? renderLockCodeManagement() : 
           activeTab === 'admission' ? renderAdmissionManagement() : (
            <div className="overflow-y-auto custom-scrollbar flex-1">
              {renderDefaultContent()}
            </div>
          )}
        </div>
      </div>

      {/* Lock Code Edit Modal - 完全参考截图还原 */}
      {isEditModalOpen && editingRecord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
          <div className="bg-[#f0f2f5] rounded shadow-2xl w-full max-w-6xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh] border border-slate-300">
            {/* Header */}
            <div className="px-6 py-2 bg-[#e4e7ed] border-b border-slate-300 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <ICONS.Activity size={16} className="text-blue-800" />
                 <span className="text-[12px] font-bold text-slate-700">锁定码详情</span>
               </div>
               <button onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-red-600 transition-colors">
                  <ICONS.Plus className="rotate-45" size={18} />
               </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white custom-scrollbar">
              
              {/* 1. 基础配置 */}
              <div className="border border-slate-200 rounded shadow-sm">
                <div className="bg-slate-50 px-3 py-1.5 flex items-center gap-2 border-b border-slate-200">
                   <ICONS.ChevronDown size={12} className="text-slate-400" />
                   <span className="text-[12px] font-bold text-slate-700">基础配置</span>
                </div>
                <div className="p-4 grid grid-cols-3 gap-x-12 gap-y-4">
                   <DetailItem label="锁定码" value={editingRecord.code} />
                   <DetailItem label="描述" value={editingRecord.description} isEdit />
                   <DetailItem label="锁定码状态" value={editingRecord.status} isSelect options={['ACTIVATE-启用', 'DEACTIVATE-停用']} />
                   
                   <div className="col-span-3 flex items-center gap-4 py-1">
                      <span className="text-[12px] text-slate-500 w-[100px] text-right">锁定码功能分类:</span>
                      <div className="flex items-center gap-6">
                        {['用信控制', '分期终止', '停息停费功能', '关户'].map((cat, idx) => (
                          <label key={cat} className="flex items-center gap-1.5 cursor-pointer">
                            <input 
                              type="checkbox" 
                              defaultChecked={idx === 0} 
                              className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                            />
                            <span className="text-[12px] text-slate-700 font-medium">{cat}</span>
                          </label>
                        ))}
                      </div>
                      <span className="text-red-500 font-bold text-[10px] ml-1">*</span>
                   </div>

                   <DetailItem label="锁定码增加原因" value="账龄锁定码-已逾期" isSelect options={['账龄锁定码-已逾期', '风险控制', '人工核定']} />
                   <DetailItem label="锁定码管理部门" value="资管部" isSelect options={['资管部', '风险部', '运营部']} />
                   <DetailItem label="申请人" value={editingRecord.applicant} isEdit />
                   
                   <DetailItem label="上码场景" value="无" isSelect options={['无', '开户', '授信']} />
                   <DetailItem label="上码方式" value="无" isSelect options={['无', '自动', '手工']} />
                   <DetailItem label="下码场景" value="无" isSelect options={['无', '还款', '展期']} />
                   
                   <DetailItem label="下码方式" value="无" isSelect options={['无', '自动', '审批']} />
                   <DetailItem label="原始需求位置" value="无" isEdit />
                   <DetailItem label="锁定码增加时间" value={editingRecord.additionTime} isDate />
                </div>
              </div>

              {/* 2. 信用控制配置 */}
              <div className="border border-slate-200 rounded shadow-sm">
                <div className="bg-slate-50 px-3 py-1.5 flex items-center gap-2 border-b border-slate-200">
                   <ICONS.ChevronDown size={12} className="text-slate-400" />
                   <span className="text-[12px] font-bold text-slate-700">信用控制配置</span>
                </div>
                <div className="p-4 grid grid-cols-3 gap-x-12 gap-y-4">
                   <DetailItem label="是否支持解锁" value="Y-支持" isSelect options={['Y-支持', 'N-不支持']} />
                   <DetailItem label="解锁方式" value="还款后自动解锁" isSelect options={['还款后自动解锁', '全额结清解锁', '人工解锁']} />
                   <DetailItem label="取现决定" value="D-拒绝" isSelect options={['D-拒绝', 'A-允许', 'W-警告']} />
                   
                   <DetailItem label="现金分期决定" value="D-拒绝" isSelect options={['D-拒绝', 'A-允许']} />
                   <DetailItem label="按日计息消费决定" value="D-拒绝" isSelect options={['D-拒绝', 'A-允许']} />
                   <DetailItem label="免息消费决定" value="D-拒绝" isSelect options={['D-拒绝', 'A-允许']} />
                   
                   <DetailItem label="消费转分期决定" value="D-拒绝" isSelect options={['D-拒绝', 'A-允许']} />
                   <DetailItem label="账单转分期决定" value="D-拒绝" isSelect options={['D-拒绝', 'A-允许']} />
                   <DetailItem label="POS分期决定" value="D-拒绝" isSelect options={['D-拒绝', 'A-允许']} />
                   
                   <DetailItem label="会员消费决定" value="D-拒绝" isSelect options={['D-拒绝', 'A-允许']} />
                </div>
              </div>

              {/* 3. 分期终止配置 */}
              <div className="border border-slate-200 rounded shadow-sm">
                <div className="bg-slate-50 px-3 py-1.5 flex items-center gap-2 border-b border-slate-200">
                   <ICONS.ChevronDown size={12} className="text-slate-400" />
                   <span className="text-[12px] font-bold text-slate-700">分期终止配置</span>
                </div>
                <div className="p-4 grid grid-cols-2 gap-x-12 gap-y-4">
                   <div className="flex items-center gap-3">
                      <span className="text-[12px] text-slate-500 w-[140px] text-right">账户当日是否进行提前结清:</span>
                      <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300" />
                   </div>
                   <DetailItem label="最小还款额计算方式" value="N-正常还款" isSelect options={['N-正常还款', 'F-固定额度还款']} />
                </div>
              </div>

              {/* 4. 停息停费配置 */}
              <div className="border border-slate-200 rounded shadow-sm">
                <div className="bg-slate-50 px-3 py-1.5 flex items-center gap-2 border-b border-slate-200">
                   <ICONS.ChevronDown size={12} className="text-slate-400" />
                   <span className="text-[12px] font-bold text-slate-700">停息停费配置</span>
                </div>
                <div className="p-4 grid grid-cols-3 gap-x-12 gap-y-4">
                   <div className="flex items-center gap-3">
                      <span className="text-[12px] text-slate-500 w-[110px] text-right">进行日常利息累积:</span>
                      <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-slate-300" />
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="text-[12px] text-slate-500 w-[110px] text-right">免除利息:</span>
                      <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300" />
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="text-[12px] text-slate-500 w-[140px] text-right">免除超次提现手续费:</span>
                      <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300" />
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="text-[12px] text-slate-500 w-[110px] text-right">免除服务费:</span>
                      <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300" />
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="text-[12px] text-slate-500 w-[110px] text-right">免除其他费用(增值服务费):</span>
                      <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300" />
                   </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-2 bg-[#f0f2f5] border-t border-slate-300 flex items-center gap-3">
              <button 
                onClick={handleUpdateLockCode}
                className="px-6 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-[#333] text-[12px] font-medium rounded flex items-center gap-2 transition-all"
              >
                <ICONS.CheckCircle2 size={14} className="text-blue-600" /> 确认
              </button>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-[#333] text-[12px] font-medium rounded flex items-center gap-2 transition-all"
              >
                <ICONS.Plus className="rotate-45 text-red-600" size={14} /> 取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Interface Admission Modal */}
      {isAdmissionModalOpen && activeSystem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
          <div className="bg-[#f0f2f5] rounded shadow-2xl w-full max-w-6xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh] border border-slate-300">
            {/* Header */}
            <div className="px-6 py-2.5 bg-[#e4e7ed] border-b border-slate-300 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <ICONS.ShieldCheck size={16} className="text-indigo-800" />
                 <span className="text-[13px] font-bold text-slate-700">接口准入维护 - {activeSystem.name}</span>
               </div>
               <button onClick={() => setIsAdmissionModalOpen(false)} className="text-slate-500 hover:text-red-600 transition-colors">
                  <ICONS.Plus className="rotate-45" size={20} />
               </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-hidden p-4 bg-slate-100 flex flex-col gap-4">
               {/* System Info Banner */}
               <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
                  <div className="flex gap-12">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">系统标识</span>
                        <span className="text-sm font-bold text-blue-700 font-mono">{activeSystem.id}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">接口总量</span>
                        <span className="text-sm font-bold text-slate-800">{activeInterfaces.length} 个已上线</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">备注说明</span>
                        <span className="text-sm text-slate-500">{activeSystem.remark}</span>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button 
                       onClick={() => setIsAddInterfaceModalOpen(true)}
                       className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm"
                     >
                        <ICONS.Plus size={14} />新增接口
                     </button>
                     <button className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
                        <ICONS.Plus size={14} />批量授权
                     </button>
                  </div>
               </div>

               {/* Interface List Table */}
               <div className="flex-1 bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-sm">
                  <div className="overflow-y-auto flex-1 custom-scrollbar">
                     <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 z-10">
                           <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                              <th className="px-4 py-3 w-10 text-center"><input type="checkbox" className="rounded border-slate-300" /></th>
                              <th className="px-6 py-3 w-48">接口名称</th>
                              <th className="px-6 py-3">请求路径 (Path)</th>
                              <th className="px-6 py-3 w-24">请求方式</th>
                              <th className="px-6 py-3 w-32">当前准入状态</th>
                              <th className="px-6 py-3 w-32 text-right">操作</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {activeInterfaces.map((inf) => (
                              <tr key={inf.id} className="hover:bg-slate-50/50 transition-colors group">
                                 <td className="px-4 py-3 text-center"><input type="checkbox" className="rounded border-slate-300" /></td>
                                 <td className="px-6 py-3 font-bold text-slate-700 text-[12px]">{inf.name}</td>
                                 <td className="px-6 py-3 font-mono text-slate-500 text-[11px]">{inf.path}</td>
                                 <td className="px-6 py-3">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${inf.method === 'POST' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 bg-slate-50'}`}>
                                       {inf.method}
                                    </span>
                                 </td>
                                 <td className="px-6 py-3">
                                    <div className="flex items-center gap-2">
                                       <div className={`w-2 h-2 rounded-full ${inf.status === 'Authorized' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                       <span className={`text-[11px] font-bold ${inf.status === 'Authorized' ? 'text-emerald-700' : 'text-red-700'}`}>
                                          {inf.status === 'Authorized' ? '已授权' : '未授权'}
                                       </span>
                                    </div>
                                 </td>
                                 <td className="px-6 py-3 text-right">
                                    <button className="text-blue-600 hover:text-blue-800 text-[11px] font-bold">编辑权限</button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-3 bg-[#e4e7ed] border-t border-slate-300 flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsAdmissionModalOpen(false)}
                className="px-8 py-1.5 bg-[#409eff] hover:bg-blue-600 text-white text-[12px] font-bold rounded shadow-sm transition-all"
              >
                保存准入设置
              </button>
              <button 
                onClick={() => setIsAdmissionModalOpen(false)}
                className="px-8 py-1.5 bg-white border border-slate-300 text-slate-600 text-[12px] font-bold rounded transition-all hover:bg-slate-100"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Interface Modal */}
      {isAddInterfaceModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-[4px] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ICONS.Plus size={18} className="text-emerald-600" />
                新增接口配置
              </h3>
              <button onClick={() => setIsAddInterfaceModalOpen(false)} className="text-slate-400 hover:text-slate-600"><ICONS.Plus className="rotate-45" size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
               <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-700 flex items-center gap-1">接口名称 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="例如: 客户实名认证查询"
                    className="w-full bg-[#fcfcfd] border border-slate-300 rounded px-4 py-2.5 text-[12px] font-medium outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-700"
                    value={newInterface.name}
                    onChange={(e) => setNewInterface({...newInterface, name: e.target.value})}
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-700 flex items-center gap-1">请求路径 (Path) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="例如: /api/v2/auth/identity"
                    className="w-full bg-[#fcfcfd] border border-slate-300 rounded px-4 py-2.5 text-[12px] font-mono outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-700"
                    value={newInterface.path}
                    onChange={(e) => setNewInterface({...newInterface, path: e.target.value})}
                  />
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-slate-700">请求方式 <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        className="w-full bg-[#fcfcfd] border border-slate-300 rounded px-3 py-2.5 text-[12px] font-medium outline-none focus:border-blue-400 focus:bg-white transition-all appearance-none pr-6 cursor-pointer text-slate-700"
                        value={newInterface.method}
                        onChange={(e) => setNewInterface({...newInterface, method: e.target.value})}
                      >
                        <option value="POST">POST</option>
                        <option value="GET">GET</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                      <ICONS.ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-slate-700">准入状态</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-[#fcfcfd] border border-slate-300 rounded px-3 py-2.5 text-[12px] font-medium outline-none focus:border-blue-400 focus:bg-white transition-all appearance-none pr-6 cursor-pointer text-slate-700"
                        value={newInterface.status}
                        onChange={(e) => setNewInterface({...newInterface, status: e.target.value as any})}
                      >
                        <option value="Authorized">Authorized - 已授权</option>
                        <option value="Unauthorized">Unauthorized - 未授权</option>
                      </select>
                      <ICONS.ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
               </div>
            </div>
            <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsAddInterfaceModalOpen(false)}
                className="px-6 py-2 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleAddNewInterface}
                className="px-8 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-emerald-100 transition-all active:scale-95"
              >
                保存接口
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// UI Helper Components - 完全参照截图还原
const DetailItem: React.FC<{ 
  label: string; 
  value: string; 
  isEdit?: boolean; 
  isSelect?: boolean; 
  isDate?: boolean;
  options?: string[] 
}> = ({ label, value, isEdit, isSelect, isDate, options }) => (
  <div className="flex items-center gap-2 group min-w-0">
    <span className="text-slate-500 min-w-[100px] text-right text-[12px]">{label}:</span>
    <div className="flex-1 min-w-0">
      {isSelect ? (
        <div className="relative">
           <select className="w-full bg-[#fcfcfd] border border-slate-300 rounded-sm px-2 py-0.5 text-[12px] font-medium outline-none focus:border-blue-400 focus:bg-white transition-all appearance-none pr-6 cursor-pointer text-slate-700">
             {options?.map(opt => <option key={opt} value={opt} selected={opt === value}>{opt}</option>)}
           </select>
           <ICONS.ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      ) : isEdit ? (
        <input 
          type="text" 
          defaultValue={value} 
          className="w-full bg-[#fcfcfd] border border-slate-300 rounded-sm px-2 py-0.5 text-[12px] font-medium outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-700"
        />
      ) : isDate ? (
        <div className="flex items-center bg-[#fcfcfd] border border-slate-300 rounded-sm px-2 py-0.5 text-[12px] font-medium group">
           <input type="text" defaultValue={value} className="bg-transparent outline-none flex-1 text-slate-700" />
           <ICONS.Clock size={12} className="text-slate-400" />
        </div>
      ) : (
        <span className="text-slate-400 text-[12px] font-medium ml-2">{value}</span>
      )}
    </div>
    {/* 还原截图中的必填红星 */}
    {(isEdit || isSelect || isDate) && <span className="text-red-500 font-bold text-[10px] ml-0.5">*</span>}
  </div>
);

export default ProductCommonPage;
