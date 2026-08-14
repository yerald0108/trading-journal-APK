import React, { useState } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { useTema } from '@/src/hooks';
import { AppText } from './AppText';
import { RADIUS, SPACING, FONT_SIZE } from '@/src/constants';

interface AppInputProps extends TextInputProps {
  label?:        string;
  error?:        string;
  prefix?:       string;
  containerStyle?: ViewStyle;
}

export const AppInput = ({
  label,
  error,
  prefix,
  containerStyle,
  style,
  ...props
}: AppInputProps) => {
  const { colors } = useTema();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.loss
    : focused
    ? colors.primary
    : colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <AppText
          variante="label"
          color={colors.textSecondary}
          style={styles.label}
        >
          {label}
        </AppText>
      )}

      <View style={[
        styles.inputWrapper,
        {
          backgroundColor: colors.surface,
          borderColor,
        },
      ]}>
        {prefix && (
          <AppText
            variante="cuerpo"
            color={colors.textMuted}
            style={styles.prefix}
          >
            {prefix}
          </AppText>
        )}
        <TextInput
          style={[
            styles.input,
            { color: colors.textPrimary },
            style,
          ]}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      </View>

      {error && (
        <AppText
          variante="caption"
          color={colors.loss}
          style={styles.error}
        >
          {error}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: SPACING.xs,
  },
  inputWrapper: {
    flexDirection:  'row',
    alignItems:     'center',
    borderWidth:    1.5,
    borderRadius:   RADIUS.md,
    paddingHorizontal: SPACING.md,
    minHeight:      52,
  },
  prefix: {
    marginRight: SPACING.xs,
    fontSize:    FONT_SIZE.lg,
  },
  input: {
    flex:     1,
    fontSize: FONT_SIZE.lg,
    padding:  0,
  },
  error: {
    marginTop: SPACING.xs,
  },
});