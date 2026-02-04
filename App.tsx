
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainContentPlaceholder from './components/MainContentPlaceholder';
import LoanTypePage from './components/LoanTypePage';
import ProductCommonPage from './components/ProductCommonPage';
import FunderManagementPage from './components/FunderManagementPage';
import SystemManagementPage from './components/SystemManagementPage';
import ProductBasicPage from './components/ProductBasicPage';

const App: React.FC = () => {
  const [activeMenuId, setActiveMenuId] = useState('product-basic');
  
  // Mapping of ID to Title for Header
  const getPageTitle = (id: string) => {
    switch(id) {
        case 'dashboard': return '控制台';
        case 'product-basic': return '产品基础配置';
        case 'loan-type': return '贷款类型配置';
        case 'product-common': return '产品通用配置';
        case 'channel-params': return '渠道参数管理';
        case 'funder-management': return '资方管理';
        case 'system-management': return '系统管理';
        default: return '仪表盘';
    }
  };

  const renderContent = () => {
    switch(activeMenuId) {
      case 'product-basic':
        return <ProductBasicPage />;
      case 'loan-type':
        return <LoanTypePage />;
      case 'product-common':
        return <ProductCommonPage />;
      case 'funder-management':
        return <FunderManagementPage />;
      case 'system-management':
        return <SystemManagementPage />;
      case 'dashboard':
        return <MainContentPlaceholder />;
      default:
        return (
          <div className="p-8 flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.94 5.56a.75.75 0 011.06 0L10 8.56l2.94-2.94a.75.75 0 111.06 1.06L11.06 10l2.94 2.94a.75.75 0 11-1.06 1.06L10 11.06l-2.94 2.94a.75.75 0 11-1.06-1.06L8.94 10 6 7.06a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
            </div>
            <p className="text-sm font-medium">该模块「{getPageTitle(activeMenuId)}」正在开发中...</p>
            <button 
              onClick={() => setActiveMenuId('product-basic')}
              className="text-blue-600 hover:underline text-sm"
            >
              返回产品基础配置
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden text-slate-900 bg-slate-50">
      {/* Fixed Sidebar */}
      <Sidebar activeId={activeMenuId} onNavigate={setActiveMenuId} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header title={getPageTitle(activeMenuId)} />
        
        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
