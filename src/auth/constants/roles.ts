export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  OPERATOR_STAFF = 'OPERATOR_STAFF',
  KITCHEN_STAFF = 'KITCHEN_STAFF',
  INVENTORY_MANAGER = 'INVENTORY_MANAGER',
  SALES_MANAGER = 'SALES_MANAGER',
}

export const ROLE_PERMISSIONS = {
  [Role.USER]: ['read:products', 'create:cart', 'read:cart'],
  [Role.ADMIN]: ['*'], // acceso total
  [Role.OPERATOR_STAFF]: [
    'read:inventory',
    'update:inventory',
    'create:inventory',
  ],
  [Role.KITCHEN_STAFF]: [
    'read:kitchen',
    'update:kitchen',
    'create:kitchen-tasks',
  ],
  [Role.INVENTORY_MANAGER]: [
    'read:inventory',
    'update:inventory',
    'create:inventory',
    'delete:inventory',
  ],
  [Role.SALES_MANAGER]: [
    'read:sales',
    'create:sales',
    'update:sales',
    'read:reports',
  ],
};
