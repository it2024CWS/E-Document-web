import BreadcrumbsCustom from '@/components/BreadcrumbsCustom';
import { formatDateTime } from '@/utils/dateUtils';
import { Box, Grid, Typography, Button, CircularProgress, Divider } from '@mui/material';
import useMainControllerContext from '../context';
import { radius } from '@/themes/radius';
import FieldData from '@/components/FieldData';
import { useFormDetailControllerContext } from '../context/FormDetailControllerProvider';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ProfilePictureUpload from '../components/ProfilePictureUpload';
import { useTranslation } from 'react-i18next';

const FormDetail = () => {
  const mainCtrl = useMainControllerContext();
  const detailCtrl = useFormDetailControllerContext();
  const { t } = useTranslation();

  if (detailCtrl.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!detailCtrl.user) {
    return (
      <Box>
        <Typography>{t('users.userNotFound')}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <BreadcrumbsCustom
        breadcrumbs={[
          {
            label: t('nav.userManagement'),
            onClick: () => {
              mainCtrl.handleChangeForm(null!);
              mainCtrl.handleChangeSelectedItem(null!);
            },
          },
          { label: t('users.userDetail') },
        ]}
      />

      <Box sx={{ mt: 3 }}>
        <Box sx={{ bgcolor: 'white', borderRadius: radius[2], p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h5">{t('users.userInfo')}</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" startIcon={<EditIcon />} onClick={detailCtrl.handleEdit}>
                {t('common.edit')}
              </Button>
              <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={detailCtrl.handleDelete}>
                {t('common.delete')}
              </Button>
            </Box>
          </Box>

          <Divider />

          {/* Profile Picture Section */}
          <ProfilePictureUpload value={detailCtrl.user.profile_picture} readOnly={true} />

          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={4}>
            <Grid size={{ md: 6, xs: 12 }}>
              <FieldData label={t('users.username')} value={detailCtrl.user.username} />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <FieldData label={t('common.email')} value={detailCtrl.user.email} />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <FieldData label={t('users.firstName')} value={detailCtrl.user.firstname || '-'} />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <FieldData label={t('users.lastName')} value={detailCtrl.user.lastname || '-'} />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <FieldData label={t('users.nickname')} value={detailCtrl.user.nickname || '-'} />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <FieldData label={t('users.accountStatus')} value={detailCtrl.user.is_active ? t('users.active') : t('users.inactive')} />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <FieldData label={t('users.role')} value={detailCtrl.user.role_name || '-'} />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <FieldData label={t('common.phone')} value={detailCtrl.user.phone || '-'} />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <FieldData label={t('common.department')} value={detailCtrl.user.department_name || '-'} />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <FieldData label={t('common.sector')} value={detailCtrl.user.sector_name || '-'} />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <FieldData label={t('users.createdAt')} value={formatDateTime(detailCtrl.user.created_at)} />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <FieldData label={t('users.updatedAt')} value={formatDateTime(detailCtrl.user.updated_at)} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default FormDetail;
