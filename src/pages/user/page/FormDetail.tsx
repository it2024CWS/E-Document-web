import BreadcrumbsCustom from '@/components/BreadcrumbsCustom';
import { Box, Grid, Typography, Button, CircularProgress, Divider } from '@mui/material';
import useMainControllerContext from '../context';
import { radius } from '@/themes/radius';
import FieldData from '@/components/FieldData';
import { useFormDetailControllerContext } from '../context/FormDetailControllerProvider';
import { UserRoleLabels } from '@/enums/userRoleEnum';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ProfilePictureUpload from '../components/ProfilePictureUpload';

const FormDetail = () => {
  const mainCtrl = useMainControllerContext();
  const detailCtrl = useFormDetailControllerContext();

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
        <Typography>User not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <BreadcrumbsCustom
        breadcrumbs={[
          {
            label: 'User management',
            onClick: () => {
              mainCtrl.handleChangeForm(null!);
              mainCtrl.handleChangeSelectedItem(null!);
            },
          },
          { label: 'User detail' },
        ]}
      />

      <Box sx={{ mt: 3 }}>
        <Box sx={{ bgcolor: 'white', borderRadius: radius[2], p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h5">User Information</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" startIcon={<EditIcon />} onClick={detailCtrl.handleEdit}>
                Edit
              </Button>
              <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={detailCtrl.handleDelete}>
                Delete
              </Button>
            </Box>
          </Box>

          <Divider />

          {/* Profile Picture Section */}
          <ProfilePictureUpload value={detailCtrl.user.profile_picture} readOnly={true} />

          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={4}>
            <Grid size={{ md: 6, xs: 12 }}>
              <FieldData label="Username" value={detailCtrl.user.username} />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <FieldData label="Email" value={detailCtrl.user.email} />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <FieldData label="First Name" value={detailCtrl.user.first_name || '-'} />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <FieldData label="Last Name" value={detailCtrl.user.last_name || '-'} />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <FieldData
                label="Role"
                value={
                  detailCtrl.user.role
                    ? UserRoleLabels[detailCtrl.user.role as keyof typeof UserRoleLabels] || detailCtrl.user.role
                    : '-'
                }
              />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <FieldData label="Phone" value={detailCtrl.user.phone || '-'} />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <FieldData label="Department ID" value={detailCtrl.user.department_id || '-'} />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <FieldData label="Sector ID" value={detailCtrl.user.sector_id || '-'} />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <FieldData
                label="Created At"
                value={new Date(detailCtrl.user.created_at).toLocaleString()}
              />
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <FieldData
                label="Updated At"
                value={new Date(detailCtrl.user.updated_at).toLocaleString()}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default FormDetail;
