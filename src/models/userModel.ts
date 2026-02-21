export interface UserModel {
  id: string;
  username: string;
  email: string;
  role_id: string;
  role_name?: string;
  phone: string;
  first_name: string;
  last_name: string;
  department_id: string; // Keep as string for now if UI handles it as string input, but ideally number
  department_name?: string;
  sector_id: string;
  sector_name?: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role_id: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  department_id?: string;
  sector_id?: string;
  profile_picture?: File | null;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  role_id?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  department_id?: string;
  sector_id?: string;
  profile_picture?: File | null;
}
