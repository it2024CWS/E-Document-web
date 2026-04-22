import axiosInstance from '@/configs/axios';
import { DocumentModel, VersionModel, CreateDocumentRequest } from '@/models/documentModel';
import { GetAllResponse, GetByIdResponse, PaginationModel } from '@/models/responseModel';

export const documentService = {
  getAllDocuments: async (
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ items: DocumentModel[]; pagination: PaginationModel }> => {
    try {
      const params: any = { page, limit };
      if (search) params.search = search;

      const res = await axiosInstance.get<GetAllResponse<DocumentModel>>('/v1/documents', { params });
      
      if (!res?.data?.success) {
        throw new Error(res?.data?.message || 'Failed to fetch documents');
      }

      return {
        items: res.data.data.items ?? [],
        pagination: res.data.pagination,
      };
    } catch (error) {
      console.error('Fetch documents error', error);
      return { items: [], pagination: null! };
    }
  },

  getDocumentById: async (id: string): Promise<DocumentModel | null> => {
    try {
      const res = await axiosInstance.get<GetByIdResponse<DocumentModel>>(`/v1/documents/${id}`);
      return res.data.data;
    } catch (error) {
      console.error('Fetch document error', error);
      return null;
    }
  },

  getDocumentsByFolder: async (
    folderId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ items: DocumentModel[]; pagination: PaginationModel }> => {
    try {
      const params = { page, limit };
      const res = await axiosInstance.get<GetAllResponse<DocumentModel>>(
        `/v1/documents/folder/${folderId}`,
        { params }
      );
      
      return {
        items: res.data.data.items ?? [],
        pagination: res.data.pagination,
      };
    } catch (error) {
      console.error('Fetch documents by folder error', error);
      return { items: [], pagination: null! };
    }
  },

  getDocumentVersions: async (id: string): Promise<VersionModel[]> => {
    try {
      // Version history usually isn't paginated in the same way, or returns a simple list
      const res = await axiosInstance.get<GetByIdResponse<VersionModel[]>>(
        `/v1/documents/${id}/versions`
      );
      return res.data.data ?? [];
    } catch (error) {
      console.error('Fetch document versions error', error);
      return [];
    }
  },

  createDocument: async (data: any): Promise<DocumentModel | null> => {
    try {
      const res = await axiosInstance.post<GetByIdResponse<DocumentModel>>('/v1/documents', data);
      return res.data.data;
    } catch (error) {
      console.error('Create document error', error);
      throw error;
    }
  },

  updateDocument: async (id: string, data: any): Promise<DocumentModel | null> => {
    try {
      const res = await axiosInstance.put<GetByIdResponse<DocumentModel>>(`/v1/documents/${id}`, data);
      return res.data.data;
    } catch (error) {
      console.error('Update document error', error);
      throw error;
    }
  },

  deleteDocument: async (id: string): Promise<boolean> => {
    try {
      const res = await axiosInstance.delete<GetByIdResponse<null>>(`/v1/documents/${id}`);
      return res.data.success;
    } catch (error) {
      console.error('Delete document error', error);
      throw error;
    }
  },
};
