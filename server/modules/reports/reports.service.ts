import { db } from '../../config/db.js';

export const getDailyDCRReport = async (date: string) => {
  const res = await db.query(`
    SELECT d.id, u.name as user_name, d.date, d.status, COUNT(c.id) as calls_count
    FROM dcr d
    JOIN users u ON d.user_id = u.id
    LEFT JOIN dcr_doctor_calls c ON d.id = c.dcr_id
    WHERE d.date = $1
    GROUP BY d.id, u.name, d.date, d.status
  `, [date]);
  return res.rows;
};

export const getAttendanceReport = async (startDate: string, endDate: string) => {
  const res = await db.query(`
    SELECT a.id, u.name, a.date, a.status, a.check_in_time, a.check_out_time
    FROM attendance a
    JOIN users u ON a.user_id = u.id
    WHERE a.date >= $1 AND a.date <= $2
    ORDER BY a.date DESC
  `, [startDate, endDate]);
  return res.rows;
};

export const getExpenseReport = async (month: number, year: number) => {
  const res = await db.query(`
    SELECT e.id, u.name, e.date, e.location_type, e.ta, e.da, e.misc, e.total, e.status
    FROM expenses e
    JOIN users u ON e.user_id = u.id
    WHERE EXTRACT(MONTH FROM e.date) = $1 AND EXTRACT(YEAR FROM e.date) = $2
    ORDER BY e.date DESC
  `, [month, year]);
  return res.rows;
};

export const getSecondarySalesReport = async (startDate: string, endDate: string) => {
  const res = await db.query(`
    SELECT s.id, u.name as user_name, p.name as product_name, s.entity_type, s.entry_date, s.quantity, s.value
    FROM secondary_sales s
    JOIN users u ON s.user_id = u.id
    JOIN products p ON s.product_id = p.id
    WHERE s.entry_date >= $1 AND s.entry_date <= $2
    ORDER BY s.entry_date DESC
  `, [startDate, endDate]);
  return res.rows;
};

export const getStockReport = async (month: number, year: number) => {
  const res = await db.query(`
    SELECT s.id, u.name as user_name, p.name as product_name, s.month, s.year, s.opening_stock, s.closing_stock
    FROM user_stocks s
    JOIN users u ON s.user_id = u.id
    JOIN products p ON s.product_id = p.id
    WHERE s.month = $1 AND s.year = $2
    ORDER BY u.name ASC
  `, [month, year]);
  return res.rows;
};
