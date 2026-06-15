import { Box } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Outlet, useLocation } from 'react-router-dom';
import MainDrawer from './components/MainDrawer';
import MainAppBar from './components/MainAppbar';
import { MainDrawerControllerProvider } from './context/MainControllerProvider';
import useMainDrawerControllerContext from './context';

const Content = () => {
  const drawerCtrl = useMainDrawerControllerContext();
  const location = useLocation();
  return (
    <Box sx={{ display: 'flex', height: '100dvh', overflow: 'hidden', bgcolor: grey[200] }}>
      <MainDrawer open={drawerCtrl.open} />
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <MainAppBar />
        <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', p: 3, bgcolor: '#F3F6F8' }}>
          <Outlet key={location.key} />
        </Box>
      </Box>
    </Box>
  );
};

const MainLayout = () => {
  return (
    <MainDrawerControllerProvider>
      <Content />
    </MainDrawerControllerProvider>
  );
};

export default MainLayout;
