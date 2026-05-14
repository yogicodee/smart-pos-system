import { UserRole, Permission } from '../models/types';

export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    'MANAGE_USERS',
    'MANAGE_PRODUCTS',
    'MANAGE_TRANSACTIONS',
    'EXPORT_REPORTS',
    'ACCESS_ANALYTICS',
    'CREATE_TRANSACTION'
  ],
  [UserRole.MANAGER]: [
    'MANAGE_PRODUCTS',
    'EXPORT_REPORTS',
    'ACCESS_ANALYTICS'
  ],
  [UserRole.CASHIER]: [
    'CREATE_TRANSACTION',
    'ACCESS_ANALYTICS' // basic dashboard access
  ]
};

