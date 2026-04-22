import axiosInstance from '@/configs/axios';
import { FolderModel, CreateFolderRequest, UpdateFolderRequest } from '@/models/folderModel';
import { GetAllResponse, GetByIdResponse, PaginationModel } from '@/models/responseModel';

export const folderService = {
  getAllFolders: async (
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ items: FolderModel[]; pagination: PaginationModel }> => {
    try {
      const params: any = { page, limit };
      if (search) params.search = search;

      const res = await axiosInstance.get<GetAllResponse<FolderModel>>('/v1/folders', { params });

      if (!res?.data?.success) {
        throw new Error(res?.data?.message || 'Failed to fetch folders');
      }

      const items = res.data.data.items ?? [];
      return {
        items: items,
        pagination: res.data.pagination,
      };
    } catch (error: any) {
      console.error('Fetch folders error', error);
      throw error;
    }
  },

  getFolderById: async (id: string): Promise<FolderModel | null> => {
    try {
      const res = await axiosInstance.get<GetByIdResponse<FolderModel>>(`/v1/folders/${id}`);
      return res.data.data;
    } catch (error) {
      console.error('Fetch folder error', error);
      return null;
    }
  },

  createFolder: async (data: CreateFolderRequest): Promise<FolderModel | null> => {
    try {
      const res = await axiosInstance.post<GetByIdResponse<FolderModel>>('/v1/folders', data);
      return res.data.data;
    } catch (error) {
      console.error('Create folder error', error);
      throw error;
    }
  },

  updateFolder: async (id: string, data: UpdateFolderRequest): Promise<FolderModel | null> => {
    try {
      const res = await axiosInstance.put<GetByIdResponse<FolderModel>>(`/v1/folders/${id}`, data);
      return res.data.data;
    } catch (error) {
      console.error('Update folder error', error);
      throw error;
    }
  },

  deleteFolder: async (id: string): Promise<boolean> => {
    try {
      const res = await axiosInstance.delete<GetByIdResponse<null>>(`/v1/folders/${id}`);
      return res.data.success;
    } catch (error) {
      console.error('Delete folder error', error);
      throw error;
    }
  },
};
