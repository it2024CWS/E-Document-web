import { TypographyVariantsOptions } from '@mui/material';
import { colors } from '../colors';

export const typography: TypographyVariantsOptions = {
  fontFamily: `'Inter', 'Noto Sans Lao', sans-serif`,

  h1: {
    //NOTE: H1E
    fontSize: '36px',
    fontWeight: 700,
    lineHeight: 'normal',
    color: colors.secondary.text,
  },
  h2: {
    //NOTE: H2E
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: 'normal',
    color: colors.secondary.text,
  },
  h3: {
    //NOTE: H3E
    fontSize: '26px',
    fontWeight: 700,
    lineHeight: 'normal',
    color: colors.secondary.text,
  },
  h4: {
    //NOTE: H4E
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: 'normal',
    color: colors.secondary.text,
  },
  h5: {
    //NOTE: B1E
    fontSize: '18px',
    fontWeight: 700,
    lineHeight: 'normal',
    color: colors.secondary.text,
  },
  h6: {
    //NOTE: B2E
    fontSize: '16px',
    fontWeight: 700,
    lineHeight: 'normal',
    color: colors.secondary.text,
  },
  body1: {
    //NOTE: Medium 2E
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: 'normal',
    color: colors.secondary.text,
  },
  body2: {
    //NOTE: Medium 3E
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: 'normal',
    color: colors.secondary.text,
  },
  subtitle1: {
    //NOTE: Medium M1L
    fontSize: '18px',
    fontWeight: 700,
    lineHeight: 'normal',
    color: colors.secondary.gray3,
  },
  subtitle2: {
    //NOTE: Medium B3E
    fontSize: '14px',
    fontWeight: 700,
    lineHeight: 'normal',
  },
} as const;

export type Typography = typeof typography;
