import axiosInstance from '@/configs/axios';


export const incomingDocService = {
    getAllIncomingDocs: async () => {
        const response = await axiosInstance.get('/incoming-docs');
        return response.data;
    },

    getIncomingDocById: async (id: string) => {
        const response = await axiosInstance.get(`/incoming-docs/${id}`);
        return response.data;
    },

    getIncomingDocsByReceiver: async (receiverId: string) => {
        const response = await axiosInstance.get(`/incoming-docs/receiver/${receiverId}`);
        return response.data;
    },

    getIncomingDocsByStatus: async (status: string) => {
        const response = await axiosInstance.get(`/incoming-docs/status/${status}`);
        return response.data;
    },

    receiveDocument: async (id: string, data: any) => {
        const response = await axiosInstance.post(`/incoming-docs/${id}/receive`, data);
        return response.data;
    },

    approveDocument: async (id: string, data: any) => {
        const response = await axiosInstance.post(`/incoming-docs/${id}/approve`, data);
        return response.data;
    },
};
