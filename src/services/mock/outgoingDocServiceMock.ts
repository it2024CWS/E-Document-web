
export interface OutgoingDocModel {
    id: number;
    outgoing_no: string;
    doc_id: number;
    doc_no?: string;
    doc_name?: string;
    user_id?: string;
    user_name?: string;
    type?: string;
    created_at: string;
}

const mockOutgoingDocs: OutgoingDocModel[] = [
    {
        id: 1,
        outgoing_no: 'OUT202602130001',
        doc_id: 101,
        doc_no: 'LAL20260210005',
        doc_name: 'Policy Update Q1.pdf',
        user_id: 'user-001',
        user_name: 'Me',
        type: 'General',
        created_at: '2026-02-13T09:00:00Z'
    },
    {
        id: 2,
        outgoing_no: 'OUT202602120005',
        doc_id: 102,
        doc_no: 'LAL20260210008',
        doc_name: 'Budget Request.xlsx',
        user_id: 'user-001',
        user_name: 'Me',
        type: 'Finance',
        created_at: '2026-02-12T08:00:00Z'
    },
    {
        id: 3,
        outgoing_no: 'OUT202602110012',
        doc_id: 105,
        doc_no: 'LAL20260205009',
        doc_name: 'Meeting Minutes.docx',
        user_id: 'user-001',
        user_name: 'Me',
        type: 'Meeting',
        created_at: '2026-02-11T15:00:00Z'
    }
];

export const outgoingDocServiceMock = {
    getAllOutgoingDocs: async () => {
        return { success: true, data: mockOutgoingDocs };
    },

    getOutgoingDocById: async (id: number) => {
        const doc = mockOutgoingDocs.find(d => d.id === id);
        return { success: true, data: doc };
    },

    getOutgoingDocsByUser: async (userId: string) => {
        const docs = mockOutgoingDocs.filter(d => d.user_id === userId);
        return { success: true, data: docs };
    },

    createOutgoingDoc: async (_data: any) => {
        // Mock creation
        return { success: true, message: "Document sent successfully" };
    }
};
