import { Box, BoxProps, CircularProgress } from '@mui/material';

const SectionLoading = (props?: BoxProps) => {
  return (
    <Box
      {...props}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
        width: '100%',
        bgcolor: 'white',
        borderRadius: '8px',
      }}
    >
      <CircularProgress size={60} />
    </Box>
  );
};

export default SectionLoading;
