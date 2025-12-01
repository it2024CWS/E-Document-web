import { Components, Theme } from '@mui/material/styles';
import { radius } from '../radius';

export const MuiTextField: Components<Omit<Theme, 'components'>>['MuiTextField'] = {
  defaultProps: {
    variant: 'filled',
    size: 'small',
  },
  styleOverrides: {
    root: {
      display: 'flex',
      alignItems: 'center',
      alignSelf: 'stretch',
      borderRadius: radius[4],
      background: '#F6F6F6',
      '& .MuiFilledInput-root': {
        width: '100%',
        borderRadius: 'inherit',
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'transparent',
          overflow: 'hidden',
        },
        '&:before, &:after': {
          display: 'none',
        },
      },
      '& .MuiOutlinedInput-root, & .MuiInput-root': {
        width: '100%',
      },
      '& .MuiFilledInput-input, & .MuiOutlinedInput-input, & .MuiInput-input': {
        height: '50px',
        lineHeight: '50px',
        padding: '0 16px',
        boxSizing: 'border-box',
        '&::placeholder': {
          lineHeight: '50px',
          opacity: 1,
        },
      },
      '& .MuiOutlinedInput-root': {
        borderRadius: radius[4], // or your desired value
        backgroundColor: '#fff', // if you want a background
        // ...other styles
      },
    },
  },
};

export const MuiInputLabel: Components<Omit<Theme, 'components'>>['MuiInputLabel'] = {
  styleOverrides: {
    root: ({ ownerState }) => {
      return {
        ...(ownerState.filled && {
          transform: 'translate(19px, 28px) scale(1)',
          lineHeight: 'normal',
        }),
        transition: 'all 0.2s ease',
        '&.MuiInputLabel-shrink': {
          transform: 'translate(9.5px, -8px) scale(0.75)',
        },
      };
    },
  },
};
