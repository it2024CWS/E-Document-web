import { Box, CSSObject, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, Theme, Typography } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { colors } from '@/themes/colors';
import { DRAWER_WIDTH, APP_BAR_HEIGHT, MAIN_MENU_ITEMS, APP_BAR_COLOR, GroupMenuModel } from '../config';
import ListMenuItem from './ListMenuItem';
import { useLocation, useNavigate } from 'react-router-dom';
import { BOOK_LOGO } from '@/utils/constants/logo';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '@/contexts/auth';
import { LOGIN_PATH } from '@/routes/config';

const drawerWidth = DRAWER_WIDTH;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(6)} + 1px)`,
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  borderRight: `1px solid ${colors.secondary.gray1}`,
  '& .MuiDrawer-paper': {
    borderRadius: 0,
    boxShadow: 'none',
  },
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': { ...openedMixin(theme) },
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      },
    },
  ],
}));

const MainDrawer = ({ open }: AppBarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate(LOGIN_PATH);
  };

  return (
    <Drawer variant="permanent" open={open}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Logo Section */}
        <Box
          sx={{
            height: open ? '120px' : 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: APP_BAR_COLOR,
            overflow: 'hidden',
            transition: (theme) =>
              theme.transitions.create('height', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
          }}
        >
          <img src={BOOK_LOGO} alt="main_logo" width={170} height={50} />
        </Box>

        {/* Menu Items */}
        <List sx={{ flex: 1, overflowY: 'auto' }}>
          {MAIN_MENU_ITEMS.map((item: GroupMenuModel) => {
            return <ListMenuItem key={item.label} menu={item} currentPath={currentPath} />;
          })}
        </List>

        {/* Logout Button at Bottom */}
        <Box sx={{ borderTop: `1px solid ${colors.secondary.gray1}` }}>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <LogoutIcon sx={{ color: colors.accent.red }} />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                sx={{
                  opacity: open ? 1 : 0,
                  '& .MuiListItemText-primary': {
                    color: colors.accent.red,
                    fontWeight: 500,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        </Box>
      </Box>
    </Drawer>
  );
};

export default MainDrawer;
