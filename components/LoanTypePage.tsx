
import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../constants';

const LoanTypePage: React.FC = () => {
  // 定义标准的分期类型配置
  const installmentOptions = [
    { label: '现金分期', color: 'bg-blue-50 text-blue-700 border-blue-100', dot: 'bg-blue-500' },
    { label: '消费分期', color: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' },
    { label: '随借随还取现', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' },
    { label: '随借随还消费', color: 'bg-indigo-50 text-indigo-700 border-indigo-100', dot: 'bg-indigo-500' },
  ];

  // 来源于产品基础配置的产品数据
  const productOptions = [
    { code: '001001', name: '快贷-工薪精英贷' },
    { code: '002005', name: '助力-小微经营抵押贷Pro' },
    { code: '003008', name: '极速秒放-S' },
  ];

  // 产品与分期类型的映射数据状态
  const [productMappings, setProductMappings] = useState([
    { name: '快贷-工薪精英贷', code: '001001', type: '现金分期', status: 'Active' },
    { name: '快贷-工薪精英贷', code: '001001', type: '随借随还取现', status: 'Active' },
    { name: '助力-小微经营抵押贷Pro', code: '002005', type: '现金分期', status: 'Active' },
    { name: '助力-小微经营抵押贷Pro', code: '002005', type: '消费分期', status: 'Active' },
    { name: '极速秒放-S', code: '003008', type: '随借随还消费', status: 'Active' },
    { name: '极速秒放-S', code: '003008', type: '随借随还取现', status: 'Active' },
    { name: '极速秒放-S', code: '003008', type: '消费分期', status: 'Inactive' },
  ]);

  // 新增类型关联 Modal 状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: installmentOptions[0].label,
    status: 'Active'
  });

  // 配置规则 Modal 状态
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [activeMapping, setActiveMapping] = useState<any>(null);
  const [ruleFormData, setRuleFormData] = useState({
    isMergeBilling: '否',
    mergeDays: '0',
    repaymentMethod: '等额本息'
  });

  // 搜索和选择状态
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 过滤产品列表
  const filteredProducts = productOptions.filter(p => 
    p.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProduct = productOptions.find(p => p.code === formData.code);

  // 点击外部关闭下拉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddMapping = () => {
    if (!selectedProduct) return;

    const newEntry = {
      name: selectedProduct.name,
      code: selectedProduct.code,
      type: formData.type,
      status: formData.status
    };

    setProductMappings([newEntry, ...productMappings]);
    setIsModalOpen(false);
    resetForm();
  };

  const handleOpenRuleConfig = (mapping: any) => {
    setActiveMapping(mapping);
    setIsRuleModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ code: '', type: installmentOptions[0].label, status: 'Active' });
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleSaveRules = () => {
    console.log('Saving rules for:', activeMapping, ruleFormData);
    setIsRuleModalOpen(false);
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50/50 min-h-full relative">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">贷款类型配置</h2>
          <p className="text-[13px] text-slate-500 font-medium tracking-wide">
            维护信贷产品与分期类型的映射矩阵，每一行定义一个独立的业务执行实例
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <ICONS.Download size={14} /> 导出配置表
          </button>
          <button 
            onClick={() => {
                resetForm();
                setIsModalOpen(true);
            }}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
          >
            <ICONS.Plus size={16} strokeWidth={3} />
            新增类型关联
          </button>
        </div>
      </div>

      {/* 产品分期类型维护列表 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
              产品-分期类型关联矩阵
            </h3>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4 w-[160px]">产品编码</th>
                  <th className="px-6 py-4 w-[280px]">产品名称</th>
                  <th className="px-6 py-4 w-[220px]">分期类型</th>
                  <th className="px-6 py-4 w-[120px] text-center">当前状态</th>
                  <th className="px-6 py-4 w-[160px] text-right">管理操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productMappings.map((item, idx) => (
                  <tr key={`${item.code}-${item.type}-${idx}`} className="group hover:bg-blue-50/10 transition-colors">
                    <td className="px-6 py-5 text-xs font-mono font-bold text-slate-500 tracking-tighter">
                      {item.code}
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[13px] font-bold text-slate-800 tracking-tight">{item.name}</span>
                    </td>
                    <td className="px-6 py-5">
                      {(() => {
                        const opt = installmentOptions.find(o => o.label === item.type);
                        const style = opt?.color || 'bg-slate-50 text-slate-500';
                        return (
                          <span className={`inline-flex items-center gap-2 text-[10px] font-bold px-3 py-1.5 rounded-xl border shadow-sm transition-transform hover:scale-105 ${style}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${opt?.dot || 'bg-slate-400'}`}></span>
                            {item.type}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${
                        item.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                        {item.status === 'Active' ? '运行中' : '已停用'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleOpenRuleConfig(item)}
                          className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg font-bold text-[11px] transition-all"
                        >
                          配置规则
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
                          <ICONS.MoreHorizontal size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <ICONS.AlertCircle size={16} />
            </div>
            <div className="flex-1">
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    <span className="font-bold text-blue-700 mr-1">规则提醒：</span>
                    每一行代表一个“产品-分期类型”的业务实例。系统将根据交易渠道（取现/消费）及客户选择的还款期限，自动匹配对应的账务与息费引擎。
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* 配置规则 Modal */}
      {isRuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">分期类型规则配置</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">Configure Rules for {activeMapping?.type}</p>
              </div>
              <button 
                onClick={() => setIsRuleModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors"
              >
                <ICONS.Plus className="rotate-45" size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
               <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 mb-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">当前应用对象</span>
                    <span className="text-[13px] font-bold text-slate-800">{activeMapping?.name}</span>
                    <span className="text-[11px] font-mono text-slate-500">{activeMapping?.code}</span>
                  </div>
               </div>

              {/* 是否合并账单日 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  是否合并账单日 <span className="text-red-500">*</span>
                </label>
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                  {['是', '否'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setRuleFormData({ ...ruleFormData, isMergeBilling: opt })}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${ruleFormData.isMergeBilling === opt ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* 合并账单日天数 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  合并账单日天数 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    disabled={ruleFormData.isMergeBilling === '否'}
                    className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-bold outline-none transition-all ${
                      ruleFormData.isMergeBilling === '否' ? 'opacity-50 cursor-not-allowed' : 'focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100'
                    }`}
                    value={ruleFormData.mergeDays}
                    onChange={(e) => setRuleFormData({ ...ruleFormData, mergeDays: e.target.value })}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">天</span>
                </div>
              </div>

              {/* 还款方式 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  还款方式 <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <select 
                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-bold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all cursor-pointer"
                    value={ruleFormData.repaymentMethod}
                    onChange={(e) => setRuleFormData({ ...ruleFormData, repaymentMethod: e.target.value })}
                  >
                    <option>等额本金</option>
                    <option>等额本息</option>
                    <option>等本等息</option>
                    <option>先息后本</option>
                    <option>随借随还</option>
                    <option>按月付息到期还本</option>
                  </select>
                  <ICONS.ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-blue-600" size={16} />
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsRuleModalOpen(false)}
                className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
              >
                取消
              </button>
              <button 
                onClick={handleSaveRules}
                className="px-8 py-2.5 text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95"
              >
                保存规则
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新增类型关联 Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">新增产品-分期类型关联</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">Create Mapping Instance</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors"
              >
                <ICONS.Plus className="rotate-45" size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* 可搜索的产品编码选择 */}
              <div className="space-y-2 relative" ref={dropdownRef}>
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  产品选择 (支持搜索编码/名称) <span className="text-red-500">*</span>
                </label>
                
                <div 
                    className={`relative flex items-center bg-slate-50 border rounded-2xl transition-all ${isDropdownOpen ? 'border-blue-600 ring-4 ring-blue-100/50 bg-white' : 'border-slate-200'}`}
                >
                    <ICONS.Search className={`ml-4 ${isDropdownOpen ? 'text-blue-500' : 'text-slate-400'}`} size={16} />
                    <input 
                        type="text"
                        placeholder={selectedProduct ? `${selectedProduct.code} - ${selectedProduct.name}` : "搜索并选择产品编码..."}
                        className="w-full bg-transparent border-none px-4 py-3.5 text-[13px] font-medium focus:ring-0 outline-none"
                        value={searchTerm}
                        onFocus={() => setIsDropdownOpen(true)}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {selectedProduct && !searchTerm && (
                        <button 
                            onClick={() => setFormData({ ...formData, code: '' })}
                            className="mr-3 p-1 hover:bg-slate-200 rounded-full text-slate-400"
                        >
                            <ICONS.Plus className="rotate-45" size={14} />
                        </button>
                    )}
                    <ICONS.ChevronDown className={`mr-4 transition-transform text-slate-400 ${isDropdownOpen ? 'rotate-180 text-blue-500' : ''}`} size={16} />
                </div>

                {/* 下拉搜索结果 */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-10 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(p => (
                        <button
                          key={p.code}
                          onClick={() => {
                            setFormData({ ...formData, code: p.code });
                            setSearchTerm('');
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-5 py-3 hover:bg-blue-50 transition-colors flex flex-col gap-0.5 ${formData.code === p.code ? 'bg-blue-50/50' : ''}`}
                        >
                          <span className="text-[13px] font-bold text-slate-800">{p.name}</span>
                          <span className="text-[10px] font-mono font-bold text-blue-600">{p.code}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-5 py-8 text-center text-slate-400 text-xs font-medium">
                        未找到匹配的产品信息
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 分期类型选择 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  分期类型 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {installmentOptions.map(opt => (
                    <button
                      key={opt.label}
                      onClick={() => setFormData({ ...formData, type: opt.label })}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-xs font-bold transition-all ${
                        formData.type === opt.label 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                        : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${formData.type === opt.label ? 'bg-white' : opt.dot}`}></span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 状态控制 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  初始状态
                </label>
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                  <button 
                    onClick={() => setFormData({ ...formData, status: 'Active' })}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${formData.status === 'Active' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                  >
                    启用中
                  </button>
                  <button 
                    onClick={() => setFormData({ ...formData, status: 'Inactive' })}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${formData.status === 'Inactive' ? 'bg-white text-slate-600 shadow-sm' : 'text-slate-400'}`}
                  >
                    停用
                  </button>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
              >
                取消
              </button>
              <button 
                disabled={!formData.code}
                onClick={handleAddMapping}
                className="px-8 py-2.5 text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 disabled:shadow-none rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95"
              >
                确认关联
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanTypePage;
