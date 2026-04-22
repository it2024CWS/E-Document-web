
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
    Chip
} from '@mui/material';
import { docTypeService } from '@/services/docTypeService';
import { departmentService } from '@/services/departmentService';
import { DepartmentModel } from '@/models/departmentModel';
import { useAuth } from '@/contexts/auth';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { radius } from '@/themes/radius';
import { colors } from '@/themes/colors';
import { DocumentModel } from '@/services/documentService';

interface DocumentEditDialogProps {
    open: boolean;
    onClose: () => void;
    onUpdate: (id: string, data: any) => Promise<void>;
    docData: DocumentModel | null;
    folders: any[];
}

const DocumentEditDialog = ({ open, onClose, onUpdate, docData, folders }: DocumentEditDialogProps) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [docTypes, setDocTypes] = useState<any[]>([]);
    const [departments, setDepartments] = useState<DepartmentModel[]>([]);

    const [formData, setFormData] = useState({
        doc_name: '',
        description: '',
        doc_type_id: '',
        department_id: '',
        folder_id: '',
        status: '',
        file: null as File | null
    });

    useEffect(() => {
        if (open) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const [dtRes, deptRes] = await Promise.all([
                        docTypeService.getAllDocTypes(),
                        departmentService.getAllDepartments(1, 100)
                    ]);
                    setDocTypes(dtRes);
                    setDepartments(deptRes.items);
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
        if (open && docData) {
            setFormData({
                doc_name: docData.doc_name,
                description: docData.description || '',
                doc_type_id: docData.doc_type_id?.toString() || '',
                department_id: user?.department_id?.toString() || '',
                folder_id: docData.folder_id?.toString() || '',
                status: docData.status || '',
                file: null
            });
        }
    }, [open, docData, user]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData(prev => ({ ...prev, file: (e.target.files as FileList)[0] }));
        }
    };

    const handleSubmit = async () => {
        if (!docData) return;
        if (!formData.doc_name || !formData.doc_type_id) {
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
            submitData.append('status', formData.status);

            if (formData.file) {
                submitData.append('file', formData.file);
            }

            await onUpdate(docData.id, submitData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!docData && !loading) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Edit Document: {docData?.doc_no}
                <Chip
                    label={`v${docData?.version_number}`}
                    size="small"
                    color="primary"
                    sx={{ ml: 2 }}
                />
            </DialogTitle>
            <DialogContent dividers>
                {loading ? <CircularProgress /> : (
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <Box
                                sx={{
                                    border: `2px dashed ${colors.secondary.gray2}`,
                                    borderRadius: radius[2],
                                    p: 3,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    bgcolor: formData.file ? colors.dominant.white3 : colors.dominant.white2,
                                    '&:hover': { bgcolor: colors.dominant.white3 }
                                }}
                                onClick={() => document.getElementById('edit-file-upload')?.click()}
                            >
                                <input
                                    id="edit-file-upload"
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}
                                />
                                <UploadFileIcon sx={{ fontSize: 48, color: colors.secondary.text }} />
                                <Typography mt={1}>
                                    {formData.file ? formData.file.name : "Click to replace file (Creates new version)"}
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
                                        <MenuItem key={dept.id} value={dept.id}>{dept.dept_name}</MenuItem>
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
                                        <MenuItem key={dt.id} value={dt.id}>{dt.type_name}</MenuItem>
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

                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={formData.status}
                                    label="Status"
                                    onChange={(e) => handleChange('status', e.target.value)}
                                >
                                    <MenuItem value="draft">Draft</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="approved">Approved</MenuItem>
                                    <MenuItem value="rejected">Rejected</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={submitting}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={submitting || loading}>
                    {submitting ? <CircularProgress size={24} /> : 'Update'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DocumentEditDialog;
