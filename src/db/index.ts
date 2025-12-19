import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// In production/docker, this will likely need to be a volume path
// For local dev, we use a local file
const sqlite = new Database(process.env.DATABASE_URL || 'data.db');

export const db = drizzle(sqlite, { schema });
