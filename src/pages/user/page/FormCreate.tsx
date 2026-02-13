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
  Divider,
} from '@mui/material';
import { radius } from '@/themes/radius';
import { useFormCreateControllerContext } from '../context/FormCreateControllerProvider';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import TextFieldPassword from '@/components/TextField/TextFieldPassword';
import ProfilePictureUpload from '../components/ProfilePictureUpload';

const FormCreate = () => {
  // const mainCtrl = useMainControllerContext();
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

      <Box sx={{ mt: 3 }}>
        <Box sx={{ bgcolor: 'white', borderRadius: radius[2], p: 4 }}>
          <Typography variant="h5" mb={4} textAlign="center">
            {createCtrl.isEditMode ? 'Edit User' : 'Create New User'}
          </Typography>
          <Divider />
          {/* Profile Picture Section */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <ProfilePictureUpload
              value={createCtrl.formData.profile_picture || createCtrl.currentProfilePicture}
              onChange={createCtrl.handleProfilePictureChange}
              disabled={createCtrl.loading}
            />
          </Box>
          <Divider sx={{ marginBottom: 4 }} />
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
                  value={createCtrl.formData.role_id || ''}
                  label="Role"
                  onChange={(e) => createCtrl.handleChange('role_id', Number(e.target.value))}
                  disabled={createCtrl.loading}
                >
                  <MenuItem value="">
                    <em>Select Role</em>
                  </MenuItem>
                  {createCtrl.roles.map((role: any) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
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
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={createCtrl.formData.department_id}
                  label="Department"
                  onChange={(e) => createCtrl.handleChange('department_id', e.target.value)}
                  disabled={createCtrl.loading}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {createCtrl.departments.map((dept: any) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth disabled={!createCtrl.formData.department_id || createCtrl.loading}>
                <InputLabel>Sector</InputLabel>
                <Select
                  value={createCtrl.formData.sector_id}
                  label="Sector"
                  onChange={(e) => createCtrl.handleChange('sector_id', e.target.value)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {createCtrl.sectors.map((sector: any) => (
                    <MenuItem key={sector.id} value={sector.id}>
                      {sector.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
  );
};

export default FormCreate;
