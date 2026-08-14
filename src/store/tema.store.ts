import { create } from 'zustand';
import { TemaNombre } from '@/src/theme';
import { temaDark, temaLight } from '@/src/theme';
import { Tema } from '@/src/theme';

interface TemaState {
  tema: Tema;
  toggleTema: () => void;
  setTema: (nombre: TemaNombre) => void;
}

export const useTemaStore = create<TemaState>((set, get) => ({
  tema: temaDark,

  toggleTema: () => {
    const actual = get().tema.nombre;
    set({ tema: actual === 'dark' ? temaLight : temaDark });
  },

  setTema: (nombre: TemaNombre) => {
    set({ tema: nombre === 'dark' ? temaDark : temaLight });
  },
}));