import { useMemo } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { OutgoingDocModel } from '@/models/outgoingDocModel';
import { colors } from '@/themes/colors';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { getFileIcon } from '@/utils/documentUtils';
import { formatDateTime } from '@/utils/dateUtils';
import DataTable, { Column } from '@/components/Table/DataTable';
import { useTranslation } from 'react-i18next';

interface OutgoingDocumentListProps {
    documents: OutgoingDocModel[];
    loading?: boolean;
    onViewDetail: (doc: OutgoingDocModel) => void;
}

const OutgoingDocumentList = ({ documents, loading, onViewDetail }: OutgoingDocumentListProps) => {
    const { t } = useTranslation();

    const columns = useMemo((): Column<OutgoingDocModel>[] => [
        {
            label: t('docs.documentName'),
            content: (doc) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {getFileIcon(doc.file_type || doc.type || doc.doc_name || '')}
                    <Typography variant="body2" fontWeight={500}>{doc.doc_name || '-'}</Typography>
                </Box>
            ),
        },
        { label: t('docs.documentNumber'), content: (doc) => doc.doc_no || '-' },
        { label: t('common.date'), content: (doc) => formatDateTime(doc.created_at) },
        { label: t('common.sender'), content: (doc) => doc.user_name || '-' },
        {
            label: '',
            align: 'right',
            content: (doc) => (
                <IconButton size="small" onClick={() => onViewDetail(doc)}>
                    <MoreHorizIcon sx={{ color: colors.secondary.text }} />
                </IconButton>
            ),
        },
    ], [t, onViewDetail]);

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

export default OutgoingDocumentList;
