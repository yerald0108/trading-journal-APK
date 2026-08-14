import { ColorScheme } from '@/src/constants/colors';

export type TemaNombre = 'dark' | 'light';

export interface Tema {
  nombre: TemaNombre;
  colors: ColorScheme;
}