import { radius } from '@/themes/radius';
import { Box, BoxProps, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TextFieldSearch from '@/components/TextField/TextFieldSearch';
import useMainControllerContext from '../context';
import { FormEnum } from '@/enums/formEnum';

const Toolbar = (props?: BoxProps) => {
  const ctrl = useMainControllerContext();

  return (
    <Box {...props} sx={{ p: 2, bgcolor: 'white', borderRadius: radius[2], ...props?.sx }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextFieldSearch
            placeholder="Search users..."
            value={ctrl.searchQuery ?? ''}
            onChange={(e) => ctrl.handleChangeSearchQuery(e.target.value)}
          />
        </Box>

        <Button onClick={() => ctrl.handleChangeForm(FormEnum.CREATE)}>
          <AddIcon sx={{ fontSize: 20, mr: 1 }} />
          Create User
        </Button>
      </Box>
    </Box>
  );
};

export default Toolbar;
