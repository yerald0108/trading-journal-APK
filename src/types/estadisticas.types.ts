export type PeriodoEstadisticas = 'dia' | 'semana' | 'mes' | 'anio';

export interface ResumenEstadisticas {
  totalOperaciones: number;
  operacionesGanadoras: number;
  operacionesPerdedoras: number;
  tasaExito: number;        // porcentaje 0-100
  gananciaNeta: number;     // puede ser negativa
  gananciaBruta: number;    // solo suma de wins
  perdidaBruta: number;     // solo suma de losses
  mejorOperacion: number;
  peorOperacion: number;
}

export interface PuntoCapital {
  fecha: string;
  capital: number;
}

export interface EstadisticasPeriodo {
  periodo: PeriodoEstadisticas;
  resumen: ResumenEstadisticas;
  curvaCapital: PuntoCapital[];
}