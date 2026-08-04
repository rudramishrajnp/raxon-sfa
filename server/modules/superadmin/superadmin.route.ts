import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/rbac.middleware.js';
import { db } from '../../config/db.js';

const router = Router();

router.use(authenticate);
router.use(authorize(['SUPER_ADMIN']));

router.get('/settings', async (req, res) => {
  const settings = await db.query('SELECT * FROM global_settings');
  res.json({ settings: settings.rows });
});

router.post('/settings', async (req, res) => {
  const { key, value } = req.body;
  await db.query(
    'INSERT INTO global_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP',
    [key, JSON.stringify(value)]
  );
  res.json({ message: 'Setting updated' });
});

router.get('/audit-logs', async (req, res) => {
  const logs = await db.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100');
  res.json({ logs: logs.rows });
});

export default router;
