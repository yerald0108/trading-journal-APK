import React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import { useTema } from '@/src/hooks';
import { RADIUS, SPACING } from '@/src/constants';

interface CardProps {
  children:  React.ReactNode;
  style?:    StyleProp<ViewStyle>;
  padding?:  number;
}

export const Card = ({ children, style, padding = SPACING.md }: CardProps) => {
  const { colors } = useTema();

  return (
    <View style={[
      styles.card,
      {
        backgroundColor: colors.surface,
        borderColor:     colors.border,
        padding,
      },
      style,
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    borderWidth:  1,
  },
});