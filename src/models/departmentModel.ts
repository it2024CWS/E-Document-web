export interface DepartmentModel {
  id: string;
  dept_name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDepartmentRequest {
  dept_name: string;
  description?: string;
}

export interface UpdateDepartmentRequest {
  dept_name?: string;
  description?: string;
}
