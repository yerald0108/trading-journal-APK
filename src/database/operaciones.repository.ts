import { getDatabase } from './schema';
import { Operacion, NuevaOperacionInput } from '@/src/types';

export const insertarOperacion = (input: NuevaOperacionInput): Operacion => {
  const db = getDatabase();

  const fecha = new Date().toISOString();

  const resultado = db.runSync(
    `INSERT INTO operaciones (tipo, monto, fecha, nota)
     VALUES (?, ?, ?, ?)`,
    input.tipo,
    input.monto,
    fecha,
    input.nota ?? null
  );

  return {
    id:    resultado.lastInsertRowId,
    tipo:  input.tipo,
    monto: input.monto,
    fecha,
    nota:  input.nota,
  };
};

export const obtenerTodasLasOperaciones = (): Operacion[] => {
  const db = getDatabase();
  return db.getAllSync<Operacion>(
    'SELECT * FROM operaciones ORDER BY fecha DESC'
  );
};

export const obtenerOperacionesPorPeriodo = (
  desde: string,
  hasta: string
): Operacion[] => {
  const db = getDatabase();
  return db.getAllSync<Operacion>(
    `SELECT * FROM operaciones
     WHERE fecha >= ? AND fecha <= ?
     ORDER BY fecha DESC`,
    desde,
    hasta
  );
};

export const eliminarOperacion = (id: number): void => {
  const db = getDatabase();
  db.runSync('DELETE FROM operaciones WHERE id = ?', id);
};