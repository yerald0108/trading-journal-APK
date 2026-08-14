import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTema } from '@/src/hooks';
import { SPACING } from '@/src/constants';

interface DividerProps {
  margen?: number;
}

export const Divider = ({ margen = SPACING.md }: DividerProps) => {
  const { colors } = useTema();

  return (
    <View style={[
      styles.divider,
      {
        backgroundColor:  colors.border,
        marginVertical:   margen,
      },
    ]} />
  );
};

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    width:  '100%',
  },
});