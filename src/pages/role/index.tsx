import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '@/utils/dateUtils';
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
    TablePagination,
    IconButton,
    Button,
    CircularProgress,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    InputAdornment,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import BreadcrumbsCustom from '@/components/BreadcrumbsCustom';
import { roleService } from '@/services/roleService';
import { RoleModel, CreateRoleRequest, UpdateRoleRequest } from '@/models/roleModel';
import Swal from 'sweetalert2';

const RolePage = () => {
    const { t } = useTranslation();

    // Table state
    const [roles, setRoles] = useState<RoleModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Dialog state
    const [openDialog, setOpenDialog] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleModel | null>(null);
    const [formData, setFormData] = useState<CreateRoleRequest>({ role_name: '', description: '' });
    const [saving, setSaving] = useState(false);

    const fetchData = useCallback(async (currentPage: number, limit: number, q: string) => {
        setLoading(true);
        try {
            const res = await roleService.getAllRoles(currentPage + 1, limit, q || undefined);
            setRoles(res.items);
            setTotalItems(res.pagination.totalItems);
        } catch (error) {
            console.error('Failed to fetch roles:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(page, rowsPerPage, search);
    }, [page, rowsPerPage, fetchData]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        searchTimerRef.current = setTimeout(() => {
            setPage(0);
            fetchData(0, rowsPerPage, value);
        }, 500);
    };

    const handleOpenAdd = () => {
        setEditingRole(null);
        setFormData({ role_name: '', description: '' });
        setOpenDialog(true);
    };

    const handleOpenEdit = (role: RoleModel) => {
        setEditingRole(role);
        setFormData({ role_name: role.role_name, description: role.description || '' });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingRole(null);
    };

    const handleSave = async () => {
        if (!formData.role_name?.trim()) return;
        setSaving(true);
        try {
            if (editingRole) {
                await roleService.updateRole(editingRole.id, formData as UpdateRoleRequest);
            } else {
                await roleService.createRole(formData);
            }
            handleCloseDialog();
            fetchData(page, rowsPerPage, search);
        } catch (err: any) {
            Swal.fire('Error', err?.message || 'Failed to save role', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (role: RoleModel) => {
        const result = await Swal.fire({
            title: t('common.delete') + ' ' + role.role_name + '?',
            text: t('dept.cannotUndo'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: t('common.delete'),
            cancelButtonText: t('common.cancel'),
        });
        if (!result.isConfirmed) return;

        try {
            await roleService.deleteRole(role.id);
            fetchData(page, rowsPerPage, search);
        } catch (err: any) {
            Swal.fire('Error', err?.message || 'Failed to delete role', 'error');
        }
    };

    return (
        <Box>
            <BreadcrumbsCustom breadcrumbs={[{ label: t('nav.roleManagement') }]} />

            <Box sx={{ mt: 3, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h5">{t('roles.title')}</Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                        size="small"
                        placeholder={t('common.search')}
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{ width: 220 }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenAdd}
                    >
                        {t('roles.addRole')}
                    </Button>
                    <Button
                        startIcon={<RefreshIcon />}
                        variant="outlined"
                        onClick={() => fetchData(page, rowsPerPage, search)}
                    >
                        {t('common.refresh')}
                    </Button>
                </Box>
            </Box>

            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell width={60}>{t('common.id')}</TableCell>
                                <TableCell>{t('roles.roleName')}</TableCell>
                                <TableCell>{t('docs.description')}</TableCell>
                                <TableCell>{t('roles.createdAt')}</TableCell>
                                <TableCell>{t('roles.updatedAt')}</TableCell>
                                <TableCell align="right">{t('common.actions')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : roles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                        {t('common.noData')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                roles.map((role, index) => (
                                    <TableRow key={role.id} hover>
                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell>{role.role_name}</TableCell>
                                        <TableCell>{role.description || '—'}</TableCell>
                                        <TableCell>{formatDateTime(role.created_at)}</TableCell>
                                        <TableCell>{formatDateTime(role.updated_at)}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title={t('common.edit')}>
                                                <IconButton size="small" onClick={() => handleOpenEdit(role)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={t('common.delete')}>
                                                <IconButton size="small" color="error" onClick={() => handleDelete(role)}>
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
                <TablePagination
                    component="div"
                    count={totalItems}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </Card>

            {/* Add / Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>
                    {editingRole ? t('common.edit') + ' ' + t('roles.roleName') : t('roles.addRole')}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={t('roles.roleName')}
                        required
                        fullWidth
                        variant="outlined"
                        value={formData.role_name}
                        onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
                        disabled={!!editingRole}
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label={t('docs.description')}
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={saving}>{t('common.cancel')}</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={saving || !formData.role_name?.trim()}
                    >
                        {saving ? <CircularProgress size={20} /> : editingRole ? t('users.update') : t('common.save')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RolePage;
