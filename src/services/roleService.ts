import axiosInstance from '@/configs/axios';
import { RoleModel, CreateRoleRequest, UpdateRoleRequest } from '@/models/roleModel';
import { PaginationModel } from '@/models/paginationModel';

import { GetAllResponse, GetByIdResponse } from '@/interface/reponseInterface';

export const roleService = {
  getAllRoles: async (
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ items: RoleModel[]; pagination: PaginationModel }> => {
    try {
      const params: any = { page, limit };
      if (search) {
        params.search = search;
      }

      const res = await axiosInstance.get<GetAllResponse<RoleModel>>('/v1/roles', {
        params,
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!res?.data?.success) {
        throw new Error(res?.data?.message || 'Failed to fetch roles');
      }

      return {
        items: res.data.data.items,
        pagination: {
          total: res.data.pagination.totalItems,
        },
      };
    } catch (error: any) {
      console.error('Get roles error:', error);
      if (error?.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error?.message || 'Failed to fetch roles');
    }
  },

  getRoleById: async (id: string): Promise<RoleModel> => {
    try {
      const res = await axiosInstance.get<GetByIdResponse<RoleModel>>(`/v1/roles/${id}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!res?.data?.success) {
        throw new Error(res?.data?.message || 'Failed to fetch role');
      }

      return res.data.data;
    } catch (error: any) {
      console.error('Get role by ID error:', error);
      if (error?.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error?.message || 'Failed to fetch role');
    }
  },

  createRole: async (data: CreateRoleRequest): Promise<RoleModel> => {
    try {
      const res = await axiosInstance.post<GetByIdResponse<RoleModel>>('/v1/roles', data, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!res?.data?.success) {
        throw new Error(res?.data?.message || 'Failed to create role');
      }

      return res.data.data;
    } catch (error: any) {
      console.error('Create role error:', error);
      if (error?.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error?.message || 'Failed to create role');
    }
  },

  updateRole: async (id: string, data: UpdateRoleRequest): Promise<RoleModel> => {
    try {
      const res = await axiosInstance.put<GetByIdResponse<RoleModel>>(`/v1/roles/${id}`, data, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!res?.data?.success) {
        throw new Error(res?.data?.message || 'Failed to update role');
      }

      return res.data.data;
    } catch (error: any) {
      console.error('Update role error:', error);
      if (error?.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error?.message || 'Failed to update role');
    }
  },

  deleteRole: async (id: string): Promise<void> => {
    try {
      const res = await axiosInstance.delete(`/v1/roles/${id}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!res?.data?.success) {
        throw new Error(res?.data?.message || 'Failed to delete role');
      }
    } catch (error: any) {
      console.error('Delete role error:', error);
      if (error?.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error?.message || 'Failed to delete role');
    }
  },
};
