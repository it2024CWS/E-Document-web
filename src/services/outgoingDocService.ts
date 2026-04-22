import axiosInstance from '@/configs/axios';

export const outgoingDocService = {
    getAllOutgoingDocs: async () => {
        const response = await axiosInstance.get('/outgoing-docs');
        return response.data;
    },

    getOutgoingDocById: async (id: string) => {
        const response = await axiosInstance.get(`/outgoing-docs/${id}`);
        return response.data;
    },

    getOutgoingDocsByUser: async (userId: string) => {
        const response = await axiosInstance.get(`/outgoing-docs/user/${userId}`);
        return response.data;
    },

    createOutgoingDoc: async (data: any) => {
        const response = await axiosInstance.post('/outgoing-docs', data);
        return response.data;
    },
};
