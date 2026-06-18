import axiosInstance from '@/configs/axios';
import { UserModel, CreateUserRequest, UpdateUserRequest } from '@/models/userModel';
import { GetAllResponse, GetByIdResponse, PaginationModel } from '@/models/responseModel';

export const getUsersService = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<{ items: UserModel[]; pagination: PaginationModel }> => {
  const params: any = { page, limit };
  if (search) params.search = search;

  const res = await axiosInstance.get<GetAllResponse<UserModel>>('/v1/users', {
    params,
    headers: { 'ngrok-skip-browser-warning': 'true' },
  });

  return { items: res.data.data.items, pagination: res.data.pagination };
};

export const getUserByIdService = async (id: string): Promise<UserModel> => {
  const res = await axiosInstance.get<GetByIdResponse<UserModel>>(`/v1/users/${id}`, {
    headers: { 'ngrok-skip-browser-warning': 'true' },
  });
  return res.data.data;
};

export const createUserService = async (data: CreateUserRequest): Promise<UserModel> => {
  const formData = new FormData();
  formData.append('username', data.username);
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('role_id', data.role_id.toString());
  if (data.phone) formData.append('phone', data.phone);
  if (data.firstname) formData.append('firstname', data.firstname);
  if (data.lastname) formData.append('lastname', data.lastname);
  if (data.department_id) formData.append('department_id', data.department_id.toString());
  if (data.sector_id) formData.append('sector_id', data.sector_id.toString());
  if (data.profile_picture) formData.append('profile_picture', data.profile_picture);

  const res = await axiosInstance.post<GetByIdResponse<UserModel>>('/v1/users', formData, {
    headers: { 'ngrok-skip-browser-warning': 'true' },
  });

  return res.data.data;
};

export const updateUserService = async (id: string, data: UpdateUserRequest): Promise<UserModel> => {
  const formData = new FormData();
  if (data.username !== undefined) formData.append('username', data.username);
  if (data.email !== undefined) formData.append('email', data.email);
  if (data.password !== undefined) formData.append('password', data.password);
  if (data.role_id !== undefined) formData.append('role_id', data.role_id.toString());
  if (data.phone !== undefined) formData.append('phone', data.phone);
  if (data.firstname !== undefined) formData.append('firstname', data.firstname);
  if (data.lastname !== undefined) formData.append('lastname', data.lastname);
  if (data.department_id !== undefined) formData.append('department_id', data.department_id.toString());
  if (data.sector_id !== undefined) formData.append('sector_id', data.sector_id.toString());
  if (data.profile_picture !== undefined && data.profile_picture !== null) {
    formData.append('profile_picture', data.profile_picture);
  }

  const res = await axiosInstance.put<GetByIdResponse<UserModel>>(`/v1/users/${id}`, formData, {
    headers: { 'ngrok-skip-browser-warning': 'true' },
  });

  return res.data.data;
};

export const deleteUserService = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/v1/users/${id}`, {
    headers: { 'ngrok-skip-browser-warning': 'true' },
  });
};

export const resetPasswordService = async (id: string, newPassword: string, confirmPassword: string): Promise<void> => {
  await axiosInstance.put(
    `/v1/users/${id}/reset-password`,
    { new_password: newPassword, confirm_password: confirmPassword },
    { headers: { 'ngrok-skip-browser-warning': 'true' } }
  );
};
