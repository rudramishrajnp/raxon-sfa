import { db } from '../../config/db.js';

export interface GpsLogInput {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  batteryPercentage?: number;
  timestamp: string;
}

export const punchIn = async (userId: string, deviceId: string, gps: GpsLogInput) => {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    // Check if already punched in today
    const checkRes = await client.query(
      'SELECT id FROM attendance WHERE user_id = $1 AND date = CURRENT_DATE',
      [userId]
    );
    
    if (checkRes.rowCount && checkRes.rowCount > 0) {
      throw new Error('Already punched in today');
    }

    // Insert attendance
    const attendanceRes = await client.query(`
      INSERT INTO attendance (user_id, device_id, punch_in, status, date)
      VALUES ($1, $2, $3, 'PRESENT', CURRENT_DATE)
      RETURNING *
    `, [userId, deviceId, gps.timestamp]);

    // Insert GPS log
    await client.query(`
      INSERT INTO gps_logs (user_id, device_id, event_type, latitude, longitude, accuracy, speed, battery_percentage, timestamp)
      VALUES ($1, $2, 'PUNCH_IN', $3, $4, $5, $6, $7, $8)
    `, [userId, deviceId, gps.latitude, gps.longitude, gps.accuracy, gps.speed, gps.batteryPercentage, gps.timestamp]);

    await client.query('COMMIT');
    
    return attendanceRes.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const punchOut = async (userId: string, deviceId: string, gps: GpsLogInput) => {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    const checkRes = await client.query(
      'SELECT id, punch_out FROM attendance WHERE user_id = $1 AND date = CURRENT_DATE',
      [userId]
    );
    
    if (!checkRes.rowCount || checkRes.rowCount === 0) {
      throw new Error('No punch-in found for today');
    }

    if (checkRes.rows[0].punch_out) {
      throw new Error('Already punched out today');
    }

    const attendanceRes = await client.query(`
      UPDATE attendance 
      SET punch_out = $1, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2 AND date = CURRENT_DATE
      RETURNING *
    `, [gps.timestamp, userId]);

    await client.query(`
      INSERT INTO gps_logs (user_id, device_id, event_type, latitude, longitude, accuracy, speed, battery_percentage, timestamp)
      VALUES ($1, $2, 'PUNCH_OUT', $3, $4, $5, $6, $7, $8)
    `, [userId, deviceId, gps.latitude, gps.longitude, gps.accuracy, gps.speed, gps.batteryPercentage, gps.timestamp]);

    await client.query('COMMIT');
    
    return attendanceRes.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getTodayAttendance = async (userId: string) => {
  const res = await db.query(
    'SELECT * FROM attendance WHERE user_id = $1 AND date = CURRENT_DATE',
    [userId]
  );
  return res.rows[0] || null;
};

export const getAttendanceHistory = async (userId: string, limit: number = 30, offset: number = 0) => {
  const res = await db.query(
    'SELECT * FROM attendance WHERE user_id = $1 ORDER BY date DESC LIMIT $2 OFFSET $3',
    [userId, limit, offset]
  );
  return res.rows;
};

export const uploadBreadcrumbs = async (userId: string, deviceId: string, logs: GpsLogInput[]) => {
  if (!logs.length) return;

  const client = await db.connect();
  
  try {
    await client.query('BEGIN');

    const values: any[] = [];
    const placeholders: string[] = [];
    
    logs.forEach((log, index) => {
      const offset = index * 8;
      placeholders.push(`($${offset + 1}, $${offset + 2}, 'BREADCRUMB', $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8})`);
      values.push(
        userId, deviceId, 
        log.latitude, log.longitude, 
        log.accuracy || null, log.speed || null, 
        log.batteryPercentage || null, log.timestamp
      );
    });

    const query = `
      INSERT INTO gps_logs (user_id, device_id, event_type, latitude, longitude, accuracy, speed, battery_percentage, timestamp)
      VALUES ${placeholders.join(', ')}
    `;

    await client.query(query, values);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
