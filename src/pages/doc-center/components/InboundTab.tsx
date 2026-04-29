import { useState, useEffect, useMemo } from 'react';
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
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { incomingDocService } from '@/services/incomingDocService';
import { IncomingDocModel } from '@/models/incomingDocModel';
import DataTable, { Column } from '@/components/Table/DataTable';
import { exportToCSV } from '@/utils/exportUtils';
import { getFileIcon, getStatusColor } from '@/utils/documentUtils';
import { colors } from '@/themes/colors';

const InboundTab = () => {
  const [documents, setDocuments] = useState<IncomingDocModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<IncomingDocModel | null>(null);
  const [remark, setRemark] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

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

  const filteredDocuments =
    filterStatus === 'all' ? documents : documents.filter((doc) => doc.status === filterStatus);

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
                onClick={() => { setSelectedDoc(doc); setRemark(''); setReceiveDialogOpen(true); }}
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
                onClick={() => { setSelectedDoc(doc); setRemark(''); setApproveDialogOpen(true); }}
                sx={{ color: colors.accent.green, bgcolor: '#E8F5E9' }}
              >
                <AssignmentTurnedInIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <IconButton size="small" onClick={() => console.log('View detail', doc)}>
            <MoreHorizIcon sx={{ color: colors.secondary.text }} />
          </IconButton>
        </Box>
      )
    }
  ], []);

  const handleExport = () => {
    const dataToExport = filteredDocuments.map((doc) => ({
      'Incoming No': doc.incoming_no,
      'Document Name': doc.doc_name,
      'Document Number': doc.doc_no,
      Date: new Date(doc.created_at).toLocaleDateString(),
      Sender: doc.sender_name,
      Status: doc.status,
    }));
    exportToCSV(dataToExport, 'Inbound_Documents');
  };

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
      {/* Toolbar */}
      <Card sx={{ p: 2, mb: 2, borderRadius: '0 0 8px 8px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Filter by Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="received">Received</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 'auto' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                startIcon={<FileDownloadIcon />}
                variant="contained"
                color="success"
                size="small"
                onClick={handleExport}
                disabled={filteredDocuments.length === 0}
              >
                Export Excel
              </Button>
              <Button
                startIcon={<RefreshIcon />}
                variant="outlined"
                size="small"
                onClick={fetchDocuments}
              >
                Refresh
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>

      <DataTable
        columns={columns}
        data={filteredDocuments}
        loading={loading}
        totalItems={totalItems}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        countLabel="Total Inbound Docs"
      />

      {/* Receive Dialog */}
      <Dialog open={receiveDialogOpen} onClose={() => setReceiveDialogOpen(false)}>
        <DialogTitle>Receive Document</DialogTitle>
        <DialogContent sx={{ minWidth: 400, pt: 2 }}>
          <TextField
            fullWidth multiline rows={3}
            label="Remark (Optional)"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReceiveDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleReceiveSubmit} disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={24} /> : 'Confirm Receive'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approve/Reject Dialog */}
      <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)}>
        <DialogTitle>Evaluate Document</DialogTitle>
        <DialogContent sx={{ minWidth: 400, pt: 2 }}>
          <TextField
            fullWidth multiline rows={3}
            label="Remark (Required for Rejection)"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" startIcon={<CancelIcon />}
            onClick={() => handleApproveSubmit(false)} disabled={actionLoading}>
            Reject
          </Button>
          <Button variant="contained" color="success" startIcon={<CheckCircleIcon />}
            onClick={() => handleApproveSubmit(true)} disabled={actionLoading}>
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InboundTab;
