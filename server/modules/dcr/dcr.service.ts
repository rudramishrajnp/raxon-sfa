import { db } from '../../config/db.js';

export interface SampleGiven {
  productId: string;
  quantity: number;
}

export interface DoctorCall {
  doctorId: string;
  callTime: string;
  inChamberTime?: number;
  remarks?: string;
  samples?: SampleGiven[];
}

export interface SaveDcrInput {
  date: string;
  workType: string;
  remarks?: string;
  doctorCalls: DoctorCall[];
}

export const saveDraft = async (userId: string, data: SaveDcrInput) => {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    // Check existing DCR
    const existingRes = await client.query('SELECT id, status FROM dcr WHERE user_id = $1 AND date = $2', [userId, data.date]);
    
    let dcrId;

    if (existingRes.rowCount && existingRes.rowCount > 0) {
      const existing = existingRes.rows[0];
      if (['SUBMITTED', 'APPROVED'].includes(existing.status)) {
        throw new Error(`Cannot modify DCR in ${existing.status} status`);
      }
      dcrId = existing.id;
      // Delete existing calls (Cascade will handle samples)
      await client.query('DELETE FROM dcr_doctor_calls WHERE dcr_id = $1', [dcrId]);
      
      await client.query(
        'UPDATE dcr SET work_type = $1, remarks = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        [data.workType, data.remarks || null, dcrId]
      );
    } else {
      const dcrRes = await client.query(
        'INSERT INTO dcr (user_id, date, work_type, remarks, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [userId, data.date, data.workType, data.remarks || null, 'DRAFT']
      );
      dcrId = dcrRes.rows[0].id;
    }

    // Insert new calls and samples
    for (const call of data.doctorCalls) {
      const callRes = await client.query(
        'INSERT INTO dcr_doctor_calls (dcr_id, doctor_id, call_time, in_chamber_time, remarks) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [dcrId, call.doctorId, call.callTime, call.inChamberTime || null, call.remarks || null]
      );
      
      const callId = callRes.rows[0].id;
      
      if (call.samples && call.samples.length > 0) {
        const values: any[] = [];
        const placeholders: string[] = [];
        call.samples.forEach((sample, idx) => {
          const offset = idx * 3;
          placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3})`);
          values.push(callId, sample.productId, sample.quantity);
        });
        
        await client.query(
          `INSERT INTO dcr_samples_given (call_id, product_id, quantity) VALUES ${placeholders.join(', ')}`,
          values
        );
      }
    }

    await client.query('COMMIT');
    return { dcrId, message: 'DCR draft saved successfully' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const submitDcr = async (userId: string, date: string) => {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    // Cannot submit future DCR
    if (new Date(date) > new Date()) {
      throw new Error('Cannot submit DCR for a future date');
    }

    const existingRes = await client.query('SELECT id, status FROM dcr WHERE user_id = $1 AND date = $2', [userId, date]);
    
    if (!existingRes.rowCount) {
      throw new Error('DCR not found. Save draft first.');
    }
    
    if (['SUBMITTED', 'APPROVED'].includes(existingRes.rows[0].status)) {
      throw new Error(`DCR is already ${existingRes.rows[0].status}`);
    }

    await client.query(
      'UPDATE dcr SET status = $1, submitted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['SUBMITTED', existingRes.rows[0].id]
    );

    await client.query('COMMIT');
    return { message: 'DCR submitted successfully' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getDcr = async (userId: string, date: string) => {
  const dcrRes = await db.query('SELECT * FROM dcr WHERE user_id = $1 AND date = $2', [userId, date]);
  if (!dcrRes.rowCount) return null;
  
  const dcr = dcrRes.rows[0];
  const callsRes = await db.query('SELECT * FROM dcr_doctor_calls WHERE dcr_id = $1 ORDER BY call_time ASC', [dcr.id]);
  
  const doctorCalls = await Promise.all(callsRes.rows.map(async (call) => {
    const samplesRes = await db.query('SELECT product_id as "productId", quantity FROM dcr_samples_given WHERE call_id = $1', [call.id]);
    return {
      ...call,
      samples: samplesRes.rows
    };
  }));

  return { ...dcr, doctorCalls };
};

export const getDcrHistory = async (userId: string, limit = 30, offset = 0) => {
  const res = await db.query('SELECT id, date, work_type, status, submitted_at FROM dcr WHERE user_id = $1 ORDER BY date DESC LIMIT $2 OFFSET $3', [userId, limit, offset]);
  return res.rows;
};
