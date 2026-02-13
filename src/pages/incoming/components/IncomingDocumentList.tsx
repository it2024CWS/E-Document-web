import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Box,
    IconButton,
    Typography,
    Tooltip
} from '@mui/material';
import { IncomingDocModel } from '@/services/mock/incomingDocServiceMock';
import { colors } from '@/themes/colors';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FileDownloadIcon from '@mui/icons-material/FileDownload'; // Receive
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'; // Approve
import { getFileIcon, getStatusColor } from '@/utils/documentUtils';

interface IncomingDocumentListProps {
    documents: IncomingDocModel[];
    loading: boolean;
    onReceive: (doc: IncomingDocModel) => void;
    onApprove: (doc: IncomingDocModel) => void;
    onViewDetail: (doc: IncomingDocModel) => void;
}

const IncomingDocumentList = ({ documents, loading, onReceive, onApprove, onViewDetail }: IncomingDocumentListProps) => {
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <TableContainer component={Paper} elevation={0} sx={{ border: 'none' }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ '& th': { borderBottom: 'none', color: colors.secondary.text, fontWeight: 600, fontSize: '0.9rem' } }}>
                        <TableCell>Document Name</TableCell>
                        <TableCell>Document number</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Sender</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {documents.map((doc) => {
                        const statusStyle = getStatusColor(doc.status);
                        return (
                            <TableRow key={doc.id} hover sx={{ '& td': { borderBottom: 'none', py: 2 } }}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        {getFileIcon(doc.doc_name || '')}
                                        <Typography variant="body2" fontWeight={500}>{doc.doc_name}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ color: colors.secondary.text }}>{doc.doc_no || '-'}</TableCell>
                                <TableCell sx={{ color: colors.secondary.text }}>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                                <TableCell sx={{ color: colors.secondary.text }}>{doc.sender_name || '-'}</TableCell>
                                <TableCell>
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
                                </TableCell>
                                <TableCell align="right">
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        {doc.status === 'pending' && (
                                            <Tooltip title="Receive Document">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => onReceive(doc)}
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
                                                    onClick={() => onApprove(doc)}
                                                    sx={{ color: colors.accent.green, bgcolor: '#E8F5E9' }}
                                                >
                                                    <AssignmentTurnedInIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        <IconButton size="small" onClick={() => onViewDetail(doc)}>
                                            <MoreHorizIcon sx={{ color: colors.secondary.text }} />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        );
                    })}

                    {documents.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 3, color: colors.secondary.text }}>
                                No documents found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default IncomingDocumentList;
