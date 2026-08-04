import { db } from '../../config/db.js';

export interface AddSalesInput {
  entityType: string;
  entityId: string;
  productId: string;
  entryDate: string;
  quantity: number;
  value: number;
  closingStock?: number;
}

export const addSecondarySales = async (userId: string, data: AddSalesInput) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
  const res = await client.query(`
    INSERT INTO secondary_sales (user_id, entity_type, entity_id, product_id, entry_date, quantity, value)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
  `, [userId, data.entityType, data.entityId, data.productId, data.entryDate, data.quantity, data.value]);


    if (data.closingStock !== undefined && data.closingStock >= 0) {
      await client.query(`
        INSERT INTO stock_inventory (entity_id, product_id, closing_stock, last_updated)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        ON CONFLICT (entity_id, product_id) DO UPDATE SET closing_stock = EXCLUDED.closing_stock, last_updated = CURRENT_TIMESTAMP
      `, [data.entityId, data.productId, data.closingStock]);
    }

    await client.query('COMMIT');
    return { salesId: res.rows[0].id, message: 'Sales entry added successfully' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getMySales = async (userId: string, limit = 50, offset = 0) => {
  const res = await db.query(
    'SELECT * FROM secondary_sales WHERE user_id = $1 ORDER BY entry_date DESC LIMIT $2 OFFSET $3',
    [userId, limit, offset]
  );
  return res.rows;
};

export const getSalesSummary = async (userId: string, month: number, year: number) => {
  const res = await db.query(`
    SELECT entity_type, SUM(quantity) as total_quantity, SUM(value) as total_value
    FROM secondary_sales
    WHERE user_id = $1 AND EXTRACT(MONTH FROM entry_date) = $2 AND EXTRACT(YEAR FROM entry_date) = $3
    GROUP BY entity_type
  `, [userId, month, year]);
  
  return res.rows;
};
