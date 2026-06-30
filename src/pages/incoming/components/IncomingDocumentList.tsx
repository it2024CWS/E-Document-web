import { useMemo } from 'react';
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { IncomingDocModel } from '@/models/incomingDocModel';
import { colors } from '@/themes/colors';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { getFileIcon, getStatusColor } from '@/utils/documentUtils';
import { formatDateTime } from '@/utils/dateUtils';
import DataTable, { Column } from '@/components/Table/DataTable';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';
import { canReceiveDocument, canApproveOrRejectDocument } from '@/enums/userRoleEnum';

interface IncomingDocumentListProps {
    documents: IncomingDocModel[];
    loading?: boolean;
    onReceive: (doc: IncomingDocModel) => void;
    onApprove: (doc: IncomingDocModel) => void;
    onViewDetail: (doc: IncomingDocModel) => void;
    readOnly?: boolean;
}

const IncomingDocumentList = ({ documents, loading, onReceive, onApprove, onViewDetail, readOnly = false }: IncomingDocumentListProps) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const showReceive = canReceiveDocument(user?.role_name);
    const showApprove = canApproveOrRejectDocument(user?.role_name);

    const columns = useMemo((): Column<IncomingDocModel>[] => [
        {
            label: t('docs.documentName'),
            content: (doc) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {getFileIcon(doc.file_type || doc.type || doc.doc_name || '')}
                    <Typography variant="body2" fontWeight={500}>{doc.doc_name}</Typography>
                </Box>
            ),
        },
        { label: t('docs.documentNumber'), content: (doc) => doc.doc_no || '-' },
        { label: t('common.date'), content: (doc) => formatDateTime(doc.incoming_date) },
        { label: t('common.sender'), content: (doc) => doc.creator_name || '-' },
        {
            label: t('common.status'),
            content: (doc) => {
                const statusStyle = getStatusColor(doc.status);
                return (
                    <Chip
                        label={doc.status || 'General'}
                        size="small"
                        sx={{
                            borderRadius: '6px',
                            bgcolor: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: 24,
                        }}
                    />
                );
            },
        },
        ...(!readOnly ? [{
            label: '',
            align: 'right' as const,
            content: (doc: IncomingDocModel) => (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    {doc.status === 'pending' && showReceive && (
                        <Tooltip title={t('docs.receiveDocument')}>
                            <IconButton
                                size="small"
                                onClick={() => onReceive(doc)}
                                sx={{ color: colors.secondary.blue1, bgcolor: colors.secondary.blue110 }}
                            >
                                <FileDownloadIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    {doc.status === 'received' && showApprove && (
                        <Tooltip title={t('common.approveReject')}>
                            <IconButton
                                size="small"
                                onClick={() => onApprove(doc)}
                                sx={{ color: colors.accent.green, bgcolor: '#E8F5E9' }}
                            >
                                <AssignmentTurnedInIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    <IconButton size="small" onClick={() => onViewDetail(doc)}>
                        <MoreHorizIcon sx={{ color: colors.secondary.text }} />
                    </IconButton>
                </Box>
            ),
        }] : []),
    ], [t, onReceive, onApprove, onViewDetail, readOnly, showReceive, showApprove]);

    return (
        <DataTable
            columns={columns}
            data={documents}
            loading={loading}
            noDataMessage={t('common.noDocuments')}
            sx={{ boxShadow: 'none', borderRadius: 0 }}
        />
    );
};

export default IncomingDocumentList;
