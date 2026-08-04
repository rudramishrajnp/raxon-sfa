import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { env } from './config/env.js';
import { setupSwagger } from './config/swagger.js';
import { initFirebase } from './config/firebase.js';

import authRoutes from './modules/auth/auth.route.js';
import attendanceRoutes from './modules/attendance/attendance.route.js';
import mtpRoutes from './modules/mtp/mtp.route.js';
import masterRoutes from './modules/master/master.route.js';
import workPlanRoutes from './modules/workplan/workplan.route.js';
import dcrRoutes from './modules/dcr/dcr.route.js';
import leaveRoutes from './modules/leave/leave.route.js';
import expenseRoutes from './modules/expense/expense.route.js';
import salesRoutes from './modules/sales/sales.route.js';
import stockRoutes from './modules/stock/stock.route.js';
import dashboardRoutes from './modules/dashboard/dashboard.route.js';
import reportsRoutes from './modules/reports/reports.route.js';
import analyticsRoutes from './modules/analytics/analytics.route.js';
import notificationsRoutes from './modules/notifications/notifications.route.js';
import chatRoutes from './modules/chat/chat.route.js';
import adminRoutes from './modules/admin/admin.route.js';
import superAdminRoutes from './modules/superadmin/superadmin.route.js';
import systemRoutes from './modules/system/system.route.js';
import { initDatabase } from './db/initDb.js';

async function startServer() {
  const app = express();
  const PORT = parseInt(env.PORT, 10);

  // Initialize Database schemas & default Super Admin
  await initDatabase().catch((err) => {
    console.error('Database initialization warning:', err);
  });

  // Security Middlewares
  app.use(helmet({ contentSecurityPolicy: false })); // Disabled CSP for Vite dev server compatibility
  app.use(compression());
  
  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: 'Too many requests, please try again later.'
  });
  app.use('/api/', limiter);

  app.use(cors());
  app.use(express.json());

  // Initialize Firebase
  initFirebase();

  // Setup Swagger API Documentation
  setupSwagger(app);

  // API Routes
  app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));
  
  app.use('/api/auth', authRoutes);
  app.use('/api/attendance', attendanceRoutes);
  app.use('/api/mtp', mtpRoutes);
  app.use('/api/master', masterRoutes);
  app.use('/api/work-plan', workPlanRoutes);
  app.use('/api/dcr', dcrRoutes);
  app.use('/api/leave', leaveRoutes);
  app.use('/api/expense', expenseRoutes);
  app.use('/api/sales', salesRoutes);
  app.use('/api/stock', stockRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/reports', reportsRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/notifications', notificationsRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/superadmin', superAdminRoutes);
  app.use('/api/system', systemRoutes);
  
  // Serve static uploads
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist', 'public');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
