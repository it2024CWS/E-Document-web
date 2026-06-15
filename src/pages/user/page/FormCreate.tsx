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
import { useTranslation } from 'react-i18next';

const FormCreate = () => {
  const createCtrl = useFormCreateControllerContext();
  const { t } = useTranslation();

  return (
    <Box>
      <BreadcrumbsCustom
        breadcrumbs={[
          {
            label: t('nav.userManagement'),
            onClick: createCtrl.handleCancel,
          },
          { label: createCtrl.isEditMode ? t('users.editUser') : t('users.createUser') },
        ]}
      />

      <Box sx={{ mt: 3 }}>
        <Box sx={{ bgcolor: 'white', borderRadius: radius[2], p: 4 }}>
          <Typography variant="h5" mb={4} textAlign="center">
            {createCtrl.isEditMode ? t('users.editUser') : t('users.createNewUser')}
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
                  label={t('users.username')}
                  required
                  value={createCtrl.formData.username}
                  onChange={(e) => createCtrl.handleChange('username', e.target.value)}
                  disabled={createCtrl.loading}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldCustom
                  fullWidth
                  label={t('common.email')}
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
                  label={t('users.firstName')}
                  value={createCtrl.formData.firstname}
                  onChange={(e) => createCtrl.handleChange('firstname', e.target.value)}
                  disabled={createCtrl.loading}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldCustom
                  fullWidth
                  label={t('users.lastName')}
                  value={createCtrl.formData.lastname}
                  onChange={(e) => createCtrl.handleChange('lastname', e.target.value)}
                  disabled={createCtrl.loading}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldCustom
                  fullWidth
                  label={t('users.nickname')}
                  value={createCtrl.formData.nickname}
                  onChange={(e) => createCtrl.handleChange('nickname', e.target.value)}
                  disabled={createCtrl.loading}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldPassword
                  fullWidth
                  label={createCtrl.isEditMode ? t('users.passwordEdit') : t('users.password')}
                  required={!createCtrl.isEditMode}
                  value={createCtrl.formData.password}
                  onChange={(e) => createCtrl.handleChange('password', e.target.value)}
                  disabled={createCtrl.loading}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabelCustom label={t('users.role')} required />
                  <Select
                    value={createCtrl.formData.role_id || ''}
                    label={t('users.role')}
                    onChange={(e) => createCtrl.handleChange('role_id', e.target.value)}
                    disabled={createCtrl.loading}
                  >
                    <MenuItem value="">
                      <em>{t('users.selectRole')}</em>
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
                  <InputLabelCustom label={t('users.accountStatus')} required />
                  <Select
                    value={createCtrl.formData.is_active}
                    label={t('users.accountStatus')}
                    onChange={(e) => createCtrl.handleChange('is_active', e.target.value)}
                    disabled={createCtrl.loading}
                  >
                    <MenuItem value="true">{t('users.active')}</MenuItem>
                    <MenuItem value="false">{t('users.inactive')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldCustom
                  fullWidth
                  label={t('common.phone')}
                  value={createCtrl.formData.phone}
                  onChange={(e) => createCtrl.handleChange('phone', e.target.value)}
                  disabled={createCtrl.loading}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>{t('common.department')}</InputLabel>
                  <Select
                    value={createCtrl.formData.department_id || ''}
                    label={t('common.department')}
                    onChange={(e) => createCtrl.handleChange('department_id', e.target.value)}
                    disabled={createCtrl.loading}
                  >
                    <MenuItem value="">
                      <em>{t('users.selectDepartment')}</em>
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
                  <InputLabel>{t('common.sector')}</InputLabel>
                  <Select
                    value={createCtrl.formData.sector_id || ''}
                    label={t('common.sector')}
                    onChange={(e) => createCtrl.handleChange('sector_id', e.target.value)}
                  >
                    <MenuItem value="">
                      <em>{t('users.selectSector')}</em>
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
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={createCtrl.isEditMode ? <SaveIcon /> : <AddIcon />}
                  disabled={createCtrl.loading}
                >
                  {createCtrl.isEditMode ? t('users.update') : t('users.create')}
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
