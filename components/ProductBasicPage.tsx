
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { ProductConfig } from '../types';
import ProductEditForm from './ProductEditForm';

const ProductBasicPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'edit'>('list');
  const [editingProduct, setEditingProduct] = useState<ProductConfig | null>(null);

  const initialProducts: ProductConfig[] = [
    { id: '1', code: '001001', name: '快贷-工薪精英贷', status: 'Published', lastModified: '2024-05-20 14:20' },
    { id: '2', code: '002005', name: '助力-小微经营抵押贷Pro', status: 'Published', lastModified: '2024-05-18 09:15' },
    { id: '3', code: '003008', name: '极速秒放-S', status: 'Draft', lastModified: '2024-05-19 18:40' },
  ];

  const handleEdit = (product: ProductConfig) => {
    setEditingProduct(product);
    setViewMode('edit');
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setViewMode('edit');
  };

  if (viewMode === 'edit') {
    return (
      <ProductEditForm 
        onBack={() => setViewMode('list')} 
        productName={editingProduct?.name} 
      />
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">产品基础配置</h2>
          <p className="text-sm text-slate-500 mt-1">管理并维护信贷产品的核心业务要素与关联模型</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <ICONS.Plus size={18} />
          新增产品配置
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-[11px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100">
              <th className="px-8 py-4 w-40">产品编码</th>
              <th className="px-8 py-4">产品名称</th>
              <th className="px-8 py-4 w-32">当前状态</th>
              <th className="px-8 py-4 w-48">最后更新</th>
              <th className="px-8 py-4 w-32 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {initialProducts.map((p) => (
              <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors cursor-default">
                <td className="px-8 py-5 text-sm font-mono font-bold text-slate-600 tracking-wider">
                  {p.code}
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{p.name}</span>
                </td>
                <td className="px-8 py-5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    p.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {p.status === 'Published' ? '已发布' : '草稿'}
                  </span>
                </td>
                <td className="px-8 py-5 text-xs text-slate-400 font-medium">
                  {p.lastModified}
                </td>
                <td className="px-8 py-5 text-right">
                  <button 
                    onClick={() => handleEdit(p)}
                    className="text-blue-600 hover:text-blue-800 font-bold text-sm transition-colors"
                  >
                    编辑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination placeholder */}
        <div className="px-8 py-4 bg-slate-50/30 flex items-center justify-between border-t border-slate-100">
           <span className="text-xs text-slate-400 font-medium">共 {initialProducts.length} 条数据</span>
           <div className="flex gap-2">
              <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400"><ICONS.ChevronRight className="rotate-180" size={14} /></button>
              <button className="w-8 h-8 rounded-lg bg-blue-700 text-white text-xs font-bold">1</button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600"><ICONS.ChevronRight size={14} /></button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBasicPage;
