
import React from 'react';
import { ICONS } from '../constants';

const FunderManagementPage: React.FC = () => {
  const funders = [
    { name: '中国工商银行', type: '国有大行', limit: 500000000, balance: 124000000, status: 'Active', logo: 'IC' },
    { name: '江苏银行', type: '城市商业银行', limit: 200000000, balance: 45000000, status: 'Active', logo: 'JS' },
    { name: '信托资金 A 计划', type: '非标资方', limit: 80000000, balance: 75000000, status: 'Warning', logo: 'TR' },
    { name: '平安银行信用中心', type: '股份制银行', limit: 300000000, balance: 10000000, status: 'Inactive', logo: 'PA' },
  ];

  const formatMoney = (val: number) => {
    return (val / 10000).toFixed(0) + '万';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">资方管理</h2>
          <p className="text-xs text-slate-500 mt-1">管理资金来源渠道，监控授信额度及消耗情况</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-all">
          <ICONS.Plus size={18} />
          接入新资方
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {funders.map((funder, i) => {
          const usage = (funder.balance / funder.limit) * 100;
          return (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100">
                      {funder.logo}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{funder.name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium">{funder.type}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    funder.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                    funder.status === 'Warning' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {funder.status === 'Active' ? '运行中' : funder.status === 'Warning' ? '额度告急' : '已暂停'}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-xs text-slate-500">额度消耗率</span>
                      <span className="text-xs font-mono font-bold text-slate-700">{usage.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${usage > 90 ? 'bg-amber-500' : usage > 50 ? 'bg-blue-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${usage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">总授信额度</p>
                      <p className="text-sm font-mono font-bold text-slate-900">¥ {formatMoney(funder.limit)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">已使用额度</p>
                      <p className="text-sm font-mono font-bold text-slate-900">¥ {formatMoney(funder.balance)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 bg-slate-50 flex items-center justify-between">
                <button className="text-xs font-bold text-blue-600 hover:text-blue-800">详细账单</button>
                <div className="flex gap-2">
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded-lg"><ICONS.Settings size={14} /></button>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded-lg"><ICONS.ExternalLink size={14} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FunderManagementPage;
