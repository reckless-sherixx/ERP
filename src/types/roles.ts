export type Role = 
  | 'SYSTEM_ADMIN'
  | 'ADMIN'
  | 'FACTORY_MANAGER'
  | 'INVENTORY_MANAGER'
  | 'SALES'
  | 'DESIGN'
  | 'ACCOUNTING'
  | 'PRODUCTION_STAFF'
  | 'CUSTOMER';

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
}

export const ADMIN_ROLES: Role[] = [
  'SYSTEM_ADMIN',
  'ADMIN'
];

export const STAFF_ROLES: Role[] = [
  'FACTORY_MANAGER',
  'INVENTORY_MANAGER',
  'SALES',
  'DESIGN',
  'ACCOUNTING',
  'PRODUCTION_STAFF'
];

export function hasAdminAccess(role?: Role): boolean {
  return role ? ADMIN_ROLES.includes(role) : false;
}

export function hasStaffAccess(role?: Role): boolean {
  return role ? [...ADMIN_ROLES, ...STAFF_ROLES].includes(role) : false;
}