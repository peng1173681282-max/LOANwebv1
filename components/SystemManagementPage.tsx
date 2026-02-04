
import React from 'react';
import { ICONS } from '../constants';

const SystemManagementPage: React.FC = () => {
  const logs = [
    { type: 'Info', user: 'admin', action: '修改了 [精英贷-A1] 的风控费率', time: '10分钟前', icon: <ICONS.CheckCircle2 size={14} className="text-emerald-500" /> },
    { type: 'Warning', user: 'system', action: '资方 [信托计划] 额度低于 5%', time: '35分钟前', icon: <ICONS.AlertCircle size={14} className="text-amber-500" /> },
    { type: 'Error', user: 'api-service', action: '核心系统回调超时，已发起重试', time: '1小时前', icon: <ICONS.AlertCircle size={14} className="text-red-500" /> },
    { type: 'Info', user: 'manager_01', action: '发布了 [助农贷 V2] 新版本', time: '2小时前', icon: <ICONS.CheckCircle2 size={14} className="text-emerald-500" /> },
    { type: 'Info', user: 'admin', action: '新增了 12 个渠道接入参数', time: '昨天 18:40', icon: <ICONS.CheckCircle2 size={14} className="text-emerald-500" /> },
  ];

  return (
    <div className="p-6 grid grid-cols-12 gap-6 h-full overflow-hidden">
      {/* Left Column: Audit Logs */}
      <div className="col-span-8 flex flex-col h-full space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ICONS.Terminal size={18} className="text-blue-600" />
              系统操作日志
            </h3>
            <button className="text-xs font-bold text-blue-600 hover:underline">查看全部日志</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-white">
                <tr className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-3">级别</th>
                  <th className="px-6 py-3">操作描述</th>
                  <th className="px-6 py-3">操作人</th>
                  <th className="px-6 py-3">时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map((log, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {log.icon}
                        <span className="text-xs font-bold text-slate-600">{log.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700">{log.action}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{log.user}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Column: Health Stats */}
      <div className="col-span-4 space-y-6">
        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
          <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest mb-6 flex items-center gap-2">
            <ICONS.Activity size={16} />
            System Health
          </h3>
          <div className="space-y-6">
            {[
              { label: 'CPU Usage', val: 14, color: 'bg-emerald-400' },
              { label: 'Memory', val: 42, color: 'bg-blue-400' },
              { label: 'Disk IO', val: 8, color: 'bg-indigo-400' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-bold">{stat.label}</span>
                  <span className="opacity-60 font-mono">{stat.val}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full ${stat.color} transition-all duration-1000`} style={{ width: `${stat.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] opacity-40 font-bold uppercase mb-1">Current Version</p>
              <p className="text-xs font-mono font-bold">v3.4.2-stable-enterprise</p>
            </div>
            <button className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors">
              <ICONS.ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4">核心组件状态</h3>
          <div className="space-y-4">
            {[
              { label: 'PostgreSQL Primary', status: 'Online' },
              { label: 'Redis Cache', status: 'Online' },
              { label: 'RabbitMQ Node', status: 'Online' },
              { label: 'API Gateway', status: 'Congested' },
            ].map((svc, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">{svc.label}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  svc.status === 'Online' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'
                }`}>
                  {svc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemManagementPage;
