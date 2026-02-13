
import { useState, useEffect } from 'react';
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
    Grid
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { incomingDocServiceMock, IncomingDocModel } from '@/services/mock/incomingDocServiceMock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import BreadcrumbsCustom from '@/components/BreadcrumbsCustom';
import IncomingDocumentList from './components/IncomingDocumentList';
import { exportToCSV } from '@/utils/exportUtils';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const IncomingPage = () => {
    const [documents, setDocuments] = useState<IncomingDocModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Dialog States
    const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<IncomingDocModel | null>(null);
    const [remark, setRemark] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const res = await incomingDocServiceMock.getAllIncomingDocs();
            if (res.success) {
                setDocuments(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch incoming documents", error);
        } finally {
            setLoading(false);
        }
    };

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
            'Incoming No': doc.incoming_no,
            'Document Name': doc.doc_name,
            'Document Number': doc.doc_no,
            'Date': new Date(doc.created_at).toLocaleDateString(),
            'Sender': doc.sender_name,
            'Status': doc.status
        }));
        exportToCSV(dataToExport, 'Incoming_Documents');
    };

    return (
        <Box>
            <BreadcrumbsCustom breadcrumbs={[{ label: 'Incoming Documents' }]} />

            <Box sx={{ mt: 3, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">Incoming Documents</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
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
                documents={filteredDocuments}
                loading={loading}
                onReceive={handleOpenReceive}
                onApprove={handleOpenApprove}
                onViewDetail={(doc) => console.log('View detail', doc)}
            />

            {/* Receive Dialog */}
            <Dialog open={receiveDialogOpen} onClose={() => setReceiveDialogOpen(false)}>
                <DialogTitle>Receive Document</DialogTitle>
                <DialogContent sx={{ minWidth: 400, pt: 2 }}>
                    <Typography gutterBottom>
                        Incoming No: {selectedDoc?.incoming_no}
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
                        Incoming No: {selectedDoc?.incoming_no}
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
