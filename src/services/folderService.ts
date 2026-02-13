
import axiosInstance from '@/configs/axios';
import { FolderModel, CreateFolderRequest, UpdateFolderRequest } from '@/models/folderModel';

interface FolderResponse {
    success: boolean;
    message: string;
    data: FolderModel;
}

interface FoldersResponse {
    success: boolean;
    message: string;
    data: {
        items: FolderModel[];
    };
}

export const folderService = {
    getAllFolders: async (): Promise<FolderModel[]> => {
        try {
            const res = await axiosInstance.get<FoldersResponse>('/v1/folders');
            if (res.data.success) {
                return res.data.data.items;
            }
            return [];
        } catch (error) {
            console.error("Fetch folders error", error);
            return [];
        }
    },

    getFolderById: async (id: string): Promise<FolderModel | null> => {
        try {
            const res = await axiosInstance.get<FolderResponse>(`/v1/folders/${id}`);
            if (res.data.success) {
                return res.data.data;
            }
            return null;
        } catch (error) {
            console.error("Fetch folder error", error);
            return null;
        }
    },

    createFolder: async (data: CreateFolderRequest): Promise<FolderModel | null> => {
        try {
            const res = await axiosInstance.post<FolderResponse>('/v1/folders', data);
            if (res.data.success) {
                return res.data.data;
            }
            return null;
        } catch (error) {
            console.error("Create folder error", error);
            throw error;
        }
    },

    updateFolder: async (id: string, data: UpdateFolderRequest): Promise<FolderModel | null> => {
        try {
            const res = await axiosInstance.put<FolderResponse>(`/v1/folders/${id}`, data);
            if (res.data.success) {
                return res.data.data;
            }
            return null;
        } catch (error) {
            console.error("Update folder error", error);
            throw error;
        }
    },

    deleteFolder: async (id: string): Promise<boolean> => {
        try {
            const res = await axiosInstance.delete<{ success: boolean }>(`/v1/folders/${id}`);
            return res.data.success;
        } catch (error) {
            console.error("Delete folder error", error);
            throw error;
        }
    }
};
