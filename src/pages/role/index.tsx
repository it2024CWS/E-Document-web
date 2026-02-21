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
    TextField,
} from '@mui/material';
import { roleServiceMock, RoleModel } from '@/services/mock/roleServiceMock';
// import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BreadcrumbsCustom from '@/components/BreadcrumbsCustom';

const RolePage = () => {
    const [roles, setRoles] = useState<RoleModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({ role_name: '', description: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await roleServiceMock.getAllRoles();
            if (res.success) {
                setRoles(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch roles:', error);
        } finally {
            setLoading(false);
        }
    };

    // const handleOpenAdd = () => {
    //     setFormData({ role_name: '', description: '' });
    //     setOpenDialog(true);
    // };

    const handleSave = async () => {
        if (!formData.role_name) return;
        try {
            const res = await roleServiceMock.createRole(formData);
            if (res.success) {
                fetchData();
                setOpenDialog(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box>
            <BreadcrumbsCustom breadcrumbs={[{ label: 'Role Management' }]} />

            <Box sx={{ mt: 3, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">Role Management</Typography>
                <Box>
                    {/* <Button
                        variant="contained"
                        onClick={handleOpenAdd}
                        sx={{ mr: 1 }}
                    >
                        + Add Role
                    </Button> */}
                    {/* <Button
                        startIcon={<RefreshIcon />}
                        variant="outlined"
                        onClick={fetchData}
                    >
                        Refresh
                    </Button> */}
                </Box>
            </Box>

            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Role Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Updated At</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center"><CircularProgress /></TableCell>
                                </TableRow>
                            ) : (
                                roles.map((role) => (
                                    <TableRow key={role.id} hover>
                                        <TableCell>{role.id}</TableCell>
                                        <TableCell>{role.role_name}</TableCell>
                                        <TableCell>{role.description}</TableCell>
                                        <TableCell>{new Date(role.created_at).toLocaleString()}</TableCell>
                                        <TableCell>{new Date(role.updated_at).toLocaleString()}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Edit">
                                                <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add Role</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Role Name"
                        fullWidth
                        variant="outlined"
                        value={formData.role_name}
                        onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
                        sx={{ mb: 2 }}
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
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RolePage;
