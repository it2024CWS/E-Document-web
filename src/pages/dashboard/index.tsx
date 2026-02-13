import {
    Box,
    Typography,
    Card,
    CircularProgress
} from '@mui/material';
import useDashboardController from './controllers/dashboardController';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import OutboxIcon from '@mui/icons-material/Outbox';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { colors } from '@/themes/colors';
import IncomingDocumentList from '../incoming/components/IncomingDocumentList';
import OutgoingDocumentList from '../outgoing/components/OutgoingDocumentList';

const StatCard = ({ title, value, icon, color, bgcolor }: any) => (
    <Card sx={{ p: 2, display: 'flex', alignItems: 'center', height: '100%', boxShadow: '0px 2px 10px rgba(0,0,0,0.05)' }}>
        <Box sx={{
            bgcolor: bgcolor || (color + '15'),
            color: color,
            borderRadius: '50%',
            width: 48,
            height: 48,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mr: 2
        }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: color }}>{value}</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>{title}</Typography>
        </Box>
    </Card>
);

const DashboardPage = () => {
    const { stats, loading } = useDashboardController();

    // Handlers for lists (can be empty or navigate to full page)
    const handleViewIncoming = (doc: any) => console.log('View Incoming', doc);
    const handleViewOutgoing = (doc: any) => console.log('View Outgoing', doc);

    return (
        <Box sx={{ mt: 1 }}>
            {loading ? (
                <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>
            ) : stats ? (
                <>
                    {/* Top 5 Boxes - Using Box with CSS Grid for 5 columns */}
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' },
                        gap: 3,
                        mb: 4
                    }}>
                        <StatCard
                            title="Incoming"
                            value={stats.totalIncoming}
                            icon={<MoveToInboxIcon />}
                            color={colors.secondary.blue1}
                        />
                        <StatCard
                            title="Outgoing"
                            value={stats.totalOutgoing}
                            icon={<OutboxIcon />}
                            color={colors.accent.main}
                        />
                        <StatCard
                            title="Pending"
                            value={stats.countPending}
                            icon={<PendingActionsIcon />}
                            color={colors.accent.yellow}
                        />
                        <StatCard
                            title="Approved"
                            value={stats.countApproved}
                            icon={<CheckCircleIcon />}
                            color={colors.accent.green}
                        />
                        <StatCard
                            title="Rejected"
                            value={stats.countRejected}
                            icon={<CancelIcon />}
                            color={colors.accent.red}
                        />
                        </Box>
                        <br />

                    {/* Bottom lists - Using Box with CSS Grid for 2 columns */}
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        gap: 3
                    }}>
                        {/* Incoming List */}
                        <Card sx={{ p: 0, overflow: 'hidden', boxShadow: '0px 2px 10px rgba(0,0,0,0.05)' }}>
                            <Box sx={{ p: 2, bgcolor: colors.dominant.white2, borderBottom: '1px solid ' + colors.secondary.gray1 }}>
                                <Typography variant="subtitle1" fontWeight={600}>Recent Incoming</Typography>
                            </Box>
                            <IncomingDocumentList
                                documents={stats.recentIncoming}
                                loading={false}
                                onReceive={() => { }}
                                onApprove={() => { }}
                                onViewDetail={handleViewIncoming}
                            />
                        </Card>

                        {/* Outgoing List */}
                        <Card sx={{ p: 0, overflow: 'hidden', boxShadow: '0px 2px 10px rgba(0,0,0,0.05)' }}>
                            <Box sx={{ p: 2, bgcolor: colors.dominant.white2, borderBottom: '1px solid ' + colors.secondary.gray1 }}>
                                <Typography variant="subtitle1" fontWeight={600}>Recent Outgoing</Typography>
                            </Box>
                            <OutgoingDocumentList
                                documents={stats.recentOutgoing}
                                loading={false}
                                onViewDetail={handleViewOutgoing}
                            />
                        </Card>
                    </Box>
                </>
            ) : null}
        </Box>
    );
};

export default DashboardPage;
