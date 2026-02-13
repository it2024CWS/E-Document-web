
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
    Tab
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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
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

    return (
        <Box>
            <BreadcrumbsCustom breadcrumbs={[{ label: 'Department Management' }]} />

            <Box sx={{ mt: 3, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">Organization Structure</Typography>
                <Button
                    startIcon={<RefreshIcon />}
                    variant="outlined"
                    onClick={fetchData}
                >
                    Refresh
                </Button>
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
        </Box>
    );
};

export default DepartmentPage;
