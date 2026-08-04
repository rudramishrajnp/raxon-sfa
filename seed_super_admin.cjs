const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/raxon' });

async function seed() {
  try {
    const password = 'Admin@123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    const query = `
      INSERT INTO users (email, password_hash, name, role, is_active) 
      VALUES ($1, $2, $3, $4, $5) 
      ON CONFLICT (email) DO UPDATE 
      SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, is_active = EXCLUDED.is_active
    `;
    
    await pool.query(query, ['charak.pradeep.mishra@gmail.con', hash, 'Super Admin', 'SUPER_ADMIN', true]);
    console.log('Super Admin user seeded successfully.');
  } catch (error) {
    console.error('Error seeding Super Admin user:', error);
  } finally {
    await pool.end();
  }
}

seed();
