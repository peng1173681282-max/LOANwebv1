
import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { ProductModuleId } from '../types';

interface ProductEditFormProps {
  onBack: () => void;
  productName?: string;
}

const ProductEditForm: React.FC<ProductEditFormProps> = ({ onBack, productName = "新产品配置" }) => {
  const [activeModule, setActiveModule] = useState<ProductModuleId>('basic');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // States for Basic Module
  const [deductionRule, setDeductionRule] = useState('通用还款抵扣规则');
  const [allocationRule, setAllocationRule] = useState('通用还款分配规则');

  // States for Limit Module
  const [limitType, setLimitType] = useState('循环');
  const [supportTempLimit, setSupportTempLimit] = useState('否');
  const [supportFixedAdj, setSupportFixedAdj] = useState('否');

  // States for Account Module
  const [billingCycle, setBillingCycle] = useState('月');
  const [billingLogic, setBillingLogic] = useState('开户日对日 (29/30/31跳1/2/3)');
  const [showAdvancedAccount, setShowAdvancedAccount] = useState(false);

  // States for Fee Module
  const [collectPenalty, setCollectPenalty] = useState('是');
  const [penaltyAccountingPosition, setPenaltyAccountingPosition] = useState('逾期期次');
  const [allowEarlySettlement, setAllowEarlySettlement] = useState('是');
  const [feeRule, setFeeRule] = useState('按比例收取');
  const [interestRule, setInterestRule] = useState('按日收取');

  // States for Repayment Module
  const [repaymentOptions, setRepaymentOptions] = useState({
    offline: '否',
    quick: '是',
    single: '是',
    batch: '是',
    agent: '否',
    overBatch: '否',
    overDeduct: '是',
    overOthers: '否'
  });

  const handleRepaymentChange = (key: keyof typeof repaymentOptions, value: string) => {
    setRepaymentOptions(prev => ({ ...prev, [key]: value }));
  };

  // States for Post-loan Module
  const [postLoanOptions, setPostLoanOptions] = useState({
    restructuring: '否',
    extension: '否',
    refinance: '否',
    billInstallment: '否',
    consInstallment: '否'
  });

  const handlePostLoanChange = (key: keyof typeof postLoanOptions, value: string) => {
    setPostLoanOptions(prev => ({ ...prev, [key]: value }));
  };

  // States for Closing Module
  const [closingOptions, setClosingOptions] = useState({
    autoCloseOnFailure: '否',
    autoCloseOnSettlement: '否',
    autoCloseOnExpiry: '否'
  });

  const handleClosingChange = (key: keyof typeof closingOptions, value: string) => {
    setClosingOptions(prev => ({ ...prev, [key]: value }));
  };

  const modules: { id: ProductModuleId; label: string; icon: React.ReactNode }[] = [
    { id: 'basic', label: '基础信息配置', icon: <ICONS.FileText size={16} /> },
    { id: 'limit', label: '额度信息配置', icon: <ICONS.BarChart3 size={16} /> },
    { id: 'rate', label: '利率管理配置', icon: <ICONS.TrendingUp size={16} /> },
    { id: 'account', label: '账户管理配置', icon: <ICONS.Database size={16} /> },
    { id: 'transaction', label: '交易规则配置', icon: <ICONS.Zap size={16} /> },
    { id: 'fee', label: '息费规则配置', icon: <ICONS.CreditCard size={16} /> },
    { id: 'repayment', label: '还款规则配置', icon: <ICONS.Activity size={16} /> },
    { id: 'postloan', label: '贷后管理配置', icon: <ICONS.ShieldCheck size={16} /> },
    { id: 'closing', label: '关户规则配置', icon: <ICONS.Lock size={16} /> },
  ];

  const renderFormContent = () => {
    switch (activeModule) {
      case 'basic':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <section>
              <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-700 rounded-full"></div>
                产品标识与核心属性
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <FormField label="产品编码" required placeholder="例如：001001" defaultValue="001002" />
                <FormField label="产品名称" required placeholder="输入产品全称" defaultValue={productName} />
                <FormSelect label="结算币种" required options={['CNY - 人民币', 'USD - 美元', 'HKD - 港币']} />
                <FormSelect label="账务规则" required options={['以合作为准', '以我司为准']} />
                <FormSelect label="品牌类型" options={['渠道合作产品', '借呗品牌', '花呗品牌']} />
                
                {/* 新增抵扣规则与还款分配规则 */}
                <FormSelect 
                  label="抵扣规则" 
                  required 
                  options={['通用还款抵扣规则', '精英贷专项抵扣规则', '小微经营贷抵扣规则']} 
                  value={deductionRule}
                  onChange={(e) => setDeductionRule(e.target.value)}
                />
                <FormSelect 
                  label="还款分配规则" 
                  required 
                  options={['通用还款分配规则', '精英贷特定分配规则', '小微经营贷保全规则']} 
                  value={allocationRule}
                  onChange={(e) => setAllocationRule(e.target.value)}
                />

                <div className="md:col-span-2">
                  <FormTextArea label="产品描述" placeholder="请输入产品业务背景与详细定义..." />
                </div>
              </div>
            </section>
          </div>
        );
      case 'limit':
        return (
          <div className="space-y-10 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-700 rounded-full"></div>
                额度信息配置
              </h3>
              <button 
                onClick={() => setIsAIModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all border border-blue-200"
              >
                <ICONS.Zap size={14} /> AI 智能建议
              </button>
            </div>

            <section className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/40 p-6 rounded-2xl border border-slate-100">
                <FormField 
                  label="额度期限 (月)" 
                  required 
                  placeholder="请输入月数，例如：12、24" 
                  type="number" 
                  defaultValue="12" 
                />
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      额度类型 <span className="text-red-500">*</span>
                    </label>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${limitType === '循环' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      {limitType === '循环' ? '循环额度' : '非循环额度'}
                    </span>
                  </div>
                  <FormSelectRaw 
                    value={limitType} 
                    onChange={setLimitType} 
                    options={['循环', '非循环']} 
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    {limitType === '循环' ? '客户在有效期内可多次借还' : '一次性授信，还清后不可再借'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormSelect 
                    label="是否支持临时额度" 
                    required 
                    value={supportTempLimit}
                    onChange={(e) => setSupportTempLimit(e.target.value)}
                    options={['是', '否']} 
                  />
                  {supportTempLimit === '是' && (
                    <div className="pl-4 border-l-2 border-blue-200 space-y-4 animate-in slide-in-from-left-2 duration-200">
                      <FormField label="临时额度有效期 (天)" type="number" defaultValue="30" />
                      <FormField label="临时额度比例 (%)" type="number" defaultValue="20" placeholder="固定额度的百分比" />
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <FormSelect 
                    label="是否支持调整固定额度" 
                    required 
                    value={supportFixedAdj}
                    onChange={(e) => setSupportFixedAdj(e.target.value)}
                    options={['是', '否']} 
                  />
                  {supportFixedAdj === '是' && (
                    <div className="pl-4 border-l-2 border-indigo-200 space-y-4 animate-in slide-in-from-left-2 duration-200">
                      <FormField label="调整周期 (月)" type="number" defaultValue="6" />
                      <FormField label="调整幅度限制 (%)" type="number" defaultValue="30" />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <CurrencyField label="最小授信额度 (元)" placeholder="1000" defaultValue="1000" />
                <CurrencyField label="最大授信额度 (元)" placeholder="50000" defaultValue="50000" />
              </div>
            </section>

            <div className="bg-yellow-50/80 border border-yellow-200 rounded-2xl p-6 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 flex-shrink-0">
                <ICONS.AlertCircle size={24} />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-yellow-800">额度信息配置说明</h4>
                <ul className="text-xs text-yellow-700/80 space-y-1 list-disc pl-4 leading-relaxed">
                  <li>额度期限指从授信成功之日起，额度可使用的有效期。</li>
                  <li>循环额度支持客户在还款后额度恢复，可再次借款。</li>
                  <li>临时额度通常有使用期限，过期自动失效。</li>
                  <li>固定额度调整需客户主动申请或系统自动审批。</li>
                  <li>最小/最大授信额度应匹配目标客群的还款能力。</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 'rate':
        return (
          <div className="space-y-10 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-700 rounded-full"></div>
              利率管理配置
            </h3>

            <section className="space-y-8">
              <div className="col-span-full">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-2">
                  利率上下限区间 (%) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-0">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">[</span>
                    <input 
                      type="number" 
                      placeholder="下限"
                      className="w-full bg-slate-50 border border-slate-200 rounded-l-xl pl-6 pr-4 py-3 text-sm font-mono font-bold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100/50 outline-none transition-all"
                      defaultValue="4.80"
                    />
                  </div>
                  <div className="px-4 py-3 bg-slate-100 border-y border-slate-200 text-xs font-bold text-slate-400">至</div>
                  <div className="relative flex-1">
                    <input 
                      type="number" 
                      placeholder="上限"
                      className="w-full bg-slate-50 border border-slate-200 rounded-r-xl pl-4 pr-6 py-3 text-sm font-mono font-bold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100/50 outline-none transition-all"
                      defaultValue="18.25"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">]</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2">注：区间包含上下限数值，通常根据客群风险等级由系统自动推荐利率。</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    监管实收息费上限 (%) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center group">
                    <span className="absolute left-3 text-slate-300 font-bold group-focus-within:text-blue-500 transition-colors text-lg">(</span>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-7 py-2.5 text-sm font-mono font-bold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100/50 outline-none transition-all text-center"
                      defaultValue="24.00"
                    />
                    <span className="absolute right-3 text-slate-300 font-bold group-focus-within:text-blue-500 transition-colors text-lg">)</span>
                  </div>
                </div>

                <FormSelect label="减免方式" required options={['实时减免', '结清减免']} />
                <FormSelect label="日利率计算基础" required options={['360天', '365天']} />
              </div>

              <div className="col-span-full space-y-2">
                <label className="text-xs font-bold text-slate-700">利息计算基础 (备注)</label>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 leading-relaxed italic">
                  说明：本产品利率采用固定利率模式，按日计息，到期一次性还本付息或按月付息到期还本。日利率 = 年利率 / 日利率计算基础。
                </div>
              </div>
            </section>
          </div>
        );
      case 'account':
        return (
          <div className="space-y-10 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-700 rounded-full"></div>
              账户管理配置
            </h3>

            <section className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                   <div className="flex items-center justify-between">
                     <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                       账单周期 <span className="text-red-500">*</span>
                     </label>
                     <div className="flex items-center gap-1 text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                        {billingCycle === '月' ? <ICONS.PieChart size={10} /> : <ICONS.Globe size={10} />}
                        {billingCycle}
                     </div>
                   </div>
                   <FormSelectRaw value={billingCycle} onChange={setBillingCycle} options={['月', '星期']} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    账单日逻辑 <span className="text-red-500">*</span>
                  </label>
                  <FormSelectRaw 
                    value={billingLogic}
                    onChange={setBillingLogic}
                    options={[
                        '开户日对日 (29/30/31跳1/2/3)',
                        '固定账单日',
                        '首次贷款更新账单日 (29/30/31跳1/2/3)'
                    ]}
                  />
                </div>

                <FormField label="还款日天数" required type="number" defaultValue="10" placeholder="账单日后多少天还款" />
                <FormField label="宽限日天数" required type="number" defaultValue="3" placeholder="还款日后宽限天数" />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 flex gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 flex-shrink-0">
                   <ICONS.AlertCircle size={22} />
                </div>
                <div className="space-y-2">
                   <h4 className="text-sm font-bold text-yellow-800 flex items-center gap-2">
                      账单逻辑说明
                      <span className="text-[10px] bg-yellow-200 text-yellow-900 px-1.5 py-0.5 rounded uppercase">Important</span>
                   </h4>
                   <div className="text-xs text-yellow-800/70 space-y-2 leading-relaxed">
                      <p>1. 周期逻辑会自动处理大小月差异，29、30、31日开户将顺延至下月1、2、3日作为固定还款逻辑。</p>
                      <p>2. 还款日 = 账单日 + 还款日天数；逾期计算起始于宽限日次日。</p>
                   </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                 <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                       <ICONS.Activity size={12} /> 时间线预览示例
                    </h4>
                    <span className="text-[10px] text-slate-400">基于 4月15日 开户</span>
                 </div>
                 <div className="relative pt-8 pb-4 px-2">
                    <div className="absolute top-10 left-0 right-0 h-0.5 bg-slate-200"></div>
                    <div className="flex justify-between relative">
                       <TimelinePoint label="开户" date="04-15" color="bg-slate-400" />
                       <TimelinePoint label="账单日" date="05-15" color="bg-blue-600" />
                       <TimelinePoint label="还款日" date="05-25" color="bg-indigo-600" />
                       <TimelinePoint label="逾期起始" date="05-29" color="bg-red-500" />
                    </div>
                 </div>
              </div>

              <div className="pt-4">
                  <button 
                    onClick={() => setShowAdvancedAccount(!showAdvancedAccount)}
                    className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1 group"
                  >
                    <ICONS.ChevronRight className={`transition-transform ${showAdvancedAccount ? 'rotate-90' : ''}`} size={14} />
                    {showAdvancedAccount ? '收起高级配置' : '展开高级配置 (账单日调整、节假日顺延)'}
                  </button>
                  
                  {showAdvancedAccount && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 animate-in slide-in-from-top-4 duration-300">
                        <FormSwitchInGrid label="是否允许手动调整账单日" defaultEnabled={false} />
                        <FormSwitchInGrid label="还款日遇节假日顺延" defaultEnabled={true} />
                        <FormSelect label="顺延规则" options={['顺延至下一工作日', '提前至上一工作日']} />
                        <FormSelect label="顺延国家/地区" options={['中国大陆', '香港', '全球通用']} />
                    </div>
                  )}
              </div>
            </section>
          </div>
        );
      case 'fee':
        return (
          <div className="space-y-12 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-700 rounded-full"></div>
              息费规则配置
            </h3>

            {/* Section 1: Penalty Interest Configuration */}
            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <h4 className="text-sm font-bold text-slate-800">罚息配置</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <FormSelect 
                  label="是否收取罚息" 
                  required 
                  value={collectPenalty}
                  onChange={(e) => setCollectPenalty(e.target.value)}
                  options={['是', '否']} 
                />
                <FormSelect 
                  label="罚息计算基数" 
                  required 
                  options={['逾期本金', '剩余未还本金']} 
                  disabled={collectPenalty === '否'}
                />
                <FormField 
                  label="罚息上浮倍数" 
                  required 
                  placeholder="如：1.5" 
                  type="number" 
                  defaultValue="1.5"
                  disabled={collectPenalty === '否'}
                />
                <FormSelect 
                  label="罚息记账位置" 
                  required 
                  value={penaltyAccountingPosition}
                  onChange={(e) => setPenaltyAccountingPosition(e.target.value)}
                  options={['逾期期次', '最新期次']} 
                  disabled={collectPenalty === '否'}
                />
              </div>
            </section>

            {/* Section 2: Early Settlement Rules */}
            <section className="space-y-0 rounded-2xl border border-blue-100 overflow-hidden shadow-sm">
              <div className="bg-blue-50 px-6 py-4 flex items-center gap-3 border-b border-blue-100">
                <ICONS.ShieldCheck size={20} className="text-blue-700" />
                <h4 className="text-base font-bold text-blue-900">提前结清规则</h4>
              </div>
              <div className="p-8 bg-white space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <FormSelect 
                    label="是否允许提前结清" 
                    required 
                    value={allowEarlySettlement}
                    onChange={(e) => setAllowEarlySettlement(e.target.value)}
                    options={['是', '否']} 
                  />
                  <FormField 
                    label="最早支持提前结清的期次" 
                    required 
                    type="number" 
                    defaultValue="1" 
                    disabled={allowEarlySettlement === '否'}
                  />

                  <div className="h-px bg-slate-100 col-span-full my-2"></div>

                  <FormSelect 
                    label="提前结清手续费收取规则" 
                    required 
                    value={feeRule}
                    onChange={(e) => setFeeRule(e.target.value)}
                    options={['不收取', '按比例收取']} 
                    disabled={allowEarlySettlement === '否'}
                  />
                  <FormSelect 
                    label="提前结清手续费基数" 
                    options={['剩余未还本金', '未出账本金']} 
                    disabled={allowEarlySettlement === '否' || feeRule === '不收取'}
                  />

                  <FormField 
                    label="提前结清手续费比例 (%)" 
                    type="number" 
                    defaultValue="0.50" 
                    disabled={allowEarlySettlement === '否' || feeRule === '不收取'}
                  />
                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${allowEarlySettlement === '否' || feeRule === '不收取' ? 'text-slate-400' : 'text-slate-700'}`}>提前结清手续费金额区间</label>
                    <div className="flex items-center gap-2">
                       <input 
                        type="number" 
                        placeholder="最小"
                        disabled={allowEarlySettlement === '否' || feeRule === '不收取'}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm disabled:opacity-50 outline-none focus:bg-white focus:border-blue-600"
                        defaultValue="200"
                       />
                       <span className="text-slate-400">-</span>
                       <input 
                        type="number" 
                        placeholder="最大"
                        disabled={allowEarlySettlement === '否' || feeRule === '不收取'}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm disabled:opacity-50 outline-none focus:bg-white focus:border-blue-600"
                        defaultValue="1000"
                       />
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 col-span-full my-2"></div>

                  <FormSelect 
                    label="提前结清利息收取规则" 
                    required 
                    value={interestRule}
                    onChange={(e) => setInterestRule(e.target.value)}
                    options={['不收取', '按日收取', '收取整期', '收取所有贷款利息']} 
                    disabled={allowEarlySettlement === '否'}
                  />
                  <FormSelect 
                    label="提前结清利息基数" 
                    options={['剩余未还本金', '未出账本金']} 
                    disabled={allowEarlySettlement === '否' || interestRule === '不收取'}
                  />
                </div>
              </div>
            </section>

            {/* Fee Preview Panel */}
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-6 flex gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                   <ICONS.PieChart size={22} />
                </div>
                <div className="space-y-3 flex-1">
                   <h4 className="text-sm font-bold text-emerald-900">提前结清费用预览</h4>
                   <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <p className="text-slate-500">模拟借款本金：100,000 元</p>
                        <p className="text-slate-500">已还期数：3期</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-slate-500">剩余本金：70,000 元</p>
                        <p className="text-slate-500 font-bold text-emerald-700 italic">费用合计：约 700.00 元</p>
                      </div>
                   </div>
                </div>
            </div>
          </div>
        );
      case 'transaction':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
             <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-700 rounded-full"></div>
                交易限额与限制
              </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-blue-600 px-4 py-2 text-white text-xs font-bold uppercase tracking-wider">取现限制 (Cash Withdrawal)</div>
                <div className="p-6 space-y-4">
                   <FormField label="单日取现最大笔数" type="number" defaultValue="5" />
                   <FormField label="单笔取现最大金额" type="number" defaultValue="20000" />
                </div>
              </div>
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-indigo-700 px-4 py-2 text-white text-xs font-bold uppercase tracking-wider">消费限制 (Consumption)</div>
                <div className="p-6 space-y-4">
                   <FormField label="单日消费最大笔数" type="number" defaultValue="20" />
                   <FormField label="单笔消费最大金额" type="number" defaultValue="50000" />
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-500 leading-relaxed">
               注：以上限额受产品总授信额度及风控实时策略共同约束，实际生效值为多方取小。
            </div>
          </div>
        );
      case 'repayment':
        return (
          <div className="space-y-10 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-700 rounded-full"></div>
              还款规则配置
            </h3>

            {/* Repayment Module Block */}
            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <h4 className="text-sm font-bold text-slate-800">还款模块</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 px-1">
                <FormSelect label="是否支持线下还款" required value={repaymentOptions.offline} onChange={(e) => handleRepaymentChange('offline', e.target.value)} options={['是', '否']} />
                <FormSelect label="是否支持快捷还款" required value={repaymentOptions.quick} onChange={(e) => handleRepaymentChange('quick', e.target.value)} options={['是', '否']} />
                <FormSelect label="是否支持单笔协议划扣" required value={repaymentOptions.single} onChange={(e) => handleRepaymentChange('single', e.target.value)} options={['是', '否']} />
                <FormSelect label="是否支持批量自动扣款" required value={repaymentOptions.batch} onChange={(e) => handleRepaymentChange('batch', e.target.value)} options={['是', '否']} />
                <FormSelect label="是否支持坐席豁免" required value={repaymentOptions.agent} onChange={(e) => handleRepaymentChange('agent', e.target.value)} options={['是', '否']} />
              </div>
            </section>

            {/* Overpayment Module Block */}
            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                <h4 className="text-sm font-bold text-slate-800">溢缴款模块</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 px-1">
                <FormSelect label="溢缴款是否支持批量退还" required value={repaymentOptions.overBatch} onChange={(e) => handleRepaymentChange('overBatch', e.target.value)} options={['是', '否']} />
                <FormSelect label="溢缴款是否自动抵扣同产品其他欠款" required value={repaymentOptions.overDeduct} onChange={(e) => handleRepaymentChange('overDeduct', e.target.value)} options={['是', '否']} />
                <FormSelect label="溢缴款是否抵扣其他关联产品借据" required value={repaymentOptions.overOthers} onChange={(e) => handleRepaymentChange('overOthers', e.target.value)} options={['是', '否']} />
              </div>
            </section>

            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] p-4 mt-8">
              <h4 className="text-xs font-bold text-slate-700 mb-2">业务说明：</h4>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                还款规则配置涉及各渠道划扣权限与溢缴款自动处理逻辑。还款模块决定了客户的资金入口多样性，溢缴款模块则定义了多收资金的自动化对账与退回规则。
              </p>
            </div>
          </div>
        );
      case 'postloan':
        return (
          <div className="space-y-10 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-700 rounded-full"></div>
              贷后管理配置
            </h3>

            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <h4 className="text-sm font-bold text-slate-800">业务处理配置</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 px-1">
                <FormSelect label="是否支持债务重组" required value={postLoanOptions.restructuring} onChange={(e) => handlePostLoanChange('restructuring', e.target.value)} options={['是', '否']} />
                <FormSelect label="是否支持延期" required value={postLoanOptions.extension} onChange={(e) => handlePostLoanChange('extension', e.target.value)} options={['是', '否']} />
                <FormSelect label="是否支持借新还旧" required value={postLoanOptions.refinance} onChange={(e) => handlePostLoanChange('refinance', e.target.value)} options={['是', '否']} />
                <FormSelect label="是否支持账单转分期" required value={postLoanOptions.billInstallment} onChange={(e) => handlePostLoanChange('billInstallment', e.target.value)} options={['是', '否']} />
                <FormSelect label="是否支持消费转分期" required value={postLoanOptions.consInstallment} onChange={(e) => handlePostLoanChange('consInstallment', e.target.value)} options={['是', '否']} />
              </div>
            </section>

            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] p-4 mt-8">
              <h4 className="text-xs font-bold text-slate-700 mb-2">业务说明：</h4>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                贷后管理配置定义了贷款发放后的特殊业务处理逻辑。债务重组、延期及借新还旧是缓解借款人还款压力的重要手段。转分期功能则提供了账单灵活性的延展。
              </p>
            </div>
          </div>
        );
      case 'closing':
        return (
          <div className="space-y-10 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-700 rounded-full"></div>
              关户规则配置
            </h3>

            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                <h4 className="text-sm font-bold text-slate-800">系统自动关户策略</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 px-1">
                <FormSelect 
                  label="放款失败自动关户" 
                  required 
                  value={closingOptions.autoCloseOnFailure} 
                  onChange={(e) => handleClosingChange('autoCloseOnFailure', e.target.value)} 
                  options={['是', '否']} 
                />
                <FormSelect 
                  label="结清时自动关户" 
                  required 
                  value={closingOptions.autoCloseOnSettlement} 
                  onChange={(e) => handleClosingChange('autoCloseOnSettlement', e.target.value)} 
                  options={['是', '否']} 
                />
                <FormSelect 
                  label="额度有效期到期且无余额自动关户" 
                  required 
                  value={closingOptions.autoCloseOnExpiry} 
                  onChange={(e) => handleClosingChange('autoCloseOnExpiry', e.target.value)} 
                  options={['是', '否']} 
                />
              </div>
            </section>

            <div className="bg-[#fff1f2] border border-[#fecdd3] rounded-[12px] p-4 mt-8">
              <h4 className="text-xs font-bold text-pink-900 mb-2">业务说明：</h4>
              <p className="text-[13px] text-pink-800 leading-relaxed">
                关户规则配置决定了借款人账户生命周期的终点逻辑。自动关户可以降低系统非活跃账户维护压力，并确保在敏感节点（如放款失败或授信过期）及时清理失效账户状态。
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300">
            <ICONS.Layers size={48} className="mb-4 opacity-20" />
            <p className="text-sm font-medium">「{modules.find(m => m.id === activeModule)?.label}」模块配置加载中...</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Edit Header */}
      <div className="h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ICONS.ChevronRight className="rotate-180" size={20} />
          </button>
          <div>
            <h2 className="text-base font-bold text-slate-900">{productName}</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Edit Configuration Factory</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-all border border-indigo-200"
          >
            <ICONS.Zap size={14} /> AI 智能配置
          </button>
          <div className="h-6 w-px bg-slate-200 mx-1"></div>
          <button onClick={onBack} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">取消</button>
          <button className="px-6 py-2 text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-lg shadow-blue-200 transition-all active:scale-95">保存配置</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Module Sidebar */}
        <div className="w-full md:w-[240px] border-r border-slate-100 bg-slate-50/30 p-4 space-y-1 overflow-y-auto">
          {modules.map(mod => (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300
                ${activeModule === mod.id 
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-100' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <span className={activeModule === mod.id ? 'text-white' : 'text-slate-400'}>{mod.icon}</span>
              {mod.label}
            </button>
          ))}
        </div>

        {/* Content Form Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white custom-scrollbar">
          <div className="max-w-4xl mx-auto">
            {renderFormContent()}
          </div>
        </div>
      </div>

      {/* AI Modal Simulation */}
      {isAIModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 bg-indigo-700 text-white flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2"><ICONS.Zap size={18} /> AI 智能辅助配置</h3>
                    <button onClick={() => setIsAIModalOpen(false)}><ICONS.Plus className="rotate-45" size={24} /></button>
                </div>
                <div className="p-8 space-y-4">
                    <p className="text-sm text-slate-600">请输入您的产品业务诉求，AI 将自动为您推荐最佳参数模版：</p>
                    <textarea 
                        className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="例如：我想要配置一款针对高净值人群的个人信用贷款，额度上限30万，按月还款，支持随借随还..."
                    ></textarea>
                    <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-100">开始智能生成</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

// UI Helper Components
const FormField: React.FC<{ label: string; required?: boolean; placeholder?: string; type?: string; defaultValue?: string; disabled?: boolean }> = ({ label, required, placeholder, type = "text", defaultValue, disabled }) => (
  <div className="space-y-1.5">
    <label className={`text-xs font-bold flex items-center gap-1 ${disabled ? 'text-slate-400' : 'text-slate-700'}`}>
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input 
      type={type} 
      defaultValue={defaultValue}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm disabled:opacity-50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100/50 outline-none transition-all" 
    />
  </div>
);

const CurrencyField: React.FC<{ label: string; placeholder?: string; defaultValue?: string }> = ({ label, placeholder, defaultValue }) => {
  const [val, setVal] = useState(defaultValue || '');
  
  const formatCurrency = (numStr: string) => {
    const clean = numStr.replace(/[^\d]/g, '');
    if (!clean) return '';
    return Number(clean).toLocaleString('en-US');
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-700">{label}</label>
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">¥</span>
        <input 
          type="text" 
          value={formatCurrency(val)}
          onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, ''))}
          placeholder={placeholder}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-sm font-mono font-bold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100/50 outline-none transition-all" 
        />
      </div>
    </div>
  );
};

const FormSelect: React.FC<{ label: string; required?: boolean; options: string[]; value?: string; onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; disabled?: boolean }> = ({ label, required, options, value, onChange, disabled }) => (
  <div className="space-y-1.5">
    <label className={`text-xs font-bold flex items-center gap-1 ${disabled ? 'text-slate-400' : 'text-slate-700'}`}>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative group">
      <select 
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm disabled:opacity-50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100/50 outline-none transition-all cursor-pointer"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ICONS.ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-600 transition-colors ${disabled ? 'text-slate-300' : 'text-slate-400'}`} size={14} />
    </div>
  </div>
);

const FormSelectRaw: React.FC<{ options: string[]; value?: string; onChange?: (val: string) => void; disabled?: boolean }> = ({ options, value, onChange, disabled }) => (
  <div className="relative group">
    <select 
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm disabled:opacity-50 focus:border-blue-600 focus:ring-4 focus:ring-blue-100/50 outline-none transition-all cursor-pointer"
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
    <ICONS.ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-600 transition-colors ${disabled ? 'text-slate-300' : 'text-slate-400'}`} size={14} />
  </div>
);

const FormTextArea: React.FC<{ label: string; placeholder?: string }> = ({ label, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-700">{label}</label>
    <textarea 
      rows={3}
      placeholder={placeholder}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100/50 outline-none transition-all"
    />
  </div>
);

const FormSwitchInGrid: React.FC<{ label: string; defaultEnabled?: boolean }> = ({ label, defaultEnabled = false }) => {
    const [enabled, setEnabled] = useState(defaultEnabled);
    return (
      <div className="bg-white p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors">
        <span className="text-xs font-medium text-slate-700">{label}</span>
        <button 
          onClick={() => setEnabled(!enabled)}
          className={`w-9 h-5 rounded-full relative transition-all duration-300 ${enabled ? 'bg-blue-600' : 'bg-slate-200'}`}
        >
          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm ${enabled ? 'left-5' : 'left-1'}`}></div>
        </button>
      </div>
    );
  };

const TimelinePoint: React.FC<{ label: string; date: string; color: string }> = ({ label, date, color }) => (
    <div className="flex flex-col items-center relative z-10">
        <span className="text-[10px] font-bold text-slate-400 mb-1">{label}</span>
        <div className={`w-4 h-4 rounded-full border-4 border-white shadow-sm ${color}`}></div>
        <span className="text-[10px] font-mono font-bold text-slate-700 mt-2">{date}</span>
    </div>
);

export default ProductEditForm;
