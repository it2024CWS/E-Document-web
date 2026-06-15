import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Typography,
    Box,
    Chip,
    Alert,
    LinearProgress,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { docTypeService } from '@/services/docTypeService';
import { documentService } from '@/services/documentService';
import { uploadSingleFile } from '@/services/uploadService';
import { radius } from '@/themes/radius';
import { colors } from '@/themes/colors';
import { DocumentModel } from '@/models/documentModel';
import { useTranslation } from 'react-i18next';

interface DocumentEditDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    docData: DocumentModel | null;
    folders: any[];
    currentFolderId?: string;
}

const DocumentEditDialog = ({ open, onClose, onSuccess, docData, folders, currentFolderId }: DocumentEditDialogProps) => {
    const { t } = useTranslation();
    const [loading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [docTypes, setDocTypes] = useState<any[]>([]);
    const [fileError, setFileError] = useState('');
    const [step, setStep] = useState<'idle' | 'updating' | 'uploading' | 'done'>('idle');

    const [formData, setFormData] = useState({
        doc_name: '',
        description: '',
        doc_type_id: '',
        folder_id: '',
        file: null as File | null,
    });

    useEffect(() => {
        if (open) {
            setFileError('');
            setStep('idle');
            setUploadProgress(0);
            docTypeService.getAllDocTypes().then(res => setDocTypes(res.items ?? []));
        }
    }, [open]);

    useEffect(() => {
        if (open && docData) {
            setFormData({
                doc_name: docData.doc_name,
                description: docData.description || '',
                doc_type_id: docData.doc_type_id?.toString() || '',
                folder_id: currentFolderId || docData.folder_id?.toString() || '',
                file: null,
            });
        }
    }, [open, docData, currentFolderId]);

    const handleChange = (field: string, value: any) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected || !docData) return;

        const selectedExt = selected.name.split('.').pop()?.toLowerCase() || '';
        const selectedBaseName = selected.name.slice(0, -(selectedExt.length + 1));
        const originalExt = (docData.file_type || '').toLowerCase();
        const originalBaseName = docData.doc_name?.trim() || '';

        if (selectedBaseName !== originalBaseName || selectedExt !== originalExt) {
            setFileError(
                t('docs.fileMustMatch', { name: originalBaseName, ext: originalExt }) +
                ` — "${selected.name}"`
            );
            e.target.value = '';
            setFormData(prev => ({ ...prev, file: null }));
            return;
        }

        setFileError('');
        setFormData(prev => ({ ...prev, file: selected }));
    };

    const handleSubmit = async () => {
        if (!docData) return;
        if (!formData.doc_name || !formData.doc_type_id) {
            setFileError(t('docs.fillRequiredFields'));
            return;
        }

        setSubmitting(true);
        try {
            setStep('updating');
            await documentService.updateDocument(docData.id, {
                doc_name: formData.doc_name,
                description: formData.description,
                doc_type_id: formData.doc_type_id,
                folder_id: formData.folder_id || undefined,
            });

            if (formData.file) {
                setStep('uploading');
                setUploadProgress(0);
                await uploadSingleFile({
                    file: formData.file,
                    parentFolderId: formData.folder_id || undefined,
                    onProgress: (info) => setUploadProgress(info.percentage),
                });
            }

            setStep('done');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Update failed:', error);
            setFileError(t('docs.updateFailed'));
            setStep('idle');
        } finally {
            setSubmitting(false);
        }
    };

    if (!docData && !loading) return null;

    const submitLabel =
        step === 'updating' ? t('docs.updating') :
        step === 'uploading' ? t('docs.uploadingVersion') :
        t('docs.update');

    return (
        <Dialog open={open} onClose={submitting ? undefined : onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {t('docs.editDocument', { no: docData?.doc_no })}
                <Chip label={`v${docData?.version_number}`} size="small" color="primary" sx={{ ml: 2 }} />
            </DialogTitle>

            <DialogContent dividers>
                {loading ? <CircularProgress /> : (
                    <Grid container spacing={3}>
                        {fileError && (
                            <Grid size={{ xs: 12 }}>
                                <Alert severity="error" onClose={() => setFileError('')} sx={{ whiteSpace: 'pre-line' }}>
                                    {fileError}
                                </Alert>
                            </Grid>
                        )}

                        {/* File upload zone */}
                        <Grid size={{ xs: 12 }}>
                            <Box
                                sx={{
                                    border: `2px dashed ${formData.file ? colors.accent.green : colors.secondary.gray2}`,
                                    borderRadius: radius[2],
                                    p: 3,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    bgcolor: formData.file ? '#F0FFF4' : colors.dominant.white2,
                                    '&:hover': { bgcolor: colors.dominant.white3 },
                                    transition: 'all 0.2s',
                                }}
                                onClick={() => document.getElementById('edit-file-upload')?.click()}
                            >
                                <input id="edit-file-upload" type="file" hidden onChange={handleFileChange} />
                                {formData.file ? (
                                    <>
                                        <CheckCircleIcon sx={{ fontSize: 40, color: colors.accent.green }} />
                                        <Typography mt={1} fontWeight={600} color={colors.accent.green}>
                                            {formData.file.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {t('docs.willCreateVersion', { n: (docData?.version_number ?? 0) + 1 })}
                                        </Typography>
                                    </>
                                ) : (
                                    <>
                                        <UploadFileIcon sx={{ fontSize: 48, color: colors.secondary.text }} />
                                        <Typography mt={1}>{t('docs.clickToReplaceFile')}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {t('docs.fileMustMatch', { name: docData?.doc_name, ext: docData?.file_type })}
                                        </Typography>
                                    </>
                                )}
                            </Box>

                            {step === 'uploading' && (
                                <Box sx={{ mt: 1 }}>
                                    <LinearProgress variant="determinate" value={uploadProgress} />
                                    <Typography variant="caption" color="text.secondary">
                                        {t('docs.uploadingNewVersion', { progress: uploadProgress })}
                                    </Typography>
                                </Box>
                            )}
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label={t('docs.documentName')}
                                required
                                value={formData.doc_name}
                                onChange={(e) => handleChange('doc_name', e.target.value)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label={t('docs.description')}
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth required>
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
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth>
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
                        </Grid>
                    </Grid>
                )}
            </DialogContent>

            <DialogActions>
                <Button variant="outlined" onClick={onClose} disabled={submitting}>{t('common.cancel')}</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={submitting || loading}
                    startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : undefined}
                >
                    {submitLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DocumentEditDialog;
