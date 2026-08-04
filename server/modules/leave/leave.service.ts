import { db } from '../../config/db.js';

export interface ApplyLeaveInput {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export const applyLeave = async (userId: string, data: ApplyLeaveInput) => {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    // Simple dates difference in days
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    
    if (end < start) throw new Error('End date cannot be before start date');
    
    const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const year = start.getFullYear();

    // Check balance
    const balanceRes = await client.query(
      'SELECT balance FROM leave_balances WHERE user_id = $1 AND type = $2 AND year = $3 FOR UPDATE',
      [userId, data.type, year]
    );

    if (!balanceRes.rowCount || parseFloat(balanceRes.rows[0].balance) < days) {
      throw new Error(`Insufficient ${data.type} leave balance for ${year}`);
    }

    const leaveRes = await client.query(`
      INSERT INTO leaves (user_id, type, start_date, end_date, reason, status)
      VALUES ($1, $2, $3, $4, $5, 'PENDING')
      RETURNING *
    `, [userId, data.type, data.startDate, data.endDate, data.reason]);

    await client.query('COMMIT');
    return leaveRes.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getMyLeaves = async (userId: string, limit = 30, offset = 0) => {
  const res = await db.query(
    'SELECT * FROM leaves WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
    [userId, limit, offset]
  );
  return res.rows;
};

export const getMyBalances = async (userId: string, year: number) => {
  const res = await db.query(
    'SELECT type, balance FROM leave_balances WHERE user_id = $1 AND year = $2',
    [userId, year]
  );
  return res.rows;
};

export const reviewLeave = async (managerId: string, leaveId: string, status: 'APPROVED' | 'REJECTED', remarks?: string) => {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    const leaveRes = await client.query('SELECT * FROM leaves WHERE id = $1 FOR UPDATE', [leaveId]);
    if (!leaveRes.rowCount) throw new Error('Leave request not found');
    
    const leave = leaveRes.rows[0];
    if (leave.status !== 'PENDING') {
      throw new Error(`Leave already ${leave.status}`);
    }

    if (status === 'APPROVED') {
      const start = new Date(leave.start_date);
      const end = new Date(leave.end_date);
      const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const year = start.getFullYear();

      // Deduct balance
      const balanceRes = await client.query(
        'UPDATE leave_balances SET balance = balance - $1 WHERE user_id = $2 AND type = $3 AND year = $4 AND balance >= $1 RETURNING balance',
        [days, leave.user_id, leave.type, year]
      );

      if (!balanceRes.rowCount) {
        throw new Error('Insufficient balance to approve this leave');
      }
    }

    await client.query(
      'UPDATE leaves SET status = $1, manager_id = $2, manager_remarks = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
      [status, managerId, remarks || null, leaveId]
    );

    await client.query('COMMIT');
    return { message: `Leave ${status.toLowerCase()} successfully` };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
