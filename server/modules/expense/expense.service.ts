import { db } from '../../config/db.js';

export interface SubmitExpenseInput {
  date: string;
  locationType: string;
  ta: number;
  da: number;
  misc: number;
  miscRemarks?: string;
}

export const submitExpense = async (userId: string, role: string, data: SubmitExpenseInput) => {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    const existingRes = await client.query('SELECT id, status FROM expenses WHERE user_id = $1 AND date = $2', [userId, data.date]);
    if (existingRes.rowCount && !['PENDING', 'REJECTED'].includes(existingRes.rows[0].status)) {
      throw new Error(`Cannot submit expense. Current status is ${existingRes.rows[0].status}`);
    }

    const ruleRes = await client.query('SELECT max_ta, max_da FROM expense_rules WHERE role = $1 AND location_type = $2', [role, data.locationType]);
    let isHighFlag = false;
    
    if (ruleRes.rowCount) {
      const { max_ta, max_da } = ruleRes.rows[0];
      if (data.ta > max_ta || data.da > max_da) {
        isHighFlag = true;
      }
    } else {
      isHighFlag = true; // No rule found, require explicit manager approval
    }

    const total = data.ta + data.da + data.misc;

    let expenseId;
    if (existingRes.rowCount) {
      expenseId = existingRes.rows[0].id;
      await client.query(`
        UPDATE expenses SET 
          location_type = $1, ta = $2, da = $3, misc = $4, misc_remarks = $5,
          total = $6, status = 'PENDING', is_high_flag = $7, updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
      `, [data.locationType, data.ta, data.da, data.misc, data.miscRemarks || null, total, isHighFlag, expenseId]);
    } else {
      const insertRes = await client.query(`
        INSERT INTO expenses (user_id, date, location_type, ta, da, misc, misc_remarks, total, status, is_high_flag)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING', $9)
        RETURNING id
      `, [userId, data.date, data.locationType, data.ta, data.da, data.misc, data.miscRemarks || null, total, isHighFlag]);
      expenseId = insertRes.rows[0].id;
    }

    await client.query('COMMIT');
    return { expenseId, isHighFlag, message: 'Expense submitted successfully' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getMyExpenses = async (userId: string, limit = 30, offset = 0) => {
  const res = await db.query(
    'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC LIMIT $2 OFFSET $3',
    [userId, limit, offset]
  );
  return res.rows;
};

export const uploadBill = async (userId: string, expenseId: string, fileUrl: string, fileType: string) => {
  const res = await db.query('SELECT user_id FROM expenses WHERE id = $1', [expenseId]);
  if (!res.rowCount || res.rows[0].user_id !== userId) {
    throw new Error('Expense not found or unauthorized');
  }

  const billRes = await db.query(
    'INSERT INTO expense_bills (expense_id, file_url, file_type) VALUES ($1, $2, $3) RETURNING id',
    [expenseId, fileUrl, fileType]
  );

  return { billId: billRes.rows[0].id, fileUrl };
};

export const getExpenseBills = async (expenseId: string) => {
  const res = await db.query('SELECT id, file_url, file_type, created_at FROM expense_bills WHERE expense_id = $1', [expenseId]);
  return res.rows;
};

export const reviewExpense = async (managerId: string, expenseId: string, status: 'APPROVED' | 'REJECTED' | 'ADJUSTED', remarks?: string, adjustments?: { ta?: number, da?: number, misc?: number }) => {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    const expRes = await client.query('SELECT ta, da, misc FROM expenses WHERE id = $1', [expenseId]);
    if (!expRes.rowCount) throw new Error('Expense not found');
    
    let ta = expRes.rows[0].ta;
    let da = expRes.rows[0].da;
    let misc = expRes.rows[0].misc;

    if (status === 'ADJUSTED') {
      if (adjustments?.ta !== undefined) ta = adjustments.ta;
      if (adjustments?.da !== undefined) da = adjustments.da;
      if (adjustments?.misc !== undefined) misc = adjustments.misc;
    }

    const total = Number(ta) + Number(da) + Number(misc);

    await client.query(`
      UPDATE expenses SET
        status = $1, manager_id = $2, manager_remarks = $3,
        ta = $4, da = $5, misc = $6, total = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
    `, [status, managerId, remarks || null, ta, da, misc, total, expenseId]);

    await client.query('COMMIT');
    return { message: `Expense ${status.toLowerCase()} successfully` };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
