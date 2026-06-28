import { Avatar, Box, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { APP_BAR_COLOR, APP_BAR_HEIGHT } from '../config';
import { colors } from '@/themes/colors';
import useMainDrawerControllerContext from '../context';
import { radius } from '@/themes/radius';
import SectionCurrentTime from './SectionCurrentTime';
import { SIDEBAR_IC } from '@/utils/constants/icon';
import { useAuth } from '@/contexts/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGIN_PATH, USER_PATH } from '@/routes/config';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getUserProfilePictureUrl } from '@/services/fileService';

const MainAppBar = () => {
  const drawerCtrl = useMainDrawerControllerContext();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (user?.id && user?.profile_picture) {
      getUserProfilePictureUrl(user.id, user.profile_picture)
        .then(url => { if (!cancelled) setProfilePictureUrl(url); })
        .catch(() => { /* MUI Avatar will fall back to the letter */ });
    } else {
      setProfilePictureUrl(null);
    }
    return () => { cancelled = true; };
  }, [user?.id, user?.profile_picture]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    if (user?.id) {
      navigate(`${USER_PATH}?id=${user.id}`);
    }
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate(LOGIN_PATH);
  };

  const avatarLetter = user?.username?.charAt(0).toUpperCase() || 'U';

  return (
    <Box
      sx={{
        height: `${APP_BAR_HEIGHT}px`,
        boxSizing: 'border-box',
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

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
        <LanguageSwitcher />
        <SectionCurrentTime />
        <Box
          onClick={handleClick}
          sx={{ cursor: 'pointer', '&:hover': { opacity: 0.9 } }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              borderRadius: radius[5],
              bgcolor: colors.dominant.white1,
              border: `1px solid ${colors.secondary.gray1}`,
              p: '6px 8px',
              minWidth: '160px',
            }}
          >
            <Avatar
              src={profilePictureUrl || undefined}
              alt={user?.username}
              sx={{ bgcolor: colors.primary.main }}
            >
              {avatarLetter}
            </Avatar>
            <Stack direction="column" justifyContent="space-between">
              <Typography variant="body2" fontWeight="bold" color="text.primary">
                {user?.username || 'User'}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: colors.secondary.gray2 }}>
                {user?.role_name || 'User'}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleProfile}>
            <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
            {t('users.profile')}
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
            {t('common.logout')}
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default MainAppBar;
