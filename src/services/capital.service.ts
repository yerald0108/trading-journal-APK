import { Operacion } from '@/src/types';

export const calcularCapitalActual = (
  capitalInicial: number,
  operaciones: Operacion[]
): number => {
  return operaciones.reduce((capital, op) => {
    return op.tipo === 'win'
      ? capital + op.monto
      : capital - op.monto;
  }, capitalInicial);
};

export const calcularGananciaNeta = (operaciones: Operacion[]): number => {
  return operaciones.reduce((total, op) => {
    return op.tipo === 'win'
      ? total + op.monto
      : total - op.monto;
  }, 0);
};