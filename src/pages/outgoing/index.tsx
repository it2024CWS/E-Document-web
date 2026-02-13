
import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { outgoingDocServiceMock, OutgoingDocModel } from '@/services/mock/outgoingDocServiceMock';
import BreadcrumbsCustom from '@/components/BreadcrumbsCustom';
import OutgoingDocumentList from './components/OutgoingDocumentList';
import { exportToCSV } from '@/utils/exportUtils';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const OutgoingPage = () => {
    const [documents, setDocuments] = useState<OutgoingDocModel[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const res = await outgoingDocServiceMock.getAllOutgoingDocs();
            if (res.success) {
                setDocuments(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch outgoing documents", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        const dataToExport = documents.map(doc => ({
            'Document Name': doc.doc_name,
            'Document Number': doc.doc_no,
            'Date': new Date(doc.created_at).toLocaleDateString(),
            'Sender': doc.user_name
        }));
        exportToCSV(dataToExport, 'Outgoing_Documents');
    };

    return (
        <Box>
            <BreadcrumbsCustom breadcrumbs={[{ label: 'Outgoing Documents' }]} />

            <Box sx={{ mt: 3, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">Outgoing Documents</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                        color="success"
                        onClick={handleExport}
                        disabled={documents.length === 0}
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

            <OutgoingDocumentList
                documents={documents}
                loading={loading}
                onViewDetail={(doc) => console.log('View detail', doc)}
            />
        </Box>
    );
};

export default OutgoingPage;
