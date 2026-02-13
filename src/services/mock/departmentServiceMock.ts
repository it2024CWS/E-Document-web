
export interface DepartmentModel {
    id: number;
    name: string;
    code: string;
}

export interface SectorModel {
    id: number;
    name: string;
    code: string;
    department_id: number;
    department_name?: string;
}

const mockDepartments: DepartmentModel[] = [
    { id: 1, name: 'Human Resources', code: 'HR' },
    { id: 2, name: 'Information Technology', code: 'IT' },
    { id: 3, name: 'Finance', code: 'FIN' },
];

const mockSectors: SectorModel[] = [
    { id: 1, name: 'Recruitment', code: 'REC', department_id: 1, department_name: 'Human Resources' },
    { id: 2, name: 'Software Development', code: 'DEV', department_id: 2, department_name: 'Information Technology' },
    { id: 3, name: 'Accounting', code: 'ACC', department_id: 3, department_name: 'Finance' },
];

export const departmentServiceMock = {
    getAllDepartments: async () => {
        return { success: true, data: mockDepartments };
    },

    // Mock CRUD (Just returns success)
    createDepartment: async (data: any) => { return { success: true, data: { ...data, id: Math.random() } }; },
    updateDepartment: async (_id: number, data: any) => { return { success: true, data: { ...data, id: _id } }; },
    deleteDepartment: async (_id: number) => { return { success: true }; },
};

export const sectorServiceMock = {
    getAllSectors: async () => {
        return { success: true, data: mockSectors };
    },
    getSectorsByDepartment: async (deptId: number) => {
        return { success: true, data: mockSectors.filter(s => s.department_id === deptId) };
    },

    // Mock CRUD
    createSector: async (data: any) => { return { success: true, data: { ...data, id: Math.random() } }; },
    updateSector: async (_id: number, data: any) => { return { success: true, data: { ...data, id: _id } }; },
    deleteSector: async (_id: number) => { return { success: true }; },
};
