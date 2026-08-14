import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { FONT_SIZE, FONT_WEIGHT } from '@/src/constants';

interface CapitalAnimadoProps {
  valor:  number;
  color:  string;
  fontSize?: number;
}

export const CapitalAnimado = ({
  valor,
  color,
  fontSize = 40,
}: CapitalAnimadoProps) => {
  const valorAnimado = useRef(new Animated.Value(valor)).current;
  const valorRef     = useRef(valor);
  const textoRef     = useRef<string>(`$${valor.toFixed(2)}`);

  useEffect(() => {
    const valorAnterior = valorRef.current;
    valorRef.current    = valor;

    Animated.timing(valorAnimado, {
      toValue:         valor,
      duration:        600,
      easing:          Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [valor]);

  const textoAnimado = valorAnimado.interpolate({
    inputRange:  [Math.min(valorRef.current, valor) - 1, Math.max(valorRef.current, valor) + 1],
    outputRange: [
      `$${Math.min(valorRef.current, valor).toFixed(2)}`,
      `$${Math.max(valorRef.current, valor).toFixed(2)}`,
    ],
    extrapolate: 'clamp',
  });

  return (
    <Animated.Text
      style={[
        styles.texto,
        {
          color,
          fontSize,
        },
      ]}
    >
      {`$${valor.toFixed(2)}`}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  texto: {
    fontWeight:         FONT_WEIGHT.bold,
    includeFontPadding: false,
  },
});