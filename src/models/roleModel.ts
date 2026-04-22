export interface RoleModel {
  id: string;
  role_name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRoleRequest {
  role_name: string;
  description?: string;
}

export interface UpdateRoleRequest {
  role_name?: string;
  description?: string;
}
