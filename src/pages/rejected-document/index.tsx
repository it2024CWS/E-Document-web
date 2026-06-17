import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Card,
  Grid,
  TextField,
  Button,
  Chip,
  Typography,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useTranslation } from 'react-i18next';
import BreadcrumbsCustom from '@/components/BreadcrumbsCustom';
import DataTable, { Column } from '@/components/Table/DataTable';
import { rejectedDocService } from '@/services/rejectedDocService';
import { departmentService } from '@/services/departmentService';
import { RejectedDocModel } from '@/models/rejectedDocModel';
import { DepartmentModel } from '@/models/departmentModel';
import { exportToCSV } from '@/utils/exportUtils';
import { formatDateTime } from '@/utils/dateUtils';
import { getFileIcon, getStatusColor, downloadDocument } from '@/utils/documentUtils';
import { colors } from '@/themes/colors';

const RejectedDocumentPage = () => {
  const { t } = useTranslation();

  const [documents, setDocuments] = useState<RejectedDocModel[]>([]);
  const [departments, setDepartments] = useState<DepartmentModel[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [deptId, setDeptId] = useState('');
  const [source, setSource] = useState<'all' | 'inbound' | 'outbound'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Row action menu (download)
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuDoc, setMenuDoc] = useState<RejectedDocModel | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    departmentService
      .getAllDepartments(1, 100)
      .then((res) => setDepartments(res.items || []))
      .catch((err) => console.error('Failed to load departments', err));
  }, []);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await rejectedDocService.getRejectedDocs(page + 1, rowsPerPage, {
        dept_id: deptId || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });
      if (res.status === 200 || res.success) {
        setDocuments(res.data.items || res.data || []);
        if (res.pagination) setTotalItems(res.pagination.totalItems);
      }
    } catch (error) {
      console.error('Failed to fetch rejected documents', error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, deptId, startDate, endDate]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleChangePage = (newPage: number) => setPage(newPage - 1);
  const handleChangeRowsPerPage = (newLimit: number) => {
    setRowsPerPage(newLimit);
    setPage(0);
  };

  const clearFilters = () => {
    setDeptId('');
    setSource('all');
    setStartDate('');
    setEndDate('');
    setPage(0);
  };

  // Source is not a backend param — filter the current page client-side
  // (mirrors how InboundTab filters by status).
  const filteredDocuments =
    source === 'all' ? documents : documents.filter((doc) => doc.source === source);

  const sourceLabel = (s: string) => (s === 'outbound' ? t('reject.outbound') : t('reject.inbound'));

  const columns = useMemo((): Column<RejectedDocModel>[] => [
    {
      label: t('docs.documentName'),
      content: (doc) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {getFileIcon(doc.file_type || doc.doc_name || '')}
          <Typography variant="body2" fontWeight={500}>{doc.doc_name}</Typography>
        </Box>
      ),
    },
    { label: t('docs.documentNumber'), content: (doc) => doc.doc_no || '-' },
    { label: t('reject.department'), content: (doc) => doc.dept_name || '-' },
    {
      label: t('reject.source'),
      content: (doc) => {
        const isOutbound = doc.source === 'outbound';
        return (
          <Chip
            label={sourceLabel(doc.source)}
            size="small"
            sx={{
              borderRadius: '6px',
              bgcolor: isOutbound ? '#EDE7F6' : '#E1F5FE',
              color: isOutbound ? '#5E35B1' : '#0288D1',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 24,
            }}
          />
        );
      },
    },
    { label: t('reject.rejectedBy'), content: (doc) => doc.rejected_by || '-' },
    { label: t('reject.rejectionDate'), content: (doc) => formatDateTime(doc.rejected_at) },
    {
      label: t('common.status'),
      content: () => {
        const statusStyle = getStatusColor('rejected');
        return (
          <Chip
            label={t('common.rejected')}
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
    { label: t('common.remark'), content: (doc) => doc.remark || '-' },
    {
      label: '',
      align: 'right',
      content: (doc) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton size="small" onClick={(e) => { setMenuAnchor(e.currentTarget); setMenuDoc(doc); }}>
            <MoreHorizIcon sx={{ color: colors.secondary.text }} />
          </IconButton>
        </Box>
      ),
    },
  ], [t]);

  const handleExport = () => {
    const dataToExport = filteredDocuments.map((doc) => ({
      'Document Name': doc.doc_name,
      'Document Number': doc.doc_no,
      Department: doc.dept_name || '-',
      Source: sourceLabel(doc.source),
      'Rejected By': doc.rejected_by || '-',
      'Rejection Date': formatDateTime(doc.rejected_at),
      Status: 'rejected',
      Remark: doc.remark || '-',
    }));
    exportToCSV(dataToExport, 'Rejected_Documents');
  };

  return (
    <Box>
      <BreadcrumbsCustom
        breadcrumbs={[{ label: t('nav.documentManagement') }, { label: t('reject.title') }]}
      />

      <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight={700}>
          {t('reject.title')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button startIcon={<FileDownloadIcon />} variant="contained" color="success" onClick={handleExport}>
            {t('common.exportExcel')}
          </Button>
          <Button startIcon={<RefreshIcon />} variant="outlined" onClick={fetchDocuments}>
            {t('common.refresh')}
          </Button>
        </Box>
      </Box>

      <Card sx={{ p: 2, mb: 2, borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              select fullWidth size="small"
              label={t('reject.department')}
              value={deptId}
              onChange={(e) => { setDeptId(e.target.value); setPage(0); }}
              SelectProps={{ native: true }}
            >
              <option value="">{t('reject.allDepartments')}</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.dept_name}</option>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              select fullWidth size="small"
              label={t('reject.source')}
              value={source}
              onChange={(e) => setSource(e.target.value as 'all' | 'inbound' | 'outbound')}
              SelectProps={{ native: true }}
            >
              <option value="all">{t('reject.allSources')}</option>
              <option value="inbound">{t('reject.inbound')}</option>
              <option value="outbound">{t('reject.outbound')}</option>
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, md: 2.5 }}>
            <TextField
              type="date" fullWidth size="small"
              label={t('docs.startDate')}
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(0); }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 2.5 }}>
            <TextField
              type="date" fullWidth size="small"
              label={t('docs.endDate')}
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(0); }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 1 }}>
            <Button variant="outlined" size="small" fullWidth onClick={clearFilters}>
              {t('common.clear')}
            </Button>
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
        countLabel={t('reject.totalRejected')}
      />

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
            {downloadingId === menuDoc?.id ? <CircularProgress size={18} /> : <DownloadIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>{t('common.download')}</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default RejectedDocumentPage;
