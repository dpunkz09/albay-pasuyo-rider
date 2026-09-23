import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

// Store the DB file next to the project root (outside src/)
const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'rider.db');

// Ensure the data/ directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// ── Schema ──────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// ── Default values (only inserted once) ────────────────────────────────────
const DEFAULTS: Record<string, string> = {
  fixedLat: '13.1391',
  fixedLng: '123.7438',
  baseFee:  '50',
  feePerKm: '10',
  freeKm:   '1',
  maxKm:    '0',
};

const insertDefault = db.prepare(
  `INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`
);
for (const [k, v] of Object.entries(DEFAULTS)) {
  insertDefault.run(k, v);
}

// ── Helpers ─────────────────────────────────────────────────────────────────
export interface Settings {
  fixedLat: number;
  fixedLng: number;
  baseFee:  number;
  feePerKm: number;
  freeKm:   number;
  maxKm:    number;
}

/** Read all settings from DB and return as typed object */
export function getSettings(): Settings {
  const rows = db.prepare(`SELECT key, value FROM settings`).all() as { key: string; value: string }[];
  const map: Record<string, string> = {};
  for (const row of rows) map[row.key] = row.value;

  return {
    fixedLat: parseFloat(map.fixedLat ?? DEFAULTS.fixedLat),
    fixedLng: parseFloat(map.fixedLng ?? DEFAULTS.fixedLng),
    baseFee:  parseFloat(map.baseFee  ?? DEFAULTS.baseFee),
    feePerKm: parseFloat(map.feePerKm ?? DEFAULTS.feePerKm),
    freeKm:   parseFloat(map.freeKm   ?? DEFAULTS.freeKm),
    maxKm:    parseFloat(map.maxKm    ?? DEFAULTS.maxKm),
  };
}

/** Upsert one or more settings keys */
export function saveSettings(updates: Partial<Settings>): void {
  const upsert = db.prepare(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  );
  const tx = db.transaction((data: Record<string, string>) => {
    for (const [k, v] of Object.entries(data)) upsert.run(k, v);
  });
  const stringified: Record<string, string> = {};
  for (const [k, v] of Object.entries(updates)) {
    if (v !== undefined) stringified[k] = String(v);
  }
  tx(stringified);
}

/** Close database connection gracefully */
export function closeDatabase(): void {
  try {
    db.close();
  } catch (error) {
    console.error('Error closing database:', error);
  }
}

// Graceful shutdown handlers
process.on('SIGINT', () => {
  closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDatabase();
  process.exit(0);
});

export default db;
