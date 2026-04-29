import { useMemo } from 'react';
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { IncomingDocModel } from '@/models/incomingDocModel';
import { colors } from '@/themes/colors';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { getFileIcon, getStatusColor } from '@/utils/documentUtils';
import DataTable, { Column } from '@/components/Table/DataTable';

interface IncomingDocumentListProps {
    documents: IncomingDocModel[];
    loading?: boolean;
    onReceive: (doc: IncomingDocModel) => void;
    onApprove: (doc: IncomingDocModel) => void;
    onViewDetail: (doc: IncomingDocModel) => void;
}

const IncomingDocumentList = ({ documents, loading, onReceive, onApprove, onViewDetail }: IncomingDocumentListProps) => {
    
    const columns = useMemo((): Column<IncomingDocModel>[] => [
        {
          label: 'Document Name',
          content: (doc) => (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {getFileIcon(doc.type || doc.doc_name || '')}
              <Typography variant="body2" fontWeight={500}>{doc.doc_name}</Typography>
            </Box>
          )
        },
        { label: 'Document number', content: (doc) => doc.doc_no || '-' },
        { label: 'Date', content: (doc) => new Date(doc.created_at).toLocaleDateString() },
        { label: 'Sender', content: (doc) => doc.sender_name || '-' },
        {
          label: 'Status',
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
                  height: 24
                }}
              />
            );
          }
        },
        {
          label: '',
          align: 'right',
          content: (doc) => (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              {doc.status === 'pending' && (
                <Tooltip title="Receive Document">
                  <IconButton
                    size="small"
                    onClick={() => onReceive(doc)}
                    sx={{ color: colors.secondary.blue1, bgcolor: colors.secondary.blue110 }}
                  >
                    <FileDownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {doc.status === 'received' && (
                <Tooltip title="Approve/Reject">
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
          )
        }
      ], [onReceive, onApprove, onViewDetail]);

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

export default IncomingDocumentList;

