export enum UserRoleEnum {
  Director = 'Director',
  DepartmentManager = 'DepartmentManager',
  SectorManager = 'SectorManager',
  Employee = 'Employee',
}

export const UserRoleLabels: Record<UserRoleEnum, string> = {
  [UserRoleEnum.Director]: 'Director',
  [UserRoleEnum.DepartmentManager]: 'Department Manager',
  [UserRoleEnum.SectorManager]: 'Sector Manager',
  [UserRoleEnum.Employee]: 'Employee',
};
