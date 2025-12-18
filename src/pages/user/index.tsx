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
import { useMemo } from 'react';

const Content = () => {
  const ctrl = useMainControllerContext();

  // Extract only the data we need to prevent unnecessary re-renders
  const users = useMemo(() => ctrl.data?.info || [], [ctrl.data?.info]);

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

          <Toolbar sx={{ mb: 3 }}
            onChangeForm={ctrl.handleChangeForm}
            onSearch={ctrl.handleChangeSearchQuery}
            initialSearchQuery={ctrl.searchQuery}
          />

          {ctrl.loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table
              users={users}
              onSelectUser={ctrl.handleChangeSelectedItem}
              totalUsers={ctrl.data?.pagination?.total}
            />
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
