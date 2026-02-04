
import React, { useState } from 'react';
import { ICONS } from '../constants';

const ProductCommonPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('fees');

  const modules = [
    { id: 'fees', label: '费用模型', icon: <ICONS.CreditCard size={16} /> },
    { id: 'limits', label: '额度策略', icon: <ICONS.BarChart3 size={16} /> },
    { id: 'periods', label: '期限规则', icon: <ICONS.Clock size={16} /> },
    { id: 'repayment', label: '还款方式', icon: <ICONS.Activity size={16} /> },
    { id: 'blacklist', label: '黑名单策略', icon: <ICONS.Lock size={16} /> },
    { id: 'scoring', label: '评分卡集成', icon: <ICONS.Zap size={16} /> },
    { id: 'docs', label: '影像件清单', icon: <ICONS.FileText size={16} /> },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-slate-200 px-8 py-4 bg-slate-50/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">产品通用配置</h2>
            <p className="text-xs text-slate-500">配置全局生效的产品基础运行逻辑与风控参数</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">取消修改</button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm">发布配置</button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Nav */}
        <div className="w-64 border-r border-slate-100 flex flex-col p-4 space-y-1">
          {modules.map(mod => (
            <button
              key={mod.id}
              onClick={() => setActiveTab(mod.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === mod.id ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {mod.icon}
              {mod.label}
            </button>
          ))}
        </div>

        {/* Right Form Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-2xl space-y-8">
            <section>
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                核心参数设置
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">默认年化利率 (%)</label>
                  <input type="number" defaultValue="4.35" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">逾期罚息倍数 (倍)</label>
                  <input type="number" defaultValue="1.5" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                服务费阶梯配置
              </h3>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 border-dashed space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>阶梯额度 (万)</span>
                  <span>对应费率 (%)</span>
                  <span>操作</span>
                </div>
                {[
                  { range: '0 - 10', rate: '1.2' },
                  { range: '10 - 50', rate: '0.8' },
                  { range: '50+', rate: '0.5' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                    <span className="text-sm font-mono text-slate-700">{row.range}</span>
                    <span className="text-sm font-bold text-blue-600">{row.rate} %</span>
                    <button className="text-slate-300 hover:text-red-500 transition-colors"><ICONS.MoreHorizontal size={16} /></button>
                  </div>
                ))}
                <button className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100 mt-2">
                  <ICONS.Plus size={14} /> 添加新阶梯
                </button>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                风控触发器
              </h3>
              <div className="space-y-3">
                {[
                  { label: '单笔贷款金额超过 100 万需人工终审', enabled: true },
                  { label: '同一自然日内进件超过 3 次自动锁定', enabled: true },
                  { label: '资信分数低于 650 分直接拒绝', enabled: false },
                ].map((rule, i) => (
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
        </div>
      </div>
    </div>
  );
};

export default ProductCommonPage;
