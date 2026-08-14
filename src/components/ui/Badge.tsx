import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTema } from '@/src/hooks';
import { RADIUS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/src/constants';
import { AppText } from './AppText';

type VarianteBadge = 'win' | 'loss' | 'neutral';

interface BadgeProps {
  variante: VarianteBadge;
  texto:    string;
}

export const Badge = ({ variante, texto }: BadgeProps) => {
  const { colors } = useTema();

  const config = {
    win: {
      backgroundColor: colors.winSurface,
      color:           colors.win,
    },
    loss: {
      backgroundColor: colors.lossSurface,
      color:           colors.loss,
    },
    neutral: {
      backgroundColor: colors.surfaceElevated,
      color:           colors.textSecondary,
    },
  };

  return (
    <View style={[styles.badge, { backgroundColor: config[variante].backgroundColor }]}>
      <AppText
        variante="label"
        color={config[variante].color}
      >
        {texto}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical:   SPACING.xs / 2,
    borderRadius:      RADIUS.full,
    alignSelf:         'flex-start',
  },
});