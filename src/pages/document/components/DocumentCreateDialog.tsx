import { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Typography,
    Box,
    Divider,
    IconButton,
    Chip,
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import CreateNewFolderRoundedIcon from '@mui/icons-material/CreateNewFolderRounded';
import DriveFolderUploadRoundedIcon from '@mui/icons-material/DriveFolderUploadRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import { docTypeService } from '@/services/docTypeService';
import { folderService } from '@/services/folderService';
import { uploadFolder, uploadSingleFile } from '@/services/uploadService';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

interface DocumentCreateDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    folders: any[];
    currentFolderId?: string;
    onSuccess?: () => void;
}

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const DocumentCreateDialog = ({ open, onClose, onSubmit: _onSubmit, folders, currentFolderId, onSuccess }: DocumentCreateDialogProps) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [docTypes, setDocTypes] = useState<any[]>([]);
    const [tabValue, setTabValue] = useState<0 | 1>(0);
    const [folderMode, setFolderMode] = useState<'new' | 'upload'>('new');
    const [dragging, setDragging] = useState(false);

    const [formData, setFormData] = useState({
        description: '',
        doc_type_id: '',
        folder_id: currentFolderId || '',
        file: null as File | null,
    });
    const [newFolderName, setNewFolderName] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const folderInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setTabValue(0);
            setFolderMode('new');
            setDragging(false);
            setFormData({ description: '', doc_type_id: '', folder_id: currentFolderId || '', file: null });
            setNewFolderName('');
            const fetchData = async () => {
                setLoading(true);
                try {
                    const dtRes = await docTypeService.getAllDocTypes();
                    setDocTypes(dtRes.items ?? []);
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [open]);

    useEffect(() => {
        if (open && currentFolderId) {
            setFormData(prev => ({ ...prev, folder_id: currentFolderId }));
        }
    }, [currentFolderId, open]);

    const handleChange = (field: string, value: any) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    const handleFileSelect = (file: File) =>
        setFormData(prev => ({ ...prev, file }));

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    const handleSubmitFile = async () => {
        if (!formData.file) {
            Swal.fire(t('common.cancel'), t('docs.pleaseSelectFile'), 'warning');
            return;
        }
        setSubmitting(true);
        onClose();
        Swal.fire({
            title: t('docs.uploadingFile'),
            html: `<b>${formData.file.name}</b>`,
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });
        try {
            await uploadSingleFile({
                file: formData.file,
                relativePath: formData.file.name,
                parentFolderId: formData.folder_id || undefined,
                onProgress: (p) => {
                    Swal.update({ html: `<b>${formData.file!.name}</b> — ${p.percentage}%` });
                },
            });
            Swal.close();
            await Swal.fire({ icon: 'success', title: t('docs.uploadComplete'), timer: 1500, showConfirmButton: false });
            onSuccess?.();
        } catch (error: any) {
            Swal.close();
            Swal.fire(t('docs.uploadFailed'), error?.message || '', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;
        setSubmitting(true);
        try {
            await folderService.createFolder({
                folder_name: newFolderName.trim(),
                folder_path: newFolderName.trim(),
                parent_folder_id: formData.folder_id || null,
            });
            onClose();
            onSuccess?.();
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUploadFolder = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setSubmitting(true);
        onClose();
        Swal.fire({
            title: t('docs.uploadingFolder'),
            html: `${files.length} files`,
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });
        uploadFolder({
            files,
            parentFolderId: formData.folder_id,
            onAllComplete: () => {
                Swal.close();
                Swal.fire({ icon: 'success', title: t('docs.uploadComplete'), timer: 1500, showConfirmButton: false });
                onSuccess?.();
            },
            onError: (fileName, error) => {
                Swal.close();
                Swal.fire('Error', `Failed to upload ${fileName}: ${error.message}`, 'error');
            },
        });
        setSubmitting(false);
    };

    const modeCards = [
        {
            value: 0 as const,
            icon: <UploadFileRoundedIcon sx={{ fontSize: 32, color: '#2563EB' }} />,
            activeBg: '#EFF6FF',
            activeBorder: '#2563EB',
            label: t('docs.uploadFile'),
            desc: t('docs.uploadFileDesc'),
        },
        {
            value: 1 as const,
            icon: <CreateNewFolderRoundedIcon sx={{ fontSize: 32, color: '#F59E0B' }} />,
            activeBg: '#FFFBEB',
            activeBorder: '#F59E0B',
            label: t('docs.createFolder'),
            desc: t('docs.createFolderDesc'),
        },
    ];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            slotProps={{ paper: { sx: { borderRadius: 3, overflow: 'hidden' } } }}
        >
            {/* Header */}
            <Box sx={{ px: 3, pt: 3, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h6" fontWeight={700}>{t('docs.addToMyFiles')}</Typography>
                    <Typography variant="caption" color="text.secondary">{t('docs.addToMyFilesDesc')}</Typography>
                </Box>
                <IconButton size="small" onClick={onClose}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            <Divider />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {/* Mode selector cards */}
                    <Box sx={{ display: 'flex', gap: 2, px: 3, pt: 3 }}>
                        {modeCards.map((card) => {
                            const active = tabValue === card.value;
                            return (
                                <Box
                                    key={card.value}
                                    onClick={() => setTabValue(card.value)}
                                    sx={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        px: 3,
                                        py: 2,
                                        borderRadius: 2.5,
                                        cursor: 'pointer',
                                        border: '2px solid',
                                        borderColor: active ? card.activeBorder : 'divider',
                                        bgcolor: active ? card.activeBg : 'background.paper',
                                        transition: 'all 0.15s ease',
                                        '&:hover': { borderColor: card.activeBorder, bgcolor: card.activeBg },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', flexShrink: 0 }}>{card.icon}</Box>
                                    <Box>
                                        <Typography variant="body1" fontWeight={700} color={active ? card.activeBorder : 'text.primary'}>
                                            {card.label}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
                                            {card.desc}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>

                    {/* Content */}
                    <Box sx={{ px: 3, pt: 2.5, pb: 3 }}>
                        {/* ── Upload File tab ── */}
                        {tabValue === 0 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {/* Upload zone */}
                                {formData.file ? (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2.5,
                                            p: 2.5,
                                            borderRadius: 3,
                                            border: '2px solid #86EFAC',
                                            bgcolor: '#F0FDF4',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                borderRadius: 2,
                                                bgcolor: '#DCFCE7',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <ArticleRoundedIcon sx={{ color: '#16A34A', fontSize: 30 }} />
                                        </Box>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography variant="body1" fontWeight={700} noWrap title={formData.file.name}>
                                                {formData.file.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {formatFileSize(formData.file.size)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, alignItems: 'center' }}>
                                            <Chip
                                                label={t('docs.changeFile')}
                                                size="small"
                                                variant="outlined"
                                                onClick={() => fileInputRef.current?.click()}
                                                sx={{ cursor: 'pointer' }}
                                            />
                                            <IconButton size="small" color="error" onClick={() => handleChange('file', null)}>
                                                <DeleteOutlineRoundedIcon />
                                            </IconButton>
                                        </Box>
                                        <input ref={fileInputRef} type="file" hidden onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
                                    </Box>
                                ) : (
                                    <Box
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                        onDragLeave={() => setDragging(false)}
                                        onDrop={handleDrop}
                                        sx={{
                                            border: '2px dashed',
                                            borderColor: dragging ? '#2563EB' : '#BFDBFE',
                                            borderRadius: 3,
                                            py: 7,
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            bgcolor: dragging ? '#EFF6FF' : '#F8FBFF',
                                            transition: 'all 0.2s ease',
                                            '&:hover': { borderColor: '#2563EB', bgcolor: '#EFF6FF' },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 72,
                                                height: 72,
                                                borderRadius: '50%',
                                                bgcolor: '#DBEAFE',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 2,
                                            }}
                                        >
                                            <UploadFileRoundedIcon sx={{ fontSize: 38, color: '#2563EB' }} />
                                        </Box>
                                        <Typography variant="body1" fontWeight={700} color="text.primary">
                                            {t('docs.clickOrDragFile')}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            {t('docs.uploadFileFormats')}
                                        </Typography>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            hidden
                                            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                                        />
                                    </Box>
                                )}

                                {/* Description */}
                                <TextField
                                    fullWidth
                                    label={t('docs.descriptionOptional')}
                                    placeholder={t('docs.descriptionPlaceholder')}
                                    multiline
                                    rows={2}
                                    size="small"
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                />

                                {/* Document Type + Folder */}
                                <Box sx={{ display: 'flex', gap: 1.5 }}>
                                    <FormControl fullWidth size="small" required>
                                        <InputLabel>{t('docs.documentType')}</InputLabel>
                                        <Select
                                            value={formData.doc_type_id}
                                            label={t('docs.documentType')}
                                            onChange={(e) => handleChange('doc_type_id', e.target.value)}
                                        >
                                            {docTypes.map((dt: any) => (
                                                <MenuItem key={dt.id} value={dt.id}>{dt.type_name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>{t('docs.selectFolder')}</InputLabel>
                                        <Select
                                            value={formData.folder_id}
                                            label={t('docs.selectFolder')}
                                            onChange={(e) => handleChange('folder_id', e.target.value)}
                                        >
                                            <MenuItem value="">{t('docs.rootFolder')}</MenuItem>
                                            {folders.map((f: any) => (
                                                <MenuItem key={f.id} value={f.id}>{f.folder_name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>
                        )}

                        {/* ── Create Folder tab ── */}
                        {tabValue === 1 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {/* Sub-mode toggle */}
                                <ToggleButtonGroup
                                    exclusive
                                    value={folderMode}
                                    onChange={(_, v) => v && setFolderMode(v)}
                                    size="small"
                                    sx={{ alignSelf: 'flex-start' }}
                                >
                                    <ToggleButton value="new" sx={{ px: 2.5, textTransform: 'none', fontWeight: 600 }}>
                                        {t('docs.newFolder')}
                                    </ToggleButton>
                                    <ToggleButton value="upload" sx={{ px: 2.5, textTransform: 'none', fontWeight: 600 }}>
                                        {t('docs.uploadFolderMode')}
                                    </ToggleButton>
                                </ToggleButtonGroup>

                                {folderMode === 'new' ? (
                                    <>
                                        {/* Folder icon + name */}
                                        <Box sx={{ textAlign: 'center', py: 2 }}>
                                            <Box
                                                sx={{
                                                    width: 72,
                                                    height: 72,
                                                    borderRadius: 3,
                                                    bgcolor: '#FFF8E1',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mx: 'auto',
                                                    mb: 2,
                                                }}
                                            >
                                                <FolderRoundedIcon sx={{ fontSize: 40, color: '#F9A825' }} />
                                            </Box>
                                            <TextField
                                                fullWidth
                                                label={t('docs.folderName')}
                                                placeholder={t('docs.folderNamePlaceholder')}
                                                size="small"
                                                value={newFolderName}
                                                onChange={(e) => setNewFolderName(e.target.value)}
                                                autoFocus
                                            />
                                        </Box>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>{t('docs.parentFolder')}</InputLabel>
                                            <Select
                                                value={formData.folder_id}
                                                label={t('docs.parentFolder')}
                                                onChange={(e) => handleChange('folder_id', e.target.value)}
                                            >
                                                <MenuItem value="">{t('docs.rootFolder')}</MenuItem>
                                                {folders.map((f: any) => (
                                                    <MenuItem key={f.id} value={f.id}>{f.folder_name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </>
                                ) : (
                                    <Box
                                        onClick={() => folderInputRef.current?.click()}
                                        sx={{
                                            border: '2px dashed',
                                            borderColor: '#FDE68A',
                                            borderRadius: 3,
                                            py: 7,
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            bgcolor: '#FFFBF0',
                                            '&:hover': { borderColor: '#F59E0B', bgcolor: '#FFF8E1' },
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 72,
                                                height: 72,
                                                borderRadius: '50%',
                                                bgcolor: '#FEF3C7',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 2,
                                            }}
                                        >
                                            <DriveFolderUploadRoundedIcon sx={{ fontSize: 38, color: '#F59E0B' }} />
                                        </Box>
                                        <Typography variant="body1" fontWeight={700}>{t('docs.clickToSelectFolder')}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{t('docs.allFilesWillUpload')}</Typography>
                                        <input
                                            ref={folderInputRef}
                                            type="file"
                                            {...({ webkitdirectory: '', directory: '' } as any)}
                                            style={{ display: 'none' }}
                                            onChange={handleUploadFolder}
                                        />
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Box>

                    <Divider />

                    {/* Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, px: 3, py: 2 }}>
                        <Button variant="outlined" onClick={onClose} disabled={submitting}>
                            {t('common.cancel')}
                        </Button>
                        {tabValue === 0 ? (
                            <Button
                                variant="contained"
                                onClick={handleSubmitFile}
                                disabled={submitting || loading || !formData.file}
                                startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <UploadFileRoundedIcon />}
                            >
                                {submitting ? t('docs.uploadingFile') : t('docs.uploadBtn')}
                            </Button>
                        ) : folderMode === 'new' ? (
                            <Button
                                variant="contained"
                                onClick={handleCreateFolder}
                                disabled={submitting || !newFolderName.trim()}
                                startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <CreateNewFolderRoundedIcon />}
                            >
                                {submitting ? t('docs.creatingFolder') : t('docs.createFolderBtn')}
                            </Button>
                        ) : null}
                    </Box>
                </>
            )}
        </Dialog>
    );
};

export default DocumentCreateDialog;
