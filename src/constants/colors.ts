export const COLORS_DARK = {
  // Fondos
  background:       '#0f172a',
  surface:          '#1e293b',
  surfaceElevated:  '#263548',
  border:           '#334155',

  // Texto
  textPrimary:      '#f1f5f9',
  textSecondary:    '#94a3b8',
  textMuted:        '#475569',

  // Marca
  primary:          '#3b82f6',
  primaryHover:     '#2563eb',

  // Semánticos
  win:              '#22c55e',
  winSurface:       '#14532d',
  loss:             '#ef4444',
  lossSurface:      '#7f1d1d',
  warning:          '#f59e0b',
  warningSurface:   '#451a03',

  // Neutros
  white:            '#ffffff',
  black:            '#000000',
  transparent:      'transparent',
} as const;

export const COLORS_LIGHT = {
  // Fondos
  background:       '#f8fafc',
  surface:          '#ffffff',
  surfaceElevated:  '#f1f5f9',
  border:           '#e2e8f0',

  // Texto
  textPrimary:      '#0f172a',
  textSecondary:    '#475569',
  textMuted:        '#94a3b8',

  // Marca
  primary:          '#3b82f6',
  primaryHover:     '#2563eb',

  // Semánticos
  win:              '#16a34a',
  winSurface:       '#dcfce7',
  loss:             '#dc2626',
  lossSurface:      '#fee2e2',
  warning:          '#d97706',
  warningSurface:   '#fef3c7',

  // Neutros
  white:            '#ffffff',
  black:            '#000000',
  transparent:      'transparent',
} as const;

export type ColorScheme = {
  readonly [K in keyof typeof COLORS_DARK]: string;
};