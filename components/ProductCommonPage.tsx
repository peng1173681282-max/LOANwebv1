
import React, { useState, useMemo } from 'react';
import { ICONS } from '../constants';

interface LockCodeRecord {
  code: string;
  description: string;
  applicant: string;
  additionTime: string;
  status: string;
  categories: string[]; // 对应“锁定码功能分类”
  // 基础配置扩展
  reason: string;
  department: string;
  addScene: string;
  addMethod: string;
  removeScene: string;
  removeMethod: string;
  requirementPos: string;
  // 用信控制配置
  allowUnlock: string;
  unlockMethod: string;
  cashWithdrawalDecision: string;
  cashInstallmentDecision: string;
  dailyInterestConsDecision: string;
  interestFreeConsDecision: string;
  consToInstallmentDecision: string;
  billToInstallmentDecision: string;
  posInstallmentDecision: string;
  memberConsDecision: string;
  // 分期终止配置
  allowEarlySettlement: boolean;
  minPaymentCalcMethod: string;
  // 停息停费配置
  accrueDailyInterest: boolean;
  waiveInterest: boolean;
  waiveExcessCashFee: boolean;
  waiveServiceFee: boolean;
  waiveOtherFees: boolean;
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

interface StageRule {
  stage: string;
  ruleType: '横向抵扣' | '纵向抵扣';
}

interface DeductionRule {
  id: string;
  code: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  updateTime: string;
  stageRules: StageRule[];
}

interface AllocationRule {
  id: string;
  code: string;
  name: string;
  status: 'Active' | 'Inactive';
  updateTime: string;
  priorityList: string[]; // 还款成分顺序，例如 ['罚息', '利息', '本金']
}

const ProductCommonPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('deduction');
  
  // States for Allocation Rule Management (还款分配顺序)
  const [allocationRules, setAllocationRules] = useState<AllocationRule[]>([
    { id: '1', code: 'AR_GEN_001', name: '通用还款分配规则', status: 'Active', updateTime: '2024-05-10', priorityList: ['罚息', '复利', '利息', '本金', '逾期手续费'] },
    { id: '2', code: 'AR_PRD_精英贷', name: '精英贷特定分配规则', status: 'Active', updateTime: '2024-05-12', priorityList: ['利息', '本金', '罚息', '手续费'] },
    { id: '3', code: 'AR_PRD_小微', name: '小微经营贷保全规则', status: 'Inactive', updateTime: '2024-05-15', priorityList: ['手续费', '罚息', '利息', '本金'] },
  ]);
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<AllocationRule | null>(null);
  const [selectedAllocationIds, setSelectedAllocationIds] = useState<Set<string>>(new Set());

