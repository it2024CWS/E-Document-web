import { PaletteOptions } from '@mui/material/styles';
import { colors } from './colors';

export const palette: PaletteOptions = {
  primary: {
    main: colors.primary.main,
  },
  secondary: {
    main: colors.secondary.gray3,
    light: colors.secondary.gray2,
  },
  error: {
    main: colors.accent.red,
  },
  warning: {
    main: colors.accent.yellow,
  },
  info: {
    main: colors.secondary.blue1,
  },
  success: {
    main: colors.accent.green,
  },
  grey: {
    50: colors.dominant.white1,
    100: colors.dominant.white2,
    200: colors.secondary.gray1,
    300: colors.secondary.gray2,
    400: colors.secondary.gray3,
    900: colors.secondary.text,
  },
  text: {
    primary: colors.secondary.text,
    secondary: colors.secondary.gray3,
  },
  background: {
    default: colors.dominant.white1,
    paper: colors.dominant.white2,
  },
};
