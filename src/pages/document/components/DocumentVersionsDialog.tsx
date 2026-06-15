import { useState, useEffect } from 'react';
import { formatDateTime } from '@/utils/dateUtils';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Chip,
    CircularProgress,
    Divider
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';
import { VersionModel } from '@/models/documentModel';
import { documentService } from '@/services/documentService';
import { colors } from '@/themes/colors';
import { useTranslation } from 'react-i18next';

interface DocumentVersionsDialogProps {
    open: boolean;
    onClose: () => void;
    documentId: string;
    documentTitle: string;
}

const DocumentVersionsDialog = ({ open, onClose, documentId, documentTitle }: DocumentVersionsDialogProps) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [versions, setVersions] = useState<VersionModel[]>([]);

    useEffect(() => {
        if (open && documentId) {
            const fetchVersions = async () => {
                setLoading(true);
                try {
                    const res = await documentService.getDocumentVersions(documentId);
                    setVersions(res);
                } catch (error) {
                    console.error('Failed to load versions', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchVersions();
        }
    }, [open, documentId]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HistoryIcon />
                {t('docs.versionHistory', { title: documentTitle })}
            </DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                        <CircularProgress />
                    </div>
                ) : versions.length === 0 ? (
                    <Typography align="center" color="text.secondary">{t('docs.noVersionHistory')}</Typography>
                ) : (
                    <List>
                        {versions.map((version, index) => (
                            <div key={version.id}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: index === 0 ? colors.primary.main : colors.secondary.gray2 }}>
                                            <DescriptionIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1" component="span" fontWeight="bold">
                                                {t('docs.versionLabel', { n: version.version_number })}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body2" component="span" display="block">
                                                {t('docs.createdOn', { date: formatDateTime(version.created_at) })}
                                            </Typography>
                                        }
                                    />
                                    {index === 0 && <Chip label={t('docs.latestVersion')} size="small" color="primary" />}
                                </ListItem>
                                {index < versions.length - 1 && <Divider variant="inset" component="li" />}
                            </div>
                        ))}
                    </List>
                )}
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>{t('common.close')}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DocumentVersionsDialog;
