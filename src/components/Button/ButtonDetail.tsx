import { IconButton, IconButtonProps } from '@mui/material';
import { DETAIL_IC } from '@/utils/constants/icon';
import { colors } from '@/themes/colors';

const ButtonDetail = (props?: IconButtonProps) => {
  return (
    <IconButton {...props} sx={{ bgcolor: colors.primary.main + 20 }}>
      <img src={DETAIL_IC} />
    </IconButton>
  );
};

export default ButtonDetail;
