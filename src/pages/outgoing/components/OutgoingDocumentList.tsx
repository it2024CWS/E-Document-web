import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    IconButton,
    Typography
} from '@mui/material';
import { OutgoingDocModel } from '@/services/mock/outgoingDocServiceMock';
import { colors } from '@/themes/colors';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { getFileIcon } from '@/utils/documentUtils';

interface OutgoingDocumentListProps {
    documents: OutgoingDocModel[];
    loading: boolean;
    onViewDetail: (doc: OutgoingDocModel) => void;
}

const OutgoingDocumentList = ({ documents, loading, onViewDetail }: OutgoingDocumentListProps) => {
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
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {documents.map((doc) => (
                        <TableRow key={doc.id} hover sx={{ '& td': { borderBottom: 'none', py: 2 } }}>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {getFileIcon(doc.doc_name || '')}
                                    <Typography variant="body2" fontWeight={500}>{doc.doc_name || '-'}</Typography>
                                </Box>
                            </TableCell>
                            <TableCell sx={{ color: colors.secondary.text }}>{doc.doc_no || '-'}</TableCell>
                            <TableCell sx={{ color: colors.secondary.text }}>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                            <TableCell sx={{ color: colors.secondary.text }}>{doc.user_name || '-'}</TableCell>
                            <TableCell align="right">
                                <IconButton size="small" onClick={() => onViewDetail(doc)}>
                                    <MoreHorizIcon sx={{ color: colors.secondary.text }} />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}

                    {documents.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 3, color: colors.secondary.text }}>
                                No documents found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default OutgoingDocumentList;
