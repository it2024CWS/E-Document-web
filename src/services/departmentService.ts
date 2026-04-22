import axiosInstance from '@/configs/axios';
import { DepartmentModel, CreateDepartmentRequest, UpdateDepartmentRequest } from '@/models/departmentModel';
import { GetAllResponse, GetByIdResponse } from '@/interface/reponseInterface';

export const departmentService = {
  getAllDepartments: async (
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ items: DepartmentModel[]; total: number }> => {
    const params: any = { page, limit };
    if (search) params.search = search;

    const res = await axiosInstance.get<GetAllResponse<DepartmentModel>>('/v1/departments', { params });
    
    // In our new standardized response, for pagination it's res.data.data.items
    return {
      items: res.data.data.items,
      total: res.data.pagination.totalItems
    };
  },

  getDepartmentById: async (id: string): Promise<DepartmentModel> => {
    const res = await axiosInstance.get<GetByIdResponse<DepartmentModel>>(`/v1/departments/${id}`);
    return res.data.data;
  },

  createDepartment: async (data: CreateDepartmentRequest): Promise<DepartmentModel> => {
    const res = await axiosInstance.post<GetByIdResponse<DepartmentModel>>('/v1/departments', data);
    return res.data.data;
  },

  updateDepartment: async (id: string, data: UpdateDepartmentRequest): Promise<DepartmentModel> => {
    const res = await axiosInstance.put<GetByIdResponse<DepartmentModel>>(`/v1/departments/${id}`, data);
    return res.data.data;
  },

  deleteDepartment: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/v1/departments/${id}`);
  },
};
