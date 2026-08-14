import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export const useFadeIn = (duracion = 400, delay = 0) => {
  const opacidad = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacidad, {
        toValue:         1,
        duration:        duracion,
        delay,
        easing:          Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue:         0,
        duration:        duracion,
        delay,
        easing:          Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return { opacidad, translateY };
};

export const useEscalaPress = () => {
  const escala = useRef(new Animated.Value(1)).current;

  const alPresionar = () => {
    Animated.spring(escala, {
      toValue:         0.96,
      useNativeDriver: true,
      speed:           50,
      bounciness:      4,
    }).start();
  };

  const alSoltar = () => {
    Animated.spring(escala, {
      toValue:         1,
      useNativeDriver: true,
      speed:           50,
      bounciness:      4,
    }).start();
  };

  return { escala, alPresionar, alSoltar };
};

export const usePulso = () => {
  const escala = useRef(new Animated.Value(1)).current;

  const iniciarPulso = () => {
    Animated.sequence([
      Animated.timing(escala, {
        toValue:         1.08,
        duration:        180,
        easing:          Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(escala, {
        toValue:         1,
        duration:        180,
        easing:          Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  return { escala, iniciarPulso };
};

export const useContadorAnimado = (
  valorFinal: number,
  duracion = 800
) => {
  const valorAnimado = useRef(new Animated.Value(0)).current;
  const valorMostrado = useRef(0);

  useEffect(() => {
    Animated.timing(valorAnimado, {
      toValue:         valorFinal,
      duration:        duracion,
      easing:          Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    valorAnimado.addListener(({ value }) => {
      valorMostrado.current = value;
    });

    return () => valorAnimado.removeAllListeners();
  }, [valorFinal]);

  return valorAnimado;
};