  // States for Deduction Rule Management
  const [deductionRules, setDeductionRules] = useState<DeductionRule[]>([
    { 
      id: '1', 
      code: 'DR_GEN_001', 
      name: '通用还款抵扣规则', 
      description: '适用于所有标准信贷产品的默认抵扣逻辑', 
      status: 'Active', 
      updateTime: '2024-05-10',
      stageRules: [
        { stage: 'M0', ruleType: '纵向抵扣' },
        { stage: 'M1', ruleType: '横向抵扣' },
        { stage: 'M2', ruleType: '横向抵扣' }
      ]
    },
    { 
      id: '2', 
      code: 'DR_PRD_精英贷', 
      name: '精英贷专项抵扣规则', 
      description: '针对高净值人群产品的特殊本息扣划逻辑', 
      status: 'Active', 
      updateTime: '2024-05-12',
      stageRules: [
        { stage: 'M0', ruleType: '纵向抵扣' },
        { stage: 'M1', ruleType: '纵向抵扣' }
      ]
    },
    { 
      id: '3', 
      code: 'DR_PRD_小微', 
      name: '小微经营贷抵扣规则', 
      description: '优先抵扣逾期利息与手续费', 
      status: 'Inactive', 
      updateTime: '2024-05-15',
      stageRules: [
        { stage: 'M0', ruleType: '横向抵扣' }
      ]
    },
  ]);
  const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);
  const [editingDeduction, setEditingDeduction] = useState<DeductionRule | null>(null);

  // States for Lock Code Management
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<LockCodeRecord | null>(null);
  const [lockCodeData, setLockCodeData] = useState<LockCodeRecord[]>([
    { 
      code: '2', 
      description: '2_1-30天拖欠', 
      applicant: '无', 
      additionTime: '2019-11-18', 
      status: 'DEACTIVATE-停用', 
      categories: ['用信控制'],
      reason: '账龄锁定码-已逾期',
      department: '资管部',
      addScene: '无',
      addMethod: '无',
      removeScene: '无',
      removeMethod: '无',
      requirementPos: '无',
      allowUnlock: 'Y-支持',
      unlockMethod: '还款后自动解锁',
      cashWithdrawalDecision: 'D-拒绝',
      cashInstallmentDecision: 'D-拒绝',
      dailyInterestConsDecision: 'D-拒绝',
      interestFreeConsDecision: 'D-拒绝',
      consToInstallmentDecision: 'D-拒绝',
      billToInstallmentDecision: 'D-拒绝',
      posInstallmentDecision: 'D-拒绝',
      memberConsDecision: 'D-拒绝',
      allowEarlySettlement: false,
      minPaymentCalcMethod: 'N-正常还款',
      accrueDailyInterest: true,
      waiveInterest: false,
      waiveExcessCashFee: false,
      waiveServiceFee: false,
      waiveOtherFees: false
    }
  ]);

  // States for System Admission Management
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [activeSystem, setActiveSystem] = useState<SystemAdmissionRecord | null>(null);
  const [activeInterfaces, setActiveInterfaces] = useState<InterfaceRecord[]>([]);
  const [admissionData, setAdmissionData] = useState<SystemAdmissionRecord[]>([
    { id: 'SYS_001', name: '信贷核心系统', remark: '核心账务处理', status: 'Running', lastUpdated: '2024-05-20' },
    { id: 'SYS_002', name: '风控决策引擎', remark: '规则准入评估', status: 'Running', lastUpdated: '2024-05-19' },
    { id: 'SYS_003', name: '渠道网关', remark: '三方渠道接入', status: 'Warning', lastUpdated: '2024-05-21' },
  ]);

  const modules = [
    { id: 'deduction', label: '抵扣规则管理', icon: <ICONS.Layers size={16} /> },
    { id: 'allocation', label: '还款分配顺序', icon: <ICONS.Activity size={16} /> },
    { id: 'lockcode', label: '锁定码管理', icon: <ICONS.Lock size={16} /> },
    { id: 'admission', label: '系统准入管理', icon: <ICONS.ShieldCheck size={16} /> },
  ];

  // Handlers for Allocation Rule
  const handleAllocationDoubleClick = (rule: AllocationRule) => {
    setEditingAllocation({ ...rule });
    setIsAllocationModalOpen(true);
  };

  const handleSaveAllocation = () => {
    if (!editingAllocation) return;
    const now = new Date().toISOString().split('T')[0];
    if (editingAllocation.id) {
      setAllocationRules(prev => prev.map(item => item.id === editingAllocation.id ? { ...editingAllocation, updateTime: now } : item));
    } else {
      setAllocationRules(prev => [{ ...editingAllocation, id: Math.random().toString(36).substr(2, 9), updateTime: now }, ...prev]);
    }
    setIsAllocationModalOpen(false);
  };

  const handleDeleteAllocation = (id?: string) => {
    if (id) {
      if (confirm('确定要删除该还款分配规则吗？')) {
        setAllocationRules(prev => prev.filter(item => item.id !== id));
      }
    } else {
      if (selectedAllocationIds.size === 0) return;
      if (confirm(`确定要删除选中的 ${selectedAllocationIds.size} 条规则吗？`)) {
        setAllocationRules(prev => prev.filter(item => !selectedAllocationIds.has(item.id)));
        setSelectedAllocationIds(new Set());
      }
    }
  };

  const toggleAllocationSelection = (id: string) => {
    const next = new Set(selectedAllocationIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedAllocationIds(next);
  };

  const handleMoveAllocationItem = (index: number, direction: 'up' | 'down') => {
    if (!editingAllocation) return;
    const newList = [...editingAllocation.priorityList];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newList.length) return;
    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    setEditingAllocation({ ...editingAllocation, priorityList: newList });
  };

  // Handlers for Deduction Rule
  const handleDeductionDoubleClick = (rule: DeductionRule) => {
    setEditingDeduction({ ...rule });
    setIsDeductionModalOpen(true);
  };

  const handleSaveDeduction = () => {
    if (!editingDeduction) return;
    const now = new Date().toISOString().split('T')[0];
    if (editingDeduction.id) {
      setDeductionRules(prev => prev.map(item => item.id === editingDeduction.id ? { ...editingDeduction, updateTime: now } : item));
    } else {
      setDeductionRules(prev => [{ ...editingDeduction, id: Math.random().toString(36).substr(2, 9), updateTime: now }, ...prev]);
    }
    setIsDeductionModalOpen(false);
  };

  const handleAddStageRule = () => {
    if (!editingDeduction) return;
    const lastStage = editingDeduction.stageRules[editingDeduction.stageRules.length - 1];
    let nextStageName = 'M0';
    if (lastStage) {
      const match = lastStage.stage.match(/M(\d+)/);
      if (match) nextStageName = `M${parseInt(match[1]) + 1}`;
    }
    setEditingDeduction({
      ...editingDeduction,
      stageRules: [...editingDeduction.stageRules, { stage: nextStageName, ruleType: '纵向抵扣' }]
    });
  };

  const handleUpdateStageRule = (index: number, field: keyof StageRule, value: string) => {
    if (!editingDeduction) return;
    const newStageRules = [...editingDeduction.stageRules];
    newStageRules[index] = { ...newStageRules[index], [field]: value };
    setEditingDeduction({ ...editingDeduction, stageRules: newStageRules });
  };

  const handleDeleteStageRule = (index: number) => {
    if (!editingDeduction) return;
    const newStageRules = editingDeduction.stageRules.filter((_, i) => i !== index);
    setEditingDeduction({ ...editingDeduction, stageRules: newStageRules });
  };

  // Other Handlers
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

  // Renderers
  const renderAllocationManagement = () => (
    <div className="space-y-4 animate-in fade-in duration-300 h-full flex flex-col">
      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 grid grid-cols-3 gap-4 items-end flex-shrink-0">
        <div className="space-y-1.5">
          <label className="text-[12px] font-bold text-slate-600">规则编码:</label>
          <input type="text" placeholder="输入分配规则编码..." className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none transition-all shadow-sm" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[12px] font-bold text-slate-600">规则名称:</label>
          <input type="text" placeholder="通用规则 / XX产品特定规则" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none transition-all shadow-sm" />
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
        <button 
          onClick={() => { setEditingAllocation({ id: '', code: '', name: '', status: 'Active', updateTime: '', priorityList: ['本金', '利息', '罚息', '手续费', '复利'] }); setIsAllocationModalOpen(true); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 bg-white transition-colors"
        >
          <ICONS.Plus size={14} className="text-emerald-500" /> 新增规则
        </button>
        <button 
          onClick={() => handleDeleteAllocation()}
          disabled={selectedAllocationIds.size === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 bg-white transition-colors disabled:opacity-50"
        >
          <ICONS.Plus className="rotate-45 text-red-500" size={14} /> 批量删除
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex-1 flex flex-col">
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                <th className="px-4 py-3 w-10 text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300" 
                    onChange={(e) => {
                      if (e.target.checked) setSelectedAllocationIds(new Set(allocationRules.map(r => r.id)));
                      else setSelectedAllocationIds(new Set());
                    }}
                  />
                </th>
                <th className="px-6 py-3 w-48">规则编码</th>
                <th className="px-6 py-3 w-64">规则名称</th>
                <th className="px-6 py-3">成分分配优先级 (从高到低)</th>
                <th className="px-6 py-3 w-32">状态</th>
                <th className="px-6 py-3 w-32 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allocationRules.map((row) => (
                <tr 
                  key={row.id} 
                  className="group hover:bg-blue-50/20 transition-colors cursor-pointer select-none"
                  onDoubleClick={() => handleAllocationDoubleClick(row)}
                >
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300" 
                      checked={selectedAllocationIds.has(row.id)}
                      onChange={() => toggleAllocationSelection(row.id)}
                    />
                  </td>
                  <td className="px-6 py-3 font-mono font-bold text-blue-700 text-sm">{row.code}</td>
                  <td className="px-6 py-3 font-bold text-slate-800 text-sm">{row.name}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center flex-wrap gap-1.5">
                      {row.priorityList.map((item, idx) => (
                        <React.Fragment key={idx}>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shadow-sm ${
                            item === '本金' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            item === '利息' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            item === '罚息' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-slate-50 text-slate-500 border-slate-100'
                          }`}>
                            {item}
                          </span>
                          {idx < row.priorityList.length - 1 && <ICONS.ChevronRight size={10} className="text-slate-300" />}
                        </React.Fragment>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${row.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {row.status === 'Active' ? '已启用' : '已停用'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); handleAllocationDoubleClick(row); }} className="text-blue-600 hover:text-blue-800 text-xs font-bold">编辑</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteAllocation(row.id); }} className="text-red-500 hover:text-red-700 text-xs font-bold">删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDeductionManagement = () => (
    <div className="space-y-4 animate-in fade-in duration-300 h-full flex flex-col">
      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 grid grid-cols-3 gap-4 items-end flex-shrink-0">
        <div className="space-y-1.5">
          <label className="text-[12px] font-bold text-slate-600">规则编码:</label>
          <input type="text" placeholder="输入规则编码..." className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none transition-all shadow-sm" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[12px] font-bold text-slate-600">抵扣规则:</label>
          <input type="text" placeholder="通用规则 / XX产品规则" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none transition-all shadow-sm" />
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
        <button 
          onClick={() => { setEditingDeduction({ id: '', code: '', name: '', description: '', status: 'Active', updateTime: '', stageRules: [{ stage: 'M0', ruleType: '纵向抵扣' }] }); setIsDeductionModalOpen(true); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 bg-white transition-colors"
        >
          <ICONS.Plus size={14} className="text-emerald-500" /> 新增抵扣策略
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex-1 flex flex-col">
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                <th className="px-4 py-3 w-10 text-center"><input type="checkbox" className="rounded border-slate-300" /></th>
                <th className="px-6 py-3 w-40">规则编码</th>
                <th className="px-6 py-3 w-64">抵扣规则</th>
                <th className="px-6 py-3">策略描述</th>
                <th className="px-6 py-3 w-32">状态</th>
                <th className="px-6 py-3 w-40 text-right">最后更新</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deductionRules.map((row) => (
                <tr 
                  key={row.id} 
                  className="group hover:bg-blue-50/20 transition-colors cursor-pointer select-none"
                  onDoubleClick={() => handleDeductionDoubleClick(row)}
                >
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded border-slate-300" />
                  </td>
                  <td className="px-6 py-3 font-mono font-bold text-blue-700 text-sm">{row.code}</td>
                  <td className="px-6 py-3 font-bold text-slate-800 text-sm">{row.name}</td>
                  <td className="px-6 py-3 text-slate-500 text-sm">{row.description}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${row.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {row.status === 'Active' ? '已启用' : '已停用'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right text-slate-400 text-xs font-mono">{row.updateTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

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
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex-1 flex flex-col">
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                <th className="px-4 py-3 w-10 text-center"><input type="checkbox" className="rounded border-slate-300" /></th>
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
                >
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded border-slate-300" />
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
    <div className="max-w-2xl space-y-8 flex-1 flex flex-col">
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
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
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
           activeTab === 'admission' ? renderAdmissionManagement() : 
           activeTab === 'deduction' ? renderDeductionManagement() : 
           activeTab === 'allocation' ? renderAllocationManagement() : renderDefaultContent()}
        </div>
      </div>

      {/* Allocation Rule Maintenance Modal - 还款分配顺序维护界面 */}
      {isAllocationModalOpen && editingAllocation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
          <div className="bg-[#f0f2f5] rounded shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh] border border-slate-300">
            <div className="px-6 py-2 bg-[#e4e7ed] border-b border-slate-300 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <ICONS.Activity size={16} className="text-blue-800" />
                 <span className="text-[12px] font-bold text-slate-700">还款分配顺序维护</span>
               </div>
               <button onClick={() => setIsAllocationModalOpen(false)} className="text-slate-500 hover:text-red-600 transition-colors">
                  <ICONS.Plus className="rotate-45" size={18} />
               </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white custom-scrollbar">
               {/* 基础配置区 */}
               <div className="border border-slate-200 rounded shadow-sm">
                  <div className="bg-slate-50 px-3 py-1.5 flex items-center gap-2 border-b border-slate-200">
                    <ICONS.ChevronDown size={12} className="text-slate-400" />
                    <span className="text-[12px] font-bold text-slate-700">基础配置 - {editingAllocation.code || '新规则'}</span>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-x-8 gap-y-4">
                    <DetailItem 
                      label="规则编码" 
                      value={editingAllocation.code} 
                      isEdit 
                      onChange={(val) => setEditingAllocation({...editingAllocation, code: val})} 
                    />
                    <DetailItem 
                      label="规则名称" 
                      value={editingAllocation.name} 
                      placeholder="通用规则 / XX产品特定规则"
                      isEdit 
                      onChange={(val) => setEditingAllocation({...editingAllocation, name: val})} 
                    />
                    <DetailItem 
                      label="规则状态" 
                      value={editingAllocation.status} 
                      isSelect 
                      options={['Active-已启用', 'Inactive-已停用']} 
                      onChange={(val) => setEditingAllocation({...editingAllocation, status: val.startsWith('Active') ? 'Active' : 'Inactive'})} 
                    />
                  </div>
               </div>

               {/* 优先级维护区 */}
               <div className="border border-slate-200 rounded shadow-sm">
                  <div className="bg-slate-50 px-3 py-1.5 flex items-center gap-2 border-b border-slate-200">
                    <ICONS.ChevronDown size={12} className="text-slate-400" />
                    <span className="text-[12px] font-bold text-slate-700">成分优先级维护 (拖拽或点击按钮调整先后抵扣关系)</span>
                  </div>
                  <div className="p-4">
                    <div className="space-y-1 bg-slate-50/50 rounded p-3 border border-slate-100">
                      {editingAllocation.priorityList.map((item, idx) => (
                        <div key={item} className="bg-white border border-slate-200 px-4 py-2.5 rounded-lg flex items-center justify-between group shadow-sm hover:border-blue-300 hover:bg-blue-50/10 transition-all">
                          <div className="flex items-center gap-4">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-inner ${
                              idx === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                            }`}>
                              {idx + 1}
                            </span>
                            <span className="text-[13px] font-bold text-slate-700 tracking-tight">{item}</span>
                          </div>
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleMoveAllocationItem(idx, 'up')}
                              className="p-1.5 hover:bg-blue-600 hover:text-white rounded-md text-slate-400 transition-colors disabled:opacity-20"
                              disabled={idx === 0}
                              title="提高优先级"
                            >
                              <ICONS.ChevronDown size={14} className="rotate-180" />
                            </button>
                            <button 
                              onClick={() => handleMoveAllocationItem(idx, 'down')}
                              className="p-1.5 hover:bg-blue-600 hover:text-white rounded-md text-slate-400 transition-colors disabled:opacity-20"
                              disabled={idx === editingAllocation.priorityList.length - 1}
                              title="降低优先级"
                            >
                              <ICONS.ChevronDown size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
            <div className="px-6 py-3 bg-[#f0f2f5] border-t border-slate-300 flex items-center justify-end gap-3">
              <button 
                onClick={handleSaveAllocation}
                className="px-6 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold rounded shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <ICONS.CheckCircle2 size={14} /> 确认并保存
              </button>
              <button 
                onClick={() => setIsAllocationModalOpen(false)}
                className="px-6 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-[#333] text-[12px] font-bold rounded transition-all"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deduction Rule Maintenance Modal - 抵扣规则维护界面 */}
      {isDeductionModalOpen && editingDeduction && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
          <div className="bg-[#f0f2f5] rounded shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh] border border-slate-300">
            <div className="px-6 py-2 bg-[#e4e7ed] border-b border-slate-300 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <ICONS.Layers size={16} className="text-blue-800" />
                 <span className="text-[12px] font-bold text-slate-700">抵扣规则维护</span>
               </div>
               <button onClick={() => setIsDeductionModalOpen(false)} className="text-slate-500 hover:text-red-600 transition-colors">
                  <ICONS.Plus className="rotate-45" size={18} />
               </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white custom-scrollbar">
               {/* 基础信息 */}
               <div className="border border-slate-200 rounded shadow-sm">
                  <div className="bg-slate-50 px-3 py-1.5 flex items-center gap-2 border-b border-slate-200">
                    <ICONS.ChevronDown size={12} className="text-slate-400" />
                    <span className="text-[12px] font-bold text-slate-700">基础信息</span>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-x-8 gap-y-4">
                    <DetailItem label="规则编码" value={editingDeduction.code} isEdit onChange={(val) => setEditingDeduction({ ...editingDeduction, code: val })} />
                    <DetailItem label="规则名称" value={editingDeduction.name} isEdit onChange={(val) => setEditingDeduction({ ...editingDeduction, name: val })} />
                    <DetailItem label="规则状态" value={editingDeduction.status} isSelect options={['Active-已启用', 'Inactive-已停用']} onChange={(val) => setEditingDeduction({ ...editingDeduction, status: val.startsWith('Active') ? 'Active' : 'Inactive' })} />
                  </div>
               </div>

               {/* 贷款阶段抵扣规则 */}
               <div className="border border-slate-200 rounded shadow-sm">
                  <div className="bg-slate-50 px-3 py-1.5 flex items-center justify-between border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <ICONS.ChevronDown size={12} className="text-slate-400" />
                      <span className="text-[12px] font-bold text-slate-700">贷款阶段抵扣策略维护</span>
                    </div>
                    <button 
                      onClick={handleAddStageRule}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm transition-all"
                    >
                      <ICONS.Plus size={10} /> 新增阶段
                    </button>
                  </div>
                  <div className="p-4">
                    <table className="w-full text-left border-collapse border border-slate-200 rounded overflow-hidden">
                      <thead className="bg-slate-50 text-[11px] text-slate-500 font-bold uppercase">
                        <tr>
                          <th className="px-4 py-2 border-b border-slate-200">贷款阶段 (M0/M1/M2...)</th>
                          <th className="px-4 py-2 border-b border-slate-200">抵扣规则</th>
                          <th className="px-4 py-2 border-b border-slate-200 w-20 text-center">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {editingDeduction.stageRules.map((stageRule, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="px-4 py-2">
                              <input 
                                type="text"
                                className="w-full bg-[#fcfcfd] border border-slate-200 rounded px-2 py-1 text-[12px] font-bold text-blue-700 outline-none focus:border-blue-400 focus:bg-white transition-all"
                                value={stageRule.stage}
                                onChange={(e) => handleUpdateStageRule(idx, 'stage', e.target.value)}
                              />
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex gap-2">
                                {(['横向抵扣', '纵向抵扣'] as const).map(type => (
                                  <button
                                    key={type}
                                    onClick={() => handleUpdateStageRule(idx, 'ruleType', type)}
                                    className={`px-3 py-1 rounded text-[11px] font-bold border transition-all ${
                                      stageRule.ruleType === type 
                                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                    }`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button 
                                onClick={() => handleDeleteStageRule(idx)}
                                className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <ICONS.Plus className="rotate-45" size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {editingDeduction.stageRules.length === 0 && (
                          <tr>
                            <td colSpan={3} className="px-4 py-8 text-center text-slate-400 text-xs italic">
                              暂无阶段抵扣规则，请点击右上角新增
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
               </div>
            </div>
            <div className="px-6 py-3 bg-[#f0f2f5] border-t border-slate-300 flex items-center justify-end gap-3">
              <button 
                onClick={handleSaveDeduction}
                className="px-6 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold rounded shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <ICONS.CheckCircle2 size={14} /> 确认并保存
              </button>
              <button onClick={() => setIsDeductionModalOpen(false)} className="px-6 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-[#333] text-[12px] font-bold rounded transition-all">
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lock Code Edit Modal - 锁定码维护界面（参考图片布局） */}
      {isEditModalOpen && editingRecord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
          <div className="bg-[#f0f2f5] rounded shadow-2xl w-full max-w-7xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh] border border-slate-300">
            {/* 弹窗头部 */}
            <div className="px-6 py-2 bg-[#e4e7ed] border-b border-slate-300 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <ICONS.Activity size={16} className="text-blue-800" />
                 <span className="text-[12px] font-bold text-slate-700">锁定码详情</span>
               </div>
               <button onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-red-600 transition-colors">
                  <ICONS.Plus className="rotate-45" size={18} />
               </button>
            </div>
            
            {/* 弹窗主体（分栏布局） */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white custom-scrollbar">
              {/* 基础配置栏目 */}
              <div className="border border-slate-200 rounded shadow-sm">
                <div className="bg-slate-50 px-3 py-1.5 flex items-center justify-between border-b border-slate-200">
                   <div className="flex items-center gap-2">
                     <ICONS.ChevronDown size={12} className="text-slate-400" />
                     <span className="text-[12px] font-bold text-slate-700">基础配置</span>
                   </div>
                   <ICONS.ChevronDown size={12} className="text-slate-300 rotate-180" />
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-3 gap-x-12 gap-y-3">
                    <DetailItem label="锁定码" value={editingRecord.code} required />
                    <DetailItem label="描述" value={editingRecord.description} isEdit required onChange={(v) => setEditingRecord({...editingRecord, description: v})} />
                    <DetailItem label="锁定码状态" value={editingRecord.status} isSelect options={['ACTIVATE-启用', 'DEACTIVATE-停用']} required onChange={(v) => setEditingRecord({...editingRecord, status: v})} />
                  </div>
                  
                  <div className="flex items-center gap-4 py-2 border-y border-slate-50">
                    <span className="text-slate-500 text-[12px] min-w-[100px] text-right font-bold">锁定码功能分类:</span>
                    <div className="flex items-center gap-4">
                      {['用信控制', '分期终止', '停息停费功能', '关户'].map(cat => (
                        <label key={cat} className="flex items-center gap-1.5 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={editingRecord.categories.includes(cat)} 
                            onChange={(e) => {
                              const next = e.target.checked 
                                ? [...editingRecord.categories, cat] 
                                : editingRecord.categories.filter(c => c !== cat);
                              setEditingRecord({...editingRecord, categories: next});
                            }}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                          />
                          <span className="text-[12px] text-slate-700 group-hover:text-blue-600 transition-colors">{cat}</span>
                        </label>
                      ))}
                      <span className="text-red-500 font-bold text-[10px]">*</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-x-12 gap-y-3">
                    <DetailItem label="锁定码增加原因" value={editingRecord.reason} isSelect options={['账龄锁定码-已逾期', '资产质量恶化', '法律风险']} required />
                    <DetailItem label="锁定码管理部门" value={editingRecord.department} isSelect options={['资管部', '信审部', '客服部']} required />
                    <DetailItem label="申请人" value={editingRecord.applicant} isEdit required />
                    
                    <DetailItem label="上码场景" value={editingRecord.addScene} isSelect options={['无', '逾期产生', '人工触发']} required />
                    <DetailItem label="上码方式" value={editingRecord.addMethod} isSelect options={['无', '系统自动', '手工录入']} required />
                    <DetailItem label="下码场景" value={editingRecord.removeScene} isSelect options={['无', '还款结清', '人工解除']} required />
                    
                    <DetailItem label="下码方式" value={editingRecord.removeMethod} isSelect options={['无', '系统自动', '手工录入']} required />
                    <DetailItem label="原始需求位置" value={editingRecord.requirementPos} isEdit required />
                    <DetailItem label="锁定码增加时间" value={editingRecord.additionTime} isDate required />
                  </div>
                </div>
              </div>

              {/* 用信控制配置栏目 */}
              <div className="border border-slate-200 rounded shadow-sm">
                <div className="bg-slate-50 px-3 py-1.5 flex items-center justify-between border-b border-slate-200">
                   <div className="flex items-center gap-2">
                     <ICONS.ChevronDown size={12} className="text-slate-400" />
                     <span className="text-[12px] font-bold text-slate-700">用信控制配置</span>
                   </div>
                   <ICONS.ChevronDown size={12} className="text-slate-300 rotate-180" />
                </div>
                <div className="p-4 grid grid-cols-3 gap-x-12 gap-y-3">
                  <DetailItem label="是否支持解锁" value={editingRecord.allowUnlock} isSelect options={['Y-支持', 'N-不支持']} required />
                  <DetailItem label="解锁方式" value={editingRecord.unlockMethod} isSelect options={['还款后自动解锁', '人工审批解锁']} required />
                  <DetailItem label="取现决定" value={editingRecord.cashWithdrawalDecision} isSelect options={['D-拒绝', 'A-允许']} required />
                  
                  <DetailItem label="现金分期决定" value={editingRecord.cashInstallmentDecision} isSelect options={['D-拒绝', 'A-允许']} required />
                  <DetailItem label="按日计息消费决定" value={editingRecord.dailyInterestConsDecision} isSelect options={['D-拒绝', 'A-允许']} required />
                  <DetailItem label="免息消费决定" value={editingRecord.interestFreeConsDecision} isSelect options={['D-拒绝', 'A-允许']} required />
                  
                  <DetailItem label="消费转分期决定" value={editingRecord.consToInstallmentDecision} isSelect options={['D-拒绝', 'A-允许']} required />
                  <DetailItem label="账单转分期决定" value={editingRecord.billToInstallmentDecision} isSelect options={['D-拒绝', 'A-允许']} required />
                  <DetailItem label="POS分期决定" value={editingRecord.posInstallmentDecision} isSelect options={['D-拒绝', 'A-允许']} required />
                  
                  <DetailItem label="会员消费决定" value={editingRecord.memberConsDecision} isSelect options={['D-拒绝', 'A-允许']} />
                </div>
              </div>

              {/* 分期终止配置栏目 */}
              <div className="border border-slate-200 rounded shadow-sm">
                <div className="bg-slate-50 px-3 py-1.5 flex items-center justify-between border-b border-slate-200">
                   <div className="flex items-center gap-2">
                     <ICONS.ChevronDown size={12} className="text-slate-400" />
                     <span className="text-[12px] font-bold text-slate-700">分期终止配置</span>
                   </div>
                   <ICONS.ChevronDown size={12} className="text-slate-300 rotate-180" />
                </div>
                <div className="p-4 grid grid-cols-3 gap-x-12 gap-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[12px] min-w-[100px] text-right font-bold">账户当日是否进行提前结清:</span>
                    <input 
                      type="checkbox" 
                      checked={editingRecord.allowEarlySettlement} 
                      onChange={(e) => setEditingRecord({...editingRecord, allowEarlySettlement: e.target.checked})}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                  </div>
                  <DetailItem label="最小还款额计算方式" value={editingRecord.minPaymentCalcMethod} isSelect options={['N-正常还款', 'F-全额还款']} required />
                </div>
              </div>

              {/* 停息停费配置栏目 */}
              <div className="border border-slate-200 rounded shadow-sm">
                <div className="bg-slate-50 px-3 py-1.5 flex items-center justify-between border-b border-slate-200">
                   <div className="flex items-center gap-2">
                     <ICONS.ChevronDown size={12} className="text-slate-400" />
                     <span className="text-[12px] font-bold text-slate-700">停息停费配置</span>
                   </div>
                   <ICONS.ChevronDown size={12} className="text-slate-300 rotate-180" />
                </div>
                <div className="p-4 grid grid-cols-3 gap-x-12 gap-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[12px] min-w-[100px] text-right font-bold">进行日常利息累积:</span>
                    <input type="checkbox" checked={editingRecord.accrueDailyInterest} onChange={(e) => setEditingRecord({...editingRecord, accrueDailyInterest: e.target.checked})} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[12px] min-w-[100px] text-right font-bold">免除利息:</span>
                    <input type="checkbox" checked={editingRecord.waiveInterest} onChange={(e) => setEditingRecord({...editingRecord, waiveInterest: e.target.checked})} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[12px] min-w-[100px] text-right font-bold">免除超次提现手续费:</span>
                    <input type="checkbox" checked={editingRecord.waiveExcessCashFee} onChange={(e) => setEditingRecord({...editingRecord, waiveExcessCashFee: e.target.checked})} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[12px] min-w-[100px] text-right font-bold">免除服务费:</span>
                    <input type="checkbox" checked={editingRecord.waiveServiceFee} onChange={(e) => setEditingRecord({...editingRecord, waiveServiceFee: e.target.checked})} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[12px] min-w-[100px] text-right font-bold">免除其他费用(增值服务费):</span>
                    <input type="checkbox" checked={editingRecord.waiveOtherFees} onChange={(e) => setEditingRecord({...editingRecord, waiveOtherFees: e.target.checked})} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* 弹窗底部操作 */}
            <div className="px-6 py-2 bg-[#f0f2f5] border-t border-slate-300 flex items-center gap-3">
              <button onClick={handleUpdateLockCode} className="px-6 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-[#333] text-[12px] font-bold rounded flex items-center gap-2 shadow-sm transition-all active:scale-95">
                <ICONS.CheckCircle2 size={14} className="text-blue-600" /> 确认
              </button>
              <button onClick={() => setIsEditModalOpen(false)} className="px-6 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-[#333] text-[12px] font-bold rounded flex items-center gap-2 shadow-sm transition-all active:scale-95">
                <ICONS.Plus className="rotate-45 text-red-600" size={14} /> 取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// UI Helper Components
const DetailItem: React.FC<{ 
  label: string; 
  value: string; 
  placeholder?: string;
  isEdit?: boolean; 
  isSelect?: boolean; 
  isDate?: boolean;
  required?: boolean;
  options?: string[];
  onChange?: (val: string) => void;
}> = ({ label, value, placeholder, isEdit, isSelect, isDate, required, options, onChange }) => (
  <div className="flex items-center gap-2 group min-w-0">
    <span className="text-slate-500 min-w-[120px] text-right text-[12px] font-bold leading-tight">{label}:</span>
    <div className="flex-1 min-w-0 flex items-center gap-1">
      {isSelect ? (
        <div className="relative flex-1">
           <select 
             className="w-full bg-[#fcfcfd] border border-slate-300 rounded-sm px-2 py-0.5 text-[12px] font-medium outline-none focus:border-blue-400 focus:bg-white transition-all appearance-none pr-6 cursor-pointer text-slate-700 h-[24px]"
             value={value}
             onChange={(e) => onChange?.(e.target.value)}
           >
             {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
           </select>
           <ICONS.ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      ) : isEdit ? (
        <input 
          type="text" 
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-[#fcfcfd] border border-slate-300 rounded-sm px-2 py-0.5 text-[12px] font-medium outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-700 placeholder:text-slate-300 placeholder:font-normal h-[24px]"
        />
      ) : isDate ? (
        <div className="flex-1 flex items-center bg-[#fcfcfd] border border-slate-300 rounded-sm px-2 py-0.5 text-[12px] font-medium group h-[24px]">
           <input type="text" defaultValue={value} className="bg-transparent outline-none flex-1 text-slate-700" />
           <ICONS.Clock size={12} className="text-slate-400" />
        </div>
      ) : (
        <span className="text-slate-600 text-[12px] font-medium ml-2">{value}</span>
      )}
      {required && <span className="text-red-500 font-bold text-[14px] leading-none h-[14px] flex items-center">*</span>}
    </div>
  </div>
);

export default ProductCommonPage;
