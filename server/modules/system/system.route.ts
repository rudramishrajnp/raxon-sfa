import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/rbac.middleware.js';
import { db } from '../../config/db.js';

const router = Router();

router.use(authenticate);
router.use(authorize(['SUPER_ADMIN']));

router.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'healthy', db: 'connected', timestamp: new Date() });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', db: 'disconnected' });
  }
});

router.post('/backup', (req, res) => {
  // Mock backup
  res.json({ message: 'Backup triggered successfully' });
});

export default router;
