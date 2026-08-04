#!/bin/bash
cat << 'INNER_EOF' > /tmp/sales.js
const fs = require('fs');
let code = fs.readFileSync('server/modules/sales/sales.service.ts', 'utf8');

code = code.replace(
  "export const addSecondarySales = async (userId: string, data: AddSalesInput) => {",
  `export const addSecondarySales = async (userId: string, data: AddSalesInput) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');`
);

code = code.replace(
  "const res = await db.query(`",
  "const res = await client.query(`"
);

code = code.replace(
  "  return { salesId: res.rows[0].id, message: 'Sales entry added successfully' };\n};",
  `
    if (data.closingStock !== undefined && data.closingStock >= 0) {
      await client.query(\`
        INSERT INTO stock_inventory (entity_id, product_id, closing_stock, last_updated)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        ON CONFLICT (entity_id, product_id) DO UPDATE SET closing_stock = EXCLUDED.closing_stock, last_updated = CURRENT_TIMESTAMP
      \`, [data.entityId, data.productId, data.closingStock]);
    }

    await client.query('COMMIT');
    return { salesId: res.rows[0].id, message: 'Sales entry added successfully' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};`
);

fs.writeFileSync('server/modules/sales/sales.service.ts', code);
INNER_EOF
node /tmp/sales.js
