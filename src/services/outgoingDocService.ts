import axiosInstance from '@/configs/axios';

export interface OutgoingDocFilter {
    page?: number;
    limit?: number;
    departmentId?: string;
    startDate?: string;
    endDate?: string;
    docNo?: string;
}

export const outgoingDocService = {
    getAllOutgoingDocs: async (page: number = 1, limit: number = 10, filters?: OutgoingDocFilter) => {
        const params: any = { page, limit };
        if (filters?.departmentId) params.department_id = filters.departmentId;
        if (filters?.startDate) params.start_date = filters.startDate;
        if (filters?.endDate) params.end_date = filters.endDate;
        if (filters?.docNo) params.doc_no = filters.docNo;

        const response = await axiosInstance.get('/v1/outgoing-docs', { params });
        return response.data;
    },

    getOutgoingDocById: async (id: string) => {
        const response = await axiosInstance.get(`/v1/outgoing-docs/${id}`);
        return response.data;
    },

    getOutgoingDocsByUser: async (userId: string) => {
        const response = await axiosInstance.get(`/v1/outgoing-docs/user/${userId}`);
        return response.data;
    },

    createOutgoingDoc: async (data: any) => {
        const response = await axiosInstance.post('/v1/outgoing-docs', data);
        return response.data;
    },

    // Owner department head approves/rejects the outgoing doc. On approval the
    // sequential recipient flow starts (first recipient's incoming doc is created).
    approveOutgoingDoc: async (id: string, data: { status: 'approved' | 'rejected'; remark?: string }) => {
        const response = await axiosInstance.post(`/v1/outgoing-docs/${id}/approve`, data);
        return response.data;
    },
};
