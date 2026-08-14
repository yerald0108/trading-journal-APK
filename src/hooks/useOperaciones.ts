import { useEffect } from 'react';
import { useOperacionesStore } from '@/src/store';

export const useOperaciones = () => {
  const {
    operaciones,
    cargando,
    cargarOperaciones,
    agregarOperacion,
    eliminarOperacion,
  } = useOperacionesStore();

  useEffect(() => {
    cargarOperaciones();
  }, []);

  return {
    operaciones,
    cargando,
    agregarOperacion,
    eliminarOperacion,
  };
};