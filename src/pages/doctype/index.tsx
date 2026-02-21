
import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    CircularProgress,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import { docTypeService, DocTypeModel } from '@/services/docTypeService';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BreadcrumbsCustom from '@/components/BreadcrumbsCustom';
import Swal from 'sweetalert2';

const DocTypePage = () => {
    const [docTypes, setDocTypes] = useState<DocTypeModel[]>([]);
    const [loading, setLoading] = useState(false);

    // Dialog states
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ type_name: '', description: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await docTypeService.getAllDocTypes();
            setDocTypes(res);
        } catch (error) {
            console.error('Failed to fetch doc types:', error);
            Swal.fire('Error', 'Failed to load document types', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (docType?: DocTypeModel) => {
        if (docType) {
            setEditMode(true);
            setCurrentId(docType.id);
            setFormData({ type_name: docType.type_name, description: docType.description || '' });
        } else {
            setEditMode(false);
            setCurrentId(null);
            setFormData({ type_name: '', description: '' });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({ type_name: '', description: '' });
    };

    const handleSaveDocType = async () => {
        if (!formData.type_name) {
            Swal.fire('Validation', 'Module name is required', 'warning');
            return;
        }

        try {
            if (editMode && currentId) {
                await docTypeService.updateDocType(currentId, formData);
                Swal.fire('Success', 'Document type updated successfully', 'success');
            } else {
                await docTypeService.createDocType(formData);
                Swal.fire('Success', 'Document type created successfully', 'success');
            }
            fetchData();
            handleCloseDialog();
        } catch (error) {
            console.error('Failed to save doc type:', error);
            Swal.fire('Error', 'Failed to save document type', 'error');
        }
    };

    const handleDeleteDocType = async (id: string, name: string) => {
        const confirmed = await Swal.fire({
            title: 'Delete Document Type?',
            text: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete'
        });

        if (!confirmed.isConfirmed) return;

        try {
            await docTypeService.deleteDocType(id);
            Swal.fire('Deleted!', 'Document type has been deleted.', 'success');
            fetchData();
        } catch (error) {
            console.error('Failed to delete doc type:', error);
            Swal.fire('Error', 'Failed to delete document type. It might be in use.', 'error');
        }
    };

    return (
        <Box>
            <BreadcrumbsCustom breadcrumbs={[{ label: 'Document Types' }]} />

            <Box sx={{ mt: 3, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">Document Types</Typography>
                <Box>
                    <Button
                        variant="contained"
                        onClick={() => handleOpenDialog()}
                        sx={{ mr: 1 }}
                    >
                        + Add
                    </Button>
                    <Button
                        startIcon={<RefreshIcon />}
                        variant="outlined"
                        onClick={fetchData}
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>

            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Type Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center"><CircularProgress /></TableCell>
                                </TableRow>
                            ) : docTypes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">No document types found</TableCell>
                                </TableRow>
                            ) : (
                                docTypes.map((item) => (
                                    <TableRow key={item.id} hover>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.type_name}</TableCell>
                                        <TableCell>{item.description || '-'}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Edit">
                                                <IconButton size="small" onClick={() => handleOpenDialog(item)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton size="small" color="error" onClick={() => handleDeleteDocType(item.id, item.type_name)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Create / Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>{editMode ? 'Edit Document Type' : 'Add Document Type'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Type Name"
                        fullWidth
                        required
                        variant="outlined"
                        value={formData.type_name}
                        onChange={(e) => setFormData({ ...formData, type_name: e.target.value })}
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSaveDocType} variant="contained">
                        {editMode ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DocTypePage;

