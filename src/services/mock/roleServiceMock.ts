
export interface RoleModel {
    id: number;
    role_name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

const mockRoles: RoleModel[] = [
    {
        id: 1,
        role_name: 'Admin',
        description: 'Administrator with full access',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
    },
    {
        id: 2,
        role_name: 'User',
        description: 'Regular user with limited access',
        created_at: '2023-01-02T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z'
    },
    {
        id: 3,
        role_name: 'Manager',
        description: 'Department manager',
        created_at: '2023-01-03T00:00:00Z',
        updated_at: '2023-01-03T00:00:00Z'
    }
];

export const roleServiceMock = {
    getAllRoles: async () => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true, data: mockRoles };
    },

    getRoleById: async (id: number) => {
        const role = mockRoles.find(r => r.id === id);
        return { success: true, data: role };
    },

    createRole: async (data: any) => {
        const newRole = {
            ...data,
            id: Math.floor(Math.random() * 1000) + 4,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        // In a real mock, we might push to the array, but for now just returning success is enough for UI dev
        // mockRoles.push(newRole); 
        return { success: true, data: newRole };
    },

    updateRole: async (id: number, data: any) => {
        return { success: true, data: { ...data, id, updated_at: new Date().toISOString() } };
    },

    deleteRole: async (id: number) => {
        return { success: true };
    }
};
