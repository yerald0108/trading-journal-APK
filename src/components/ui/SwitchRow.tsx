import React from 'react';
import { View, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { useTema } from '@/src/hooks';
import { AppText } from './AppText';
import { SPACING, RADIUS } from '@/src/constants';

interface SwitchRowProps {
  label:       string;
  descripcion?: string;
  valor:       boolean;
  onChange:    (valor: boolean) => void;
  icono?:      React.ReactNode;
}

export const SwitchRow = ({
  label,
  descripcion,
  valor,
  onChange,
  icono,
}: SwitchRowProps) => {
  const { colors } = useTema();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onChange(!valor)}
      activeOpacity={0.7}
    >
      {icono && (
        <View style={[styles.iconContainer, { backgroundColor: colors.surfaceElevated }]}>
          {icono}
        </View>
      )}
      <View style={styles.textos}>
        <AppText variante="cuerpo" color={colors.textPrimary}>
          {label}
        </AppText>
        {descripcion && (
          <AppText variante="caption" color={colors.textMuted}>
            {descripcion}
          </AppText>
        )}
      </View>
      <Switch
        value={valor}
        onValueChange={onChange}
        trackColor={{
          false: colors.border,
          true:  colors.primary,
        }}
        thumbColor={colors.white}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            SPACING.md,
    paddingVertical: SPACING.sm,
  },
  iconContainer: {
    width:          40,
    height:         40,
    borderRadius:   RADIUS.md,
    alignItems:     'center',
    justifyContent: 'center',
  },
  textos: {
    flex: 1,
    gap:  2,
  },
});