import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import baseRoutes from './routes/base.js';
import equipmentRoutes from './routes/equipment.js';
import purchaseRoutes from './routes/purchases.js';
import transferRoutes from './routes/transfers.js';
import assignmentRoutes from './routes/assignments.js';
import expenditureRoutes from './routes/expenditures.js';
import dashboardRoutes from './routes/dashboard.js';
import logRoutes from './routes/logs.js';
import { apiLogger } from './middleware/logger.js';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(apiLogger);

app.get('/', (_req, res) => res.send('Backend is running'));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/bases', baseRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/expenditures', expenditureRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/logs', logRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
