
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
