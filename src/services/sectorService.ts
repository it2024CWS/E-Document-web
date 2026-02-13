import axios from "axios";

const API_URL = "http://localhost:5001/api/v1/sectors";

export const sectorService = {
    getAllSectors: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    getSectorById: async (id: number) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    getSectorsByDepartment: async (deptId: number) => {
        const response = await axios.get(`http://localhost:5001/api/v1/departments/${deptId}/sectors`);
        return response.data;
    },

    createSector: async (data: any) => {
        const response = await axios.post(API_URL, data);
        return response.data;
    },

    updateSector: async (id: number, data: any) => {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    deleteSector: async (id: number) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    },
};
