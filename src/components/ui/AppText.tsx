import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { useTema } from '@/src/hooks';
import { FONT_SIZE, FONT_WEIGHT } from '@/src/constants';

type VarianteTexto =
  | 'titulo'
  | 'subtitulo'
  | 'cuerpo'
  | 'caption'
  | 'label'
  | 'numero';

interface AppTextProps {
  children:  React.ReactNode;
  variante?: VarianteTexto;
  color?:    string;
  style?:    TextStyle;
  centrado?: boolean;
}

export const AppText = ({
  children,
  variante = 'cuerpo',
  color,
  style,
  centrado = false,
}: AppTextProps) => {
  const { colors } = useTema();

  const colorFinal = color ?? colors.textPrimary;

  return (
    <Text style={[
      styles.base,
      styles[variante],
      { color: colorFinal },
      centrado && { textAlign: 'center' },
      style,
    ]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
  titulo: {
    fontSize:   FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: FONT_SIZE.xxl * 1.2,
  },
  subtitulo: {
    fontSize:   FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: FONT_SIZE.lg * 1.3,
  },
  cuerpo: {
    fontSize:   FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.regular,
    lineHeight: FONT_SIZE.md * 1.5,
  },
  caption: {
    fontSize:   FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.regular,
    lineHeight: FONT_SIZE.sm * 1.4,
  },
  label: {
    fontSize:   FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: FONT_SIZE.xs * 1.4,
    letterSpacing: 0.5,
  },
  numero: {
    fontSize:   FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: FONT_SIZE.xxxl * 1.1,
  },
});