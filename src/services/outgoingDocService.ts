import axios from "axios";

const API_URL = "http://localhost:5001/api/v1/outgoing-docs";

export const outgoingDocService = {
    getAllOutgoingDocs: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    getOutgoingDocById: async (id: string) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    getOutgoingDocsByUser: async (userId: string) => {
        const response = await axios.get(`${API_URL}/user/${userId}`);
        return response.data;
    },

    createOutgoingDoc: async (data: any) => {
        const response = await axios.post(API_URL, data);
        return response.data;
    },
};
