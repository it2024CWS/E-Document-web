import axiosInstance from '@/configs/axios';

export const outgoingDocService = {
    getAllOutgoingDocs: async (page: number = 1, limit: number = 10) => {
        const response = await axiosInstance.get('/v1/outgoing-docs', {
            params: { page, limit }
        });
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
};
