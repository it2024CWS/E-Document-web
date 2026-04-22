import BreadcrumbsCustom from '@/components/BreadcrumbsCustom';
import {
  Box,
  Grid,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { radius } from '@/themes/radius';
import { useFormCreateControllerContext } from '../context/FormCreateControllerProvider';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import TextFieldPassword from '@/components/TextField/TextFieldPassword';
import TextFieldCustom from '@/components/TextField/TextFieldCustom';
import InputLabelCustom from '@/components/InputLabelCustom';
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

          <form onSubmit={createCtrl.handleSubmit}>
            <Grid container spacing={3}>
              {/* Avatar Section */}
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <ProfilePictureUpload
                    value={createCtrl.formData.profile_picture || createCtrl.currentProfilePicture}
                    onChange={createCtrl.handleProfilePictureChange}
                    disabled={createCtrl.loading}
                  />
                </Box>
              </Grid>

              {/* Form Fields */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldCustom
                  fullWidth
                  label="Username"
                  required
                  value={createCtrl.formData.username}
                  onChange={(e) => createCtrl.handleChange('username', e.target.value)}
                  disabled={createCtrl.loading}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldCustom
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
                <TextFieldCustom
                  fullWidth
                  label="First Name"
                  value={createCtrl.formData.firstname}
                  onChange={(e) => createCtrl.handleChange('firstname', e.target.value)}
                  disabled={createCtrl.loading}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldCustom
                  fullWidth
                  label="Last Name"
                  value={createCtrl.formData.lastname}
                  onChange={(e) => createCtrl.handleChange('lastname', e.target.value)}
                  disabled={createCtrl.loading}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldCustom
                  fullWidth
                  label="Nickname"
                  value={createCtrl.formData.nickname}
                  onChange={(e) => createCtrl.handleChange('nickname', e.target.value)}
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
                  <InputLabelCustom label="Role" required />
                  <Select
                    value={createCtrl.formData.role_id || ''}
                    label="Role"
                    onChange={(e) => createCtrl.handleChange('role_id', e.target.value)}
                    disabled={createCtrl.loading}
                  >
                    <MenuItem value="">
                      <em>Select Role</em>
                    </MenuItem>
                    {createCtrl.roles.map((role: any) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.role_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabelCustom label="Account Status" required />
                  <Select
                    value={createCtrl.formData.is_active}
                    label="Account Status"
                    onChange={(e) => createCtrl.handleChange('is_active', e.target.value)}
                    disabled={createCtrl.loading}
                  >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldCustom
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
                    value={createCtrl.formData.department_id || ''}
                    label="Department"
                    onChange={(e) => createCtrl.handleChange('department_id', e.target.value)}
                    disabled={createCtrl.loading}
                  >
                    <MenuItem value="">
                      <em>Select Department</em>
                    </MenuItem>
                    {createCtrl.departments.map((dept: any) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.dept_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth disabled={!createCtrl.formData.department_id || createCtrl.loading}>
                  <InputLabel>Sector</InputLabel>
                  <Select
                    value={createCtrl.formData.sector_id || ''}
                    label="Sector"
                    onChange={(e) => createCtrl.handleChange('sector_id', e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Select Sector</em>
                    </MenuItem>
                    {createCtrl.sectors.map((sector: any) => (
                      <MenuItem key={sector.id} value={sector.id}>
                        {sector.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Action Buttons */}
              <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={createCtrl.handleCancel}
                  disabled={createCtrl.loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={createCtrl.isEditMode ? <SaveIcon /> : <AddIcon />}
                  disabled={createCtrl.loading}
                >
                  {createCtrl.isEditMode ? 'Update' : 'Create'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default FormCreate;
