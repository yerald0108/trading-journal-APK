import { useMemo } from 'react';
import { useOperacionesStore } from '@/src/store';
import { useCapitalStore } from '@/src/store';
import { calcularResumen, calcularCurvaCapital } from '@/src/services';
import { PeriodoEstadisticas } from '@/src/types';

const filtrarPorPeriodo = (
  operaciones: ReturnType<typeof useOperacionesStore.getState>['operaciones'],
  periodo: PeriodoEstadisticas
) => {
  const ahora = new Date();
  const desde = new Date();

  switch (periodo) {
    case 'dia':
      desde.setHours(0, 0, 0, 0);
      break;
    case 'semana':
      desde.setDate(ahora.getDate() - ahora.getDay());
      desde.setHours(0, 0, 0, 0);
      break;
    case 'mes':
      desde.setDate(1);
      desde.setHours(0, 0, 0, 0);
      break;
    case 'anio':
      desde.setMonth(0, 1);
      desde.setHours(0, 0, 0, 0);
      break;
  }

  return operaciones.filter(op => new Date(op.fecha) >= desde);
};

export const useEstadisticas = (periodo: PeriodoEstadisticas = 'dia') => {
  const operaciones = useOperacionesStore(s => s.operaciones);
  const capital     = useCapitalStore(s => s.capital);

  const operacionesFiltradas = useMemo(
    () => filtrarPorPeriodo(operaciones, periodo),
    [operaciones, periodo]
  );

  const resumen = useMemo(
    () => calcularResumen(operacionesFiltradas),
    [operacionesFiltradas]
  );

  const curvaCapital = useMemo(
    () => calcularCurvaCapital(capital, operaciones),
    [capital, operaciones]
  );

  return {
    resumen,
    curvaCapital,
    operacionesFiltradas,
  };
};