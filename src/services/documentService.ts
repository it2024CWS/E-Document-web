
import axiosInstance from '@/configs/axios';

// ── Types matching backend DocumentResponse ───────────────────────────────────

export interface DocumentModel {
    id: string;
    doc_no: string;
    doc_name: string;
    doc_path: string;
    type: string;
    doc_type_id?: string;
    doc_type_name?: string;
    folder_id?: string;
    folder_name?: string;
    registrant_id?: string;
    registrant_name?: string;
    registrant_email?: string;
    department_name?: string;
    sector_name?: string;
    status: string;
    version_number: number;
    description?: string;
    send_to_director?: boolean;
    created_at: string;
    updated_at: string;
}

export interface VersionModel {
    id: string;
    doc_id: string;
    version_number: number;
    doc_path: string;
    created_at: string;
}

export interface CreateDocumentRequest {
    doc_name: string;
    description?: string;
    doc_type_id?: string;
    folder_id?: string;
    send_to_director?: boolean;
}

// ── API helpers ───────────────────────────────────────────────────────────────

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const documentService = {
    getAllDocuments: async (): Promise<DocumentModel[]> => {
        try {
            const res = await axiosInstance.get<ApiResponse<DocumentModel[]>>('/v1/documents');
            return res.data.data ?? [];
        } catch (error) {
            console.error('Fetch documents error', error);
            return [];
        }
    },

    getDocumentById: async (id: string): Promise<DocumentModel | null> => {
        try {
            const res = await axiosInstance.get<ApiResponse<DocumentModel>>(`/v1/documents/${id}`);
            return res.data.data;
        } catch (error) {
            console.error('Fetch document error', error);
            return null;
        }
    },

    getDocumentsByFolder: async (folderId: string): Promise<DocumentModel[]> => {
        try {
            const res = await axiosInstance.get<ApiResponse<DocumentModel[]>>(
                `/v1/documents/folder/${folderId}`
            );
            return res.data.data ?? [];
        } catch (error) {
            console.error('Fetch documents by folder error', error);
            return [];
        }
    },

    getDocumentVersions: async (id: string): Promise<VersionModel[]> => {
        try {
            const res = await axiosInstance.get<ApiResponse<VersionModel[]>>(
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
            const res = await axiosInstance.post<ApiResponse<DocumentModel>>('/v1/documents', data);
            return res.data.data;
        } catch (error) {
            console.error('Create document error', error);
            throw error;
        }
    },

    updateDocument: async (id: string, data: any): Promise<DocumentModel | null> => {
        try {
            const res = await axiosInstance.put<ApiResponse<DocumentModel>>(`/v1/documents/${id}`, data);
            return res.data.data;
        } catch (error) {
            console.error('Update document error', error);
            throw error;
        }
    },

    deleteDocument: async (id: string): Promise<boolean> => {
        try {
            const res = await axiosInstance.delete<{ success: boolean }>(`/v1/documents/${id}`);
            return res.data.success;
        } catch (error) {
            console.error('Delete document error', error);
            throw error;
        }
    },
};
