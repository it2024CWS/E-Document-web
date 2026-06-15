import {
    Box,
    Typography,
    Card,
    CircularProgress
} from '@mui/material';
import useDashboardController from './controllers/dashboardController';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import SendIcon from '@mui/icons-material/Send';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import { colors } from '@/themes/colors';
import IncomingDocumentList from '../incoming/components/IncomingDocumentList';
import OutgoingDocumentList from '../outgoing/components/OutgoingDocumentList';
import { useTranslation } from 'react-i18next';

const StatCard = ({ title, value, icon, color }: any) => (
    <Card sx={{ p: 2.5, display: 'flex', alignItems: 'center', height: '100%', boxShadow: '0px 2px 10px rgba(0,0,0,0.05)' }}>
        <Box sx={{
            bgcolor: color + '20',
            color: color,
            borderRadius: '50%',
            width: 52,
            height: 52,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mr: 2,
            flexShrink: 0,
        }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color, lineHeight: 1.1 }}>{value}</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {title}
            </Typography>
        </Box>
    </Card>
);

const DashboardPage = () => {
    const { t } = useTranslation();
    const { stats, loading } = useDashboardController();

    const handleViewIncoming = (doc: any) => console.log('View Incoming', doc);
    const handleViewOutgoing = (doc: any) => console.log('View Outgoing', doc);

    return (
        <Box sx={{ mt: 1 }}>
            {loading ? (
                <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>
            ) : stats ? (
                <>
                    {/* Stat cards */}
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' },
                        gap: 2,
                        mb: 5,
                    }}>
                        <StatCard
                            title={t('dashboard.incoming')}
                            value={stats.totalIncoming}
                            icon={<CallReceivedIcon />}
                            color={colors.secondary.blue1}
                        />
                        <StatCard
                            title={t('dashboard.outgoing')}
                            value={stats.totalOutgoing}
                            icon={<SendIcon />}
                            color={colors.accent.main}
                        />
                        <StatCard
                            title={t('common.pending')}
                            value={stats.countPending}
                            icon={<HourglassEmptyIcon />}
                            color={colors.accent.yellow}
                        />
                        <StatCard
                            title={t('common.approved')}
                            value={stats.countApproved}
                            icon={<TaskAltIcon />}
                            color={colors.accent.green}
                        />
                        <StatCard
                            title={t('common.rejected')}
                            value={stats.countRejected}
                            icon={<DoNotDisturbOnIcon />}
                            color={colors.accent.red}
                        />
                    </Box>

                    {/* Recent document lists */}
                    <br></br>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        gap: 3,
                    }}>
                        <Card sx={{ p: 0, overflow: 'hidden', boxShadow: '0px 2px 10px rgba(0,0,0,0.05)' }}>
                            <Box sx={{ px: 2.5, py: 1.5, bgcolor: colors.dominant.white2, borderBottom: '1px solid ' + colors.secondary.gray1 }}>
                                <Typography variant="subtitle1" fontWeight={700}>{t('dashboard.recentIncoming')}</Typography>
                            </Box>
                            <IncomingDocumentList
                                documents={stats.recentIncoming}
                                loading={false}
                                onReceive={() => { }}
                                onApprove={() => { }}
                                onViewDetail={handleViewIncoming}
                            />
                        </Card>

                        <Card sx={{ p: 0, overflow: 'hidden', boxShadow: '0px 2px 10px rgba(0,0,0,0.05)' }}>
                            <Box sx={{ px: 2.5, py: 1.5, bgcolor: colors.dominant.white2, borderBottom: '1px solid ' + colors.secondary.gray1 }}>
                                <Typography variant="subtitle1" fontWeight={700}>{t('dashboard.recentOutgoing')}</Typography>
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
