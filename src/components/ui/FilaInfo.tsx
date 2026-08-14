import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTema } from '@/src/hooks';
import { AppText } from './AppText';
import { SPACING, RADIUS, ICON_SIZE } from '@/src/constants';

interface FilaInfoProps {
  label:       string;
  valor?:      string;
  icono?:      React.ReactNode;
  onPress?:    () => void;
  colorValor?: string;
  peligro?:    boolean;
}

export const FilaInfo = ({
  label,
  valor,
  icono,
  onPress,
  colorValor,
  peligro = false,
}: FilaInfoProps) => {
  const { colors } = useTema();

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icono && (
        <View style={[
          styles.iconContainer,
          { backgroundColor: peligro ? colors.lossSurface : colors.surfaceElevated },
        ]}>
          {icono}
        </View>
      )}
      <AppText
        variante="cuerpo"
        color={peligro ? colors.loss : colors.textPrimary}
        style={styles.label}
      >
        {label}
      </AppText>
      <View style={styles.right}>
        {valor && (
          <AppText variante="cuerpo" color={colorValor ?? colors.textMuted}>
            {valor}
          </AppText>
        )}
        {onPress && (
          <ChevronRight size={ICON_SIZE.sm} color={colors.textMuted} />
        )}
      </View>
    </Wrapper>
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
  label: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.xs,
  },
});