export const colors = {
  primary: {
    main: '#052baaff',
  },
  dominant: {
    white1: '#ffffff',
    white3: '#f6f6f6',
    white25: 'rgba(255, 255, 255, 0.25)',
    white50: 'rgba(255, 255, 255, 0.5)',
  },
  secondary: {
    gray1: '#e8eaed',
    gray2: '#bbbbbb',
    gray3: '#737373',
    text: '#363636',
    blue1: '#306ea9',
    blue110: 'rgba(48, 110, 169, 0.1)',
    yellow10: '#fffacd',
  },
  accent: {
    green: '#1da243',
    main: '#034266',
    red: '#b1342b',
    yellow: '#e0ab49',
  },
} as const;

export type Colors = typeof colors;
