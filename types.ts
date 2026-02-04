
// Import React to resolve the "Cannot find namespace 'React'" error on React.ReactNode
import React from 'react';

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  isOpen?: boolean;
}

export interface UserInfo {
  name: string;
  email: string;
  avatar: string;
}

export interface ProductConfig {
  id: string;
  code: string;
  name: string;
  status: 'Draft' | 'Published' | 'Inactive';
  creditType: '循环' | '非循环';
  validity: string;
  lastModified: string;
}

export type ProductModuleId = 
  | 'basic' 
  | 'limit' 
  | 'rate' 
  | 'account' 
  | 'transaction' 
  | 'fee' 
  | 'repayment' 
  | 'postloan' 
  | 'closing';
