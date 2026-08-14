import * as SQLite from 'expo-sqlite';

const DB_NAME = 'trading_journal.db';

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    db = SQLite.openDatabaseSync(DB_NAME);
  }
  return db;
};

export const inicializarBaseDeDatos = (): void => {
  const db = getDatabase();

  db.execSync(`PRAGMA journal_mode = WAL;`);

  // Crear tabla configuracion si no existe (esquema nuevo)
  db.execSync(`
    CREATE TABLE IF NOT EXISTS configuracion (
      id               INTEGER PRIMARY KEY NOT NULL DEFAULT 1,
      capital_inicial  REAL    NOT NULL DEFAULT 0,
      creado_en        TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Migración: si la tabla tiene columna 'capital' en vez de 'capital_inicial'
  const columnas = db.getAllSync<{ name: string }>(
    `PRAGMA table_info(configuracion)`
  );
  const tieneCapital        = columnas.some(c => c.name === 'capital');
  const tieneCapitalInicial = columnas.some(c => c.name === 'capital_inicial');

  if (tieneCapital && !tieneCapitalInicial) {
    // Renombrar columna migrando los datos
    db.execSync(`
      ALTER TABLE configuracion ADD COLUMN capital_inicial REAL NOT NULL DEFAULT 0;
      UPDATE configuracion SET capital_inicial = capital WHERE id = 1;
    `);
  }

  // Crear tabla operaciones si no existe
  db.execSync(`
    CREATE TABLE IF NOT EXISTS operaciones (
      id    INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo  TEXT NOT NULL CHECK(tipo IN ('win', 'loss')),
      monto REAL NOT NULL CHECK(monto > 0),
      fecha TEXT NOT NULL DEFAULT (datetime('now')),
      nota  TEXT
    );
  `);

  // Insertar fila de configuración si no existe
  db.execSync(`
    INSERT OR IGNORE INTO configuracion (id, capital_inicial)
    VALUES (1, 0);
  `);
};