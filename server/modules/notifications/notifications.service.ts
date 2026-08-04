import { db } from '../../config/db.js';
import { getMessaging } from '../../config/firebase.js';

export const registerToken = async (userId: string, token: string, platform?: string) => {
  await db.query(
    'INSERT INTO device_tokens (user_id, token, platform) VALUES ($1, $2, $3) ON CONFLICT (user_id, token) DO UPDATE SET updated_at = CURRENT_TIMESTAMP',
    [userId, token, platform || null]
  );
  return { message: 'Token registered successfully' };
};

export const getMyNotifications = async (userId: string, limit = 50, offset = 0) => {
  const res = await db.query(
    'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
    [userId, limit, offset]
  );
  return res.rows;
};

export const getUnreadCount = async (userId: string) => {
  const res = await db.query(
    'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false',
    [userId]
  );
  return parseInt(res.rows[0].count);
};

export const markAsRead = async (userId: string, notificationIds: string[]) => {
  if (!notificationIds.length) return { message: 'No IDs provided' };
  
  const placeholders = notificationIds.map((_, i) => '$' + (i + 2)).join(', ');
  await db.query(
    `UPDATE notifications SET is_read = true, read_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND id IN (${placeholders})`,
    [userId, ...notificationIds]
  );
  return { message: 'Notifications marked as read' };
};

export const sendNotification = async (userId: string, title: string, body: string, type: string) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    
    // Save to DB
    const notifRes = await client.query(
      'INSERT INTO notifications (user_id, title, body, type) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, title, body, type]
    );

    // Get Tokens
    const tokenRes = await client.query('SELECT token FROM device_tokens WHERE user_id = $1', [userId]);
    const tokens = tokenRes.rows.map(r => r.token);

    // Send via FCM if available
    const messaging = getMessaging();
    if (messaging && tokens.length > 0) {
      const message = {
        notification: { title, body },
        data: { type, notificationId: notifRes.rows[0].id },
        tokens
      };
      
      try {
        await messaging.sendEachForMulticast(message);
      } catch (err) {
        console.error('FCM send failed:', err);
      }
    }
    
    await client.query('COMMIT');
    return { notificationId: notifRes.rows[0].id };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const broadcast = async (title: string, body: string, type: string, targetRoles?: string[], targetUserIds?: string[]) => {
  const client = await db.connect();
  try {
    let usersQuery = 'SELECT id FROM users WHERE is_active = true';
    const params: any[] = [];
    
    if (targetRoles && targetRoles.length > 0) {
      params.push(targetRoles);
      usersQuery += ` AND role = ANY($${params.length})`;
    } else if (targetUserIds && targetUserIds.length > 0) {
      params.push(targetUserIds);
      usersQuery += ` AND id = ANY($${params.length})`;
    }

    const userRes = await client.query(usersQuery, params);
    const userIds = userRes.rows.map(r => r.id);

    if (userIds.length > 0) {
      const values: any[] = [];
      const placeholders: string[] = [];
      
      userIds.forEach((uid, idx) => {
        const offset = idx * 4;
        placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`);
        values.push(uid, title, body, type);
      });

      await client.query(
        `INSERT INTO notifications (user_id, title, body, type) VALUES ${placeholders.join(', ')}`,
        values
      );
      
      // We skip actual FCM broadcast here to keep it simple, or it can be batched similarly
    }
    
    return { message: `Broadcast sent to ${userIds.length} users` };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};
