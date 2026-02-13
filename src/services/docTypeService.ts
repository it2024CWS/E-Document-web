import axios from "axios";

const API_URL = "http://localhost:5001/api/v1/doctypes";

export const docTypeService = {
    getAllDocTypes: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    getDocTypeById: async (id: number) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    createDocType: async (data: any) => {
        const response = await axios.post(API_URL, data);
        return response.data;
    },

    updateDocType: async (id: number, data: any) => {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    deleteDocType: async (id: number) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    },
};
