
import axiosInstance from '@/configs/axios';
import { FolderModel, CreateFolderRequest, UpdateFolderRequest, adaptFolder } from '@/models/folderModel';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const folderService = {
    getAllFolders: async (): Promise<FolderModel[]> => {
        try {
            const res = await axiosInstance.get<ApiResponse<FolderModel[]>>('/v1/folders');
            const items = res.data.data ?? [];
            return items.map(adaptFolder);
        } catch (error) {
            console.error('Fetch folders error', error);
            return [];
        }
    },

    getFolderById: async (id: string): Promise<FolderModel | null> => {
        try {
            const res = await axiosInstance.get<ApiResponse<FolderModel>>(`/v1/folders/${id}`);
            return adaptFolder(res.data.data);
        } catch (error) {
            console.error('Fetch folder error', error);
            return null;
        }
    },

    createFolder: async (data: CreateFolderRequest): Promise<FolderModel | null> => {
        try {
            const res = await axiosInstance.post<ApiResponse<FolderModel>>('/v1/folders', data);
            return adaptFolder(res.data.data);
        } catch (error) {
            console.error('Create folder error', error);
            throw error;
        }
    },

    updateFolder: async (id: string, data: UpdateFolderRequest): Promise<FolderModel | null> => {
        try {
            const res = await axiosInstance.put<ApiResponse<FolderModel>>(`/v1/folders/${id}`, data);
            return adaptFolder(res.data.data);
        } catch (error) {
            console.error('Update folder error', error);
            throw error;
        }
    },

    deleteFolder: async (id: string): Promise<boolean> => {
        try {
            const res = await axiosInstance.delete<{ success: boolean }>(`/v1/folders/${id}`);
            return res.data.success;
        } catch (error) {
            console.error('Delete folder error', error);
            throw error;
        }
    },
};
