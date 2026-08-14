import { create } from 'zustand';
import {
  insertarOperacion,
  obtenerTodasLasOperaciones,
  eliminarOperacion,
} from '@/src/database';
import { obtenerCapitalInicial } from '@/src/database';
import { Operacion, NuevaOperacionInput } from '@/src/types';
import { calcularCapitalActual } from '@/src/services';
import { useCapitalStore } from './capital.store';

interface OperacionesState {
  operaciones:       Operacion[];
  cargando:          boolean;
  cargarOperaciones: () => void;
  agregarOperacion:  (input: NuevaOperacionInput) => void;
  eliminarOperacion: (id: number) => void;
}

export const useOperacionesStore = create<OperacionesState>((set, get) => ({
  operaciones: [],
  cargando:    false,

  cargarOperaciones: () => {
    set({ cargando: true });
    const operaciones = obtenerTodasLasOperaciones();
    set({ operaciones, cargando: false });
  },

  agregarOperacion: (input: NuevaOperacionInput) => {
    const nueva       = insertarOperacion(input);
    const operaciones = [nueva, ...get().operaciones];

    // Calcular capital en tiempo real desde el capital inicial
    const capitalInicial = obtenerCapitalInicial();
    const nuevoCapital   = calcularCapitalActual(capitalInicial, operaciones);

    // Sincronizar capital store sin tocar SQLite
    useCapitalStore.setState({ capital: nuevoCapital });

    set({ operaciones });
  },

  eliminarOperacion: (id: number) => {
    eliminarOperacion(id);
    const operaciones = get().operaciones.filter(op => op.id !== id);

    const capitalInicial = obtenerCapitalInicial();
    const nuevoCapital   = calcularCapitalActual(capitalInicial, operaciones);

    useCapitalStore.setState({ capital: nuevoCapital });

    set({ operaciones });
  },
}));