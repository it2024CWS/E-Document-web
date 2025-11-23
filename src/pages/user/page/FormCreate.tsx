import BreadcrumbsCustom from '@/components/BreadcrumbsCustom';
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import useMainControllerContext from '../context';
import { radius } from '@/themes/radius';
import { useFormCreateControllerContext } from '../context/FormCreateControllerProvider';
import { UserRoleEnum, UserRoleLabels } from '@/enums/userRoleEnum';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import TextFieldPassword from '@/components/TextField/TextFieldPassword';

const FormCreate = () => {
  const mainCtrl = useMainControllerContext();
  const createCtrl = useFormCreateControllerContext();

  return (
    <Box>
      <BreadcrumbsCustom
        breadcrumbs={[
          {
            label: 'User management',
            onClick: createCtrl.handleCancel,
          },
          { label: createCtrl.isEditMode ? 'Edit user' : 'Create user' },
        ]}
      />

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '2 1 600px', minWidth: '300px' }}>
          <Box sx={{ bgcolor: 'white', borderRadius: radius[2], p: 4, mt: 3 }}>
            <Typography variant="h5" mb={4}>
              {createCtrl.isEditMode ? 'Edit User' : 'Create New User'}
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Username"
                  required
                  value={createCtrl.formData.username}
                  onChange={(e) => createCtrl.handleChange('username', e.target.value)}
                  disabled={createCtrl.loading}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  required
                  type="email"
                  value={createCtrl.formData.email}
                  onChange={(e) => createCtrl.handleChange('email', e.target.value)}
                  disabled={createCtrl.loading}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={createCtrl.formData.first_name}
                  onChange={(e) => createCtrl.handleChange('first_name', e.target.value)}
                  disabled={createCtrl.loading}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={createCtrl.formData.last_name}
                  onChange={(e) => createCtrl.handleChange('last_name', e.target.value)}
                  disabled={createCtrl.loading}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldPassword
                  fullWidth
                  label={createCtrl.isEditMode ? 'Password (leave blank to keep current)' : 'Password'}
                  required={!createCtrl.isEditMode}
                  value={createCtrl.formData.password}
                  onChange={(e) => createCtrl.handleChange('password', e.target.value)}
                  disabled={createCtrl.loading}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={createCtrl.formData.role}
                    label="Role"
                    onChange={(e) => createCtrl.handleChange('role', e.target.value)}
                    disabled={createCtrl.loading}
                  >
                    {Object.values(UserRoleEnum).map((role) => (
                      <MenuItem key={role} value={role}>
                        {UserRoleLabels[role]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={createCtrl.formData.phone}
                  onChange={(e) => createCtrl.handleChange('phone', e.target.value)}
                  disabled={createCtrl.loading}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Department ID"
                  value={createCtrl.formData.department_id}
                  onChange={(e) => createCtrl.handleChange('department_id', e.target.value)}
                  disabled={createCtrl.loading}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Sector ID"
                  value={createCtrl.formData.sector_id}
                  onChange={(e) => createCtrl.handleChange('sector_id', e.target.value)}
                  disabled={createCtrl.loading}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={createCtrl.handleCancel}
                disabled={createCtrl.loading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={createCtrl.loading ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={createCtrl.handleSubmit}
                disabled={createCtrl.loading}
              >
                {createCtrl.isEditMode ? 'Update' : 'Create'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FormCreate;
