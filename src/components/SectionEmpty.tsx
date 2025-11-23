import { Box, BoxProps, Typography } from '@mui/material';

const SectionEmpty = (props?: BoxProps) => {
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
      <Typography>No data available.</Typography>
    </Box>
  );
};

export default SectionEmpty;
