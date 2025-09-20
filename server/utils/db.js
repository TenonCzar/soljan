import { createClient } from "@libsql/client";

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Create users and addresses tables (run once)
export async function initDB() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT UNIQUE,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      balance REAL DEFAULT 0,
      account TEXT DEFAULT 'STANDARD',
      last_checkin TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      checkin REAL DEFAULT 0
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      currency TEXT NOT NULL,
      address TEXT NOT NULL,
      ngnbalance REAL DEFAULT 0 NOT NULL,
      coinbal INTEGER DEFAULT 0 NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
}
