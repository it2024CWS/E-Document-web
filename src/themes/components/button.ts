import { Components, Theme } from '@mui/material/styles';
import { radius } from '../radius';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    transparent: true;
  }
}

export const MuiButton: Components<Omit<Theme, 'components'>>['MuiButton'] = {
  defaultProps: {
    color: 'primary',
    variant: 'contained',
  },
  styleOverrides: {
    root: {
      borderRadius: radius[4],
      textTransform: 'none',
      fontWeight: 700,
      fontSize: '14px',
      padding: '12px 32px',
    },
  },
  variants: [
    {
      props: { variant: 'outlined' },
      style: ({ theme }) => ({
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
      }),
    },
    {
      props: { variant: 'transparent' },
      style: ({ theme }) => ({
        background: 'rgba(3, 66, 102, 0.10)',
        color: theme.palette.primary.main,
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: 'normal',
        border: 'none',
        '&:hover': {
          backgroundColor: 'rgba(3, 66, 102, 0.15)',
        },
      }),
    },
  ],
};
