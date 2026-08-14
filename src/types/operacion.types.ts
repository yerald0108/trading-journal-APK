export type TipoOperacion = 'win' | 'loss';

export interface Operacion {
  id: number;
  tipo: TipoOperacion;
  monto: number;
  fecha: string; // ISO 8601: "2026-08-12T14:30:00.000Z"
  nota?: string;
}

export interface NuevaOperacionInput {
  tipo: TipoOperacion;
  monto: number;
  nota?: string;
}