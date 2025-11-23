import { ThemeProvider } from '@mui/material';
import './App.css';
import AppRoutes from './routes';
import { theme } from './themes';
import { AuthProvider } from './contexts/auth';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
