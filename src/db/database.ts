import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  const dbPath = env.DATABASE_PATH ?? path.join(process.cwd(), 'data', 'cellulo.db');

  // Ensure the parent directory exists
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(dbPath);

  // Enable WAL mode for better concurrent read performance
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS packages (
      id          TEXT    PRIMARY KEY,
      data        TEXT    NOT NULL,
      synced_at   TEXT    NOT NULL
    )
  `);

  return db;
}

/** Close the database connection. Safe to call even if the DB was never opened. */
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
