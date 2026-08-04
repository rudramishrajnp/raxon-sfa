import fs from 'fs';
import path from 'path';
import { db } from '../config/db.js';

export async function initDatabase(): Promise<void> {
  console.log('Initializing database schema and seed data...');
  
  const schemaFiles = [
    'schema.sql',
    'schema_mtp.sql',
    'schema_attendance.sql',
    'schema_workplan.sql',
    'schema_batch1.sql',
    'schema_batch2.sql',
    'schema_batch3.sql',
    'schema_batch4.sql',
    'schema_batch5.sql',
    'seed_super_admin.sql',
  ];

  for (const file of schemaFiles) {
    try {
      const filePath = path.join(process.cwd(), 'server', 'db', file);
      if (fs.existsSync(filePath)) {
        const sql = fs.readFileSync(filePath, 'utf8');
        await db.query(sql);
        console.log(`Successfully executed DB script: ${file}`);
      } else {
        console.warn(`DB script file not found at path: ${filePath}`);
      }
    } catch (err: any) {
      console.error(`Error executing DB script ${file}:`, err.message || err);
    }
  }

  // Idempotent Super Admin verification & creation
  try {
    const superAdminQuery = `
      INSERT INTO users (email, password_hash, name, role, is_active) 
      VALUES ('charak.pradeep.mishra@gmail.con', '$2b$10$NAykgvAJuAs9JEGDCWYY/Oz7u64PFkvi3r1FnrYpLVgHx9pBulBBq', 'Super Admin', 'SUPER_ADMIN', true) 
      ON CONFLICT (email) DO UPDATE 
      SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
    `;
    await db.query(superAdminQuery);
    console.log('Super Admin user verified/seeded successfully (charak.pradeep.mishra@gmail.con).');
  } catch (err: any) {
    console.error('Failed to verify/seed Super Admin user:', err.message || err);
  }
}
