
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
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BreadcrumbsCustom from '@/components/BreadcrumbsCustom';
import { departmentService } from '@/services/departmentService';
import { sectorService } from '@/services/sectorService';
import { DepartmentModel, CreateDepartmentRequest, UpdateDepartmentRequest } from '@/models/departmentModel';
import { SectorModel, CreateSectorRequest, UpdateSectorRequest } from '@/models/sectorModel';
import Swal from 'sweetalert2';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
    return (
        <div hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

// --------------- Department Dialog ---------------
interface DeptDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    initial?: DepartmentModel | null;
}

function DeptDialog({ open, onClose, onSave, initial }: DeptDialogProps) {
    const [form, setForm] = useState<CreateDepartmentRequest & UpdateDepartmentRequest>({ dept_name: '', description: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open) {
            setForm({ dept_name: initial?.dept_name ?? '', description: initial?.description ?? '' });
        }
    }, [open, initial]);

    const handleSave = async () => {
        if (!form.dept_name?.trim()) return;
        setSaving(true);
        try {
            if (initial) {
                await departmentService.updateDepartment(initial.id, form);
            } else {
                await departmentService.createDepartment(form as CreateDepartmentRequest);
            }
            onSave();
            onClose();
        } catch (err: any) {
            Swal.fire('Error', err?.response?.data?.message || 'Failed to save department', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{initial ? 'Edit Department' : 'Add Department'}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Department Name *"
                    fullWidth
                    variant="outlined"
                    value={form.dept_name}
                    onChange={(e) => setForm({ ...form, dept_name: e.target.value })}
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense"
                    label="Description"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={saving}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" disabled={saving || !form.dept_name?.trim()}>
                    {saving ? <CircularProgress size={20} /> : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// --------------- Sector Dialog ---------------
interface SectorDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    departments: DepartmentModel[];
    initial?: SectorModel | null;
}

function SectorDialog({ open, onClose, onSave, departments, initial }: SectorDialogProps) {
    const [form, setForm] = useState<{ name: string; dept_id: string }>({ name: '', dept_id: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open) {
            setForm({ name: initial?.name ?? '', dept_id: initial?.dept_id?.toString() ?? '' });
        }
    }, [open, initial]);

    const handleSave = async () => {
        if (!form.name.trim() || !form.dept_id) return;
        setSaving(true);
        try {
            const payload = { name: form.name.trim(), dept_id: form.dept_id };
            if (initial) {
                await sectorService.updateSector(initial.id, payload as UpdateSectorRequest);
            } else {
                await sectorService.createSector(payload as CreateSectorRequest);
            }
            onSave();
            onClose();
        } catch (err: any) {
            Swal.fire('Error', err?.response?.data?.message || 'Failed to save sector', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{initial ? 'Edit Sector' : 'Add Sector'}</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                    <InputLabel>Department *</InputLabel>
                    <Select
                        label="Department *"
                        value={form.dept_id}
                        onChange={(e) => setForm({ ...form, dept_id: e.target.value })}
                    >
                        {departments.map((d) => (
                            <MenuItem key={d.id} value={d.id}>{d.dept_name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    margin="dense"
                    label="Sector Name *"
                    fullWidth
                    variant="outlined"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={saving}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" disabled={saving || !form.name.trim() || !form.dept_id}>
                    {saving ? <CircularProgress size={20} /> : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// --------------- Main Page ---------------
const DepartmentPage = () => {
    const [tab, setTab] = useState(0);
    const [departments, setDepartments] = useState<DepartmentModel[]>([]);
    const [sectors, setSectors] = useState<SectorModel[]>([]);
    const [loading, setLoading] = useState(false);

    // Department dialog
    const [deptDialogOpen, setDeptDialogOpen] = useState(false);
    const [editingDept, setEditingDept] = useState<DepartmentModel | null>(null);

    // Sector dialog
    const [sectorDialogOpen, setSectorDialogOpen] = useState(false);
    const [editingSector, setEditingSector] = useState<SectorModel | null>(null);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [deptRes, secRes] = await Promise.all([
                departmentService.getAllDepartments(1, 100),
                sectorService.getAllSectors(1, 100),
            ]);
            setDepartments(deptRes.items ?? []);
            setSectors(secRes.items ?? []);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    };

    // --- Department actions ---
    const handleOpenAddDept = () => { setEditingDept(null); setDeptDialogOpen(true); };
    const handleOpenEditDept = (dept: DepartmentModel) => { setEditingDept(dept); setDeptDialogOpen(true); };
    const handleDeleteDept = async (id: string) => {
        const result = await Swal.fire({
            title: 'Delete Department?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Delete',
        });
        if (!result.isConfirmed) return;
        try {
            await departmentService.deleteDepartment(id);
            fetchData();
        } catch (err: any) {
            Swal.fire('Error', err?.response?.data?.message || 'Failed to delete department', 'error');
        }
    };

    // --- Sector actions ---
    const handleOpenAddSector = () => { setEditingSector(null); setSectorDialogOpen(true); };
    const handleOpenEditSector = (sec: SectorModel) => { setEditingSector(sec); setSectorDialogOpen(true); };
    const handleDeleteSector = async (id: string) => {
        const result = await Swal.fire({
            title: 'Delete Sector?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Delete',
        });
        if (!result.isConfirmed) return;
        try {
            await sectorService.deleteSector(id);
            fetchData();
        } catch (err: any) {
            Swal.fire('Error', err?.response?.data?.message || 'Failed to delete sector', 'error');
        }
    };

    return (
        <Box>
            <BreadcrumbsCustom breadcrumbs={[{ label: 'Department Management' }]} />

            <Box sx={{ mt: 3, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">Organization Structure</Typography>
                <Box>
                    <Button
                        variant="contained"
                        onClick={tab === 0 ? handleOpenAddDept : handleOpenAddSector}
                        sx={{ mr: 1 }}
                    >
                        + Add
                    </Button>
                    <Button startIcon={<RefreshIcon />} variant="outlined" onClick={fetchData}>
                        Refresh
                    </Button>
                </Box>
            </Box>

            <Card>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab label="Departments" />
                    <Tab label="Sectors" />
                </Tabs>

                {/* --- Departments Tab --- */}
                <TabPanel value={tab} index={0}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center"><CircularProgress /></TableCell>
                                    </TableRow>
                                ) : departments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">No departments found</TableCell>
                                    </TableRow>
                                ) : departments.map((dept) => (
                                    <TableRow key={dept.id} hover>
                                        <TableCell>{dept.id}</TableCell>
                                        <TableCell>{dept.dept_name}</TableCell>
                                        <TableCell>{dept.description || '—'}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Edit">
                                                <IconButton size="small" onClick={() => handleOpenEditDept(dept)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton size="small" color="error" onClick={() => handleDeleteDept(dept.id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>

                {/* --- Sectors Tab --- */}
                <TabPanel value={tab} index={1}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Department</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center"><CircularProgress /></TableCell>
                                    </TableRow>
                                ) : sectors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">No sectors found</TableCell>
                                    </TableRow>
                                ) : sectors.map((sec) => (
                                    <TableRow key={sec.id} hover>
                                        <TableCell>{sec.id}</TableCell>
                                        <TableCell>{sec.name}</TableCell>
                                        <TableCell>{sec.dept_name || '—'}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Edit">
                                                <IconButton size="small" onClick={() => handleOpenEditSector(sec)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton size="small" color="error" onClick={() => handleDeleteSector(sec.id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>
            </Card>

            {/* Dialogs */}
            <DeptDialog
                open={deptDialogOpen}
                onClose={() => setDeptDialogOpen(false)}
                onSave={fetchData}
                initial={editingDept}
            />
            <SectorDialog
                open={sectorDialogOpen}
                onClose={() => setSectorDialogOpen(false)}
                onSave={fetchData}
                departments={departments}
                initial={editingSector}
            />
        </Box>
    );
};

export default DepartmentPage;
