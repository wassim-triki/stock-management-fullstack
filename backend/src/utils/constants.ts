// constants/roles.ts
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
} as const;

export enum PO_STATUSES {
  DRAFT = 'Draft',
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  RECEIVED = 'Received',
}
export type Role = (typeof ROLES)[keyof typeof ROLES];
