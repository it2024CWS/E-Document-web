import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import useMainControllerContext from './context';
import { MainControllerProvider } from './context/MainControllerProvider';
import { colors } from '@/themes/colors';
import TextFieldPassword from '@/components/TextField/TextFieldPassword';

const Content = () => {
  const ctrl = useMainControllerContext();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.accent.main} 100%)`,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 5,
            borderRadius: 3,
            backgroundColor: colors.dominant.white1,
          }}
        >
          <Stack spacing={3}>
            {/* Logo & Title */}
            <Box sx={{ textAlign: 'center', mb: 1 }}>
              <Typography variant="h4" fontWeight="bold" color={colors.primary.main} gutterBottom>
                E-Document System
              </Typography>
              <Typography variant="body2" color={colors.secondary.gray3}>
                Please login to continue
              </Typography>
            </Box>

            {/* Username/Email Field */}
            <TextField
              fullWidth
              label="Username or Email"
              variant="outlined"
              value={ctrl.formData.usernameOrEmail}
              onChange={(e) => ctrl.handleChange('usernameOrEmail')(e.target.value)}
              onKeyPress={ctrl.handleKeyPress}
              error={!!ctrl.errors.usernameOrEmail}
              helperText={ctrl.errors.usernameOrEmail}
              disabled={ctrl.loading}
              autoComplete="username"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: colors.primary.main,
                  },
                },
              }}
            />

            {/* Password Field */}
            <TextFieldPassword
              fullWidth
              label="Password"
              variant="outlined"
              value={ctrl.formData.password}
              onChange={(e) => ctrl.handleChange('password')(e.target.value)}
              onKeyPress={ctrl.handleKeyPress}
              error={!!ctrl.errors.password}
              helperText={ctrl.errors.password}
              disabled={ctrl.loading}
              autoComplete="current-password"
            />

            {/* Remember Me */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={ctrl.rememberMe}
                    onChange={(e) => ctrl.setRememberMe(e.target.checked)}
                    sx={{
                      color: colors.primary.main,
                      '&.Mui-checked': {
                        color: colors.primary.main,
                      },
                    }}
                  />
                }
                label={<Typography variant="body2">Remember me</Typography>}
              />
            </Box>

            {/* Login Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={ctrl.handleLogin}
              disabled={ctrl.loading}
              sx={{
                py: 1.5,
                bgcolor: colors.primary.main,
                '&:hover': {
                  bgcolor: colors.accent.main,
                },
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              {ctrl.loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </Stack>
        </Paper>
      </Container>
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
