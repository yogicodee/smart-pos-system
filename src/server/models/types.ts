export enum UserRole {
  ADMIN = 'ADMIN',
  CASHIER = 'CASHIER',
  MANAGER = 'MANAGER'
}

export type Permission = 
  | 'MANAGE_USERS'
  | 'MANAGE_PRODUCTS'
  | 'MANAGE_TRANSACTIONS'
  | 'EXPORT_REPORTS'
  | 'ACCESS_ANALYTICS'
  | 'CREATE_TRANSACTION';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  stock: number;
  price: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductWithCategory extends Product {
  category?: Category;
}

export interface TransactionItem {
  id: string;
  transactionId: string;
  productId: string;
  name: string; // snapshot name to keep history
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  totalAmount: number;
  paidAmount: number;
  changeAmount: number;
  createdAt: Date;
  items: TransactionItem[];
}
