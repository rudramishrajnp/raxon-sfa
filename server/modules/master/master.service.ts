import { db } from '../../config/db.js';

export const getDoctors = async () => {
  const res = await db.query('SELECT id, name, class, is_active FROM doctors WHERE is_active = true ORDER BY name ASC');
  return res.rows;
};

export const getChemists = async () => {
  const res = await db.query('SELECT id, name, is_active FROM chemists WHERE is_active = true ORDER BY name ASC');
  return res.rows;
};

export const getProducts = async () => {
  const res = await db.query('SELECT id, name, code, type, is_active FROM products WHERE is_active = true ORDER BY name ASC');
  return res.rows;
};

export const requestDoctor = async (userId: string, data: any) => {
  const res = await db.query(
    `INSERT INTO doctor_requests (name, class, specialty, qualification, mobile, address, latitude, longitude, requested_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [data.name, data.class || null, data.specialty || null, data.qualification || null, data.mobile || null, data.address || null, data.latitude || null, data.longitude || null, userId]
  );
  return res.rows[0];
};

export const requestChemist = async (userId: string, data: any) => {
  const res = await db.query(
    `INSERT INTO chemist_requests (name, address, mobile, latitude, longitude, requested_by)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [data.name, data.address || null, data.mobile || null, data.latitude || null, data.longitude || null, userId]
  );
  return res.rows[0];
};
