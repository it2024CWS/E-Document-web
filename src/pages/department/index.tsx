
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
    MenuItem
} from '@mui/material';
import { departmentServiceMock, sectorServiceMock, DepartmentModel, SectorModel } from '@/services/mock/departmentServiceMock';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BreadcrumbsCustom from '@/components/BreadcrumbsCustom';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const DepartmentPage = () => {
    const [value, setValue] = useState(0);
    const [departments, setDepartments] = useState<DepartmentModel[]>([]);
    const [sectors, setSectors] = useState<SectorModel[]>([]);
    const [loading, setLoading] = useState(false);

    const [openDeptDialog, setOpenDeptDialog] = useState(false);
    const [openSectorDialog, setOpenSectorDialog] = useState(false);

    // Form States
    const [newDept, setNewDept] = useState({ code: '', name: '' });
    const [newSector, setNewSector] = useState({ code: '', name: '', department_id: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Always fetch both for now to ensure we have departments for the sector dropdown
            const depRes = await departmentServiceMock.getAllDepartments();
            if (depRes.success) setDepartments(depRes.data);

            const secRes = await sectorServiceMock.getAllSectors();
            if (secRes.success) setSectors(secRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    // --- Handlers ---
    const handleOpenAdd = () => {
        if (value === 0) {
            setNewDept({ code: '', name: '' });
            setOpenDeptDialog(true);
        } else {
            setNewSector({ code: '', name: '', department_id: '' });
            setOpenSectorDialog(true);
        }
    };

    const handleSaveDept = async () => {
        if (!newDept.code || !newDept.name) return;
        try {
            const res = await departmentServiceMock.createDepartment(newDept);
            if (res.success) {
                fetchData();
                setOpenDeptDialog(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveSector = async () => {
        if (!newSector.code || !newSector.name || !newSector.department_id) return;
        try {
            const payload = {
                ...newSector,
                department_id: Number(newSector.department_id)
            };
            const res = await sectorServiceMock.createSector(payload);
            if (res.success) {
                fetchData();
                setOpenSectorDialog(false);
            }
        } catch (error) {
            console.error(error);
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
                        onClick={handleOpenAdd}
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
                <Tabs value={value} onChange={handleChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab label="Departments" />
                    <Tab label="Sectors" />
                </Tabs>

                <TabPanel value={value} index={0}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Code</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center"><CircularProgress /></TableCell>
                                    </TableRow>
                                ) : (
                                    departments.map((dept) => (
                                        <TableRow key={dept.id} hover>
                                            <TableCell>{dept.id}</TableCell>
                                            <TableCell>{dept.code}</TableCell>
                                            <TableCell>{dept.name}</TableCell>
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
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Code</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Department</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center"><CircularProgress /></TableCell>
                                    </TableRow>
                                ) : (
                                    sectors.map((sec) => (
                                        <TableRow key={sec.id} hover>
                                            <TableCell>{sec.id}</TableCell>
                                            <TableCell>{sec.code}</TableCell>
                                            <TableCell>{sec.name}</TableCell>
                                            <TableCell>{sec.department_name}</TableCell>
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
                </TabPanel>
            </Card>

            {/* Department Dialog */}
            <Dialog open={openDeptDialog} onClose={() => setOpenDeptDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add Department</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Code"
                        fullWidth
                        variant="outlined"
                        value={newDept.code}
                        onChange={(e) => setNewDept({ ...newDept, code: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Name"
                        fullWidth
                        variant="outlined"
                        value={newDept.name}
                        onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeptDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveDept} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Sector Dialog */}
            <Dialog open={openSectorDialog} onClose={() => setOpenSectorDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add Sector</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        autoFocus
                        margin="dense"
                        label="Department"
                        fullWidth
                        variant="outlined"
                        value={newSector.department_id}
                        onChange={(e) => setNewSector({ ...newSector, department_id: e.target.value })}
                        sx={{ mb: 2 }}
                    >
                        {departments.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        margin="dense"
                        label="Code"
                        fullWidth
                        variant="outlined"
                        value={newSector.code}
                        onChange={(e) => setNewSector({ ...newSector, code: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Name"
                        fullWidth
                        variant="outlined"
                        value={newSector.name}
                        onChange={(e) => setNewSector({ ...newSector, name: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSectorDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveSector} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DepartmentPage;
