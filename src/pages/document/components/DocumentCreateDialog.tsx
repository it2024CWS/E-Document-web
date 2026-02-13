
import { useState, useEffect, useRef } from 'react';
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
    Tabs,
    Tab
} from '@mui/material';
import { docTypeService } from '@/services/docTypeService';
import { departmentService } from '@/services/departmentService';
import { useAuth } from '@/contexts/auth';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { radius } from '@/themes/radius';
import { colors } from '@/themes/colors';
import { folderService } from '@/services/folderService';
import { uploadFolder } from '@/services/uploadService';
import Swal from 'sweetalert2';

interface DocumentCreateDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>; // FormData
    folders: any[]; // FolderModel
    currentFolderId?: string;
}

const DocumentCreateDialog = ({ open, onClose, onSubmit, folders, currentFolderId }: DocumentCreateDialogProps) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [docTypes, setDocTypes] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);

    // 0: File, 1: Folder
    const [tabValue, setTabValue] = useState(0);
    // For Folder Tab: 0: Create New, 1: Upload Folder
    const [folderMode, setFolderMode] = useState(0);

    const [formData, setFormData] = useState({
        doc_name: '',
        description: '',
        doc_type_id: '',
        department_id: user?.department_id || '',
        folder_id: currentFolderId || '',
        file: null as File | null
    });

    const [newFolderName, setNewFolderName] = useState('');
    const folderInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const [dtRes, deptRes] = await Promise.all([
                        docTypeService.getAllDocTypes(),
                        departmentService.getAllDepartments()
                    ]);
                    setDocTypes(dtRes);
                    if (deptRes.success) setDepartments(deptRes.data);
                } catch (error) {
                    console.error("Failed to load dependency data", error);
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

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData(prev => ({ ...prev, file: (e.target.files as FileList)[0] }));
        }
    };

    const handleSubmitFile = async () => {
        if (!formData.doc_name || !formData.doc_type_id || !formData.file) {
            alert("Please fill all required fields");
            return;
        }

        setSubmitting(true);
        try {
            const submitData = new FormData();
            submitData.append('title', formData.doc_name);
            submitData.append('description', formData.description);
            submitData.append('doc_type_id', formData.doc_type_id.toString());
            if (formData.department_id) submitData.append('department_id', formData.department_id.toString());
            if (formData.folder_id) submitData.append('folder_id', formData.folder_id.toString());
            submitData.append('file', formData.file);

            await onSubmit(submitData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateFolder = async () => {
        if (!newFolderName) return;
        setSubmitting(true);
        try {
            await folderService.createFolder({
                name: newFolderName,
                parent_id: formData.folder_id || undefined
            });
            // Need a way to refresh folders in parent, but onSubmit is for document creation
            // Assuming we just close and reload or similar. logic might need adjustment if parent component doesn't auto-refresh folders
            // Actually DocumentPage refreshes specific things. We might need to trigger folder refresh.
            // For now, let's close.
            onClose();
            // Trigger global refresh? logic in DocumentPage handles refreshing documents, but creating folder should refresh folder tree/list.
            window.location.reload(); // Temporary fix or need a callback for folder creation
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUploadFolder = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setSubmitting(true);
        onClose(); // Close dialog first

        Swal.fire({
            title: 'Uploading Folder...',
            html: `Uploading ${files.length} files, please wait.`,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        uploadFolder({
            files,
            parentFolderId: formData.folder_id,
            onAllComplete: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Upload Complete',
                    timer: 1500,
                    showConfirmButton: false
                });
                window.location.reload(); // Refresh to show new files
            },
            onError: (fileName, error) => {
                Swal.close();
                Swal.fire('Error', `Failed to upload ${fileName}: ${error.message}`, 'error');
            }
        });
        setSubmitting(false);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
                    <Tab label="Create File" />
                    <Tab label="Create Folder" />
                </Tabs>
            </DialogTitle>
            <DialogContent dividers>
                {loading ? <CircularProgress /> : (
                    <>
                        {/* File Tab */}
                        {tabValue === 0 && (
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12 }}>
                                    <Box
                                        sx={{
                                            border: `2px dashed ${colors.secondary.gray2}`,
                                            borderRadius: radius[2],
                                            p: 3,
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            bgcolor: colors.dominant.white2,
                                            '&:hover': { bgcolor: colors.dominant.white3 }
                                        }}
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                    >
                                        <input
                                            id="file-upload"
                                            type="file"
                                            hidden
                                            onChange={handleFileChange}
                                        />
                                        <UploadFileIcon sx={{ fontSize: 48, color: colors.secondary.text }} />
                                        <Typography mt={1}>
                                            {formData.file ? formData.file.name : "Click to select file"}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Document Name"
                                        required
                                        value={formData.doc_name}
                                        onChange={(e) => handleChange('doc_name', e.target.value)}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        multiline
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Department</InputLabel>
                                        <Select
                                            value={formData.department_id}
                                            label="Department"
                                            onChange={(e) => handleChange('department_id', e.target.value)}
                                        >
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            {departments.map((dept: any) => (
                                                <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Document Type</InputLabel>
                                        <Select
                                            value={formData.doc_type_id}
                                            label="Document Type"
                                            onChange={(e) => handleChange('doc_type_id', e.target.value)}
                                        >
                                            {docTypes.map((dt: any) => (
                                                <MenuItem key={dt.id} value={dt.id}>{dt.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Folder</InputLabel>
                                        <Select
                                            value={formData.folder_id}
                                            label="Folder"
                                            onChange={(e) => handleChange('folder_id', e.target.value)}
                                        >
                                            <MenuItem value="">Root</MenuItem>
                                            {folders.map((f: any) => (
                                                <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        )}

                        {/* Folder Tab */}
                        {tabValue === 1 && (
                            <Box>
                                <Box sx={{ mb: 2 }}>
                                    <Button
                                        onClick={() => setFolderMode(0)}
                                        variant={folderMode === 0 ? "contained" : "outlined"}
                                        sx={{ mr: 1 }}
                                    >
                                        Create New
                                    </Button>
                                    <Button
                                        onClick={() => setFolderMode(1)}
                                        variant={folderMode === 1 ? "contained" : "outlined"}
                                    >
                                        Upload Folder
                                    </Button>
                                </Box>

                                {folderMode === 0 ? (
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12 }}>
                                            <Box sx={{ textAlign: 'center', py: 3 }}>
                                                <CreateNewFolderIcon sx={{ fontSize: 60, color: colors.primary.main, mb: 2 }} />
                                                <TextField
                                                    fullWidth
                                                    label="Folder Name"
                                                    value={newFolderName}
                                                    onChange={(e) => setNewFolderName(e.target.value)}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <FormControl fullWidth>
                                                <InputLabel>Parent Folder</InputLabel>
                                                <Select
                                                    value={formData.folder_id}
                                                    label="Parent Folder"
                                                    onChange={(e) => handleChange('folder_id', e.target.value)}
                                                >
                                                    <MenuItem value="">Root</MenuItem>
                                                    {folders.map((f: any) => (
                                                        <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Box
                                        sx={{
                                            textAlign: 'center',
                                            py: 5,
                                            border: `2px dashed ${colors.secondary.gray2}`,
                                            borderRadius: radius[2],
                                            cursor: 'pointer',
                                            bgcolor: colors.dominant.white2,
                                            '&:hover': { bgcolor: colors.dominant.white3 }
                                        }}
                                        onClick={() => folderInputRef.current?.click()}
                                    >
                                        <DriveFolderUploadIcon sx={{ fontSize: 60, color: colors.accent.yellow, mb: 2 }} />
                                        <Typography variant="h6">Click to upload folder</Typography>
                                        <Typography variant="body2" color="textSecondary">All files in the folder will be uploaded</Typography>
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
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={submitting}>Cancel</Button>
                {tabValue === 0 ? (
                    <Button onClick={handleSubmitFile} variant="contained" disabled={submitting || loading}>
                        {submitting ? <CircularProgress size={24} /> : 'Upload File'}
                    </Button>
                ) : folderMode === 0 && (
                    <Button onClick={handleCreateFolder} variant="contained" disabled={submitting || !newFolderName}>
                        {submitting ? <CircularProgress size={24} /> : 'Create Folder'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default DocumentCreateDialog;
