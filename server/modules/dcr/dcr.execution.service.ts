import { db } from '../../config/db.js';
import { getDistance } from '../../utils/geo.util.js';

export const checkIn = async (userId: string, data: any) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    
    // Validate DCR belongs to user and is DRAFT
    const dcrRes = await client.query('SELECT status FROM dcr WHERE id = $1 AND user_id = $2', [data.dcrId, userId]);
    if (!dcrRes.rowCount) throw new Error('DCR not found or unauthorized');
    if (dcrRes.rows[0].status !== 'DRAFT') throw new Error('Cannot modify non-draft DCR');

    // Geofence Validation
    const docRes = await client.query('SELECT latitude, longitude FROM doctors WHERE id = $1', [data.doctorId]);
    if (docRes.rowCount && docRes.rows[0].latitude && docRes.rows[0].longitude) {
      const dist = getDistance(data.lat, data.lng, parseFloat(docRes.rows[0].latitude), parseFloat(docRes.rows[0].longitude));
      if (dist > 50) {
        throw new Error(`Geofence validation failed. Distance is ${Math.round(dist)}m, max allowed is 50m`);
      }
    }

    const callRes = await client.query(`
      INSERT INTO dcr_doctor_calls (dcr_id, doctor_id, call_time, check_in_time, check_in_lat, check_in_lng)
      VALUES ($1, $2, $3, $3, $4, $5)
      RETURNING id
    `, [data.dcrId, data.doctorId, data.timestamp, data.lat, data.lng]);

    await client.query('COMMIT');
    return { callId: callRes.rows[0].id, message: 'Check-in successful' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const checkOut = async (userId: string, data: any) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    
    // Validate call
    const callRes = await client.query(`
      SELECT d.user_id, d.status, c.id, c.is_completed 
      FROM dcr_doctor_calls c
      JOIN dcr d ON c.dcr_id = d.id
      WHERE c.id = $1
    `, [data.callId]);
    
    if (!callRes.rowCount || callRes.rows[0].user_id !== userId) throw new Error('Call not found or unauthorized');
    if (callRes.rows[0].status !== 'DRAFT') throw new Error('DCR already submitted');
    if (callRes.rows[0].is_completed) throw new Error('Call already completed');

    await client.query(`
      UPDATE dcr_doctor_calls
      SET check_out_time = $1, check_out_lat = $2, check_out_lng = $3, 
          in_chamber_time = $4, feedback = $5, is_completed = true, remarks = $5
      WHERE id = $6
    `, [data.timestamp, data.lat, data.lng, data.inChamberTime || null, data.feedback || null, data.callId]);

    // Insert samples
    if (data.samples?.length) {
      for (const s of data.samples) {
        await client.query('INSERT INTO dcr_samples_given (call_id, product_id, quantity) VALUES ($1, $2, $3)', [data.callId, s.productId, s.quantity]);
      }
    }
    
    // Insert orders
    if (data.orders?.length) {
      for (const o of data.orders) {
        await client.query('INSERT INTO dcr_product_orders (call_id, product_id, quantity, amount) VALUES ($1, $2, $3, $4)', [data.callId, o.productId, o.quantity, o.amount || null]);
      }
    }
    
    // Insert prescriptions
    if (data.prescriptions?.length) {
      for (const p of data.prescriptions) {
        await client.query('INSERT INTO dcr_prescriptions (call_id, product_id, prescription_count) VALUES ($1, $2, $3)', [data.callId, p.productId, p.prescriptionCount]);
      }
    }

    await client.query('COMMIT');
    return { message: 'Call completed successfully' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const offlineSync = async (userId: string, data: any) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    
    const dcrRes = await client.query('SELECT status FROM dcr WHERE id = $1 AND user_id = $2', [data.dcrId, userId]);
    if (!dcrRes.rowCount) throw new Error('DCR not found');
    if (dcrRes.rows[0].status !== 'DRAFT') throw new Error('Cannot sync offline data to a non-draft DCR');

    for (const call of data.calls) {
      // Basic insert for offline call
      const callRes = await client.query(`
        INSERT INTO dcr_doctor_calls (
          dcr_id, doctor_id, call_time, check_in_time, check_out_time, 
          check_in_lat, check_in_lng, check_out_lat, check_out_lng,
          in_chamber_time, feedback, is_completed, remarks
        ) VALUES ($1, $2, $3, $3, $4, $5, $6, $7, $8, $9, $10, true, $10)
        RETURNING id
      `, [
        data.dcrId, call.doctorId, call.checkInTime, call.checkOutTime,
        call.checkInLat, call.checkInLng, call.checkOutLat, call.checkOutLng,
        call.inChamberTime || null, call.feedback || null
      ]);
      const callId = callRes.rows[0].id;

      if (call.samples?.length) {
        for (const s of call.samples) {
          await client.query('INSERT INTO dcr_samples_given (call_id, product_id, quantity) VALUES ($1, $2, $3)', [callId, s.productId, s.quantity]);
        }
      }
      if (call.orders?.length) {
        for (const o of call.orders) {
          await client.query('INSERT INTO dcr_product_orders (call_id, product_id, quantity, amount) VALUES ($1, $2, $3, $4)', [callId, o.productId, o.quantity, o.amount || null]);
        }
      }
      if (call.prescriptions?.length) {
        for (const p of call.prescriptions) {
          await client.query('INSERT INTO dcr_prescriptions (call_id, product_id, prescription_count) VALUES ($1, $2, $3)', [callId, p.productId, p.prescriptionCount]);
        }
      }
    }

    await client.query('COMMIT');
    return { message: 'Offline sync successful' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
