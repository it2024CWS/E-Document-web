import { useState, useEffect, useMemo, useImperativeHandle, forwardRef, ReactNode } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { outgoingDocService, OutgoingDocFilter } from '@/services/outgoingDocService';
import { OutgoingDocModel } from '@/models/outgoingDocModel';
import DataTable, { Column } from '@/components/Table/DataTable';
import { exportToCSV } from '@/utils/exportUtils';
import { formatDateTime } from '@/utils/dateUtils';
import { getFileIcon } from '@/utils/documentUtils';
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
      label: t('common.all'),
      align: 'center',
      content: (doc) => {
        const total = doc.status_counts?.total ?? doc.recipients?.length ?? 0;
        return <Typography variant="body2" fontWeight={700}>{total}</Typography>;
      }
    },
    {
      label: t('common.pending'),
      align: 'center',
      content: (doc) => {
        const counts = getStatusCounts(doc);
        return <Typography variant="body2" fontWeight={600}>{counts.pending}</Typography>;
      }
    },
    {
      label: t('common.received'),
      align: 'center',
      content: (doc) => {
        const counts = getStatusCounts(doc);
        return <Typography variant="body2" fontWeight={600}>{counts.received}</Typography>;
      }
    },
    {
      label: t('common.approved'),
      align: 'center',
      content: (doc) => {
        const counts = getStatusCounts(doc);
        return <Typography variant="body2" fontWeight={600}>{counts.approved}</Typography>;
      }
    },
    {
      label: t('common.rejected'),
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
    </Box>
  );
});

OutboundTab.displayName = 'OutboundTab';

export default OutboundTab;
