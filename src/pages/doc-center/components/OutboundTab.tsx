import { useState, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react';
import { Box, Card, Button, Grid, Typography, IconButton, TextField, FormControlLabel, Checkbox } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { outgoingDocService, OutgoingDocFilter } from '@/services/outgoingDocService';
import { OutgoingDocModel } from '@/models/outgoingDocModel';
import DataTable, { Column } from '@/components/Table/DataTable';
import { exportToCSV } from '@/utils/exportUtils';
import { getFileIcon } from '@/utils/documentUtils';
import { colors } from '@/themes/colors';
import DocumentDetailModal from './DocumentDetailModal';
import useAuth from '@/contexts/auth/useAuth';

export interface OutboundTabRef {
  refresh: () => void;
}

const OutboundTab = forwardRef<OutboundTabRef>((_, ref) => {
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

  // Filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [docNo, setDocNo] = useState('');
  const [filterByDept, setFilterByDept] = useState(true);

  useImperativeHandle(ref, () => ({
    refresh: fetchDocuments,
  }));

  useEffect(() => {
    fetchDocuments();
  }, [page, rowsPerPage, startDate, endDate, docNo, filterByDept]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const filters: OutgoingDocFilter = {
        departmentId: filterByDept ? user?.department_id || undefined : undefined,
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

  const getStatusCounts = (doc: OutgoingDocModel) => {
    // Use status_counts from API if available (new format)
    if (doc.status_counts) {
      return doc.status_counts;
    }

    // Fallback: calculate from recipients (new format)
    const counts = {
      pending: 0,
      received: 0,
      approved: 0,
      rejected: 0,
    };

    if (doc.recipients && Array.isArray(doc.recipients)) {
      doc.recipients.forEach((recipient: any) => {
        const status = recipient.status?.toLowerCase() || recipient.incoming_doc?.status?.toLowerCase();
        if (status in counts) {
          counts[status as keyof typeof counts]++;
        }
      });
      return counts;
    }

    // Legacy: calculate from incoming_docs (old format)
    if (doc.incoming_docs && Array.isArray(doc.incoming_docs)) {
      doc.incoming_docs.forEach((inc: any) => {
        const status = inc.status?.toLowerCase();
        if (status in counts) {
          counts[status as keyof typeof counts]++;
        }
      });
    }

    return counts;
  };

  const getRecipientsList = (doc: OutgoingDocModel) => {
    if (doc.recipients && Array.isArray(doc.recipients)) {
      return doc.recipients.map((r: any) => r.department_name || r.dept_name).filter(Boolean).join(', ');
    }
    return '-';
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
    { label: 'Sender', content: (doc) => doc.creator_name || doc.user_name || '-' },
    {
      label: 'Recipients',
      content: (doc) => (
        <Typography variant="body2" sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={getRecipientsList(doc)}>
          {getRecipientsList(doc)}
        </Typography>
      )
    },
    {
      label: 'All',
      align: 'center',
      content: (doc) => {
        const total = doc.status_counts?.total ?? doc.recipients?.length ?? 0;
        return <Typography variant="body2" fontWeight={700}>{total}</Typography>;
      }
    },
    {
      label: 'Pending',
      align: 'center',
      content: (doc) => {
        const counts = getStatusCounts(doc);
        return <Typography variant="body2" fontWeight={600}>{counts.pending}</Typography>;
      }
    },
    {
      label: 'Received',
      align: 'center',
      content: (doc) => {
        const counts = getStatusCounts(doc);
        return <Typography variant="body2" fontWeight={600}>{counts.received}</Typography>;
      }
    },
    {
      label: 'Approved',
      align: 'center',
      content: (doc) => {
        const counts = getStatusCounts(doc);
        return <Typography variant="body2" fontWeight={600}>{counts.approved}</Typography>;
      }
    },
    {
      label: 'Rejected',
      align: 'center',
      content: (doc) => {
        const counts = getStatusCounts(doc);
        return <Typography variant="body2" fontWeight={600}>{counts.rejected}</Typography>;
      }
    },
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
      {/* Filters */}
      <Card sx={{ p: 2, mb: 2, borderRadius: '8px 8px 0 0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <TextField
              fullWidth
              size="small"
              label="Document Number"
              value={docNo}
              onChange={(e) => {
                setDocNo(e.target.value);
                setPage(0);
              }}
              placeholder="Filter by doc no..."
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(0);
              }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(0);
              }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterByDept}
                  onChange={(e) => {
                    setFilterByDept(e.target.checked);
                    setPage(0);
                  }}
                  size="small"
                />
              }
              label="My Dept Only"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setDocNo('');
                setStartDate('');
                setEndDate('');
                setFilterByDept(true);
                setPage(0);
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Card>

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
});

OutboundTab.displayName = 'OutboundTab';

export default OutboundTab;
