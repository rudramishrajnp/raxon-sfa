import { Pool } from 'pg';
import { env } from './env.js';

export const db = new Pool({
  connectionString: env.DATABASE_URL,
});

db.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});
