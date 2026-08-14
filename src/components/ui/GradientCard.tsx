import React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RADIUS, SPACING } from '@/src/constants';

interface GradientCardProps {
  children:  React.ReactNode;
  colores:   [string, string, ...string[]];
  style?:    StyleProp<ViewStyle>;
  padding?:  number;
}

export const GradientCard = ({
  children,
  colores,
  style,
  padding = SPACING.md,
}: GradientCardProps) => {
  return (
    <LinearGradient
      colors={colores}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, { padding }, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    borderRadius: RADIUS.lg,
  },
});