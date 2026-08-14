export const COLORS_DARK = {
  // Fondos
  background:       '#0B0C10',
  surface:          '#13151C',
  surfaceElevated:  '#1A1D27',
  surfaceHigh:      '#21253A',
  border:           'rgba(255,255,255,0.07)',
  borderStrong:     'rgba(255,255,255,0.13)',

  // Texto
  textPrimary:      '#F0F1F5',
  textSecondary:    '#8B8FA8',
  textMuted:        '#4E526A',

  // Marca — violeta premium
  primary:          '#7C6FFF',
  primaryHover:     '#6A5EE0',
  primarySurface:   'rgba(124,111,255,0.15)',

  // Semánticos
  win:              '#2DD4A0',
  winSurface:       'rgba(45,212,160,0.12)',
  loss:             '#F06292',
  lossSurface:      'rgba(240,98,146,0.12)',
  warning:          '#F59E0B',
  warningSurface:   'rgba(245,158,11,0.12)',

  // Neutros
  white:            '#ffffff',
  black:            '#000000',
  transparent:      'transparent',
} as const;

export const COLORS_LIGHT = {
  // Fondos
  background:       '#F4F5F9',
  surface:          '#FFFFFF',
  surfaceElevated:  '#ECEEF5',
  surfaceHigh:      '#E2E5F0',
  border:           'rgba(0,0,0,0.07)',
  borderStrong:     'rgba(0,0,0,0.13)',

  // Texto
  textPrimary:      '#0D0F1A',
  textSecondary:    '#4E526A',
  textMuted:        '#9599B3',

  // Marca
  primary:          '#7C6FFF',
  primaryHover:     '#6A5EE0',
  primarySurface:   'rgba(124,111,255,0.12)',

  // Semánticos
  win:              '#059669',
  winSurface:       'rgba(5,150,105,0.10)',
  loss:             '#E11D6A',
  lossSurface:      'rgba(225,29,106,0.10)',
  warning:          '#D97706',
  warningSurface:   'rgba(217,119,6,0.10)',

  // Neutros
  white:            '#ffffff',
  black:            '#000000',
  transparent:      'transparent',
} as const;

export type ColorScheme = {
  readonly [K in keyof typeof COLORS_DARK]: string;
};