export interface AuthModel {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenModel {
  access_token: string;
  refresh_token: string;
}

export interface UserDataModel {
  id: string;
  username: string;
  email: string;
  role_id: string;
  role_name?: string;
  first_name?: string;
  last_name?: string;
  department_id?: string | null;
  department_name?: string;
  sector_id?: string | null;
  sector_name?: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponseModel {
  success: boolean;
  message: string;
  error_code: string;
  data: UserDataModel;
}

export interface ProfileModel {
  id: string;
  username: string;
  status: string;
  staff_role_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  company: string;
  department: string;
  profile: string;
  created_at: Date;
  updated_at: null;
}
