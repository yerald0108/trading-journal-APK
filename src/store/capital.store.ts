import { create } from 'zustand';
import { obtenerCapitalInicial, establecerCapitalInicial } from '@/src/database';
import { obtenerTodasLasOperaciones } from '@/src/database';
import { calcularCapitalActual } from '@/src/services';

interface CapitalState {
  capital:             number;
  capitalInicial:      number;
  capitalInicializado: boolean;
  cargarCapital:       () => void;
  establecerCapital:   (monto: number) => void;
}

export const useCapitalStore = create<CapitalState>((set) => ({
  capital:             0,
  capitalInicial:      0,
  capitalInicializado: false,

  cargarCapital: () => {
    const capitalInicial = obtenerCapitalInicial();
    const operaciones    = obtenerTodasLasOperaciones();
    const capital        = calcularCapitalActual(capitalInicial, operaciones);
    set({ capital, capitalInicial, capitalInicializado: true });
  },

  establecerCapital: (monto: number) => {
    establecerCapitalInicial(monto);
    set({ capital: monto, capitalInicial: monto, capitalInicializado: true });
  },
}));