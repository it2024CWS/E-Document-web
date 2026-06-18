import axiosInstance from '@/configs/axios';
import { RoleModel, CreateRoleRequest, UpdateRoleRequest } from '@/models/roleModel';
import { PaginationModel } from '@/models/responseModel';
import { GetAllResponse, GetByIdResponse } from '@/models/responseModel';

export const roleService = {
  getAllRoles: async (
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ items: RoleModel[]; pagination: PaginationModel }> => {
    const params: any = { page, limit };
    if (search) params.search = search;

    const res = await axiosInstance.get<GetAllResponse<RoleModel>>('/v1/roles', {
      params,
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });

    return {
      items: res.data.data?.items ?? [],
      pagination: res.data.pagination ?? {
        totalItems: res.data.data?.items?.length ?? 0,
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: res.data.data?.items?.length ?? 0,
      },
    };
  },

  getRoleById: async (id: string): Promise<RoleModel> => {
    const res = await axiosInstance.get<GetByIdResponse<RoleModel>>(`/v1/roles/${id}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
    return res.data.data;
  },

  createRole: async (data: CreateRoleRequest): Promise<RoleModel> => {
    const res = await axiosInstance.post<GetByIdResponse<RoleModel>>('/v1/roles', data, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
    return res.data.data;
  },

  updateRole: async (id: string, data: UpdateRoleRequest): Promise<RoleModel> => {
    const res = await axiosInstance.put<GetByIdResponse<RoleModel>>(`/v1/roles/${id}`, data, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
    return res.data.data;
  },

  deleteRole: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/v1/roles/${id}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
  },
};
