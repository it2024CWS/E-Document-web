
export interface DocTypeModel {
    id: number;
    name: string;
    code: string;
}

const mockDocTypes: DocTypeModel[] = [
    { id: 1, name: 'General Request', code: 'GEN' },
    { id: 2, name: 'Purchase Order', code: 'PO' },
    { id: 3, name: 'Leave Request', code: 'LR' },
    { id: 4, name: 'Memo', code: 'MEMO' },
];

export const docTypeServiceMock = {
    getAllDocTypes: async () => {
        return { success: true, data: mockDocTypes };
    },

    // Mock CRUD
    createDocType: async (data: any) => { return { success: true, data: { ...data, id: Math.random() } }; },
    updateDocType: async (_id: number, data: any) => { return { success: true, data: { ...data, id: _id } }; },
    deleteDocType: async (_id: number) => { return { success: true }; },
};
