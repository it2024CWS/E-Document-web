import axiosInstance from '@/configs/axios';
import { DocTypeModel, CreateDocTypeRequest, UpdateDocTypeRequest } from '@/models/docTypeModel';
import { GetAllResponse, GetByIdResponse, PaginationModel } from '@/models/responseModel';

export const docTypeService = {
  getAllDocTypes: async (
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ items: DocTypeModel[]; pagination: PaginationModel }> => {
    try {
      const params: any = { page, limit };
      if (search) params.search = search;

      const res = await axiosInstance.get<GetAllResponse<DocTypeModel>>('/v1/doctypes', { params });
      
      if (!res?.data?.success) {
        throw new Error(res?.data?.message || 'Failed to fetch doctypes');
      }

      return {
        items: res.data.data.items ?? [],
        pagination: res.data.pagination,
      };
    } catch (error: any) {
      console.error('Fetch doctypes error', error);
      throw error;
    }
  },

  getDocTypeById: async (id: string): Promise<DocTypeModel | null> => {
    try {
      const res = await axiosInstance.get<GetByIdResponse<DocTypeModel>>(`/v1/doctypes/${id}`);
      return res.data.data;
    } catch (error) {
      console.error('Fetch doctype error', error);
      return null;
    }
  },

  createDocType: async (data: CreateDocTypeRequest): Promise<DocTypeModel | null> => {
    try {
      const res = await axiosInstance.post<GetByIdResponse<DocTypeModel>>('/v1/doctypes', data);
      return res.data.data;
    } catch (error) {
      console.error('Create doctype error', error);
      throw error;
    }
  },

  updateDocType: async (id: string, data: UpdateDocTypeRequest): Promise<DocTypeModel | null> => {
    try {
      const res = await axiosInstance.put<GetByIdResponse<DocTypeModel>>(`/v1/doctypes/${id}`, data);
      return res.data.data;
    } catch (error) {
      console.error('Update doctype error', error);
      throw error;
    }
  },

  deleteDocType: async (id: string): Promise<boolean> => {
    try {
      const res = await axiosInstance.delete<GetByIdResponse<null>>(`/v1/doctypes/${id}`);
      return res.data.success;
    } catch (error) {
      console.error('Delete doctype error', error);
      throw error;
    }
  },
};
