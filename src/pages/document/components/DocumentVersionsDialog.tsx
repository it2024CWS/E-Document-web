
import { useState, useEffect } from 'react';
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
import { documentService, VersionModel } from '@/services/documentService';
import { colors } from '@/themes/colors';

interface DocumentVersionsDialogProps {
    open: boolean;
    onClose: () => void;
    documentId: string;
    documentTitle: string;
}

const DocumentVersionsDialog = ({ open, onClose, documentId, documentTitle }: DocumentVersionsDialogProps) => {
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
                    console.error("Failed to load versions", error);
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
                Version History: {documentTitle}
            </DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                        <CircularProgress />
                    </div>
                ) : versions.length === 0 ? (
                    <Typography align="center" color="text.secondary">No version history found.</Typography>
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
                                                Version {version.version_number}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="body2" component="span" display="block">
                                                    Created: {new Date(version.created_at).toLocaleString()}
                                                </Typography>
                                                {/* <Typography variant="caption" display="block">
                                                    Path: {version.doc_path}
                                                </Typography> */}
                                            </>
                                        }
                                    />
                                    {index === 0 && <Chip label="Latest" size="small" color="primary" />}
                                </ListItem>
                                {index < versions.length - 1 && <Divider variant="inset" component="li" />}
                            </div>
                        ))}
                    </List>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DocumentVersionsDialog;
