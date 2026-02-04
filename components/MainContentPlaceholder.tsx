
import React from 'react';
import { ICONS } from '../constants';

const MainContentPlaceholder: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* 顶部统计卡片 - 采用渐变描边和微光效果 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '活跃信贷产品', value: '42', trend: '+12%', icon: <ICONS.Layers className="text-blue-600" size={20} />, bg: 'bg-blue-50' },
          { label: '待审核配置', value: '08', trend: '需加急', icon: <ICONS.Clock className="text-amber-600" size={20} />, bg: 'bg-amber-50' },
          { label: '本周进件量', value: '¥1,420.5k', trend: '+8.4%', icon: <ICONS.TrendingUp className="text-emerald-600" size={20} />, bg: 'bg-emerald-50' },
          { label: '风控拦截率', value: '14.2%', trend: '-2.1%', icon: <ICONS.ShieldCheck className="text-indigo-600" size={20} />, bg: 'bg-indigo-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between group hover:border-blue-300 transition-all duration-300 cursor-default">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</span>
                <span className="text-[10px] font-bold text-emerald-500">{stat.trend}</span>
              </div>
            </div>
            <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center transition-transform group-hover:scale-110`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* 高级筛选区 */}
      <div className="bg-white rounded-xl border border-slate-200/60 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <ICONS.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="输入产品 ID 或名称..." 
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm rounded-lg w-64 transition-all outline-none"
            />
          </div>
          <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-2 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all">
            <option>全部产品类型</option>
            <option>消费贷款</option>
            <option>经营贷款</option>
            <option>房产抵押</option>
          </select>
          <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-2 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all">
            <option>所有状态</option>
            <option>进行中</option>
            <option>已暂停</option>
            <option>草稿</option>
          </select>
          <button className="flex items-center gap-2 text-slate-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
            <ICONS.Filter size={16} />
            高级筛选
          </button>
        </div>
        <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg transition-colors">
                <ICONS.Download size={18} />
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md shadow-blue-200 flex items-center gap-2">
                <ICONS.Plus size={18} />
                创建新产品
            </button>
        </div>
      </div>

      {/* 数据工作区 */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">产品基本信息</th>
                <th className="px-6 py-4">核心参数 (利率/额度)</th>
                <th className="px-6 py-4">还款周期/方式</th>
                <th className="px-6 py-4">资方渠道</th>
                <th className="px-6 py-4">状态控制</th>
                <th className="px-6 py-4 text-right">管理操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { 
                    id: 'PD-1002', 
                    name: '精英消费贷 A1', 
                    tag: '高活跃', 
                    rate: '3.65%', 
                    limit: '500,000', 
                    method: '等额本息', 
                    period: '12/24/36期', 
                    funder: '工商银行', 
                    status: 'Active' 
                },
                { 
                    id: 'PD-1005', 
                    name: '助农普惠贷 V3', 
                    tag: '政策', 
                    rate: '2.80%', 
                    limit: '100,000', 
                    method: '随借随还', 
                    period: '不限', 
                    funder: '农业银行', 
                    status: 'Paused' 
                },
                { 
                    id: 'PD-1008', 
                    name: '小微税E贷', 
                    tag: '风控优', 
                    rate: '4.25%', 
                    limit: '2,000,000', 
                    method: '先息后本', 
                    period: '12期', 
                    funder: '江苏银行', 
                    status: 'Active' 
                },
                { 
                    id: 'PD-1012', 
                    name: '房易抵旗舰款', 
                    tag: '大额', 
                    rate: '3.15%', 
                    limit: '15,000,000', 
                    method: '等额本金', 
                    period: '60/120期', 
                    funder: '平安银行', 
                    status: 'Draft' 
                },
              ].map((row, i) => (
                <tr key={i} className="group hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{row.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">{row.id}</span>
                      <div className="mt-1 flex gap-1">
                        <span className="bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">{row.tag}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">年化:</span>
                        <span className="text-sm font-mono font-semibold text-emerald-600">{row.rate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">上限:</span>
                        <span className="text-sm font-mono font-semibold text-slate-700">¥{row.limit}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <div className="text-xs text-slate-700 font-medium">{row.method}</div>
                      <div className="text-[11px] text-slate-400">{row.period}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-600 font-bold">
                            {row.funder.charAt(0)}
                        </div>
                        <span className="text-sm text-slate-600">{row.funder}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        row.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 
                        row.status === 'Paused' ? 'bg-amber-500' : 'bg-slate-300'
                      }`}></span>
                      <span className={`text-xs font-bold ${
                        row.status === 'Active' ? 'text-emerald-700' : 
                        row.status === 'Paused' ? 'text-amber-700' : 'text-slate-500'
                      }`}>
                        {row.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="快速编辑">
                            <ICONS.Plus className="rotate-45" size={16} />
                        </button>
                        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="更多操作">
                            <ICONS.MoreHorizontal size={16} />
                        </button>
                        <button className="flex items-center gap-1.5 ml-2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-600 transition-colors">
                            <ICONS.ArrowUpRight size={14} />
                            配置
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* 精致分页器 */}
        <div className="px-6 py-4 bg-slate-50/50 flex items-center justify-between border-t border-slate-100">
            <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500 font-medium">每页显示</span>
                <select className="bg-white border border-slate-200 text-xs text-slate-600 rounded px-2 py-1 outline-none">
                    <option>10 条</option>
                    <option>20 条</option>
                    <option>50 条</option>
                </select>
            </div>
            <div className="flex items-center gap-1">
                <button className="p-1.5 border border-slate-200 rounded-lg bg-white text-slate-400 cursor-not-allowed hover:bg-slate-50 transition-colors">
                    <ICONS.ChevronRight size={16} className="rotate-180" />
                </button>
                {[1, 2, 3].map(page => (
                    <button key={page} className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                        page === 1 ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-400'
                    }`}>
                        {page}
                    </button>
                ))}
                <span className="px-2 text-slate-300">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-blue-400 transition-all text-xs font-bold">12</button>
                <button className="p-1.5 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 transition-colors">
                    <ICONS.ChevronRight size={16} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MainContentPlaceholder;
