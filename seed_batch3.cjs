const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  try {
    const sql = fs.readFileSync('server/db/schema_batch3.sql', 'utf8');
    await pool.query(sql);
    console.log('Batch 3 Schema seeded successfully');
  } catch (error) {
    console.error('Error seeding Batch 3 Schema:', error);
  } finally {
    await pool.end();
  }
}
seed();
