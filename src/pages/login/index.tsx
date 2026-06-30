import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import useMainControllerContext from './context';
import { MainControllerProvider } from './context/MainControllerProvider';
import { colors } from '@/themes/colors';
import TextFieldPassword from '@/components/TextField/TextFieldPassword';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import LAOALSY_LOGO from '@/assets/logo/LAOALSY.webp';
import LOGIN_BANNER from '@/assets/banner/Login_image.jpg';

const Content = () => {
  const ctrl = useMainControllerContext();
  const theme = useTheme();
  const { t } = useTranslation();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: colors.dominant.white2,
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, md: 4 },
        overflow: 'auto',
      }}
    >
      {/* Language switcher — top-right */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 12, sm: 16, md: 20 },
          right: { xs: 12, sm: 16, md: 20 },
          zIndex: 10,
        }}
      >
        <LanguageSwitcher />
      </Box>

      {/* Centered card */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 1100,
          minHeight: { xs: 'auto', md: 620 },
          bgcolor: colors.dominant.white1,
          borderRadius: 3,
          boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        }}
      >
        {/* Left — Form */}
        <Box
          component="section"
          aria-label="Sign in"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            px: { xs: 3, sm: 5, md: 6 },
            py: { xs: 4, md: 5 },
          }}
        >
          {/* Brand */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
            }}
          >
            <Box
              component="img"
              src={LAOALSY_LOGO}
              alt="Lao Airline logo"
              sx={{ width: 32, height: 32, objectFit: 'contain' }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: colors.secondary.text,
                letterSpacing: 0.2,
              }}
            >
              {t('auth.brand')}
            </Typography>
          </Box>

          {/* Form — vertically centered */}
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: { xs: 4, md: 0 },
            }}
          >
            <Box sx={{ width: '100%', maxWidth: 380 }}>
              <Stack spacing={1} sx={{ mb: 3.5 }}>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: colors.secondary.text,
                    letterSpacing: -0.5,
                  }}
                >
                  {t('auth.signIn')}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.secondary.gray3 }}>
                  {t('auth.signInSubtitle')}
                </Typography>
              </Stack>

              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label={t('auth.usernameOrEmail')}
                  variant="outlined"
                  value={ctrl.formData.usernameOrEmail}
                  onChange={(e) => ctrl.handleChange('usernameOrEmail')(e.target.value)}
                  onKeyPress={ctrl.handleKeyPress}
                  error={!!ctrl.errors.usernameOrEmail}
                  helperText={ctrl.errors.usernameOrEmail}
                  disabled={ctrl.loading}
                  autoComplete="username"
                  slotProps={{
                    input: { sx: { borderRadius: 1.5 } },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'border-color 200ms',
                      '&:hover fieldset': { borderColor: colors.primary.main },
                      '&.Mui-focused fieldset': { borderWidth: 1.5 },
                    },
                  }}
                />

                <TextFieldPassword
                  fullWidth
                  label={t('auth.password')}
                  variant="outlined"
                  value={ctrl.formData.password}
                  onChange={(e) => ctrl.handleChange('password')(e.target.value)}
                  onKeyPress={ctrl.handleKeyPress}
                  error={!!ctrl.errors.password}
                  helperText={ctrl.errors.password}
                  disabled={ctrl.loading}
                  autoComplete="current-password"
                  slotProps={{
                    input: { sx: { borderRadius: 1.5 } },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'border-color 200ms',
                      '&:hover fieldset': { borderColor: colors.primary.main },
                      '&.Mui-focused fieldset': { borderWidth: 1.5 },
                    },
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={ctrl.rememberMe}
                      onChange={(e) => ctrl.setRememberMe(e.target.checked)}
                      size="small"
                      sx={{
                        color: colors.secondary.gray3,
                        '&.Mui-checked': { color: colors.primary.main },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: colors.secondary.text }}>
                      {t('auth.keepMeLoggedIn')}
                    </Typography>
                  }
                  sx={{ mt: -0.5 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={ctrl.handleLogin}
                  disabled={ctrl.loading}
                  disableElevation
                  sx={{
                    py: 1.5,
                    mt: 0.5,
                    bgcolor: colors.primary.main,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: 0.2,
                    transition: 'background-color 200ms, box-shadow 200ms',
                    '&:hover': {
                      bgcolor: colors.accent.main,
                      boxShadow: '0 4px 14px rgba(5, 43, 170, 0.25)',
                    },
                    '&:focus-visible': {
                      outline: `2px solid ${colors.primary.main}`,
                      outlineOffset: 2,
                    },
                    '@media (prefers-reduced-motion: reduce)': {
                      transition: 'none',
                    },
                  }}
                >
                  {ctrl.loading ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    t('auth.signIn')
                  )}
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Right — Banner image (desktop only) */}
        {isDesktop && (
          <Box
            aria-hidden="true"
            sx={{
              position: 'relative',
              overflow: 'hidden',
              backgroundImage: `url(${LOGIN_BANNER})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              bgcolor: colors.primary.main,
            }}
          />
        )}
      </Box>
    </Box>
  );
};

const LoginPage = () => {
  return (
    <MainControllerProvider>
      <Content />
    </MainControllerProvider>
  );
};

export default LoginPage;
