import axios from "axios";

const API_URL = "http://localhost:5001/api/v1/roles";

export const roleService = {
    getAllRoles: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    getRoleById: async (id: number) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    createRole: async (data: any) => {
        const response = await axios.post(API_URL, data);
        return response.data;
    },

    updateRole: async (id: number, data: any) => {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    deleteRole: async (id: number) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    },
};
