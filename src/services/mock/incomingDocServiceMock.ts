
export interface IncomingDocModel {
    id: number;
    incoming_no: string;
    doc_id: number;
    doc_no?: string;
    doc_name?: string;
    sender_id?: string;
    sender_name?: string;
    receiver_id?: string;
    receiver_name?: string;
    approver_id?: string;
    approver_name?: string;
    received_date?: string;
    approver_date?: string;
    remark?: string;
    status: 'pending' | 'received' | 'approved' | 'rejected';
    created_at: string;
}

const mockIncomingDocs: IncomingDocModel[] = [
    {
        id: 1,
        incoming_no: 'IN202602130001',
        doc_id: 101,
        doc_no: 'LAL20260210005',
        doc_name: 'Policy Update Q1.pdf',
        sender_id: 'user-001',
        sender_name: 'John Doe',
        receiver_id: 'user-002',
        receiver_name: 'Jane Smith',
        status: 'pending',
        created_at: '2026-02-13T09:00:00Z'
    },
    {
        id: 2,
        incoming_no: 'IN202602120005',
        doc_id: 102,
        doc_no: 'LAL20260210008',
        doc_name: 'Budget Approval 2026.xlsx',
        sender_id: 'user-003',
        sender_name: 'Finance Dept',
        receiver_id: 'user-002',
        receiver_name: 'Jane Smith',
        status: 'received',
        received_date: '2026-02-12T10:30:00Z',
        created_at: '2026-02-12T08:00:00Z'
    },
    {
        id: 3,
        incoming_no: 'IN202602110012',
        doc_id: 103,
        doc_no: 'LAL20260205001',
        doc_name: 'Project Alpha Spec.docx',
        sender_id: 'user-004',
        sender_name: 'IT Dept',
        receiver_id: 'user-002',
        receiver_name: 'Jane Smith',
        status: 'approved',
        received_date: '2026-02-11T09:15:00Z',
        approver_id: 'user-005',
        approver_name: 'Director',
        approver_date: '2026-02-11T14:20:00Z',
        created_at: '2026-02-11T08:00:00Z'
    }
];

export const incomingDocServiceMock = {
    getAllIncomingDocs: async () => {
        return { success: true, data: mockIncomingDocs }; // Simulating API response structure
    },

    getIncomingDocById: async (id: number) => {
        const doc = mockIncomingDocs.find(d => d.id === id);
        return { success: true, data: doc };
    },

    getIncomingDocsByReceiver: async (receiverId: string) => {
        const docs = mockIncomingDocs.filter(d => d.receiver_id === receiverId);
        return { success: true, data: docs };
    },

    getIncomingDocsByStatus: async (status: string) => {
        const docs = mockIncomingDocs.filter(d => d.status === status);
        return { success: true, data: docs };
    },

    receiveDocument: async (id: number, data: any) => {
        const doc = mockIncomingDocs.find(d => d.id === id);
        if (doc) {
            doc.status = 'received';
            doc.received_date = new Date().toISOString();
            doc.remark = data.remark;
        }
        return { success: true, data: doc };
    },

    approveDocument: async (id: number, data: any) => {
        const doc = mockIncomingDocs.find(d => d.id === id);
        if (doc) {
            doc.status = data.approved ? 'approved' : 'rejected';
            doc.approver_date = new Date().toISOString();
            doc.remark = data.remark;
        }
        return { success: true, data: doc };
    },
};
