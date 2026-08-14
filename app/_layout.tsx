import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { inicializarBaseDeDatos } from '@/src/database';
import { useTemaStore } from '@/src/store';
import { useCapitalStore } from '@/src/store';

export default function RootLayout() {
  const tema          = useTemaStore(s => s.tema);
  const cargarCapital = useCapitalStore(s => s.cargarCapital);

  useEffect(() => {
    inicializarBaseDeDatos();
    cargarCapital();
  }, []);

  return (
    <>
      <StatusBar style={tema.nombre === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}