
import axiosInstance from '@/configs/axios';

// Define Document Model based on backend
export interface DocumentModel {
    id: string;
    doc_no: string;
    doc_name: string; // Changed from title
    description?: string;
    doc_type_id: number;
    doc_type_name?: string;
    folder_id?: string;
    folder_name?: string;
    user_id: string; // uuid
    user_name?: string;
    status: string;
    doc_path?: string; // Changed from file_path
    type?: string;
    version_number: number;
    created_at: string;
    updated_at: string;
    department_id?: number;
    department_name?: string;
    send_to_director?: boolean;
    // Extra details for sidebar
    sector?: string;
    user_email?: string;
    user_phone?: string;
    user_avatar?: string;
}

export interface VersionModel {
    id: number;
    doc_id: number;
    version_number: number;
    doc_path: string;
    created_at: string;
}

export interface CreateDocumentRequest {
    doc_name: string; // Changed from title
    description?: string;
    doc_type_id: number;
    department_id?: number;
    folder_id?: string;
    file: File;
}

interface DocumentResponse {
    success: boolean;
    message: string;
    data: DocumentModel;
}



interface VersionsResponse {
    success: boolean;
    message: string;
    data: VersionModel[];
}


export const documentService = {
    getAllDocuments: async (): Promise<DocumentModel[]> => {
        try {
            const response = await axiosInstance.get<any>('/v1/documents');
            if (response.data.success) {
                return response.data.data; // Adjusted based on backend util.Response
            }
            return [];
        } catch (error) {
            console.error("Fetch documents error", error);
            return [];
        }
    },

    getDocumentById: async (id: string): Promise<DocumentModel | null> => {
        try {
            const response = await axiosInstance.get<DocumentResponse>(`/v1/documents/${id}`);
            if (response.data.success) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error("Fetch document error", error);
            return null;
        }
    },

    getDocumentsByFolder: async (folderId: string): Promise<DocumentModel[]> => {
        try {
            const response = await axiosInstance.get<any>(`/v1/documents/folder/${folderId}`);
            if (response.data.success) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error("Fetch documents by folder error", error);
            return [];
        }
    },

    getDocumentVersions: async (id: string): Promise<VersionModel[]> => {
        try {
            const response = await axiosInstance.get<VersionsResponse>(`/v1/documents/${id}/versions`);
            if (response.data.success) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error("Fetch document versions error", error);
            return [];
        }
    },

    createDocument: async (data: any): Promise<DocumentModel | null> => {
        try {
            const response = await axiosInstance.post<DocumentResponse>('/v1/documents', data);
            if (response.data.success) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error("Create document error", error);
            throw error;
        }
    },

    updateDocument: async (id: string, data: any): Promise<DocumentModel | null> => {
        try {
            const response = await axiosInstance.put<DocumentResponse>(`/v1/documents/${id}`, data);
            if (response.data.success) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error("Update document error", error);
            throw error;
        }
    },

    deleteDocument: async (id: string): Promise<boolean> => {
        try {
            const response = await axiosInstance.delete<{ success: boolean }>(`/v1/documents/${id}`);
            return response.data.success;
        } catch (error) {
            console.error("Delete document error", error);
            throw error;
        }
    },
};
