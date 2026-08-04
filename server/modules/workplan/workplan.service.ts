import { db } from '../../config/db.js';

export const submitDeviation = async (userId: string, data: any) => {
  const res = await db.query(
    `INSERT INTO deviations (user_id, date, customer_id, customer_name, reason, remarks)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, data.date, data.customerId || null, data.customerName || null, data.reason, data.remarks || null]
  );
  return res.rows[0];
};

export const submitJointWork = async (userId: string, data: any) => {
  const res = await db.query(
    `INSERT INTO joint_work (user_id, date, manager_id, manager_name)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, data.date, data.managerId, data.managerName]
  );
  return res.rows[0];
};
