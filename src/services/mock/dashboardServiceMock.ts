import { IncomingDocModel, incomingDocServiceMock } from './incomingDocServiceMock';
import { OutgoingDocModel, outgoingDocServiceMock } from './outgoingDocServiceMock';

export interface DashboardStats {
    totalIncoming: number;
    totalOutgoing: number;
    countPending: number;
    countApproved: number;
    countRejected: number;
    recentIncoming: IncomingDocModel[];
    recentOutgoing: OutgoingDocModel[];
}

// Helper to get mock data synchronously (in real app this would be DB query)
// We need to fetch from the other mocks. Since they are async, we might need to make getStats async and call them.
// But for now, we can typically access the arrays if they are exported, or just duplicate some mock data here for simplicity of the dashboard mock.
// Better to import the arrays if possible, but they are inside the service file scope usually.
// Let's just hardcode some compatible mock data for the dashboard to avoid circular dependency or complex setup, 
// OR better, change getStats to actually call the other services.

export const dashboardServiceMock = {
    getStats: async () => {
        // Simulate fetching from other services
        const incomingRes = await incomingDocServiceMock.getAllIncomingDocs();
        const outgoingRes = await outgoingDocServiceMock.getAllOutgoingDocs();

        const incoming = incomingRes.data || [];
        const outgoing = outgoingRes.data || [];

        const stats: DashboardStats = {
            totalIncoming: incoming.length,
            totalOutgoing: outgoing.length,
            countPending: incoming.filter(d => d.status === 'pending').length, // Inspecting incoming pending only? Or both? User said "Pending box". Usually refers to incoming tasks.
            countApproved: incoming.filter(d => d.status === 'approved').length,
            countRejected: incoming.filter(d => d.status === 'rejected').length,
            recentIncoming: incoming.slice(0, 5),
            recentOutgoing: outgoing.slice(0, 5)
        };

        return { success: true, data: stats };
    }
};
