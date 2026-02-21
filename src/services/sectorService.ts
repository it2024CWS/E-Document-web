import axiosInstance from '@/configs/axios';

export interface SectorModel {
    id: string;
    name: string;
    dept_id: string;
    dept_name: string;
    created_at: string;
    updated_at: string;
}

export interface CreateSectorRequest {
    name: string;
    dept_id: string;
}

export interface UpdateSectorRequest {
    name?: string;
    dept_id?: string;
}

export const sectorService = {
    getAllSectors: async (): Promise<SectorModel[]> => {
        const res = await axiosInstance.get('/v1/sectors');
        return res.data.data;
    },

    getSectorById: async (id: string): Promise<SectorModel> => {
        const res = await axiosInstance.get(`/v1/sectors/${id}`);
        return res.data.data;
    },

    getSectorsByDepartment: async (deptId: string): Promise<SectorModel[]> => {
        const res = await axiosInstance.get(`/v1/departments/${deptId}/sectors`);
        return res.data.data;
    },

    createSector: async (data: CreateSectorRequest): Promise<SectorModel> => {
        const res = await axiosInstance.post('/v1/sectors', data);
        return res.data.data;
    },

    updateSector: async (id: string, data: UpdateSectorRequest): Promise<SectorModel> => {
        const res = await axiosInstance.put(`/v1/sectors/${id}`, data);
        return res.data.data;
    },

    deleteSector: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/v1/sectors/${id}`);
    },
};
