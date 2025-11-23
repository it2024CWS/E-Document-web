import { ARROW_LEFT_IC } from '@/utils/constants/icon';
import { Box, IconButton, IconButtonProps, Typography } from '@mui/material';

interface Props extends IconButtonProps {
  label: string;
}

const ButtonBack = ({ label, ...props }: Props) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <IconButton {...props} sx={{ borderRadius: '50%', width: '32px', height: '32px', bgcolor: 'none', ...props?.sx }}>
        <img alt="back arrow" src={ARROW_LEFT_IC} style={{ width: '28px', height: '28px' }} />
      </IconButton>
      <Typography variant="h4">{label}</Typography>
    </Box>
  );
};

export default ButtonBack;
