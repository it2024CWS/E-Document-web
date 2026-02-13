import { useState, useEffect } from 'react';
import { dashboardServiceMock, DashboardStats } from '@/services/mock/dashboardServiceMock';

const useDashboardController = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await dashboardServiceMock.getStats();
            if (res.success) {
                setStats(res.data);
            }
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
