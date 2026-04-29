import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material';
import { DepartmentModel } from '@/models/departmentModel';

interface DepartmentSelectProps {
  departments: DepartmentModel[];
  selectedDepartments: string[];
  onChange: (event: any) => void;
  loading?: boolean;
}

const DepartmentSelect = ({
  departments,
  selectedDepartments,
  onChange,
  loading = false,
}: DepartmentSelectProps) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="dept-select-label">Select Departments</InputLabel>
      <Select
        labelId="dept-select-label"
        multiple
        value={selectedDepartments}
        onChange={onChange}
        input={<OutlinedInput label="Select Departments" />}
        renderValue={(selected) => {
          return (selected as string[])
            .map((id) => departments.find((d) => d.id === id)?.dept_name)
            .filter(Boolean)
            .join(', ');
        }}
        MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
      >
        {departments.map((dept) => (
          <MenuItem key={dept.id} value={dept.id}>
            <Checkbox checked={selectedDepartments.indexOf(dept.id) > -1} />
            <ListItemText primary={dept.dept_name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DepartmentSelect;
