
import React from 'react';
import { ICONS } from '../constants';

const LoanTypePage: React.FC = () => {
  const types = [
    { title: '个人消费信用贷款', code: 'LOAN_PERS_CONS', category: '个人信贷', desc: '基于个人信用记录，无需抵押，用于日常消费。', icon: <ICONS.Users className="text-blue-500" /> },
    { title: '小微企业经营性贷款', code: 'LOAN_SME_OPER', category: '普惠金融', desc: '助力小微企业主解决流动资金周转，额度灵活。', icon: <ICONS.Briefcase className="text-emerald-500" /> },
    { title: '房产抵押助业贷款', code: 'LOAN_MORT_BIZ', category: '抵押类', desc: '以房产作为抵押物，为创业和经营提供大额资金支持。', icon: <ICONS.Database className="text-purple-500" /> },
    { title: '车辆融资租赁', code: 'LOAN_VEH_LEAS', category: '资产金融', desc: '针对购车人群提供的金融方案，极速审核。', icon: <ICONS.Zap className="text-amber-500" /> },
    { title: '供应链保理融资', code: 'LOAN_SUPP_FACT', category: '供应链金融', desc: '基于真实贸易背景，为核心企业上下游提供融资服务。', icon: <ICONS.Globe className="text-cyan-500" /> },
    { title: '绿色低碳转型贷款', code: 'LOAN_GREEN_ENV', category: 'ESG 金融', desc: '响应国家双碳政策，支持节能环保项目的低息信贷。', icon: <ICONS.Activity className="text-green-500" /> },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">贷款类型配置</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm">
          <ICONS.Plus size={18} />
          新增类型
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {types.map((type, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                {type.icon}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                type.category === '个人信贷' ? 'bg-blue-50 text-blue-600' :
                type.category === '普惠金融' ? 'bg-emerald-50 text-emerald-600' :
                'bg-slate-100 text-slate-500'
              }`}>
                {type.category}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">{type.title}</h3>
            <p className="text-[11px] font-mono text-slate-400 mb-3">{type.code}</p>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">{type.desc}</p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <span className="text-xs text-slate-400">已接入产品: 8</span>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group/btn">
                管理配置
                <ICONS.ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanTypePage;
