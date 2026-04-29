import { useMemo } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { OutgoingDocModel } from '@/models/outgoingDocModel';
import { colors } from '@/themes/colors';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { getFileIcon } from '@/utils/documentUtils';
import DataTable, { Column } from '@/components/Table/DataTable';

interface OutgoingDocumentListProps {
    documents: OutgoingDocModel[];
    loading?: boolean;
    onViewDetail: (doc: OutgoingDocModel) => void;
}

const OutgoingDocumentList = ({ documents, loading, onViewDetail }: OutgoingDocumentListProps) => {

    const columns = useMemo((): Column<OutgoingDocModel>[] => [
        {
          label: 'Document Name',
          content: (doc) => (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {getFileIcon(doc.type || doc.doc_name || '')}
              <Typography variant="body2" fontWeight={500}>{doc.doc_name || '-'}</Typography>
            </Box>
          )
        },
        { label: 'Document number', content: (doc) => doc.doc_no || '-' },
        { label: 'Date', content: (doc) => new Date(doc.created_at).toLocaleDateString() },
        { label: 'Sender', content: (doc) => doc.user_name || '-' },
        {
          label: '',
          align: 'right',
          content: (doc) => (
            <IconButton size="small" onClick={() => onViewDetail(doc)}>
              <MoreHorizIcon sx={{ color: colors.secondary.text }} />
            </IconButton>
          )
        }
      ], [onViewDetail]);

    return (
        <DataTable
            columns={columns}
            data={documents}
            loading={loading}
            noDataMessage="No documents found"
            sx={{ boxShadow: 'none', borderRadius: 0 }}
        />
    );
};

export default OutgoingDocumentList;
