import { Box } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Outlet, useLocation } from 'react-router-dom';
import MainDrawer from './components/MainDrawer';
import MainAppBar from './components/MainAppbar';
import { APP_BAR_HEIGHT } from './config';
import { MainDrawerControllerProvider } from './context/MainControllerProvider';
import useMainDrawerControllerContext from './context';

const Content = () => {
  const drawerCtrl = useMainDrawerControllerContext();
  const location = useLocation();
  return (
    <Box sx={{ minHeight: '100dvh' }}>
      <Box
        sx={{
          minHeight: '100dvh',
          width: '100%',
          overflowX: 'hidden',
          bgcolor: grey[200],
          display: 'flex',
        }}
      >
        <MainDrawer open={drawerCtrl.open} />
        <Box sx={{ width: '100%', overflowX: 'hidden' }}>
          <MainAppBar />
          <Box sx={{ p: 3, bgcolor: '#F3F6F8', overflowX: 'hidden', height: `calc(100dvh - ${APP_BAR_HEIGHT}px - 34px)` }}>
            <Box sx={{ width: '100%' }}>
              <Outlet key={location.key} />
            </Box>
          </Box>
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
