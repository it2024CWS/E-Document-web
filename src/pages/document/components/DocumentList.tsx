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
import { DocumentModel } from '../../../models/documentModel';
import { formatDate } from '@/utils/dateUtils';
import { FolderModel } from '../../../models/folderModel';
import { colors } from '../../../themes/colors';
import { getFileIcon } from '@/utils/documentUtils';
import FolderIcon from '@mui/icons-material/Folder';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useTranslation } from 'react-i18next';

interface DocumentListProps {
    documents: DocumentModel[];
    folders?: FolderModel[];
    loading: boolean;
    onDelete: (doc: DocumentModel) => void;
    onFolderClick?: (folder: FolderModel) => void;
    onDetail: (item: DocumentModel | FolderModel) => void;
}

const DocumentList = ({
    documents,
    folders = [],
    loading,
    onFolderClick,
    onDetail
}: DocumentListProps) => {
    const { t } = useTranslation();

    if (loading) {
        return <Typography sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>{t('common.loading')}</Typography>;
    }

    return (
        <TableContainer component={Paper} elevation={0} sx={{ border: 'none' }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ '& th': { borderBottom: 'none', color: colors.secondary.text, fontWeight: 600, fontSize: '0.9rem' } }}>
                        <TableCell>{t('docs.documentName')}</TableCell>
                        <TableCell>{t('docs.documentNumber')}</TableCell>
                        <TableCell>{t('common.modified')}</TableCell>
                        <TableCell>{t('myFile.ownerName')}</TableCell>
                        <TableCell>{t('myFile.departmentName')}</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* Folders */}
                    {folders.map((folder) => (
                        <TableRow
                            key={`folder-${folder.id}`}
                            hover
                            sx={{ cursor: 'pointer', '& td': { borderBottom: 'none', py: 2 } }}
                            onDoubleClick={() => onFolderClick?.(folder)}
                        >
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <FolderIcon sx={{ color: colors.accent.yellow, fontSize: 32 }} />
                                    <Typography variant="body2" fontWeight={500}>{folder.folder_name}</Typography>
                                </Box>
                            </TableCell>
                            <TableCell sx={{ color: colors.secondary.text }}>-</TableCell>
                            <TableCell sx={{ color: colors.secondary.text }}>{formatDate(folder.updated_at || Date.now())}</TableCell>
                            <TableCell sx={{ color: colors.secondary.text }}>-</TableCell>
                            <TableCell sx={{ color: colors.secondary.text }}>-</TableCell>
                            <TableCell align="right">
                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDetail(folder); }}>
                                    <MoreHorizIcon sx={{ color: colors.secondary.text }} />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}

                    {/* Documents */}
                    {documents.map((doc) => (
                        <TableRow key={doc.id} hover sx={{ '& td': { borderBottom: 'none', py: 2 } }}>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {getFileIcon(doc.file_type || doc.type || doc.doc_name || '')}
                                    <Typography variant="body2" fontWeight={500}>{doc.doc_name}</Typography>
                                </Box>
                            </TableCell>
                            <TableCell sx={{ color: colors.secondary.text }}>{doc.doc_no || '-'}</TableCell>
                            <TableCell sx={{ color: colors.secondary.text }}>{formatDate(doc.updated_at)}</TableCell>
                            <TableCell sx={{ color: colors.secondary.text }}>{doc.registrant_name || '-'}</TableCell>
                            <TableCell sx={{ color: colors.secondary.text }}>{doc.department_name || '-'}</TableCell>
                            <TableCell align="right">
                                <IconButton size="small" onClick={() => onDetail(doc)}>
                                    <MoreHorizIcon sx={{ color: colors.secondary.text }} />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}

                    {documents.length === 0 && folders.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 3, color: colors.secondary.text }}>
                                {t('myFile.noFilesOrFolders')}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DocumentList;
