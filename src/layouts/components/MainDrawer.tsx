import { Box, CSSObject, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MuiDrawer from '@mui/material/Drawer';
import { colors } from '@/themes/colors';
import { DRAWER_WIDTH, MAIN_MENU_ITEMS, GroupMenuModel } from '../config';
import ListMenuItem from './ListMenuItem';
import { useLocation, useNavigate } from 'react-router-dom';
import { LAOALSY_LOGO } from '@/utils/constants/logo';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '@/contexts/auth';
import { LOGIN_PATH } from '@/routes/config';
import UploadButton from '@/components/UploadButton';
import { useMemo } from 'react';
import { getMenuPathsForRole } from '@/enums/userRoleEnum';

const drawerWidth = DRAWER_WIDTH;


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

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })<{ open?: boolean }>(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    borderRight: `1px solid ${colors.secondary.gray1}`,
    '& .MuiDrawer-paper': {
      borderRadius: 0,
      boxShadow: 'none',
    },
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': { ...openedMixin(theme), borderRadius: 0 },
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': { ...closedMixin(theme), borderRadius: 0 },
    }),
  })
);

const MainDrawer = ({ open }: { open?: boolean }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { t } = useTranslation();

  const filteredMenu = useMemo(() => {
    const allowed = new Set(getMenuPathsForRole(user?.role_name));
    return MAIN_MENU_ITEMS
      .map(group => ({
        ...group,
        menu: group.menu
          .map(item => {
            if (item.subMenu) {
              const sub = item.subMenu.filter(s => !s.path || allowed.has(s.path));
              return sub.length ? { ...item, subMenu: sub } : null;
            }
            return !item.path || allowed.has(item.path) ? item : null;
          })
          .filter((x): x is NonNullable<typeof x> => x !== null),
      }))
      .filter(group => group.menu.length > 0);
  }, [user?.role_name]);

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
            height: open ? '80px' : 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: colors.primary.main,
            overflow: 'hidden',
            transition: (theme) =>
              theme.transitions.create('height', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
          }}
        >
          <img src={LAOALSY_LOGO} alt="main_logo" width={75} height={65} />
        </Box>

        {/* Upload Button */}
        <Box
          sx={{
            px: 2,
            py: 2,
            opacity: open ? 1 : 0,
            height: open ? 'auto' : 0,
            overflow: 'hidden',
            transition: (theme) =>
              theme.transitions.create(['opacity', 'height'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
          }}
        >
          <UploadButton />
        </Box>

        {/* Menu Items */}
        <List sx={{ flex: 1, overflowY: 'auto' }}>
          {filteredMenu.map((item: GroupMenuModel) => {
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
                primary={t('common.logout')}
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
