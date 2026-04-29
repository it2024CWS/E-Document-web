import { useState, useEffect, useMemo } from 'react';
import { Box, Card, Button, Grid, Typography, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { outgoingDocService } from '@/services/outgoingDocService';
import { OutgoingDocModel } from '@/models/outgoingDocModel';
import DataTable, { Column } from '@/components/Table/DataTable';
import { exportToCSV } from '@/utils/exportUtils';
import { getFileIcon } from '@/utils/documentUtils';
import { colors } from '@/themes/colors';
import DocumentDetailModal from './DocumentDetailModal';

const OutboundTab = () => {
  const [documents, setDocuments] = useState<OutgoingDocModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<OutgoingDocModel | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

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
      const res = await outgoingDocService.getAllOutgoingDocs(page + 1, rowsPerPage);
      if (res.status === 200 || res.success) {
        // Backend returns { items: [...] } in res.data
        setDocuments(res.data.items || res.data);
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
        <IconButton size="small" onClick={() => handleOpenDetail(doc)}>
          <MoreHorizIcon sx={{ color: colors.secondary.text }} />
        </IconButton>
      )
    }
  ], []);

  const handleExport = () => {
    const dataToExport = documents.map((doc) => ({
      'Document Name': doc.doc_name,
      'Document Number': doc.doc_no,
      Date: new Date(doc.created_at).toLocaleDateString(),
      Sender: doc.user_name,
    }));
    exportToCSV(dataToExport, 'Outbound_Documents');
  };

  return (
    <Box>
      {/* Toolbar */}
      <Card sx={{ p: 2, mb: 2, borderRadius: '0 0 8px 8px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
          <Grid size={{ xs: 12, md: 'auto' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                startIcon={<FileDownloadIcon />}
                variant="contained"
                color="success"
                size="small"
                onClick={handleExport}
                disabled={documents.length === 0}
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
        data={documents}
        loading={loading}
        totalItems={totalItems}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        countLabel="Total Outbound Docs"
      />

      <DocumentDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        document={selectedDoc}
        loading={detailLoading}
      />
    </Box>
  );
};

export default OutboundTab;
