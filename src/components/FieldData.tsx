import { colors } from '@/themes/colors';
import { Box, BoxProps, Typography } from '@mui/material';

interface Props extends BoxProps {
  label: string;
  value: string;
}

const FieldData = ({ label, value, ...props }: Props) => {
  return (
    <Box {...props}>
      <Typography variant="subtitle2" color={colors.secondary.gray3}>
        {label}:
      </Typography>
      <Typography variant="subtitle2" color={colors.secondary.text}>
        {value}
      </Typography>
    </Box>
  );
};

export default FieldData;
