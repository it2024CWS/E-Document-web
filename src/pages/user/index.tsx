import useMainControllerContext from './context';
import { MainControllerProvider } from './context/MainControllerProvider';
import { FormEnum } from '@/enums/formEnum';
import FormDetail from './page/FormDetail';
import FormCreate from './page/FormCreate';
import { FormDetailControllerProvider } from './context/FormDetailControllerProvider';
import { FormCreateControllerProvider } from './context/FormCreateControllerProvider';
import { Box, Typography, CircularProgress } from '@mui/material';
import Toolbar from './components/Toolbar';
import Table from './components/Table';

const Content = () => {
  const ctrl = useMainControllerContext();

  switch (ctrl.currentForm) {
    case FormEnum.DETAIL:
      return (
        <FormDetailControllerProvider>
          <FormDetail />
        </FormDetailControllerProvider>
      );
    case FormEnum.CREATE:
    case FormEnum.EDIT:
      return (
        <FormCreateControllerProvider>
          <FormCreate />
        </FormCreateControllerProvider>
      );

    default:
      return (
        <Box>
          <Typography variant="h4" mb={3}>
            User Management
          </Typography>

          <Toolbar />

          {ctrl.loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table sx={{ mt: 3 }} />
          )}
        </Box>
      );
  }
};

const UserPage = () => {
  return (
    <MainControllerProvider>
      <Content />
    </MainControllerProvider>
  );
};

export default UserPage;
