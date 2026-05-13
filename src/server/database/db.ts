import { Category, Product, Transaction } from '../models/types';

// Mock DB storage
export const categories: Category[] = [
  { id: '1', name: 'Electronics', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Food & Beverage', createdAt: new Date(), updatedAt: new Date() }
];

export const products: Product[] = [
  { id: '1', name: 'MacBook Pro', categoryId: '1', stock: 15, price: 25000000, description: 'High performance laptop', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Espresso Beans', categoryId: '2', stock: 50, price: 150000, description: 'Organic fair trade', createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: 'Monitor 4K', categoryId: '1', stock: 5, price: 5000000, description: 'Stunning display', createdAt: new Date(), updatedAt: new Date() }
];

export const transactions: Transaction[] = [];
