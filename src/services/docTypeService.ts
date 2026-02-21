import axiosInstance from '@/configs/axios';

export interface DocTypeModel {
    id: string;
    type_name: string;
    description: string;
    created_at?: string;
    updated_at?: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const docTypeService = {
    getAllDocTypes: async (): Promise<DocTypeModel[]> => {
        try {
            const res = await axiosInstance.get<ApiResponse<DocTypeModel[]>>('/v1/doctypes');
            return res.data.data ?? [];
        } catch (error) {
            console.error('Fetch doctypes error', error);
            return [];
        }
    },

    getDocTypeById: async (id: string): Promise<DocTypeModel | null> => {
        try {
            const res = await axiosInstance.get<ApiResponse<DocTypeModel>>(`/v1/doctypes/${id}`);
            return res.data.data;
        } catch (error) {
            console.error('Fetch doctype error', error);
            return null;
        }
    },

    createDocType: async (data: { type_name: string; description?: string }): Promise<DocTypeModel | null> => {
        try {
            const res = await axiosInstance.post<ApiResponse<DocTypeModel>>('/v1/doctypes', data);
            return res.data.data;
        } catch (error) {
            console.error('Create doctype error', error);
            throw error;
        }
    },

    updateDocType: async (id: string, data: { type_name?: string; description?: string }): Promise<DocTypeModel | null> => {
        try {
            const res = await axiosInstance.put<ApiResponse<DocTypeModel>>(`/v1/doctypes/${id}`, data);
            return res.data.data;
        } catch (error) {
            console.error('Update doctype error', error);
            throw error;
        }
    },

    deleteDocType: async (id: string): Promise<boolean> => {
        try {
            const res = await axiosInstance.delete<{ success: boolean }>(`/v1/doctypes/${id}`);
            return res.data.success;
        } catch (error) {
            console.error('Delete doctype error', error);
            throw error;
        }
    },
};
