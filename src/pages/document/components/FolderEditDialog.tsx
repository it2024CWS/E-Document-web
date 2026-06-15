import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    CircularProgress,
} from '@mui/material';
import { FolderModel } from '@/models/folderModel';
import { folderService } from '@/services/folderService';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';

interface FolderEditDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    folder: FolderModel | null;
}

const FolderEditDialog = ({ open, onClose, onSuccess, folder }: FolderEditDialogProps) => {
    const { t } = useTranslation();
    const [folderName, setFolderName] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open && folder) {
            setFolderName(folder.folder_name || '');
        }
    }, [open, folder]);

    const handleSave = async () => {
        if (!folder || !folderName.trim()) return;
        setSaving(true);
        try {
            await folderService.updateFolder(folder.id, { folder_name: folderName.trim() });
            onSuccess();
            onClose();
        } catch (err: any) {
            Swal.fire('Error', err?.message || 'Failed to update folder', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={saving ? undefined : onClose} maxWidth="xs" fullWidth>
            <DialogTitle>{t('myFile.editFolder')}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    fullWidth
                    label={t('myFile.folderName')}
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
                    sx={{ mt: 1 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={saving}>{t('common.cancel')}</Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving || !folderName.trim()}
                >
                    {saving ? <CircularProgress size={20} /> : t('common.save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FolderEditDialog;
