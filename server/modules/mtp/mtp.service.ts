import { db } from '../../config/db.js';

export interface DailyPlanInput {
  date: string;
  workType: string;
  locationType: string;
  doctorIds: string[];
  chemistIds: string[];
}

export interface MtpInput {
  month: number;
  year: number;
  dailyPlans: DailyPlanInput[];
}

export const saveDraft = async (userId: string, data: MtpInput) => {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    // Check if MTP exists
    const existingRes = await client.query(
      'SELECT id, status FROM mtp WHERE user_id = $1 AND month = $2 AND year = $3',
      [userId, data.month, data.year]
    );

    let mtpId;

    if (existingRes.rowCount && existingRes.rowCount > 0) {
      const existing = existingRes.rows[0];
      if (['SUBMITTED', 'APPROVED'].includes(existing.status)) {
        throw new Error(`Cannot modify MTP in ${existing.status} status`);
      }
      mtpId = existing.id;
      // Delete old daily plans
      await client.query('DELETE FROM mtp_daily_plan WHERE mtp_id = $1', [mtpId]);
      
      // Update status back to DRAFT if it was REJECTED
      if (existing.status === 'REJECTED') {
        await client.query('UPDATE mtp SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', ['DRAFT', mtpId]);
      }
    } else {
      const mtpRes = await client.query(
        'INSERT INTO mtp (user_id, month, year, status) VALUES ($1, $2, $3, $4) RETURNING id',
        [userId, data.month, data.year, 'DRAFT']
      );
      mtpId = mtpRes.rows[0].id;
    }

    // Insert new daily plans
    if (data.dailyPlans.length > 0) {
      const values: any[] = [];
      const placeholders: string[] = [];
      
      data.dailyPlans.forEach((plan, index) => {
        const offset = index * 5;
        placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}::uuid[], $${offset + 6}::uuid[])`);
        values.push(mtpId, plan.date, plan.workType, plan.locationType, plan.doctorIds, plan.chemistIds);
      });

      const query = `
        INSERT INTO mtp_daily_plan (mtp_id, date, work_type, location_type, doctor_ids, chemist_ids)
        VALUES ${placeholders.join(', ')}
      `;
      // fix placeholders logic because 6 arguments per insert
    }
    
    // Correcting placeholder logic:
    if (data.dailyPlans.length > 0) {
      const values: any[] = [];
      const placeholders: string[] = [];
      
      data.dailyPlans.forEach((plan, index) => {
        const offset = index * 6;
        placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}::uuid[], $${offset + 6}::uuid[])`);
        values.push(mtpId, plan.date, plan.workType, plan.locationType, plan.doctorIds, plan.chemistIds);
      });

      const query = `
        INSERT INTO mtp_daily_plan (mtp_id, date, work_type, location_type, doctor_ids, chemist_ids)
        VALUES ${placeholders.join(', ')}
      `;
      await client.query(query, values);
    }

    await client.query('COMMIT');
    return { mtpId, message: 'Draft saved successfully' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const updateMtp = async (userId: string, mtpId: string, data: MtpInput) => {
   // Validate it belongs to user
   const existingRes = await db.query('SELECT user_id FROM mtp WHERE id = $1', [mtpId]);
   if (!existingRes.rowCount || existingRes.rows[0].user_id !== userId) {
     throw new Error('MTP not found or unauthorized');
   }
   return saveDraft(userId, data);
};

export const submitMtp = async (userId: string, mtpId: string) => {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    const existingRes = await client.query('SELECT status FROM mtp WHERE id = $1 AND user_id = $2', [mtpId, userId]);
    if (!existingRes.rowCount) throw new Error('MTP not found');
    
    if (['SUBMITTED', 'APPROVED'].includes(existingRes.rows[0].status)) {
      throw new Error(`MTP is already ${existingRes.rows[0].status}`);
    }

    // Validate Doctor Visit Frequencies
    const planRes = await client.query('SELECT doctor_ids FROM mtp_daily_plan WHERE mtp_id = $1', [mtpId]);
    const doctorVisitCount: Record<string, number> = {};
    
    for (const row of planRes.rows) {
      for (const docId of row.doctor_ids || []) {
        doctorVisitCount[docId] = (doctorVisitCount[docId] || 0) + 1;
      }
    }

    if (Object.keys(doctorVisitCount).length > 0) {
      const docIds = Object.keys(doctorVisitCount);
      const docsRes = await client.query(`SELECT id, class FROM doctors WHERE id = ANY($1::uuid[])`, [docIds]);
      
      for (const doc of docsRes.rows) {
        const count = doctorVisitCount[doc.id];
        if (doc.class === 'A' && count > 3) {
          throw new Error(`Doctor ${doc.id} (Class A) visited ${count} times, max allowed is 3`);
        }
        if (doc.class === 'B' && count > 2) {
          throw new Error(`Doctor ${doc.id} (Class B) visited ${count} times, max allowed is 2`);
        }
      }
    }

    await client.query(
      'UPDATE mtp SET status = $1, submitted_by = $2, submitted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      ['SUBMITTED', userId, mtpId]
    );

    await client.query(
      'INSERT INTO mtp_approval_history (mtp_id, status, acted_by, remarks) VALUES ($1, $2, $3, $4)',
      [mtpId, 'SUBMITTED', userId, 'MTP Submitted for approval']
    );

    await client.query('COMMIT');
    return { message: 'MTP submitted successfully' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getCurrentMtp = async (userId: string, month: number, year: number) => {
  const res = await db.query('SELECT * FROM mtp WHERE user_id = $1 AND month = $2 AND year = $3', [userId, month, year]);
  if (!res.rowCount) return null;
  
  const mtp = res.rows[0];
  const plans = await db.query('SELECT * FROM mtp_daily_plan WHERE mtp_id = $1 ORDER BY date ASC', [mtp.id]);
  
  return { ...mtp, dailyPlans: plans.rows };
};

export const getHistory = async (userId: string) => {
  const res = await db.query('SELECT id, month, year, status, submitted_at, approved_at FROM mtp WHERE user_id = $1 ORDER BY year DESC, month DESC', [userId]);
  return res.rows;
};

export const reviewMtp = async (managerId: string, mtpId: string, status: 'APPROVED' | 'REJECTED', remarks?: string) => {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    const existingRes = await client.query('SELECT status FROM mtp WHERE id = $1', [mtpId]);
    if (!existingRes.rowCount) throw new Error('MTP not found');
    
    if (existingRes.rows[0].status !== 'SUBMITTED') {
      throw new Error(`Cannot review MTP in ${existingRes.rows[0].status} status`);
    }

    const updateField = status === 'APPROVED' ? 'approved_by = $2, approved_at = CURRENT_TIMESTAMP' : 'rejected_by = $2';
    
    await client.query(
      `UPDATE mtp SET status = $1, remarks = $3, ${updateField}, updated_at = CURRENT_TIMESTAMP WHERE id = $4`,
      [status, managerId, remarks || null, mtpId]
    );

    await client.query(
      'INSERT INTO mtp_approval_history (mtp_id, status, acted_by, remarks) VALUES ($1, $2, $3, $4)',
      [mtpId, status, managerId, remarks || null]
    );

    await client.query('COMMIT');
    return { message: `MTP ${status.toLowerCase()} successfully` };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getMtpStatus = async (userId: string, month: number, year: number) => {
  const res = await db.query('SELECT id, status FROM mtp WHERE user_id = $1 AND month = $2 AND year = $3', [userId, month, year]);
  
  let status = res.rowCount ? res.rows[0].status : 'NOT_CREATED';
  let isDcrLocked = false;
  let isProvisionallyApproved = false;

  const now = new Date();
  
  // Provisional approval: 1st and 2nd of the month
  if (now.getDate() <= 2 && now.getMonth() + 1 === month && now.getFullYear() === year) {
    isProvisionallyApproved = true;
  }

  // Check deadline for DCR Lock
  if (status === 'NOT_CREATED' || status === 'DRAFT' || status === 'REJECTED') {
    const deadlineRes = await db.query(`SELECT value FROM global_settings WHERE key = 'MTP_SUBMISSION_DEADLINE'`);
    const deadlineDay = deadlineRes.rowCount ? parseInt(deadlineRes.rows[0].value) : 5;
    
    if (now.getDate() > deadlineDay && now.getMonth() + 1 === month && now.getFullYear() === year) {
      isDcrLocked = true;
    }
  }

  return {
    status,
    isDcrLocked,
    isProvisionallyApproved,
    mtpId: res.rowCount ? res.rows[0].id : null
  };
};

export const getCalendar = async (userId: string, month: number, year: number) => {
  const mtpRes = await db.query('SELECT id FROM mtp WHERE user_id = $1 AND month = $2 AND year = $3 AND status = $4', [userId, month, year, 'APPROVED']);
  
  if (!mtpRes.rowCount) {
    return []; // No approved MTP for this month
  }

  const plansRes = await db.query('SELECT date, work_type, location_type, doctor_ids, chemist_ids FROM mtp_daily_plan WHERE mtp_id = $1 ORDER BY date ASC', [mtpRes.rows[0].id]);
  return plansRes.rows;
};
