import axios from "axios";

const API_URL = "http://localhost:5001/api/v1/incoming-docs";

export const incomingDocService = {
    getAllIncomingDocs: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    getIncomingDocById: async (id: string) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    getIncomingDocsByReceiver: async (receiverId: string) => {
        const response = await axios.get(`${API_URL}/receiver/${receiverId}`);
        return response.data;
    },

    getIncomingDocsByStatus: async (status: string) => {
        const response = await axios.get(`${API_URL}/status/${status}`);
        return response.data;
    },

    receiveDocument: async (id: string, data: any) => {
        const response = await axios.post(`${API_URL}/${id}/receive`, data);
        return response.data;
    },

    approveDocument: async (id: string, data: any) => {
        const response = await axios.post(`${API_URL}/${id}/approve`, data);
        return response.data;
    },
};
