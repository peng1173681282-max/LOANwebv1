
import React from 'react';
import { ICONS } from '../constants';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div className="flex items-center text-xs font-semibold text-slate-400 gap-2 uppercase tracking-widest">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">核心系统</span>
            <ICONS.ChevronRight size={12} className="opacity-50" />
            <span className="hover:text-blue-600 cursor-pointer transition-colors">产品管理</span>
            <ICONS.ChevronRight size={12} className="opacity-50" />
            <span className="text-slate-900 font-bold tracking-tight bg-slate-100 px-2 py-1 rounded lowercase first-letter:uppercase">{title}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center bg-slate-100 rounded-full px-3 py-1.5 group focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 border border-transparent focus-within:border-blue-200 transition-all">
          <ICONS.Search size={14} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="搜索全局配置、流水号或资方..." 
            className="bg-transparent border-none px-2 text-xs w-56 transition-all outline-none text-slate-800 placeholder:text-slate-400"
          />
          <span className="text-[10px] bg-white border border-slate-200 text-slate-400 px-1 rounded shadow-sm font-mono">⌘K</span>
        </div>

        <div className="flex items-center gap-2">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all hover:scale-105 active:scale-95">
                <ICONS.Bell size={18} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">A</div>
                <span className="text-xs font-bold text-slate-700">Admin</span>
                <ICONS.ChevronDown size={14} className="text-slate-400" />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
