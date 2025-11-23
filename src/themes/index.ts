import { createTheme, ThemeOptions } from '@mui/material/styles';
import { palette } from './palette';
import { spacing } from './spacing';
import { radius } from './radius';
import { typography } from './components/typography';
import { MuiButton } from './components/button';
import { MuiInputLabel, MuiTextField } from './components/textField';

const baseTheme: ThemeOptions = {
  palette,
  typography,
  spacing: (factor: number) => {
    const spacingValues = Object.values(spacing);
    return spacingValues[factor] || factor * 8;
  },
  components: {
    MuiButton,
    MuiTextField,
    MuiInputLabel,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: radius[2],
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: radius[2],
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
          backgroundColor: 'white',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '14px',
          fontWeight: '400',
        },
      },
    },
  },
};

export const theme = createTheme(baseTheme);
export type { Theme } from '@mui/material/styles';
