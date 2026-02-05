
import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../constants';

interface ChannelParam {
  id: string;
  productCode: string;
  productName: string;
  channelNo: string;
  channelName: string;
  channelType: '开户渠道' | '交易渠道';
  // 新增业务逻辑字段
  earlySettlementFeeRate: string;
  earlySettlementFeeBase: string;
  earlySettlementMinFee: string;
  earlySettlementMaxFee: string;
  penaltyMultiplier: string;
}

const ChannelParamsPage: React.FC = () => {
  // 模拟初始数据
  const [data, setData] = useState<ChannelParam[]>([
    { 
      id: '1', 
      productCode: '001001', 
      productName: '快贷-工薪精英贷', 
      channelNo: 'CH_ALIPAY_01', 
      channelName: '支付宝小程序', 
      channelType: '开户渠道',
      earlySettlementFeeRate: '0.50',
      earlySettlementFeeBase: '剩余未还本金',
      earlySettlementMinFee: '100',
      earlySettlementMaxFee: '1000',
      penaltyMultiplier: '1.5'
    },
    { 
      id: '2', 
      productCode: '001001', 
      productName: '快贷-工薪精英贷', 
      channelNo: 'CH_WXPAY_02', 
      channelName: '微信支付分', 
      channelType: '交易渠道',
      earlySettlementFeeRate: '0.80',
      earlySettlementFeeBase: '未出账本金',
      earlySettlementMinFee: '200',
      earlySettlementMaxFee: '2000',
      penaltyMultiplier: '1.8'
    },
    { 
      id: '3', 
      productCode: '002005', 
      productName: '助力-小微经营抵押贷Pro', 
      channelNo: 'CH_BANK_APP', 
      channelName: '手机银行App', 
      channelType: '开户渠道',
      earlySettlementFeeRate: '0.30',
      earlySettlementFeeBase: '剩余未还本金',
      earlySettlementMinFee: '50',
      earlySettlementMaxFee: '500',
      penaltyMultiplier: '1.2'
    },
    { 
      id: '4', 
      productCode: '003008', 
      productName: '极速秒放-S', 
      channelNo: 'CH_H5_PARTNER', 
      channelName: '合作方H5', 
      channelType: '交易渠道',
      earlySettlementFeeRate: '1.00',
      earlySettlementFeeBase: '剩余未还本金',
      earlySettlementMinFee: '150',
      earlySettlementMaxFee: '1500',
      penaltyMultiplier: '2.0'
    },
  ]);

  // 来源于产品基础配置的产品数据（模拟）
  const productOptions = [
    { code: '001001', name: '快贷-工薪精英贷' },
    { code: '002005', name: '助力-小微经营抵押贷Pro' },
    { code: '003008', name: '极速秒放-S' },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ChannelParam | null>(null);
  
  // 表单状态
  const [formData, setFormData] = useState({
    productCode: '',
    channelNo: '',
    channelName: '',
    channelType: '开户渠道' as '开户渠道' | '交易渠道',
    earlySettlementFeeRate: '0.50',
    earlySettlementFeeBase: '剩余未还本金',
    earlySettlementMinFee: '0',
    earlySettlementMaxFee: '0',
    penaltyMultiplier: '1.5'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProductDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenModal = (item?: ChannelParam) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        productCode: item.productCode,
        channelNo: item.channelNo,
        channelName: item.channelName,
        channelType: item.channelType,
        earlySettlementFeeRate: item.earlySettlementFeeRate,
        earlySettlementFeeBase: item.earlySettlementFeeBase,
        earlySettlementMinFee: item.earlySettlementMinFee,
        earlySettlementMaxFee: item.earlySettlementMaxFee,
        penaltyMultiplier: item.penaltyMultiplier
      });
    } else {
      setEditingItem(null);
      setFormData({
        productCode: '',
        channelNo: '',
        channelName: '',
        channelType: '开户渠道',
        earlySettlementFeeRate: '0.50',
        earlySettlementFeeBase: '剩余未还本金',
        earlySettlementMinFee: '0',
        earlySettlementMaxFee: '0',
        penaltyMultiplier: '1.5'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const product = productOptions.find(p => p.code === formData.productCode);
    if (!product) return;

    if (editingItem) {
      setData(data.map(item => item.id === editingItem.id ? { 
        ...item, 
        ...formData, 
        productName: product.name 
      } : item));
    } else {
      const newItem: ChannelParam = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        productName: product.name
      };
      setData([newItem, ...data]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该渠道参数配置吗？')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  const selectedProduct = productOptions.find(p => p.code === formData.productCode);
  const filteredProducts = productOptions.filter(p => 
    p.code.includes(searchTerm) || p.name.includes(searchTerm)
  );

  return (
    <div className="p-8 space-y-6 bg-slate-50/50 min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">渠道参数管理</h2>
          <p className="text-[13px] text-slate-500 font-medium mt-1">维护产品在不同渠道下的特殊业务逻辑与识别参数</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <ICONS.Plus size={18} />
          新增渠道关联
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[1200px]">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4 w-[240px]">产品编码 / 名称</th>
                <th className="px-6 py-4 w-[160px]">渠道号</th>
                <th className="px-6 py-4 w-[160px]">渠道名称</th>
                <th className="px-6 py-4 w-[120px]">渠道类型</th>
                <th className="px-6 py-4 w-[180px]">提前结清费率/基数</th>
                <th className="px-6 py-4 w-[100px]">罚息倍数</th>
                <th className="px-6 py-4 w-[120px] text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item) => (
                <tr key={item.id} className="group hover:bg-blue-50/10 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[13px] font-bold text-slate-800 tracking-tight">{item.productName}</span>
                      <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-tighter">{item.productCode}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[13px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                      {item.channelNo}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[13px] font-bold text-slate-700">{item.channelName}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl border ${
                      item.channelType === '开户渠道' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${item.channelType === '开户渠道' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                      {item.channelType}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-bold text-slate-700">{item.earlySettlementFeeRate}% ({item.earlySettlementFeeBase})</span>
                      <span className="text-[10px] text-slate-400">区间: {item.earlySettlementMinFee}-{item.earlySettlementMaxFee} 元</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[13px] font-mono font-bold text-slate-700">{item.penaltyMultiplier} 倍</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleOpenModal(item)}
                        className="text-blue-600 hover:text-blue-800 font-bold text-sm transition-colors"
                      >
                        编辑
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-slate-300 hover:text-red-500 font-bold text-sm transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 新增/编辑 Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {editingItem ? '编辑渠道参数' : '新增渠道关联'}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">Channel Mapping Configuration</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors"
              >
                <ICONS.Plus className="rotate-45" size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              {/* 基础映射配置 */}
              <div className="grid grid-cols-2 gap-6">
                {/* 产品选择 */}
                <div className="space-y-2 relative" ref={dropdownRef}>
                  <label className="text-xs font-bold text-slate-700">产品选择 <span className="text-red-500">*</span></label>
                  <div 
                    className={`relative flex items-center bg-slate-50 border rounded-2xl transition-all ${isProductDropdownOpen ? 'border-blue-600 ring-4 ring-blue-100/50 bg-white' : 'border-slate-200'}`}
                  >
                    <ICONS.Search className="ml-4 text-slate-400" size={16} />
                    <input 
                      type="text"
                      placeholder={selectedProduct ? `${selectedProduct.code} - ${selectedProduct.name}` : "搜索并选择产品..."}
                      className="w-full bg-transparent border-none px-4 py-3 text-[13px] font-medium focus:ring-0 outline-none"
                      value={searchTerm}
                      onFocus={() => setIsProductDropdownOpen(true)}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <ICONS.ChevronDown className="mr-4 text-slate-300" size={16} />
                  </div>
                  
                  {isProductDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-10 max-h-48 overflow-y-auto overflow-x-hidden">
                      {filteredProducts.map(p => (
                        <button
                          key={p.code}
                          onClick={() => {
                            setFormData({ ...formData, productCode: p.code });
                            setSearchTerm('');
                            setIsProductDropdownOpen(false);
                          }}
                          className="w-full text-left px-5 py-3 hover:bg-blue-50 transition-colors flex flex-col gap-0.5"
                        >
                          <span className="text-[13px] font-bold text-slate-800">{p.name}</span>
                          <span className="text-[10px] font-mono font-bold text-blue-600">{p.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 渠道类型 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">渠道类型</label>
                  <div className="flex bg-slate-100 p-1 rounded-2xl h-[46px]">
                    {(['开户渠道', '交易渠道'] as const).map(type => (
                      <button 
                        key={type}
                        onClick={() => setFormData({ ...formData, channelType: type })}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                          formData.channelType === type 
                          ? 'bg-white text-blue-700 shadow-sm' 
                          : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 渠道号 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">渠道号 <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    placeholder="例如：CH_APP_01"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-[13px] font-mono font-bold text-slate-700 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    value={formData.channelNo}
                    onChange={(e) => setFormData({ ...formData, channelNo: e.target.value })}
                  />
                </div>

                {/* 渠道名称 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">渠道名称 <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    placeholder="例如：支付宝小程序"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-[13px] font-bold text-slate-700 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    value={formData.channelName}
                    onChange={(e) => setFormData({ ...formData, channelName: e.target.value })}
                  />
                </div>
              </div>

              {/* 特殊业务逻辑配置 */}
              <div className="pt-6 border-t border-slate-100 space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                  <h4 className="text-[13px] font-bold text-slate-900 tracking-tight">特殊业务逻辑配置</h4>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  {/* 提前结清手续费率 */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">提前结清手续费费率 (%)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-[13px] font-mono font-bold text-blue-600 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                        value={formData.earlySettlementFeeRate}
                        onChange={(e) => setFormData({ ...formData, earlySettlementFeeRate: e.target.value })}
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">%</span>
                    </div>
                  </div>

                  {/* 提前结清手续费基数 */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">提前结清手续费基数</label>
                    <div className="relative group">
                      <select 
                        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-[13px] font-bold text-slate-700 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all cursor-pointer"
                        value={formData.earlySettlementFeeBase}
                        onChange={(e) => setFormData({ ...formData, earlySettlementFeeBase: e.target.value })}
                      >
                        <option>剩余未还本金</option>
                        <option>未出账本金</option>
                        <option>总贷款金额</option>
                      </select>
                      <ICONS.ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={16} />
                    </div>
                  </div>

                  {/* 提前结清手续费上下限 */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">提前结清手续费上下限 (元)</label>
                    <div className="flex items-center gap-0">
                      <div className="relative flex-1">
                        <input 
                          type="number" 
                          placeholder="下限"
                          className="w-full bg-slate-50 border border-slate-200 rounded-l-2xl pl-5 pr-4 py-3 text-[13px] font-mono font-bold text-slate-700 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                          value={formData.earlySettlementMinFee}
                          onChange={(e) => setFormData({ ...formData, earlySettlementMinFee: e.target.value })}
                        />
                      </div>
                      <div className="px-3 bg-slate-100 border-y border-slate-200 text-[10px] font-bold text-slate-400 flex items-center">至</div>
                      <div className="relative flex-1">
                        <input 
                          type="number" 
                          placeholder="上限"
                          className="w-full bg-slate-50 border border-slate-200 rounded-r-2xl pl-4 pr-5 py-3 text-[13px] font-mono font-bold text-slate-700 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                          value={formData.earlySettlementMaxFee}
                          onChange={(e) => setFormData({ ...formData, earlySettlementMaxFee: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 罚息倍数 */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">罚息倍数</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="0.1"
                        placeholder="1.5"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-[13px] font-mono font-bold text-amber-600 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                        value={formData.penaltyMultiplier}
                        onChange={(e) => setFormData({ ...formData, penaltyMultiplier: e.target.value })}
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">倍</span>
                    </div>
                  </div>
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
                disabled={!formData.productCode || !formData.channelNo || !formData.channelName}
                onClick={handleSave}
                className="px-8 py-2.5 text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 disabled:shadow-none rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95"
              >
                保存配置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelParamsPage;
