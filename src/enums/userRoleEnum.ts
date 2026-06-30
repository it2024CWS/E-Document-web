import {
  DASHBOARD_PATH, DOCUMENT_PATH, DOC_CENTER_PATH, REJECTED_DOC_PATH,
  USER_PATH, ROLE_PATH, DEPARTMENT_PATH, DOCTYPE_PATH,
} from '@/routes/config';

export enum UserRoleEnum {
  Admin = 'Admin',
  Director = 'Director',
  Manager = 'Manager',
  Secretary = 'Secretary',
  Staff = 'Staff',
}

// Document action permissions
export const canReceiveDocument = (role?: string) =>
  role === UserRoleEnum.Secretary || role === UserRoleEnum.Director;

export const canApproveOrRejectDocument = (role?: string) =>
  role === UserRoleEnum.Manager || role === UserRoleEnum.Director;

// Profile self-edit (can change role/dept/sector on own profile)
export const canEditOwnRoleDeptSector = (role?: string) =>
  role === UserRoleEnum.Admin || role === UserRoleEnum.Director;

// Menu paths visible in sidebar
export const getMenuPathsForRole = (role?: string): string[] => {
  const FULL = [
    DASHBOARD_PATH, DOCUMENT_PATH, DOC_CENTER_PATH, REJECTED_DOC_PATH,
    USER_PATH, ROLE_PATH, DEPARTMENT_PATH, DOCTYPE_PATH,
  ];
  switch (role) {
    case UserRoleEnum.Admin:
    case UserRoleEnum.Director:
      return FULL;
    case UserRoleEnum.Manager:
      return [DASHBOARD_PATH, DOCUMENT_PATH, DOC_CENTER_PATH, REJECTED_DOC_PATH, DEPARTMENT_PATH];
    case UserRoleEnum.Secretary:
      return [DASHBOARD_PATH, DOCUMENT_PATH, DOC_CENTER_PATH, REJECTED_DOC_PATH];
    case UserRoleEnum.Staff:
      return [DOCUMENT_PATH];
    default:
      return [];
  }
};

// Route-level access — extends menu paths with USER_PATH so non-admin
// roles can still open their own profile via the AppBar Profile menu.
export const getAccessiblePathsForRole = (role?: string): string[] => {
  const menu = getMenuPathsForRole(role);
  if (role && role !== UserRoleEnum.Admin && role !== UserRoleEnum.Director) {
    return [...menu, USER_PATH];
  }
  return menu;
};

// Default landing page after login
export const getDefaultPathForRole = (role?: string): string => {
  if (role === UserRoleEnum.Staff) return DOCUMENT_PATH;
  return DASHBOARD_PATH;
};
