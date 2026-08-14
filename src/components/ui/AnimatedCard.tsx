import React, { useRef } from 'react';
import {
  Animated,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTema } from '@/src/hooks';
import { useFadeIn, useEscalaPress } from '@/src/hooks';
import { RADIUS, SPACING } from '@/src/constants';

interface AnimatedCardProps {
  children:  React.ReactNode;
  style?:    StyleProp<ViewStyle>;
  padding?:  number;
  delay?:    number;
  onPress?:  () => void;
}

export const AnimatedCard = ({
  children,
  style,
  padding = SPACING.md,
  delay   = 0,
  onPress,
}: AnimatedCardProps) => {
  const { colors }                    = useTema();
  const { opacidad, translateY }      = useFadeIn(400, delay);
  const { escala, alPresionar, alSoltar } = useEscalaPress();

  const Wrapper = onPress ? TouchableOpacity : Animated.View;

  if (onPress) {
    return (
      <Animated.View style={[{ opacity: opacidad, transform: [{ translateY }, { scale: escala }] }]}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={alPresionar}
          onPressOut={alSoltar}
          activeOpacity={1}
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor:     colors.border,
              padding,
            },
            style,
          ]}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor:     colors.border,
          padding,
          opacity:         opacidad,
          transform:       [{ translateY }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    borderWidth:  1,
  },
});