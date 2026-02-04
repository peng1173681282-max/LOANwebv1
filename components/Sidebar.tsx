
import React, { useState } from 'react';
import { MENU_DATA, ICONS } from '../constants';
import { MenuItem } from '../types';

interface SidebarProps {
  activeId: string;
  onNavigate: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeId, onNavigate }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_DATA);

  const toggleSubmenu = (id: string) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isOpen: !item.isOpen };
      }
      return item;
    }));
  };

  return (
    <aside className="w-[260px] h-screen bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Brand Section */}
      <div className="h-16 flex items-center px-6 border-b border-slate-50 gap-3">
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <ICONS.ShieldCheck size={20} strokeWidth={2.5} />
            </div>
        </div>
        <div className="flex flex-col">
            <span className="text-base font-bold text-slate-800 tracking-tight leading-none">信贷工厂 Pro</span>
            <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-0.5">Enterprise SaaS</span>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
        {menuItems.map(item => (
          <div key={item.id} className="space-y-1">
            <button
              onClick={() => item.children ? toggleSubmenu(item.id) : onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-300 group
                ${activeId === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <div className="flex items-center gap-3">
                <span className={`transition-colors ${activeId === item.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`}>
                  {item.icon}
                </span>
                <span className="font-semibold tracking-wide">{item.label}</span>
              </div>
              {item.children && (
                <span className={`transition-transform duration-300 ${item.isOpen ? 'rotate-180' : ''} ${activeId === item.id ? 'text-white/70' : 'text-slate-300'}`}>
                  <ICONS.ChevronDown size={14} />
                </span>
              )}
            </button>
            
            {item.children && item.isOpen && (
              <div className="ml-5 mt-1 border-l-2 border-slate-100 pl-4 space-y-1">
                {item.children.map(child => (
                  <button
                    key={child.id}
                    onClick={() => onNavigate(child.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200
                      ${activeId === child.id 
                        ? 'text-blue-600 bg-blue-50 shadow-inner shadow-blue-100/50' 
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Card Section */}
      <div className="p-4 mx-4 mb-6 rounded-2xl bg-slate-50 border border-slate-100 group cursor-pointer hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden ring-1 ring-slate-200">
                <img 
                    src="https://picsum.photos/seed/financial-admin/100/100" 
                    alt="Admin" 
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-slate-800 truncate">系统管理员</p>
            <p className="text-[10px] text-slate-500 truncate font-medium">高级产品专家</p>
          </div>
          <ICONS.Settings size={14} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
