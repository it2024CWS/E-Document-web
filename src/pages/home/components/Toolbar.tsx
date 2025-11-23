import InputFieldDate from '@/components/InputFieldDate';
import { radius } from '@/themes/radius';
import { Box, BoxProps, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Toolbar = (props?: BoxProps) => {
  return (
    <Box {...props} sx={{ p: 2, bgcolor: 'white', borderRadius: radius[2], ...props?.sx }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <InputFieldDate label={'Start date'} />
          <InputFieldDate label={'End date'} />
        </Box>

        <Button>
          <AddIcon sx={{ fontSize: 20, mr: 1 }} />
          Create link
        </Button>
      </Box>
    </Box>
  );
};

export default Toolbar;
