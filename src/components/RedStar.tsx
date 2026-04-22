import { Box } from '@mui/material';
import { colors } from '@/themes/colors';

const RedStar = () => {
  return (
    <Box component="span" sx={{ color: colors.accent.red, ml: 0.5 }}>
      *
    </Box>
  );
};

export default RedStar;
