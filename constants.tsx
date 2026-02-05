
import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Briefcase,
  Layers,
  Search,
  Bell,
  Plus,
  Filter,
  Download,
  MoreHorizontal,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  Database,
  Server,
  PieChart,
  Globe,
  FileText,
  BarChart3,
  Terminal,
  Cpu,
  HardDrive,
  ExternalLink,
  Lock,
  Zap
} from 'lucide-react';
import { MenuItem } from './types';

export const MENU_DATA: MenuItem[] = [
  {
    id: 'product-management',
    label: '产品管理',
    icon: <Package size={18} />,
    isOpen: true,
    children: [
      { id: 'product-basic', label: '产品基础配置' },
      { id: 'loan-type', label: '贷款类型配置' },
      { id: 'channel-params', label: '渠道参数管理' },
      { id: 'product-common', label: '通用逻辑配置' },
    ]
  },
  {
    id: 'funder-management',
    label: '资方管理',
    icon: <Briefcase size={18} />
  },
  {
    id: 'system-management',
    label: '系统管理',
    icon: <Settings size={18} />
  }
];

export const ICONS = {
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Search,
  Bell,
  Plus,
  Layers,
  Filter,
  Download,
  MoreHorizontal,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  Database,
  Server,
  PieChart,
  Globe,
  FileText,
  BarChart3,
  Terminal,
  Cpu,
  HardDrive,
  ExternalLink,
  Lock,
  Settings,
  Zap,
  // Added Users and Briefcase to resolve the "Property does not exist on type ICONS" error in components/LoanTypePage.tsx
  Users,
  Briefcase
};
