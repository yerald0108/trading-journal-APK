import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { useTema } from '@/src/hooks';
import { AppText } from './AppText';
import { RADIUS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/src/constants';

type VarianteButton = 'primary' | 'win' | 'loss' | 'ghost';

interface ButtonProps {
  texto:      string;
  onPress:    () => void;
  variante?:  VarianteButton;
  cargando?:  boolean;
  disabled?:  boolean;
  style?:     ViewStyle;
  fullWidth?: boolean;
}

export const Button = ({
  texto,
  onPress,
  variante  = 'primary',
  cargando  = false,
  disabled  = false,
  style,
  fullWidth = false,
}: ButtonProps) => {
  const { colors } = useTema();

  const config = {
    primary: {
      backgroundColor: colors.primary,
      color:           colors.white,
    },
    win: {
      backgroundColor: colors.win,
      color:           colors.white,
    },
    loss: {
      backgroundColor: colors.loss,
      color:           colors.white,
    },
    ghost: {
      backgroundColor: colors.transparent,
      color:           colors.textSecondary,
    },
  };

  const isDisabled = disabled || cargando;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[
        styles.button,
        { backgroundColor: config[variante].backgroundColor },
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {cargando ? (
        <ActivityIndicator color={config[variante].color} size="small" />
      ) : (
        <AppText
          variante="label"
          color={config[variante].color}
          style={styles.texto}
        >
          {texto}
        </AppText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical:   SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius:      RADIUS.md,
    alignItems:        'center',
    justifyContent:    'center',
    minHeight:         52,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  texto: {
    fontSize:   FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
});