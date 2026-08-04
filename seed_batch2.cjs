const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  try {
    const sql = fs.readFileSync('server/db/schema_batch2.sql', 'utf8');
    await pool.query(sql);
    console.log('Batch 2 Schema seeded successfully');
  } catch (error) {
    console.error('Error seeding Batch 2 Schema:', error);
  } finally {
    await pool.end();
  }
}

seed();
