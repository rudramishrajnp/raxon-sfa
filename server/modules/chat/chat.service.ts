import { db } from '../../config/db.js';

export const createGroup = async (userId: string, name: string | undefined, memberIds: string[], isGroup: boolean) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    
    // Check if 1-to-1 already exists
    if (!isGroup && memberIds.length === 1) {
      const existing = await client.query(`
        SELECT g.id FROM chat_groups g
        JOIN chat_members m1 ON g.id = m1.group_id
        JOIN chat_members m2 ON g.id = m2.group_id
        WHERE g.is_group = false 
          AND m1.user_id = $1 AND m2.user_id = $2
      `, [userId, memberIds[0]]);
      
      if (existing.rowCount) {
        await client.query('ROLLBACK');
        return { groupId: existing.rows[0].id, message: 'Chat already exists' };
      }
    }

    const grpRes = await client.query(
      'INSERT INTO chat_groups (name, is_group) VALUES ($1, $2) RETURNING id',
      [name || null, isGroup]
    );
    const groupId = grpRes.rows[0].id;

    const allMembers = Array.from(new Set([userId, ...memberIds]));
    
    for (const memId of allMembers) {
      await client.query('INSERT INTO chat_members (group_id, user_id) VALUES ($1, $2)', [groupId, memId]);
    }

    await client.query('COMMIT');
    return { groupId, message: 'Chat group created' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const sendMessage = async (userId: string, groupId: string, content?: string, mediaUrl?: string, mediaType?: string) => {
  // Validate membership
  const memRes = await db.query('SELECT 1 FROM chat_members WHERE group_id = $1 AND user_id = $2', [groupId, userId]);
  if (!memRes.rowCount) throw new Error('Not a member of this chat');

  const msgRes = await db.query(
    'INSERT INTO chat_messages (group_id, sender_id, content, media_url, media_type) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at',
    [groupId, userId, content || null, mediaUrl || null, mediaType || null]
  );
  
  return { messageId: msgRes.rows[0].id, timestamp: msgRes.rows[0].created_at };
};

export const markAsRead = async (userId: string, messageIds: string[]) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    for (const mid of messageIds) {
      await client.query(
        'INSERT INTO chat_read_receipts (message_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [mid, userId]
      );
    }
    await client.query('COMMIT');
    return { message: 'Read receipts updated' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getMyGroups = async (userId: string) => {
  const res = await db.query(`
    SELECT g.* FROM chat_groups g
    JOIN chat_members m ON g.id = m.group_id
    WHERE m.user_id = $1
    ORDER BY g.created_at DESC
  `, [userId]);
  return res.rows;
};

export const getMessages = async (userId: string, groupId: string, limit = 50, offset = 0) => {
  const memRes = await db.query('SELECT 1 FROM chat_members WHERE group_id = $1 AND user_id = $2', [groupId, userId]);
  if (!memRes.rowCount) throw new Error('Not a member of this chat');

  const res = await db.query(`
    SELECT m.*, 
           COALESCE(
             (SELECT json_agg(user_id) FROM chat_read_receipts WHERE message_id = m.id),
             '[]'::json
           ) as read_by
    FROM chat_messages m
    WHERE m.group_id = $1
    ORDER BY m.created_at DESC
    LIMIT $2 OFFSET $3
  `, [groupId, limit, offset]);
  return res.rows;
};
