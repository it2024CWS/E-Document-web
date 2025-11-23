import { Box, CircularProgress, MenuItem, Select, SelectProps } from '@mui/material';

type Props = SelectProps & {
  children?: React.ReactNode;
  loading?: boolean;
};
const SelectLoading = ({ loading, children, ...props }: Props) => {
  return (
    <Select defaultValue="" {...props} variant="outlined">
      <MenuItem sx={{ display: loading ? 'none' : 'flex' }} value={0}>
        None
      </MenuItem>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={20} />
        </Box>
      ) : (
        children
      )}
    </Select>
  );
};

export default SelectLoading;
