import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  primary: '#FF6B00',
  primaryPressed: '#E05E00',
  primarySoft: '#FFF1E6',
  white: '#FFFFFF',
  black: '#111111',
  muted: '#6B6B6B',
  border: '#111111',
  borderSoft: '#E4E4E7',
  background: '#FAFAFA',
  danger: '#D92D20',
  dangerSoft: '#FDECEA',
} as const;

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', mono: 'ui-monospace' },
  web: { sans: 'var(--font-display)', mono: 'var(--font-mono)' },
  default: { sans: 'normal', mono: 'monospace' },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
} as const;

export const MaxContentWidth = 1200;
export const WideBreakpoint = 768;
