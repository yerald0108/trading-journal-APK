import { Operacion, ResumenEstadisticas, PuntoCapital } from '@/src/types';
import { DatosBarra } from '../components';


export const calcularResumen = (
  operaciones: Operacion[]
): ResumenEstadisticas => {
  const ganadoras = operaciones.filter(op => op.tipo === 'win');
  const perdedoras = operaciones.filter(op => op.tipo === 'loss');

  const gananciaBruta = ganadoras.reduce((s, op) => s + op.monto, 0);
  const perdidaBruta  = perdedoras.reduce((s, op) => s + op.monto, 0);
  const gananciaNeta  = gananciaBruta - perdidaBruta;

  const total = operaciones.length;
  const tasaExito = total > 0
    ? (ganadoras.length / total) * 100
    : 0;

  const montos = operaciones.map(op => op.monto);
  const mejorOperacion = ganadoras.length > 0
    ? Math.max(...ganadoras.map(op => op.monto))
    : 0;
  const peorOperacion = perdedoras.length > 0
    ? Math.max(...perdedoras.map(op => op.monto))
    : 0;

  return {
    totalOperaciones:      total,
    operacionesGanadoras:  ganadoras.length,
    operacionesPerdedoras: perdedoras.length,
    tasaExito,
    gananciaNeta,
    gananciaBruta,
    perdidaBruta,
    mejorOperacion,
    peorOperacion,
  };
};

export const calcularCurvaCapital = (
  capitalInicial: number,
  operaciones: Operacion[]
): PuntoCapital[] => {
  // Las operaciones vienen DESC, las invertimos para calcular cronológicamente
  const ordenadas = [...operaciones].reverse();

  let capital = capitalInicial;
  const curva: PuntoCapital[] = [
    { fecha: ordenadas[0]?.fecha ?? new Date().toISOString(), capital },
  ];

  for (const op of ordenadas) {
    capital = op.tipo === 'win'
      ? capital + op.monto
      : capital - op.monto;
    curva.push({ fecha: op.fecha, capital });
  }

  return curva;
};

export const calcularDatosBarras = (
  operaciones: import('@/src/types').Operacion[],
  periodo: import('@/src/types').PeriodoEstadisticas
): DatosBarra[] => {
  if (operaciones.length === 0) return [];

  const agrupar = (getKey: (fecha: Date) => string): DatosBarra[] => {
    const mapa = new Map<string, DatosBarra>();

    [...operaciones].reverse().forEach((op) => {
      const key = getKey(new Date(op.fecha));
      if (!mapa.has(key)) {
        mapa.set(key, { label: key, ganadoras: 0, perdedoras: 0 });
      }
      const entrada = mapa.get(key)!;
      if (op.tipo === 'win') entrada.ganadoras++;
      else entrada.perdedoras++;
    });

    return Array.from(mapa.values());
  };

  switch (periodo) {
    case 'dia':
      return agrupar((f) =>
        f.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      );
    case 'semana':
      return agrupar((f) =>
        f.toLocaleDateString('es-ES', { weekday: 'short' })
      );
    case 'mes':
      return agrupar((f) => `${f.getDate()}`);
    case 'anio':
      return agrupar((f) =>
        f.toLocaleDateString('es-ES', { month: 'short' })
      );
  }
};