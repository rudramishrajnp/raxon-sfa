import { db } from '../../config/db.js';

export interface UpdateStockInput {
  productId: string;
  month: number;
  year: number;
  openingStock?: number;
  closingStock?: number;
}

export const updateStock = async (userId: string, data: UpdateStockInput) => {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');

    const existRes = await client.query(
      'SELECT id, opening_stock, closing_stock FROM user_stocks WHERE user_id = $1 AND product_id = $2 AND month = $3 AND year = $4 FOR UPDATE',
      [userId, data.productId, data.month, data.year]
    );

    let stockId;

    if (existRes.rowCount) {
      stockId = existRes.rows[0].id;
      const newOpening = data.openingStock !== undefined ? data.openingStock : existRes.rows[0].opening_stock;
      const newClosing = data.closingStock !== undefined ? data.closingStock : existRes.rows[0].closing_stock;
      
      await client.query(
        'UPDATE user_stocks SET opening_stock = $1, closing_stock = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        [newOpening, newClosing, stockId]
      );
    } else {
      const insertRes = await client.query(
        'INSERT INTO user_stocks (user_id, product_id, month, year, opening_stock, closing_stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [userId, data.productId, data.month, data.year, data.openingStock || 0, data.closingStock || 0]
      );
      stockId = insertRes.rows[0].id;
    }

    await client.query('COMMIT');
    return { stockId, message: 'Stock updated successfully' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getMyStocks = async (userId: string, month: number, year: number) => {
  const res = await db.query(
    'SELECT s.*, p.name as product_name FROM user_stocks s JOIN products p ON s.product_id = p.id WHERE s.user_id = $1 AND s.month = $2 AND s.year = $3',
    [userId, month, year]
  );
  return res.rows;
};
