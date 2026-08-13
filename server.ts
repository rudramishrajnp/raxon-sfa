import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Auth Route
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    res.json({
      status: 'success',
      user: {
        id: '1',
        name: 'Pradeep Mishra',
        email: email,
        role: 'super_admin',
        token: 'jwt_raxon_sfa_token_2026'
      }
    });
  });

  // API DCR Status Route
  app.get('/api/dcr/summary', (req, res) => {
    res.json({
      totalCalls: 10,
      completedCalls: 7,
      pobTotalValue: 128000,
      gpsGeofenceActive: true
    });
  });

  // API System Health
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      system: 'RAXON SFA Server',
      timestamp: new Date().toISOString()
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static frontend files from dist/ if built
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RAXON SFA Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
