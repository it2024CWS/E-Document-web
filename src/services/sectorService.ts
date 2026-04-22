import axiosInstance from '@/configs/axios';
import { SectorModel, CreateSectorRequest, UpdateSectorRequest } from '@/models/sectorModel';
import { GetAllResponse, GetByIdResponse } from '@/interface/reponseInterface';

export const sectorService = {
  getAllSectors: async (
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ items: SectorModel[]; total: number }> => {
    const params: any = { page, limit };
    if (search) params.search = search;

    const res = await axiosInstance.get<GetAllResponse<SectorModel>>('/v1/sectors', { params });
    
    return {
      items: res.data.data.items,
      total: res.data.pagination.totalItems
    };
  },

  getSectorById: async (id: string): Promise<SectorModel> => {
    const res = await axiosInstance.get<GetByIdResponse<SectorModel>>(`/v1/sectors/${id}`);
    return res.data.data;
  },

  getSectorsByDepartment: async (deptId: string): Promise<SectorModel[]> => {
    // New route: /v1/sectors/department/{deptId}
    const res = await axiosInstance.get<GetByIdResponse<SectorModel[]>>(`/v1/sectors/department/${deptId}`);
    // This one uses OKResponse, so data is directly the array
    return res.data.data;
  },

  createSector: async (data: CreateSectorRequest): Promise<SectorModel> => {
    const res = await axiosInstance.post<GetByIdResponse<SectorModel>>('/v1/sectors', data);
    return res.data.data;
  },

  updateSector: async (id: string, data: UpdateSectorRequest): Promise<SectorModel> => {
    const res = await axiosInstance.put<GetByIdResponse<SectorModel>>(`/v1/sectors/${id}`, data);
    return res.data.data;
  },

  deleteSector: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/v1/sectors/${id}`);
  },
};
