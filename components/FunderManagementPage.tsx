
import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../constants';

interface FunderRule {
  id: string;
  productCode: string;
  productName: string;
  loanType: '联贷' | '助贷';
  selfInstName: string;
  selfEnhanceInstName: string;
  funderInstName: string;
  funderEnhanceInstName: string;
  status: 'Active' | 'Inactive';
  updateTime: string;
  // 放款还款计划策略
  isInterestOnLoanDay: string;
  repaymentDays: string;
  graceDays: string;
  principalStrategy: string;
  interestStrategy: string;
  premiumStrategy: string;
  // 逾期策略
  selfPenaltyEnabled: string;
  funderPenaltyEnabled: string;
  insurerPenaltyEnabled: string;
  selfPenaltyMultiplier: string;
  funderPenaltyMultiplier: string;
  insurerPenaltyMultiplier: string;
  selfPenaltyBase: string;
  funderPenaltyBase: string;
  insurerPenaltyBase: string;
  penaltyStrategy: string;
  defaultFeeStrategy: string;
  // 提前结清策略
  selfEarlyFeeEnabled: string;
  funderEarlyFeeEnabled: string;
  earlyFeeStrategy: string;
  // 理赔策略
  selfClaimDays: string;
  funderClaimDays: string;
}

const STRATEGY_OPTIONS = ['先自营后资方容差', '先资方后自营容差', '分开计算后汇总'];
const PENALTY_BASE_OPTIONS = ['逾期本金', '逾期本息', '剩余未还本金'];

const FunderManagementPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [rules, setRules] = useState<FunderRule[]>([
    {
      id: 'RULE-001',
      productCode: '001001',
      productName: '快贷-工薪精英贷',
      loanType: '联贷',
      selfInstName: '蚂蚁消费金融',
      selfEnhanceInstName: '太平洋保险-保证保险部',
      funderInstName: '中国工商银行-普惠金融部',
      funderEnhanceInstName: '中担集团-融资担保公司',
      status: 'Active',
      updateTime: '2024/05/20',
      isInterestOnLoanDay: '是',
      repaymentDays: '30',
      graceDays: '3',
      principalStrategy: '先自营后资方容差',
      interestStrategy: '分开计算后汇总',
      premiumStrategy: '分开计算后汇总',
      selfPenaltyEnabled: '是',
      funderPenaltyEnabled: '是',
      insurerPenaltyEnabled: '是',
      selfPenaltyMultiplier: '1.5',
      funderPenaltyMultiplier: '1.5',
      insurerPenaltyMultiplier: '1.0',
      selfPenaltyBase: '逾期本金',
      funderPenaltyBase: '逾期本金',
      insurerPenaltyBase: '逾期本金',
      penaltyStrategy: '分开计算后汇总',
      defaultFeeStrategy: '分开计算后汇总',
      selfEarlyFeeEnabled: '是',
      funderEarlyFeeEnabled: '否',
      earlyFeeStrategy: '先自营后资方容差',
      selfClaimDays: '80',
      funderClaimDays: '80'
    },
    {
      id: 'RULE-002',
      productCode: '002005',
      productName: '助力-小微经营抵押贷Pro',
      loanType: '助贷',
      selfInstName: '',
      selfEnhanceInstName: '',
      funderInstName: '江苏银行-小微金融中心',
      funderEnhanceInstName: '差额补足方-某资产管理公司',
      status: 'Active',
      updateTime: '2024/05/22',
      isInterestOnLoanDay: '是',
      repaymentDays: '30',
      graceDays: '3',
      principalStrategy: '先资方后自营容差',
      interestStrategy: '分开计算后汇总',
      premiumStrategy: '分开计算后汇总',
      selfPenaltyEnabled: '否',
      funderPenaltyEnabled: '是',
      insurerPenaltyEnabled: '否',
      selfPenaltyMultiplier: '0',
      funderPenaltyMultiplier: '1.5',
      insurerPenaltyMultiplier: '0',
      selfPenaltyBase: '逾期本金',
      funderPenaltyBase: '逾期本金',
      insurerPenaltyBase: '逾期本金',
      penaltyStrategy: '分开计算后汇总',
      defaultFeeStrategy: '分开计算后汇总',
      selfEarlyFeeEnabled: '否',
      funderEarlyFeeEnabled: '是',
      earlyFeeStrategy: '先资方后自营容差',
      selfClaimDays: '0',
      funderClaimDays: '90'
    },
    {
      id: 'RULE-003',
      productCode: '003008',
      productName: '极速秒放-S',
      loanType: '联贷',
      selfInstName: '蚂蚁消费金融',
      selfEnhanceInstName: '太平洋保险-保证保险部',
      funderInstName: '南京银行-零售部',
      funderEnhanceInstName: '无',
      status: 'Active',
      updateTime: '2024/05/23',
      isInterestOnLoanDay: '否',
      repaymentDays: '28',
      graceDays: '1',
      principalStrategy: '先自营后资方容差',
      interestStrategy: '先自营后资方容差',
      premiumStrategy: '分开计算后汇总',
      selfPenaltyEnabled: '是',
      funderPenaltyEnabled: '是',
      insurerPenaltyEnabled: '是',
      selfPenaltyMultiplier: '1.2',
      funderPenaltyMultiplier: '1.2',
      insurerPenaltyMultiplier: '1.0',
      selfPenaltyBase: '逾期本息',
      funderPenaltyBase: '逾期本息',
      insurerPenaltyBase: '逾期本金',
      penaltyStrategy: '分开计算后汇总',
      defaultFeeStrategy: '分开计算后汇总',
      selfEarlyFeeEnabled: '是',
      funderEarlyFeeEnabled: '是',
      earlyFeeStrategy: '分开计算后汇总',
      selfClaimDays: '60',
      funderClaimDays: '60'
    },
    {
      id: 'RULE-004',
      productCode: '001001',
      productName: '快贷-工薪精英贷',
      loanType: '助贷',
      selfInstName: '',
      selfEnhanceInstName: '',
      funderInstName: '中信信托-信托计划A',
      funderEnhanceInstName: '省再担保集团',
      status: 'Inactive',
      updateTime: '2024/05/24',
      isInterestOnLoanDay: '是',
      repaymentDays: '30',
      graceDays: '5',
      principalStrategy: '先资方后自营容差',
      interestStrategy: '分开计算后汇总',
      premiumStrategy: '分开计算后汇总',
      selfPenaltyEnabled: '否',
      funderPenaltyEnabled: '是',
      insurerPenaltyEnabled: '是',
      selfPenaltyMultiplier: '0',
      funderPenaltyMultiplier: '1.8',
      insurerPenaltyMultiplier: '1.2',
      selfPenaltyBase: '逾期本金',
      funderPenaltyBase: '逾期本金',
      insurerPenaltyBase: '逾期本金',
      penaltyStrategy: '分开计算后汇总',
      defaultFeeStrategy: '分开计算后汇总',
      selfEarlyFeeEnabled: '否',
      funderEarlyFeeEnabled: '否',
      earlyFeeStrategy: '分开计算后汇总',
      selfClaimDays: '0',
      funderClaimDays: '120'
    }
  ]);

  const [currentRule, setCurrentRule] = useState<FunderRule | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const productOptions = [
    { code: '001001', name: '快贷-工薪精英贷' },
    { code: '002005', name: '助力-小微经营抵押贷Pro' },
    { code: '003008', name: '极速秒放-S' },
  ];

  const handleOpenDetail = (rule?: FunderRule) => {
    if (rule) {
      setCurrentRule({ ...rule });
    } else {
      setCurrentRule({
        id: '',
        productCode: '',
        productName: '',
        loanType: '联贷',
        selfInstName: '蚂蚁消费金融',
        selfEnhanceInstName: '无',
        funderInstName: '',
        funderEnhanceInstName: '无',
        status: 'Active',
        updateTime: '',
        isInterestOnLoanDay: '是',
        repaymentDays: '30',
        graceDays: '3',
        principalStrategy: '先自营后资方容差',
        interestStrategy: '分开计算后汇总',
        premiumStrategy: '分开计算后汇总',
        selfPenaltyEnabled: '是',
        funderPenaltyEnabled: '是',
        insurerPenaltyEnabled: '是',
        selfPenaltyMultiplier: '1.5',
        funderPenaltyMultiplier: '1.5',
        insurerPenaltyMultiplier: '1.0',
        selfPenaltyBase: '逾期本金',
        funderPenaltyBase: '逾期本金',
        insurerPenaltyBase: '逾期本金',
        penaltyStrategy: '分开计算后汇总',
        defaultFeeStrategy: '分开计算后汇总',
        selfEarlyFeeEnabled: '是',
        funderEarlyFeeEnabled: '是',
        earlyFeeStrategy: '分开计算后汇总',
        selfClaimDays: '80',
        funderClaimDays: '80'
      });
    }
    setViewMode('detail');
  };

  const handleSaveDetail = () => {
    if (!currentRule || !currentRule.productCode) return;
    const product = productOptions.find(p => p.code === currentRule.productCode);
    const updatedRule = {
      ...currentRule,
      productName: product?.name || '',
      updateTime: new Date().toLocaleDateString(),
      selfInstName: currentRule.loanType === '助贷' ? '' : currentRule.selfInstName,
      selfEnhanceInstName: currentRule.loanType === '助贷' ? '' : currentRule.selfEnhanceInstName,
    };

    if (currentRule.id) {
      setRules(rules.map(r => r.id === currentRule.id ? updatedRule : r));
    } else {
      setRules([{ ...updatedRule, id: `RULE-${Math.random().toString(36).substr(2, 4).toUpperCase()}` }, ...rules]);
    }
    setViewMode('list');
  };

  const handleCopy = (rule: FunderRule) => {
    const newRule = {
      ...rule,
      id: `RULE-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      updateTime: new Date().toLocaleDateString()
    };
    setRules([newRule, ...rules]);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定删除该路由关系吗？')) {
      setRules(rules.filter(r => r.id !== id));
    }
  };

  // 列表渲染
  const renderList = () => (
    <div className="p-8 space-y-6 bg-slate-50/50 min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">资方管理</h2>
          <p className="text-sm text-slate-500 mt-1">维护产品、机构与资产路由的全局规则映射关系矩阵</p>
        </div>
        <button 
          onClick={() => handleOpenDetail()}
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <ICONS.Plus size={18} /> 新增路由关系
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[1500px]">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4 w-[340px]">产品标识</th>
                <th className="px-6 py-4 w-[240px]">自营机构</th>
                <th className="px-6 py-4 w-[240px]">自营增信机构</th>
                <th className="px-4 py-4 w-[60px] text-center">路由</th>
                <th className="px-6 py-4 w-[240px]">资方机构</th>
                <th className="px-6 py-4 w-[240px]">资方增信机构</th>
                <th className="px-6 py-4 w-[120px] text-center">状态</th>
                <th className="px-6 py-4 w-[180px] text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rules.map((rule) => (
                <tr 
                  key={rule.id} 
                  onDoubleClick={() => handleOpenDetail(rule)}
                  className="group hover:bg-blue-50/10 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-slate-800">{rule.productName}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          rule.loanType === '联贷' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {rule.loanType}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-blue-600 uppercase">{rule.productCode}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[12px] font-bold text-slate-700">{rule.selfInstName || '-'}</td>
                  <td className="px-6 py-5 text-[12px] font-bold text-slate-700">{rule.selfEnhanceInstName || '-'}</td>
                  <td className="px-4 py-5 text-center"><ICONS.ChevronRight size={14} className="text-slate-300 mx-auto" /></td>
                  <td className="px-6 py-5 text-[12px] font-bold text-slate-700">{rule.funderInstName}</td>
                  <td className="px-6 py-5 text-[12px] font-bold text-slate-700">{rule.funderEnhanceInstName}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      rule.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${rule.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      {rule.status === 'Active' ? '运行中' : '暂停'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); handleOpenDetail(rule); }} className="text-blue-600 font-bold text-xs">编辑</button>
                      <button onClick={(e) => { e.stopPropagation(); handleCopy(rule); }} className="text-indigo-600 font-bold text-xs">复制</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(rule.id); }} className="text-red-500 font-bold text-xs">删除</button>
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

  // 详情页渲染
  const renderDetail = () => {
    if (!currentRule) return null;
    const isAssisted = currentRule.loanType === '助贷';

    return (
      <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
        {/* 顶部工具栏 */}
        <div className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setViewMode('list')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ICONS.ChevronRight className="rotate-180 text-slate-400" size={20} />
            </button>
            <div>
              <h3 className="text-base font-bold text-slate-900">路由映射配置详情</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Asset Routing Pipeline Configuration</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setViewMode('list')} className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all">取消</button>
            <button onClick={handleSaveDetail} className="px-8 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-lg transition-all active:scale-95">保存配置变更</button>
          </div>
        </div>

        {/* 主体表单区 */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* 1. 基础配置模块 */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                  <ICONS.Layers size={18} />
                </div>
                <h4 className="text-sm font-bold text-slate-900">1. 基础关系配置</h4>
              </div>
              <div className="p-8 grid grid-cols-3 gap-x-10 gap-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">关联产品选择 <span className="text-red-500">*</span></label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all"
                    value={currentRule.productCode}
                    onChange={(e) => setCurrentRule({ ...currentRule, productCode: e.target.value })}
                  >
                    <option value="">请选择产品</option>
                    {productOptions.map(p => <option key={p.code} value={p.code}>{p.code} - {p.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">业务模式</label>
                  <div className="flex bg-slate-100 p-1 rounded-2xl h-[42px]">
                    {['联贷', '助贷'].map(type => (
                      <button 
                        key={type}
                        onClick={() => setCurrentRule({ ...currentRule, loanType: type as any })}
                        className={`flex-1 text-xs font-bold rounded-xl transition-all ${currentRule.loanType === type ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">运行状态</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all"
                    value={currentRule.status}
                    onChange={(e) => setCurrentRule({ ...currentRule, status: e.target.value as any })}
                  >
                    <option value="Active">Active-运行中</option>
                    <option value="Inactive">Inactive-暂停</option>
                  </select>
                </div>
                <div className={`space-y-2 ${isAssisted ? 'opacity-40 grayscale' : ''}`}>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">自营机构</label>
                  <input 
                    type="text" 
                    disabled={isAssisted}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600"
                    value={isAssisted ? '-' : currentRule.selfInstName}
                    onChange={(e) => setCurrentRule({ ...currentRule, selfInstName: e.target.value })}
                  />
                </div>
                <div className={`space-y-2 ${isAssisted ? 'opacity-40 grayscale' : ''}`}>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">自营增信机构</label>
                  <input 
                    type="text" 
                    disabled={isAssisted}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600"
                    value={isAssisted ? '-' : currentRule.selfEnhanceInstName}
                    onChange={(e) => setCurrentRule({ ...currentRule, selfEnhanceInstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">资方主体机构 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600"
                    value={currentRule.funderInstName}
                    onChange={(e) => setCurrentRule({ ...currentRule, funderInstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">资方增信机构</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600"
                    value={currentRule.funderEnhanceInstName}
                    onChange={(e) => setCurrentRule({ ...currentRule, funderEnhanceInstName: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 2. 放款还款计划策略 */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                  <ICONS.Activity size={18} />
                </div>
                <h4 className="text-sm font-bold text-slate-900">2. 放款还款计划策略</h4>
              </div>
              <div className="p-8 grid grid-cols-3 gap-x-10 gap-y-6">
                <DetailSelect label="放款当日是否计息" value={currentRule.isInterestOnLoanDay} options={['是', '否']} onChange={(v) => setCurrentRule({...currentRule, isInterestOnLoanDay: v})} />
                <DetailInput label="还款日天数" value={currentRule.repaymentDays} suffix="天" onChange={(v) => setCurrentRule({...currentRule, repaymentDays: v})} />
                <DetailInput label="宽限日天数" value={currentRule.graceDays} suffix="天" onChange={(v) => setCurrentRule({...currentRule, graceDays: v})} />
                <DetailSelect label="本金策略" value={currentRule.principalStrategy} options={['先自营后资方容差', '先资方后自营容差']} onChange={(v) => setCurrentRule({...currentRule, principalStrategy: v})} />
                <DetailSelect label="利息策略" value={currentRule.interestStrategy} options={STRATEGY_OPTIONS} onChange={(v) => setCurrentRule({...currentRule, interestStrategy: v})} />
                <DetailSelect label="保费策略" value={currentRule.premiumStrategy} options={STRATEGY_OPTIONS} onChange={(v) => setCurrentRule({...currentRule, premiumStrategy: v})} />
              </div>
            </div>

            {/* 3. 逾期策略 */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-100">
                  <ICONS.AlertCircle size={18} />
                </div>
                <h4 className="text-sm font-bold text-slate-900">3. 逾期策略</h4>
              </div>
              <div className="p-8 space-y-8">
                {/* 矩阵配置 */}
                <div className="grid grid-cols-3 gap-10">
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center border-b pb-2">自营侧配置</h5>
                    <DetailSelect label="是否收取罚息" value={currentRule.selfPenaltyEnabled} options={['是', '否']} onChange={(v) => setCurrentRule({...currentRule, selfPenaltyEnabled: v})} />
                    <DetailInput label="罚息上浮倍数" value={currentRule.selfPenaltyMultiplier} onChange={(v) => setCurrentRule({...currentRule, selfPenaltyMultiplier: v})} />
                    <DetailSelect label="罚息计算基数" value={currentRule.selfPenaltyBase} options={PENALTY_BASE_OPTIONS} onChange={(v) => setCurrentRule({...currentRule, selfPenaltyBase: v})} />
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center border-b pb-2">资方侧配置</h5>
                    <DetailSelect label="是否收取罚息" value={currentRule.funderPenaltyEnabled} options={['是', '否']} onChange={(v) => setCurrentRule({...currentRule, funderPenaltyEnabled: v})} />
                    <DetailInput label="罚息上浮倍数" value={currentRule.funderPenaltyMultiplier} onChange={(v) => setCurrentRule({...currentRule, funderPenaltyMultiplier: v})} />
                    <DetailSelect label="罚息计算基数" value={currentRule.funderPenaltyBase} options={PENALTY_BASE_OPTIONS} onChange={(v) => setCurrentRule({...currentRule, funderPenaltyBase: v})} />
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center border-b pb-2">保方侧配置</h5>
                    <DetailSelect label="是否收取违约金" value={currentRule.insurerPenaltyEnabled} options={['是', '否']} onChange={(v) => setCurrentRule({...currentRule, insurerPenaltyEnabled: v})} />
                    <DetailInput label="违约金上浮倍数" value={currentRule.insurerPenaltyMultiplier} onChange={(v) => setCurrentRule({...currentRule, insurerPenaltyMultiplier: v})} />
                    <DetailSelect label="违约金计算基数" value={currentRule.insurerPenaltyBase} options={PENALTY_BASE_OPTIONS} onChange={(v) => setCurrentRule({...currentRule, insurerPenaltyBase: v})} />
                  </div>
                </div>
                <div className="h-px bg-slate-100"></div>
                <div className="grid grid-cols-2 gap-10">
                  <DetailSelect label="罚息策略" value={currentRule.penaltyStrategy} options={STRATEGY_OPTIONS} onChange={(v) => setCurrentRule({...currentRule, penaltyStrategy: v})} />
                  <DetailSelect label="违约金策略" value={currentRule.defaultFeeStrategy} options={STRATEGY_OPTIONS} onChange={(v) => setCurrentRule({...currentRule, defaultFeeStrategy: v})} />
                </div>
              </div>
            </div>

            {/* 4. 提前结清策略 */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                  <ICONS.CreditCard size={18} />
                </div>
                <h4 className="text-sm font-bold text-slate-900">4. 提前结清策略</h4>
              </div>
              <div className="p-8 grid grid-cols-3 gap-x-10 gap-y-6">
                <DetailSelect label="自营是否收取手续费" value={currentRule.selfEarlyFeeEnabled} options={['是', '否']} onChange={(v) => setCurrentRule({...currentRule, selfEarlyFeeEnabled: v})} />
                <DetailSelect label="资方是否收取手续费" value={currentRule.funderEarlyFeeEnabled} options={['是', '否']} onChange={(v) => setCurrentRule({...currentRule, funderEarlyFeeEnabled: v})} />
                <DetailSelect label="手续费策略" value={currentRule.earlyFeeStrategy} options={STRATEGY_OPTIONS} onChange={(v) => setCurrentRule({...currentRule, earlyFeeStrategy: v})} />
              </div>
            </div>

            {/* 5. 理赔策略 */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-white shadow-lg shadow-slate-200">
                  <ICONS.ShieldCheck size={18} />
                </div>
                <h4 className="text-sm font-bold text-slate-900">5. 理赔策略</h4>
              </div>
              <div className="p-8 grid grid-cols-2 gap-x-10 gap-y-6">
                <DetailInput label="自营增信理赔天数" value={currentRule.selfClaimDays} suffix="天" onChange={(v) => setCurrentRule({...currentRule, selfClaimDays: v})} />
                <DetailInput label="资方增信理赔天数" value={currentRule.funderClaimDays} suffix="天" onChange={(v) => setCurrentRule({...currentRule, funderClaimDays: v})} />
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  return viewMode === 'list' ? renderList() : renderDetail();
};

// 辅助组件
const DetailSelect: React.FC<{ label: string; value: string; options: string[]; onChange: (v: string) => void }> = ({ label, value, options, onChange }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    <div className="relative group">
      <select 
        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 transition-all cursor-pointer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ICONS.ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={14} />
    </div>
  </div>
);

const DetailInput: React.FC<{ label: string; value: string; suffix?: string; onChange: (v: string) => void }> = ({ label, value, suffix, onChange }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <input 
        type="text" 
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{suffix}</span>}
    </div>
  </div>
);

export default FunderManagementPage;
