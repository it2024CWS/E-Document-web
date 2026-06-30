
import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
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
    Alert,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import BreadcrumbsCustom from '@/components/BreadcrumbsCustom';
import IncomingDocumentList from './components/IncomingDocumentList';
import { exportToCSV } from '@/utils/exportUtils';
import { formatDate } from '@/utils/dateUtils';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { incomingDocServiceMock } from '@/services/mock/incomingDocServiceMock';
import { incomingDocService } from '@/services/incomingDocService';
import { IncomingDocModel } from '@/models/incomingDocModel';
import { useBarcodeScan } from '@/hooks/useBarcodeScan';
import Swal from 'sweetalert2';

const IncomingPage = () => {
    const [documents, setDocuments] = useState<IncomingDocModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Dialog States (list-based flow)
    const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<IncomingDocModel | null>(null);
    const [remark, setRemark] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // Barcode scan state
    const [scanActive, setScanActive] = useState(false);
    const [scanLoading, setScanLoading] = useState(false);
    const [scanDoc, setScanDoc] = useState<IncomingDocModel | null>(null);
    const [scanDialogOpen, setScanDialogOpen] = useState(false);
    const [scanRemark, setScanRemark] = useState('');

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const res = await incomingDocServiceMock.getAllIncomingDocs();
            if (res.success) {
                setDocuments(res.data as unknown as IncomingDocModel[]);
            }
        } catch (error) {
            console.error("Failed to fetch incoming documents", error);
        } finally {
            setLoading(false);
        }
    };

    // --- barcode scan handler ---
    const handleBarcodeScan = useCallback(async (docNo: string) => {
        setScanLoading(true);
        try {
            const res = await incomingDocService.getByDocNo(docNo);
            const doc = res.data as IncomingDocModel;
            if (!doc) {
                Swal.fire({ icon: 'warning', title: 'Not Found', text: `No incoming document for "${docNo}"`, timer: 2500, showConfirmButton: false });
                return;
            }
            setScanDoc(doc);
            setScanRemark('');
            setScanDialogOpen(true);
        } catch {
            Swal.fire({ icon: 'error', title: 'Not Found', text: `No incoming document found for "${docNo}"`, timer: 2500, showConfirmButton: false });
        } finally {
            setScanLoading(false);
        }
    }, []);

    useBarcodeScan({ onScan: handleBarcodeScan, enabled: scanActive && !scanDialogOpen });

    const handleScanReceiveSubmit = async () => {
        if (!scanDoc) return;
        setActionLoading(true);
        try {
            await incomingDocService.receiveDocument(scanDoc.id, { remark: scanRemark });
            setScanDialogOpen(false);
            setScanDoc(null);
            fetchDocuments();
            Swal.fire({ icon: 'success', title: 'Received', text: `Document ${scanDoc.doc_no} received successfully`, timer: 2000, showConfirmButton: false });
        } catch (err: any) {
            Swal.fire('Error', err?.response?.data?.message || 'Failed to receive document', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    // --- list-based flow ---
    const handleOpenReceive = (doc: IncomingDocModel) => {
        setSelectedDoc(doc);
        setRemark('');
        setReceiveDialogOpen(true);
    };

    const handleReceiveSubmit = async () => {
        if (!selectedDoc) return;
        setActionLoading(true);
        try {
            await incomingDocServiceMock.receiveDocument(selectedDoc.id, { remark });
            await fetchDocuments();
            setReceiveDialogOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleOpenApprove = (doc: IncomingDocModel) => {
        setSelectedDoc(doc);
        setRemark('');
        setApproveDialogOpen(true);
    };

    const handleApproveSubmit = async (approved: boolean) => {
        if (!selectedDoc) return;
        setActionLoading(true);
        try {
            await incomingDocServiceMock.approveDocument(selectedDoc.id, { approved, remark });
            await fetchDocuments();
            setApproveDialogOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const filteredDocuments = filterStatus === 'all'
        ? documents
        : documents.filter(doc => doc.status === filterStatus);

    const handleExport = () => {
        const dataToExport = filteredDocuments.map(doc => ({
            'Document Name': doc.doc_name,
            'Document Number': doc.doc_no,
            'Date': formatDate(doc.incoming_date),
            'Sender': doc.creator_name || '-',
            'Status': doc.status
        }));
        exportToCSV(dataToExport, 'Incoming_Documents');
    };

    return (
        <Box>
            <BreadcrumbsCustom breadcrumbs={[{ label: 'Incoming Documents' }]} />

            <Box sx={{ mt: 3, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h5">Incoming Documents</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    {/* Barcode scan toggle */}
                    <Chip
                        icon={scanLoading ? <CircularProgress size={14} /> : <QrCodeScannerIcon />}
                        label={scanActive ? 'Scan Active' : 'Scan Off'}
                        color={scanActive ? 'success' : 'default'}
                        variant={scanActive ? 'filled' : 'outlined'}
                        onClick={() => setScanActive(v => !v)}
                        clickable
                        sx={{ fontWeight: 600, px: 0.5 }}
                    />
                    <Button
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                        color="success"
                        onClick={handleExport}
                        disabled={filteredDocuments.length === 0}
                    >
                        Export Excel
                    </Button>
                    <Button
                        startIcon={<RefreshIcon />}
                        variant="outlined"
                        onClick={fetchDocuments}
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>

            {/* Scan active banner */}
            {scanActive && (
                <Alert
                    severity="info"
                    icon={<QrCodeScannerIcon />}
                    sx={{ mb: 2 }}
                >
                    Barcode scanner active — scan a document barcode to receive it automatically
                </Alert>
            )}

            <Card sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            select
                            fullWidth
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
                </Grid>
            </Card>

            <IncomingDocumentList
                documents={filteredDocuments as any}
                loading={loading}
                onReceive={handleOpenReceive}
                onApprove={handleOpenApprove}
                onViewDetail={(doc) => console.log('View detail', doc)}
            />

            {/* Barcode Scan — Receive Dialog */}
            <Dialog open={scanDialogOpen} onClose={() => setScanDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <QrCodeScannerIcon color="primary" />
                    Receive Scanned Document
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    {scanDoc && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">Document No</Typography>
                            <Typography variant="subtitle1" fontWeight={700}>{scanDoc.doc_no}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Document Name</Typography>
                            <Typography variant="subtitle1">{scanDoc.doc_name}</Typography>
                            {scanDoc.creator_name && (
                                <>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Sender</Typography>
                                    <Typography variant="subtitle1">{scanDoc.creator_name}</Typography>
                                </>
                            )}
                            {scanDoc.status !== 'pending' && (
                                <Alert severity="warning" sx={{ mt: 2 }}>
                                    This document is already <strong>{scanDoc.status}</strong> and cannot be received again.
                                </Alert>
                            )}
                        </Box>
                    )}
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Remark (Optional)"
                        value={scanRemark}
                        onChange={(e) => setScanRemark(e.target.value)}
                        disabled={scanDoc?.status !== 'pending'}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setScanDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleScanReceiveSubmit}
                        disabled={actionLoading || scanDoc?.status !== 'pending'}
                        startIcon={actionLoading ? <CircularProgress size={18} /> : <CheckCircleIcon />}
                    >
                        Confirm Receive
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Receive Dialog (list-based) */}
            <Dialog open={receiveDialogOpen} onClose={() => setReceiveDialogOpen(false)}>
                <DialogTitle>Receive Document</DialogTitle>
                <DialogContent sx={{ minWidth: 400, pt: 2 }}>
                    <Typography gutterBottom>
                        Document No: {selectedDoc?.doc_no}
                    </Typography>
                    <Typography gutterBottom sx={{ mb: 2 }}>
                        Document: {selectedDoc?.doc_name}
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Remark (Optional)"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReceiveDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleReceiveSubmit}
                        disabled={actionLoading}
                    >
                        {actionLoading ? <CircularProgress size={24} /> : 'Confirm Receive'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Approve/Reject Dialog */}
            <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)}>
                <DialogTitle>Evaluate Document</DialogTitle>
                <DialogContent sx={{ minWidth: 400, pt: 2 }}>
                    <Typography gutterBottom>
                        Document No: {selectedDoc?.doc_no}
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Remark (Required for Rejection)"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => handleApproveSubmit(false)}
                        disabled={actionLoading}
                    >
                        Reject
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleApproveSubmit(true)}
                        disabled={actionLoading}
                    >
                        Approve
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default IncomingPage;
