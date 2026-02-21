import axiosInstance from '@/configs/axios';

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

export const departmentService = {
    getAllDepartments: async (): Promise<DepartmentModel[]> => {
        const res = await axiosInstance.get('/v1/departments');
        return res.data.data;
    },

    getDepartmentById: async (id: string): Promise<DepartmentModel> => {
        const res = await axiosInstance.get(`/v1/departments/${id}`);
        return res.data.data;
    },

    createDepartment: async (data: CreateDepartmentRequest): Promise<DepartmentModel> => {
        const res = await axiosInstance.post('/v1/departments', data);
        return res.data.data;
    },

    updateDepartment: async (id: string, data: UpdateDepartmentRequest): Promise<DepartmentModel> => {
        const res = await axiosInstance.put(`/v1/departments/${id}`, data);
        return res.data.data;
    },

    deleteDepartment: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/v1/departments/${id}`);
    },
};
