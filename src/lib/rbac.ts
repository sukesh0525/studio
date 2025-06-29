// Role-Based Access Control utilities

export type UserRole = 'student' | 'company' | 'admin';

export interface Permission {
  resource: string;
  action: string;
}

export const PERMISSIONS = {
  // Job permissions
  JOB_CREATE: { resource: 'job', action: 'create' },
  JOB_READ: { resource: 'job', action: 'read' },
  JOB_UPDATE: { resource: 'job', action: 'update' },
  JOB_DELETE: { resource: 'job', action: 'delete' },
  JOB_APPLY: { resource: 'job', action: 'apply' },
  
  // Application permissions
  APPLICATION_READ: { resource: 'application', action: 'read' },
  APPLICATION_UPDATE: { resource: 'application', action: 'update' },
  
  // Resume permissions
  RESUME_UPLOAD: { resource: 'resume', action: 'upload' },
  RESUME_READ: { resource: 'resume', action: 'read' },
  RESUME_DELETE: { resource: 'resume', action: 'delete' },
  
  // Discussion permissions
  DISCUSSION_CREATE: { resource: 'discussion', action: 'create' },
  DISCUSSION_READ: { resource: 'discussion', action: 'read' },
  DISCUSSION_UPDATE: { resource: 'discussion', action: 'update' },
  DISCUSSION_DELETE: { resource: 'discussion', action: 'delete' },
  DISCUSSION_MODERATE: { resource: 'discussion', action: 'moderate' },
  
  // Company update permissions
  COMPANY_UPDATE_CREATE: { resource: 'company_update', action: 'create' },
  COMPANY_UPDATE_READ: { resource: 'company_update', action: 'read' },
  COMPANY_UPDATE_UPDATE: { resource: 'company_update', action: 'update' },
  COMPANY_UPDATE_DELETE: { resource: 'company_update', action: 'delete' },
} as const;

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  student: [
    PERMISSIONS.JOB_READ,
    PERMISSIONS.JOB_APPLY,
    PERMISSIONS.APPLICATION_READ,
    PERMISSIONS.RESUME_UPLOAD,
    PERMISSIONS.RESUME_READ,
    PERMISSIONS.RESUME_DELETE,
    PERMISSIONS.DISCUSSION_CREATE,
    PERMISSIONS.DISCUSSION_READ,
    PERMISSIONS.DISCUSSION_UPDATE,
    PERMISSIONS.COMPANY_UPDATE_READ,
  ],
  company: [
    PERMISSIONS.JOB_CREATE,
    PERMISSIONS.JOB_READ,
    PERMISSIONS.JOB_UPDATE,
    PERMISSIONS.JOB_DELETE,
    PERMISSIONS.APPLICATION_READ,
    PERMISSIONS.APPLICATION_UPDATE,
    PERMISSIONS.RESUME_READ,
    PERMISSIONS.DISCUSSION_CREATE,
    PERMISSIONS.DISCUSSION_READ,
    PERMISSIONS.DISCUSSION_UPDATE,
    PERMISSIONS.COMPANY_UPDATE_CREATE,
    PERMISSIONS.COMPANY_UPDATE_READ,
    PERMISSIONS.COMPANY_UPDATE_UPDATE,
    PERMISSIONS.COMPANY_UPDATE_DELETE,
  ],
  admin: Object.values(PERMISSIONS),
};

export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  return rolePermissions.some(
    p => p.resource === permission.resource && p.action === permission.action
  );
}

export function requirePermission(userRole: UserRole, permission: Permission): void {
  if (!hasPermission(userRole, permission)) {
    throw new Error(`Access denied. Required permission: ${permission.resource}:${permission.action}`);
  }
}