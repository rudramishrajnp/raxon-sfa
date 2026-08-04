import { db } from '../../config/db.js';

export const getDailyKPIs = async (date: string) => {
  const kpis = {
    totalCalls: 0,
    productiveCalls: 0, // Calls with prescriptions or orders
    totalSales: 0,
    attendanceCount: 0
  };

  const callsRes = await db.query(`
    SELECT COUNT(c.id) as total, 
           COUNT(c.id) FILTER (WHERE EXISTS (SELECT 1 FROM dcr_product_orders o WHERE o.call_id = c.id)) as productive
    FROM dcr_doctor_calls c
    JOIN dcr d ON c.dcr_id = d.id
    WHERE d.date = $1 AND c.is_completed = true
  `, [date]);
  
  if (callsRes.rowCount) {
    kpis.totalCalls = parseInt(callsRes.rows[0].total) || 0;
    kpis.productiveCalls = parseInt(callsRes.rows[0].productive) || 0;
  }

  const salesRes = await db.query('SELECT SUM(value) as total FROM secondary_sales WHERE entry_date = $1', [date]);
  kpis.totalSales = parseFloat(salesRes.rows[0].total || 0);

  const attRes = await db.query('SELECT COUNT(*) as total FROM attendance WHERE date = $1 AND status = \'PRESENT\'', [date]);
  kpis.attendanceCount = parseInt(attRes.rows[0].total || 0);

  return kpis;
};

export const getProductPerformance = async (month: number, year: number) => {
  const res = await db.query(`
    SELECT p.name, SUM(s.quantity) as total_quantity, SUM(s.value) as total_value
    FROM secondary_sales s
    JOIN products p ON s.product_id = p.id
    WHERE EXTRACT(MONTH FROM s.entry_date) = $1 AND EXTRACT(YEAR FROM s.entry_date) = $2
    GROUP BY p.id, p.name
    ORDER BY total_value DESC
  `, [month, year]);
  
  return res.rows;
};
