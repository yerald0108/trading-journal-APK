import { getDatabase } from './schema';

export const obtenerCapitalInicial = (): number => {
  const db  = getDatabase();
  const row = db.getFirstSync<{ capital_inicial: number }>(
    'SELECT capital_inicial FROM configuracion WHERE id = 1'
  );
  return row?.capital_inicial ?? 0;
};

export const establecerCapitalInicial = (capitalInicial: number): void => {
  const db = getDatabase();
  db.runSync(
    'UPDATE configuracion SET capital_inicial = ? WHERE id = 1',
    capitalInicial
  );
};