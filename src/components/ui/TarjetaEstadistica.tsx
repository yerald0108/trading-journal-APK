import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTema } from '@/src/hooks';
import { AppText } from './AppText';
import { Card } from './Card';
import { SPACING } from '@/src/constants';

interface TarjetaEstadisticaProps {
  label:      string;
  valor:      string;
  subvalor?:  string;
  colorValor?: string;
}

export const TarjetaEstadistica = ({
  label,
  valor,
  subvalor,
  colorValor,
}: TarjetaEstadisticaProps) => {
  const { colors } = useTema();

  return (
    <Card style={styles.card}>
      <AppText variante="label" color={colors.textMuted}>
        {label}
      </AppText>
      <AppText
        variante="subtitulo"
        color={colorValor ?? colors.textPrimary}
        style={styles.valor}
      >
        {valor}
      </AppText>
      {subvalor && (
        <AppText variante="caption" color={colors.textMuted}>
          {subvalor}
        </AppText>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap:  SPACING.xs,
  },
  valor: {
    marginTop: SPACING.xs / 2,
  },
});