import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Avatar,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import TagIcon from '@mui/icons-material/Tag';
import GroupsIcon from '@mui/icons-material/Groups';
import { OutgoingDocModel } from '@/models/outgoingDocModel';
import { getFileIcon, getStatusColor, downloadDocument } from '@/utils/documentUtils';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '@/utils/dateUtils';

interface DocumentDetailModalProps {
  open: boolean;
  onClose: () => void;
  document: OutgoingDocModel | null;
  loading?: boolean;
}

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
    <Box sx={{ color: 'text.secondary', mt: 0.2, flexShrink: 0 }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ mt: 0.3 }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <Box
    sx={{
      flex: 1,
      textAlign: 'center',
      py: 1.5,
      px: 1,
      borderRadius: 2,
      bgcolor: color,
      minWidth: 64,
    }}
  >
    <Typography variant="h5" fontWeight={700} lineHeight={1}>
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.4, display: 'block' }}>
      {label}
    </Typography>
  </Box>
);

const DocumentDetailModal = ({ open, onClose, document, loading }: DocumentDetailModalProps) => {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);
  if (!document && !loading) return null;

  const handleDownload = async () => {
    if (!document?.doc_path) return;
    setDownloading(true);
    try { await downloadDocument(document.doc_path, document.doc_name, document.file_type); }
    finally { setDownloading(false); }
  };

  const recipients: any[] = document?.recipients ?? [];
  const statusCounts = document?.status_counts ?? {
    total: recipients.length,
    pending: recipients.filter((r: any) => (r.status || r.incoming_doc?.status) === 'pending').length,
    received: recipients.filter((r: any) => (r.status || r.incoming_doc?.status) === 'received').length,
    approved: recipients.filter((r: any) => (r.status || r.incoming_doc?.status) === 'approved').length,
    rejected: recipients.filter((r: any) => (r.status || r.incoming_doc?.status) === 'rejected').length,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, maxHeight: '90vh' } } }}
    >
      {/* Custom header */}
      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#EEF2FF', width: 48, height: 48 }}>
            <Box sx={{ fontSize: 28, lineHeight: 1, display: 'flex', alignItems: 'center' }}>
              {document ? getFileIcon(document.file_type || document.type || document.doc_name || '') : null}
            </Box>
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
              {document?.doc_name || t('docs.documentDetails')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('docs.outgoingDocument')}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ mt: -0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider />

      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 240 }}>
            <CircularProgress />
          </Box>
        ) : document && (
          <Box>
            {/* Document metadata */}
            <Box
              sx={{
                px: 3,
                py: 2.5,
                bgcolor: '#FAFBFF',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
              }}
            >
              <InfoItem
                icon={<TagIcon fontSize="small" />}
                label={t('docs.documentNumber')}
                value={document.doc_no || '-'}
              />
              <InfoItem
                icon={<TagIcon fontSize="small" />}
                label={t('docs.outgoingNo')}
                value={document.outgoing_no || '-'}
              />
              <InfoItem
                icon={<PersonIcon fontSize="small" />}
                label={t('common.sender')}
                value={document.creator_name || document.user_name || '-'}
              />
              <InfoItem
                icon={<CalendarTodayIcon fontSize="small" />}
                label={t('docs.sentDate')}
                value={formatDateTime(document.created_at)}
              />
            </Box>

            <Divider />

            {/* Status summary cards */}
            <Box sx={{ px: 3, py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <GroupsIcon fontSize="small" color="action" />
                <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
                  {t('docs.deliveryStatus').toUpperCase()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <StatCard label={t('common.all')} value={statusCounts.total} color="#F0F4FF" />
                <StatCard label={t('common.pending')} value={statusCounts.pending} color="#FFF8ED" />
                <StatCard label={t('common.received')} value={statusCounts.received} color="#EDF7FF" />
                <StatCard label={t('common.approved')} value={statusCounts.approved} color="#EDFAF3" />
                <StatCard label={t('common.rejected')} value={statusCounts.rejected} color="#FFF2F2" />
              </Box>
            </Box>

            <Divider />

            {/* Recipients table */}
            <Box sx={{ px: 3, py: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 1.5 }}>
                {t('docs.recipientsAndTracking').toUpperCase()}
              </Typography>
              <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F5F7FF' }}>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>{t('common.department').toUpperCase()}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>{t('docs.incomingNo').toUpperCase()}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>{t('docs.receivedDate').toUpperCase()}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>{t('docs.approvedDate').toUpperCase()}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>{t('common.status').toUpperCase()}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recipients.length > 0 ? (
                      recipients.map((recipient: any, idx: number) => {
                        const incomingDoc = recipient.incoming_doc;
                        const status = incomingDoc?.status || recipient.status || 'pending';
                        const statusStyle = getStatusColor(status);
                        const receivedDate = incomingDoc?.received_date || recipient.received_date;
                        const approverDate = incomingDoc?.approver_date || recipient.approver_date;
                        return (
                          <TableRow
                            key={recipient.department_id || idx}
                            sx={{ '&:last-child td': { borderBottom: 0 }, '&:hover': { bgcolor: '#FAFBFF' } }}
                          >
                            <TableCell sx={{ fontWeight: 500 }}>
                              {recipient.department_name || recipient.dept_name || '-'}
                            </TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                              {incomingDoc?.incoming_no || recipient.incoming_no || '-'}
                            </TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                              {receivedDate
                                ? formatDateTime(receivedDate)
                                : '-'}
                            </TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                              {approverDate
                                ? formatDateTime(approverDate)
                                : '-'}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={status.charAt(0).toUpperCase() + status.slice(1)}
                                size="small"
                                sx={{
                                  borderRadius: '6px',
                                  bgcolor: statusStyle.bg,
                                  color: statusStyle.color,
                                  fontWeight: 700,
                                  fontSize: '0.7rem',
                                  height: 22,
                                  '& .MuiChip-label': { px: 1 },
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : document.incoming_docs && document.incoming_docs.length > 0 ? (
                      document.incoming_docs.map((inc: any) => {
                        const statusStyle = getStatusColor(inc.status);
                        return (
                          <TableRow key={inc.id} sx={{ '&:last-child td': { borderBottom: 0 }, '&:hover': { bgcolor: '#FAFBFF' } }}>
                            <TableCell sx={{ fontWeight: 500 }}>{inc.receiver_name || '-'}</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>{inc.incoming_no || '-'}</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                              {inc.received_date ? formatDateTime(inc.received_date) : '-'}
                            </TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                              {inc.approver_date ? formatDateTime(inc.approver_date) : '-'}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={inc.status.charAt(0).toUpperCase() + inc.status.slice(1)}
                                size="small"
                                sx={{
                                  borderRadius: '6px',
                                  bgcolor: statusStyle.bg,
                                  color: statusStyle.color,
                                  fontWeight: 700,
                                  fontSize: '0.7rem',
                                  height: 22,
                                  '& .MuiChip-label': { px: 1 },
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                          {t('docs.noTrackingData')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        )}
      </DialogContent>

      <Divider />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          {t('common.close')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={downloading ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />}
          onClick={handleDownload}
          disabled={downloading || !document?.doc_path}
        >
          {downloading ? t('common.downloading') : t('common.download')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentDetailModal;
