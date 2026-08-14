import { useTemaStore } from '@/src/store';

export const useTema = () => {
  const { tema, toggleTema, setTema } = useTemaStore();

  return {
    colors:     tema.colors,
    nombre:     tema.nombre,
    isDark:     tema.nombre === 'dark',
    toggleTema,
    setTema,
  };
};