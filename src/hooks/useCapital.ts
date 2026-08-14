import { useEffect } from 'react';
import { useCapitalStore } from '@/src/store';

export const useCapital = () => {
  const { capital, capitalInicializado, cargarCapital, establecerCapital } =
    useCapitalStore();

  useEffect(() => {
    cargarCapital();
  }, []);

  return {
    capital,
    capitalInicializado,
    establecerCapital,
  };
};