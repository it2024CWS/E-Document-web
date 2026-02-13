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
    colors as muiColors
} from '@mui/material';
import { DocumentModel } from '@/services/documentService';
import { FolderModel } from '@/models/folderModel';
import { colors } from '@/themes/colors';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TableChartIcon from '@mui/icons-material/TableChart';
import FolderIcon from '@mui/icons-material/Folder';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface DocumentListProps {
    documents: DocumentModel[];
    folders?: FolderModel[];
    loading: boolean;
    onVersionHistory: (doc: DocumentModel) => void;
    onEdit: (doc: DocumentModel) => void;
    onDelete: (doc: DocumentModel) => void;
    onFolderClick?: (folder: FolderModel) => void;
    onDetail: (item: DocumentModel | FolderModel) => void;
}

const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <PictureAsPdfIcon sx={{ color: colors.accent.red }} />;
    if (['doc', 'docx'].includes(ext || '')) return <DescriptionIcon sx={{ color: colors.secondary.blue1 }} />;
    if (['xls', 'xlsx'].includes(ext || '')) return <TableChartIcon sx={{ color: colors.accent.green }} />;
    return <InsertDriveFileIcon sx={{ color: colors.secondary.gray1 }} />;
};

const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'general') return { bg: '#E3F2FD', color: '#1565C0' }; // Blue
    if (s === 'pending') return { bg: '#FFF4E5', color: '#B76E00' }; // Orange
    if (s === 'approved') return { bg: '#E8F5E9', color: '#2E7D32' }; // Green
    // Fallback for old mock data
    if (s === 'confidential') return { bg: '#FFF4E5', color: '#B76E00' };
    if (s === 'highly confidential') return { bg: '#FFEBEE', color: '#C62828' };
    return { bg: colors.secondary.gray3, color: colors.secondary.text }; // Default
};

const DocumentList = ({
    documents,
    folders = [],
    loading,
    onVersionHistory,
    onEdit,
    onFolderClick,
    onDetail
}: DocumentListProps) => {
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
                        <TableCell>Modified</TableCell>
                        <TableCell>Owner name</TableCell>
                        <TableCell>Department name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* Folders */}
                    {folders.map((folder) => (
                        <TableRow
                            key={`folder-${folder.id}`}
                            hover
                            sx={{
                                cursor: 'pointer',
                                '& td': { borderBottom: 'none', py: 2 }
                            }}
                            onDoubleClick={() => onFolderClick?.(folder)}
                        >
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <FolderIcon sx={{ color: colors.accent.yellow, fontSize: 32 }} />
                                    <Typography variant="body2" fontWeight={500}>{folder.name}</Typography>
                                </Box>
                            </TableCell>
                            <TableCell sx={{ color: colors.secondary.text }}>-</TableCell>
                            <TableCell sx={{ color: colors.secondary.text }}>{new Date(folder.updated_at || Date.now()).toLocaleDateString()}</TableCell>
                            <TableCell sx={{ color: colors.secondary.text }}>-</TableCell>
                            <TableCell sx={{ color: colors.secondary.text }}>-</TableCell>
                            <TableCell></TableCell>
                            <TableCell align="right">
                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDetail(folder); }}>
                                    <MoreHorizIcon sx={{ color: colors.secondary.text }} />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}

                    {/* Documents */}
                    {documents.map((doc) => {
                        const statusStyle = getStatusColor(doc.status || 'General');
                        return (
                            <TableRow key={doc.id} hover sx={{ '& td': { borderBottom: 'none', py: 2 } }}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        {getFileIcon(doc.doc_name)}
                                        <Typography variant="body2" fontWeight={500}>{doc.doc_name}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ color: colors.secondary.text }}>{doc.doc_no || '-'}</TableCell>
                                <TableCell sx={{ color: colors.secondary.text }}>{new Date(doc.updated_at).toLocaleDateString()}</TableCell>
                                <TableCell sx={{ color: colors.secondary.text }}>{doc.user_name || '-'}</TableCell>
                                <TableCell sx={{ color: colors.secondary.text }}>{doc.department_name || '-'}</TableCell>
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
                                    <IconButton size="small" onClick={() => onDetail(doc)}>
                                        <MoreHorizIcon sx={{ color: colors.secondary.text }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    })}

                    {documents.length === 0 && folders.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} align="center" sx={{ py: 3, color: colors.secondary.text }}>
                                No files or folders
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DocumentList;
