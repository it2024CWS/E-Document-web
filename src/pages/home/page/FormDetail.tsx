import BreadcrumbsCustom from '@/components/BreadcrumbsCustom';
import { Box, Grid, Typography } from '@mui/material';
import useMainControllerContext from '../context';
import { radius } from '@/themes/radius';
import TextFieldCopy from '@/components/TextField/TextFieldCopy';
import FieldData from '@/components/FieldData';
import { colors } from '@/themes/colors';

const FormDetail = () => {
  const mainCtrl = useMainControllerContext();

  return (
    <Box>
      <BreadcrumbsCustom
        breadcrumbs={[
          {
            label: 'Link management',
            onClick: () => {
              mainCtrl.handleChangeForm(null!);
              mainCtrl.handleChangeSelectedItem(null!);
            },
          },
          { label: 'Link detail' },
        ]}
      />

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '2 1 600px', minWidth: '300px' }}>
          <Box sx={{ bgcolor: 'white', borderRadius: radius[2], p: 4, mt: 3 }}>
            <Typography variant="h5" mb={4}>
              Link Info
            </Typography>
            <Typography variant="body2">Link</Typography>
            <TextFieldCopy variant="outlined" disabled />
            <Grid container spacing={4} mt={4}>
              {[
                { label: 'Lot no', value: '5468789' },
                { label: 'Metal', value: 'Gold' },
                { label: 'Fineness', value: '99.99%' },
                { label: 'Serial no', value: 'L000001' },
                { label: 'Lot code', value: '5468789' },
                { label: 'Gold bar type code', value: 'W1' },
                { label: 'Gold bar type', value: '1,000 G' },
                { label: 'Supplier name', value: 'LINMBER' },
                { label: 'Supplier code', value: '5468789' },
                { label: 'Year', value: '5468789' },
                { label: 'Year code', value: '5468789' },
                { label: 'Month', value: 'Jan - A' },
              ].map((field, index) => (
                <Grid key={index} size={{ md: 6, xs: 12 }}>
                  <FieldData label={field.label} value={field.value} />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ bgcolor: 'white', borderRadius: radius[2], p: 4, mt: 3 }}>
            <Typography variant="h5" mb={4}>
              Image Info
            </Typography>
            <Typography>Image</Typography>
            <Box mt={2} sx={{ border: `1px ${colors.secondary.gray2} dashed}`, borderRadius: radius[2], p: 2 }}>
              <img style={{ minHeight: 200, width: '100%' }} alt="signature image" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FormDetail;
