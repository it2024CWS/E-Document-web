import axiosInstance from '@/configs/axios';


export const incomingDocService = {
    getAllIncomingDocs: async (page: number = 1, limit: number = 10) => {
        const response = await axiosInstance.get('/v1/incoming-docs', {
            params: { page, limit }
        });
        return response.data;
    },

    getIncomingDocById: async (id: string) => {
        const response = await axiosInstance.get(`/v1/incoming-docs/${id}`);
        return response.data;
    },

    getIncomingDocsByReceiver: async (receiverId: string) => {
        const response = await axiosInstance.get(`/v1/incoming-docs/receiver/${receiverId}`);
        return response.data;
    },

    getIncomingDocsByStatus: async (status: string) => {
        const response = await axiosInstance.get(`/v1/incoming-docs/status/${status}`);
        return response.data;
    },

    receiveDocument: async (id: string, data: any) => {
        const response = await axiosInstance.post(`/v1/incoming-docs/${id}/receive`, data);
        return response.data;
    },

    approveDocument: async (id: string, data: any) => {
        const response = await axiosInstance.post(`/v1/incoming-docs/${id}/approve`, data);
        return response.data;
    },
};
