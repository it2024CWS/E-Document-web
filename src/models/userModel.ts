export interface UserModel {
  id: string;
  username: string;
  email: string;
  role: string;
  phone: string;
  first_name: string;
  last_name: string;
  department_id: string;
  sector_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  department_id?: string;
  sector_id?: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  department_id?: string;
  sector_id?: string;
}
