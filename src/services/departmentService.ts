import axios from "axios";

const API_URL = "http://localhost:5001/api/v1/departments";

export const departmentService = {
    getAllDepartments: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    getDepartmentById: async (id: number) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    createDepartment: async (data: any) => {
        const response = await axios.post(API_URL, data);
        return response.data;
    },

    updateDepartment: async (id: number, data: any) => {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    deleteDepartment: async (id: number) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    },
};
