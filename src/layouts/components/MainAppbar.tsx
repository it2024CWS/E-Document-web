import { Avatar, Box, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { APP_BAR_COLOR, APP_BAR_HEIGHT } from '../config';
import { colors } from '@/themes/colors';
import useMainDrawerControllerContext from '../context';
import { radius } from '@/themes/radius';
import SectionCurrentTime from './SectionCurrentTime';
import { SIDEBAR_IC } from '@/utils/constants/icon';
import { useAuth } from '@/contexts/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGIN_PATH } from '@/routes/config';
import LogoutIcon from '@mui/icons-material/Logout';

const MainAppBar = () => {
  const drawerCtrl = useMainDrawerControllerContext();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate(LOGIN_PATH);
  };

  // Get first letter of username for avatar
  const avatarLetter = user?.username?.charAt(0).toUpperCase() || 'U';

  return (
    <Box
      sx={{
        maxHeight: `calc(${APP_BAR_HEIGHT}px - 32px)`,
        height: '100%',
        bgcolor: APP_BAR_COLOR,
        p: '16px',
        borderBottom: `1px solid ${colors.secondary.gray1}`,  
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}
    >
      <IconButton onClick={drawerCtrl.handleChangeOpen} sx={{ bgcolor: colors.dominant.white3 }}>
        <img
          src={SIDEBAR_IC}
          style={{
            transition: 'transform 0.2s',
            transform: !drawerCtrl.open ? 'rotate(180deg)' : 'none',
          }}
          alt="sidebar"
        />
      </IconButton>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3 }}>
        <SectionCurrentTime />
        <Box
          onClick={handleClick}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.9,
            },
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              borderRadius: radius[5],
              bgcolor: colors.dominant.white1,
              p: '6px 8px',
              minWidth: '160px',
            }}
          >
            <Avatar sx={{ bgcolor: colors.primary.main }}>{avatarLetter}</Avatar>
            <Stack direction="column" justifyContent="space-between">
              <Typography variant="body2" fontWeight="bold" color="text.primary">
                {user?.username || 'User'}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: colors.secondary.gray2 }}>{user?.role || 'User'}</Typography>
            </Stack>
          </Stack>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default MainAppBar;
