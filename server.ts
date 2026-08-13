import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Serve static frontend files from dist/ if built
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
    if (err) {
      res.status(200).send('RAXON SFA Server Running on Port 3000');
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`RAXON SFA Server running on http://0.0.0.0:${PORT}`);
});
