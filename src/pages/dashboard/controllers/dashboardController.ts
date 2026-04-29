import { useState, useEffect } from 'react';
import { incomingDocService } from '@/services/incomingDocService';
import { outgoingDocService } from '@/services/outgoingDocService';

export interface DashboardStats {
    totalIncoming: number;
    totalOutgoing: number;
    countPending: number;
    countApproved: number;
    countRejected: number;
    recentIncoming: any[];
    recentOutgoing: any[];
}

const useDashboardController = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // Fetch incoming and outgoing documents (page 1, limit 5 for recent)
            const [incomingRes, outgoingRes] = await Promise.all([
                incomingDocService.getAllIncomingDocs(1, 5),
                outgoingDocService.getAllOutgoingDocs(1, 5)
            ]);

            let totalIncoming = 0;
            let totalOutgoing = 0;
            let recentIncoming: any[] = [];
            let recentOutgoing: any[] = [];
            let countPending = 0;
            let countApproved = 0;
            let countRejected = 0;

            if (incomingRes.success) {
                recentIncoming = incomingRes.data.items || incomingRes.data || [];
                totalIncoming = incomingRes.data.total || recentIncoming.length;
            }

            if (outgoingRes.success) {
                recentOutgoing = outgoingRes.data.items || outgoingRes.data || [];
                totalOutgoing = outgoingRes.data.total || recentOutgoing.length;
            }

            // Fetch counts by status for incoming documents
            try {
                const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
                    incomingDocService.getIncomingDocsByStatus('pending'),
                    incomingDocService.getIncomingDocsByStatus('approved'),
                    incomingDocService.getIncomingDocsByStatus('rejected')
                ]);

                if (pendingRes.success) countPending = (pendingRes.data || []).length;
                if (approvedRes.success) countApproved = (approvedRes.data || []).length;
                if (rejectedRes.success) countRejected = (rejectedRes.data || []).length;
            } catch (statusError) {
                console.error("Failed to fetch status counts", statusError);
                // Fallback: count from recent incoming if status fetch fails
                countPending = recentIncoming.filter(doc => doc.status === 'pending').length;
                countApproved = recentIncoming.filter(doc => doc.status === 'approved').length;
                countRejected = recentIncoming.filter(doc => doc.status === 'rejected').length;
            }

            setStats({
                totalIncoming,
                totalOutgoing,
                countPending,
                countApproved,
                countRejected,
                recentIncoming,
                recentOutgoing
            });

        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return {
        stats,
        loading,
        refresh: fetchStats
    };
};

export default useDashboardController;
