import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRoles } from '../middleware/rbac.js';

const router = express.Router();

router.get('/', authenticateToken, requireRoles('ADMIN'), async (_req, res) => {
  const bases = await prisma.base.findMany({ orderBy: { name: 'asc' } });
  return res.json(bases);
});

router.post('/', authenticateToken, requireRoles('ADMIN'), async (req, res) => {
  const { name, location } = req.body;
  const base = await prisma.base.create({ data: { name, location } });
  return res.status(201).json(base);
});

export default router;
