export const radius = {
  1: '8px',
  2: '12px',
  3: '18px',
  4: '22px',
  5: '36px',
  none: '0px',
  full: '999px',
} as const;

export type Radius = typeof radius;
