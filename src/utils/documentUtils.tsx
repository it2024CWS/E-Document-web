import { colors } from '@/themes/colors';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TableChartIcon from '@mui/icons-material/TableChart';

export const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <PictureAsPdfIcon sx={{ color: colors.accent.red }} />;
    if (['doc', 'docx'].includes(ext || '')) return <DescriptionIcon sx={{ color: colors.secondary.blue1 }} />;
    if (['xls', 'xlsx'].includes(ext || '')) return <TableChartIcon sx={{ color: colors.accent.green }} />;
    return <InsertDriveFileIcon sx={{ color: colors.secondary.gray1 }} />;
};

export const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    // Common
    if (s === 'general') return { bg: '#E3F2FD', color: '#1565C0' }; // Blue
    if (s === 'pending') return { bg: '#FFF4E5', color: '#B76E00' }; // Orange
    if (s === 'approved') return { bg: '#E8F5E9', color: '#2E7D32' }; // Green
    if (s === 'rejected') return { bg: '#FFEBEE', color: '#C62828' }; // Red

    // Incoming specific
    if (s === 'received') return { bg: '#E1F5FE', color: '#0288D1' }; // Light Blue

    // Legacy / Other
    if (s === 'confidential') return { bg: '#FFF4E5', color: '#B76E00' };
    if (s === 'highly confidential') return { bg: '#FFEBEE', color: '#C62828' };
    if (s === 'public') return { bg: '#E8F5E9', color: '#2E7D32' };
    if (s === 'internal') return { bg: '#E3F2FD', color: '#1565C0' };

    return { bg: colors.secondary.gray3, color: colors.secondary.text }; // Default
};
