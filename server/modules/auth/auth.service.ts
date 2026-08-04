import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../config/db.js';
import { env } from '../../config/env.js';

export const login = async (email: string, password: string, deviceId: string, deviceName?: string) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1 AND is_active = true', [email]);
  const user = result.rows[0];

  if (!user) throw new Error('Invalid email or password');

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) throw new Error('Invalid email or password');

  // Upsert device
  await db.query(`
    INSERT INTO devices (user_id, device_id, device_name, last_login)
    VALUES ($1, $2, $3, NOW())
    ON CONFLICT (device_id) DO UPDATE 
    SET last_login = NOW(), device_name = EXCLUDED.device_name, is_active = true
  `, [user.id, deviceId, deviceName]);

  return generateTokens(user.id, user.role, deviceId);
};

export const refreshAccessToken = async (token: string) => {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string; role: string; deviceId: string };
  
  // Verify token exists in db and not expired
  const result = await db.query('SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()', [token]);
  if (result.rowCount === 0) throw new Error('Invalid or expired refresh token');

  return generateTokens(decoded.id, decoded.role, decoded.deviceId);
};

export const logout = async (userId: string, deviceId: string) => {
  await db.query('DELETE FROM refresh_tokens WHERE user_id = $1 AND device_id = $2', [userId, deviceId]);
};

export const getUserById = async (userId: string) => {
  const result = await db.query('SELECT id, email, name, role, is_active FROM users WHERE id = $1', [userId]);
  if (result.rowCount === 0) throw new Error('User not found');
  return result.rows[0];
};

const generateTokens = async (userId: string, role: string, deviceId: string) => {
  const accessToken = jwt.sign({ id: userId, role, deviceId }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
  });

  const refreshToken = jwt.sign({ id: userId, role, deviceId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });

  // Calculate expires_at for db
  const decodedRefresh = jwt.decode(refreshToken) as { exp: number };
  const expiresAt = new Date(decodedRefresh.exp * 1000);

  // Upsert refresh token
  await db.query(`
    INSERT INTO refresh_tokens (user_id, device_id, token, expires_at)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (token) DO UPDATE
    SET expires_at = EXCLUDED.expires_at, created_at = NOW()
  `, [userId, deviceId, refreshToken, expiresAt]);

  return { accessToken, refreshToken };
};
