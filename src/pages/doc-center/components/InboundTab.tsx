import { useState, useEffect, useMemo, ReactNode, forwardRef, useImperativeHandle } from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Grid,
  Chip,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DownloadIcon from '@mui/icons-material/Download';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { incomingDocService } from '@/services/incomingDocService';
import { IncomingDocModel } from '@/models/incomingDocModel';
import DataTable, { Column } from '@/components/Table/DataTable';
import { exportToCSV } from '@/utils/exportUtils';
import { formatDateTime } from '@/utils/dateUtils';
import { getFileIcon, getStatusColor, downloadDocument } from '@/utils/documentUtils';
import { colors } from '@/themes/colors';
import { useTranslation } from 'react-i18next';

export interface InboundTabRef {
  refresh: () => void;
  triggerExport: () => void;
}

interface InboundTabProps {
  tabBar?: ReactNode;
}

const InboundTab = forwardRef<InboundTabRef, InboundTabProps>(({ tabBar }, ref) => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<IncomingDocModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<IncomingDocModel | null>(null);
  const [remark, setRemark] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuDoc, setMenuDoc] = useState<IncomingDocModel | null>(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchDocuments();
  }, [page, rowsPerPage]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await incomingDocService.getAllIncomingDocs(page + 1, rowsPerPage);
      if (res.status === 200 || res.success) {
        // Backend returns { items: [...] } in res.data
        setDocuments(res.data.items || res.data);
        if (res.pagination) {
          setTotalItems(res.pagination.totalItems);
        }
      }
    } catch (error) {
      console.error('Failed to fetch incoming documents', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage - 1); // DataTable uses 1-based for onPageChange call from TablePaginationCustom
  };

  const handleChangeRowsPerPage = (newLimit: number) => {
    setRowsPerPage(newLimit);
    setPage(0);
  };

  const filteredDocuments = documents
    .filter((doc) => doc.status !== 'rejected')
    .filter((doc) => filterStatus === 'all' || doc.status === filterStatus);

  const columns = useMemo((): Column<IncomingDocModel>[] => [
    {
      label: t('docs.documentName'),
      content: (doc) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {getFileIcon(doc.file_type || doc.type || doc.doc_name || '')}
          <Typography variant="body2" fontWeight={500}>{doc.doc_name}</Typography>
        </Box>
      )
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
            <Tooltip title={t('docs.receiveDocument')}>
              <IconButton
                size="small"
                onClick={() => { setSelectedDoc(doc); setRemark(''); setReceiveDialogOpen(true); }}
                sx={{ color: colors.secondary.blue1, bgcolor: colors.secondary.blue110 }}
              >
                <FileDownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {doc.status === 'received' && (
            <Tooltip title={t('docs.evaluateDocument')}>
              <IconButton
                size="small"
                onClick={() => { setSelectedDoc(doc); setRemark(''); setApproveDialogOpen(true); }}
                sx={{ color: colors.accent.green, bgcolor: '#E8F5E9' }}
              >
                <AssignmentTurnedInIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <IconButton
            size="small"
            onClick={(e) => { setMenuAnchor(e.currentTarget); setMenuDoc(doc); }}
          >
            <MoreHorizIcon sx={{ color: colors.secondary.text }} />
          </IconButton>
        </Box>
      )
    }
  ], [t]);

  const handleExport = () => {
    const dataToExport = filteredDocuments.map((doc) => ({
      'Document Name': doc.doc_name,
      'Document Number': doc.doc_no,
      Date: formatDateTime(doc.incoming_date),
      Sender: doc.creator_name || '-',
      Status: doc.status,
    }));
    exportToCSV(dataToExport, 'Inbound_Documents');
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchDocuments,
    triggerExport: handleExport,
  }));

  const handleReceiveSubmit = async () => {
    if (!selectedDoc) return;
    setActionLoading(true);
    try {
      await incomingDocService.receiveDocument(selectedDoc.id, { remark });
      await fetchDocuments();
      setReceiveDialogOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveSubmit = async (approved: boolean) => {
    if (!selectedDoc) return;
    setActionLoading(true);
    try {
      const status = approved ? 'approved' : 'rejected';
      await incomingDocService.approveDocument(selectedDoc.id, { status, remark });
      await fetchDocuments();
      setApproveDialogOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box>
      {/* Toolbar — status filter only; Export/Refresh moved to parent title bar */}
      <Card sx={{ p: 2, mb: 2, borderRadius: '0 0 8px 8px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              size="small"
              label={t('docs.filterByStatus')}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="all">{t('docs.allStatuses')}</option>
              <option value="pending">{t('common.pending')}</option>
              <option value="received">{t('common.received')}</option>
              <option value="approved">{t('common.approved')}</option>
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {tabBar}

      <DataTable
        columns={columns}
        data={filteredDocuments}
        loading={loading}
        totalItems={totalItems}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        countLabel={t('docs.totalInbound')}
      />

      {/* Row action menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => { setMenuAnchor(null); setMenuDoc(null); }}
        slotProps={{ paper: { sx: { minWidth: 160, borderRadius: 2 } } }}
      >
        <MenuItem
          disabled={!menuDoc?.doc_path || downloadingId === menuDoc?.id}
          onClick={async () => {
            if (!menuDoc) return;
            setMenuAnchor(null);
            setDownloadingId(menuDoc.id);
            try { await downloadDocument(menuDoc.doc_path, menuDoc.doc_name, menuDoc.file_type); }
            finally { setDownloadingId(null); }
          }}
        >
          <ListItemIcon>
            {downloadingId === menuDoc?.id
              ? <CircularProgress size={18} />
              : <DownloadIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>{t('common.download')}</ListItemText>
        </MenuItem>
      </Menu>

      {/* Receive Dialog */}
      <Dialog open={receiveDialogOpen} onClose={() => setReceiveDialogOpen(false)}>
        <DialogTitle>{t('docs.receiveDocument')}</DialogTitle>
        <DialogContent sx={{ minWidth: 400, pt: 2 }}>
          <TextField
            fullWidth multiline rows={3}
            label={t('docs.remarkOptional')}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReceiveDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" color="primary" onClick={handleReceiveSubmit} disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={24} /> : t('docs.confirmReceive')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)}>
        <DialogTitle>{t('docs.evaluateDocument')}</DialogTitle>
        <DialogContent sx={{ minWidth: 400, pt: 2 }}>
          <TextField
            fullWidth multiline rows={3}
            label={t('docs.remarkRequired')}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            sx={{ mt: 2 }}
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
            {t('docs.approve')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

InboundTab.displayName = 'InboundTab';

export default InboundTab;
