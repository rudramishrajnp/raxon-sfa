import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/rbac.middleware.js';
import { db } from '../../config/db.js';

const router = Router();

router.use(authenticate);
router.use(authorize(['ADMIN', 'SUPER_ADMIN']));

router.get('/users', async (req, res) => {
  const users = await db.query('SELECT id, name, email, role, is_active FROM users');
  res.json({ users: users.rows });
});

router.put('/users/:id/status', async (req, res) => {
  const { isActive } = req.body;
  await db.query('UPDATE users SET is_active = $1 WHERE id = $2', [isActive, req.params.id]);
  res.json({ message: 'User status updated' });
});

router.get('/territories', async (req, res) => {
  const territories = await db.query('SELECT * FROM territories');
  res.json({ territories: territories.rows });
});

export default router;
