import { useState, useEffect, useMemo, useImperativeHandle, forwardRef, ReactNode } from 'react';
import {
  Box, Typography, IconButton, Chip, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { outgoingDocService, OutgoingDocFilter } from '@/services/outgoingDocService';
import { OutgoingDocModel } from '@/models/outgoingDocModel';
import DataTable, { Column } from '@/components/Table/DataTable';
import { exportToCSV } from '@/utils/exportUtils';
import { formatDateTime } from '@/utils/dateUtils';
import { getFileIcon, getStatusColor } from '@/utils/documentUtils';
import { colors } from '@/themes/colors';
import DocumentDetailModal from './DocumentDetailModal';
import useAuth from '@/contexts/auth/useAuth';

export interface OutboundTabRef {
  refresh: () => void;
  triggerExport: () => void;
}

export interface OutboundTabProps {
  docNo?: string;
  startDate?: string;
  endDate?: string;
  tabBar?: ReactNode;
}

const OutboundTab = forwardRef<OutboundTabRef, OutboundTabProps>(({
  docNo = '',
  startDate = '',
  endDate = '',
  tabBar,
}, ref) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<OutgoingDocModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<OutgoingDocModel | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const handleExport = () => {
    const dataToExport = documents.map((doc) => ({
      'Document Name': doc.doc_name,
      'Document Number': doc.doc_no,
      Date: formatDateTime(doc.created_at),
      Sender: doc.user_name,
    }));
    exportToCSV(dataToExport, 'Outbound_Documents');
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchDocuments,
    triggerExport: handleExport,
  }));

  useEffect(() => {
    setPage(0);
  }, [docNo, startDate, endDate]);

  useEffect(() => {
    fetchDocuments();
  }, [page, rowsPerPage, docNo, startDate, endDate]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const filters: OutgoingDocFilter = {
        departmentId: user?.department_id || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        docNo: docNo || undefined,
      };
      console.log('Fetching outgoing docs with filters:', filters);
      const res = await outgoingDocService.getAllOutgoingDocs(page + 1, rowsPerPage, filters);
      console.log('Outgoing docs response:', res);
      if (res.status === 200 || res.success) {
        // Backend returns { items: [...] } in res.data
        const docs = res.data.items || res.data;
        setDocuments(docs);
        console.log('Loaded documents:', docs.length);
        if (res.pagination) {
          setTotalItems(res.pagination.totalItems);
        }
      }
    } catch (error) {
      console.error('Failed to fetch outgoing documents', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecipientsList = (doc: OutgoingDocModel) => {
    if (doc.recipients && Array.isArray(doc.recipients)) {
      return doc.recipients.map((r: any) => r.department_name || r.dept_name).filter(Boolean).join(', ');
    }
    return '-';
  };

  // Where the document currently sits + its status, derived from the API's flow
  // fields with a fallback to the recipient marked is_current.
  const getCurrentLocation = (doc: OutgoingDocModel): { dept: string; status: string } => {
    if (doc.current_department || doc.current_status) {
      return { dept: doc.current_department || '-', status: doc.current_status || 'completed' };
    }
    const current = doc.recipients?.find((r: any) => r.is_current);
    if (current) {
      return {
        dept: current.department_name || current.dept_name || '-',
        status: current.status || 'pending',
      };
    }
    return { dept: '-', status: doc.flow_status === 'completed' ? 'completed' : '-' };
  };

  // Progress = approved steps / total steps in the route.
  const getProgress = (doc: OutgoingDocModel): { approved: number; total: number } => {
    const total = doc.status_counts?.total ?? doc.recipients?.length ?? 0;
    const approved =
      doc.status_counts?.approved ??
      doc.recipients?.filter((r: any) => (r.status || r.incoming_doc?.status) === 'approved').length ??
      0;
    return { approved, total };
  };

  const handleOpenDetail = async (doc: OutgoingDocModel) => {
    setSelectedDoc(doc);
    setDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const res = await outgoingDocService.getOutgoingDocById(doc.id);
      if (res.success) {
        setSelectedDoc(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch document details', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage - 1);
  };

  const handleChangeRowsPerPage = (newLimit: number) => {
    setRowsPerPage(newLimit);
    setPage(0);
  };

  // Owner department head approval gate (handled on the outgoing side).
  const canApprove = ['Manager', 'Director', 'Admin'].includes(user?.role_name || '');
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [approveDoc, setApproveDoc] = useState<OutgoingDocModel | null>(null);
  const [remark, setRemark] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const handleApproveSubmit = async (approved: boolean) => {
    if (!approveDoc) return;
    setActionLoading(true);
    try {
      await outgoingDocService.approveOutgoingDoc(approveDoc.id, {
        status: approved ? 'approved' : 'rejected',
        remark,
      });
      await fetchDocuments();
      setApproveDialogOpen(false);
    } catch (error) {
      console.error('Failed to approve outgoing document', error);
    } finally {
      setActionLoading(false);
    }
  };

  const { t } = useTranslation();

  const columns = useMemo((): Column<OutgoingDocModel>[] => [
    {
      label: t('docs.documentName'),
      content: (doc) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {getFileIcon(doc.file_type || doc.type || doc.doc_name || '')}
          <Typography variant="body2" fontWeight={500}>{doc.doc_name || '-'}</Typography>
        </Box>
      )
    },
    { label: t('docs.documentNumber'), content: (doc) => doc.doc_no || '-' },
    { label: t('common.date'), content: (doc) => formatDateTime(doc.created_at) },
    { label: t('common.sender'), content: (doc) => doc.creator_name || doc.user_name || '-' },
    {
      label: t('docs.recipients'),
      content: (doc) => (
        <Typography variant="body2" sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={getRecipientsList(doc)}>
          {getRecipientsList(doc)}
        </Typography>
      )
    },
    {
      label: t('docs.currentLocation'),
      content: (doc) => {
        const { dept, status } = getCurrentLocation(doc);
        const flow = doc.flow_status;
        if (flow === 'pending_approval') {
          const style = getStatusColor('pending_approval');
          return (
            <Chip
              label={t('docs.flowPendingApproval')}
              size="small"
              sx={{ borderRadius: '6px', bgcolor: style.bg, color: style.color, fontWeight: 700, fontSize: '0.7rem', height: 22 }}
            />
          );
        }
        if (flow === 'completed') {
          const style = getStatusColor('approved');
          return (
            <Chip
              label={t('docs.flowCompleted')}
              size="small"
              sx={{ borderRadius: '6px', bgcolor: style.bg, color: style.color, fontWeight: 700, fontSize: '0.7rem', height: 22 }}
            />
          );
        }
        const style = getStatusColor(status);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" fontWeight={500} sx={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={dept}>
              {dept}
            </Typography>
            <Chip
              label={status.charAt(0).toUpperCase() + status.slice(1)}
              size="small"
              sx={{ borderRadius: '6px', bgcolor: style.bg, color: style.color, fontWeight: 700, fontSize: '0.65rem', height: 20 }}
            />
          </Box>
        );
      }
    },
    {
      label: t('docs.progress'),
      align: 'center',
      content: (doc) => {
        const { approved, total } = getProgress(doc);
        return <Typography variant="body2" fontWeight={700}>{approved}/{total}</Typography>;
      }
    },
    {
      label: '',
      align: 'right',
      content: (doc) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          {canApprove && doc.status === 'pending' && (
            <Tooltip title={t('docs.approveOutgoing')}>
              <IconButton
                size="small"
                onClick={() => { setApproveDoc(doc); setRemark(''); setApproveDialogOpen(true); }}
                sx={{ color: colors.accent.green, bgcolor: '#E8F5E9' }}
              >
                <AssignmentTurnedInIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <IconButton size="small" onClick={() => handleOpenDetail(doc)}>
            <MoreHorizIcon sx={{ color: colors.secondary.text }} />
          </IconButton>
        </Box>
      )
    }
  ], [canApprove]);

  return (
    <Box>
      {/* Tab bar slot — rendered between toolbar and table */}
      {tabBar}

      <DataTable
        columns={columns}
        data={documents}
        loading={loading}
        totalItems={totalItems}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        countLabel={t('docs.totalOutbound')}
      />

      <DocumentDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        document={selectedDoc}
        loading={detailLoading}
      />

      {/* Owner department head approval gate */}
      <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)}>
        <DialogTitle>{t('docs.approveOutgoing')}</DialogTitle>
        <DialogContent sx={{ minWidth: 400, pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('docs.approveOutgoingHint')}
          </Typography>
          <TextField
            fullWidth multiline rows={3}
            label={t('docs.remarkRequired')}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" color="error" startIcon={<CancelIcon />}
            onClick={() => handleApproveSubmit(false)} disabled={actionLoading}>
            {t('docs.reject')}
          </Button>
          <Button variant="contained" color="success" startIcon={<CheckCircleIcon />}
            onClick={() => handleApproveSubmit(true)} disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={20} /> : t('docs.approve')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

OutboundTab.displayName = 'OutboundTab';

export default OutboundTab;
