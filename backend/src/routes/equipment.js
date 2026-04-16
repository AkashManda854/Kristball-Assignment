import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRoles } from '../middleware/rbac.js';

const router = express.Router();

router.get('/', authenticateToken, async (_req, res) => {
  const equipment = await prisma.equipment.findMany({ orderBy: { name: 'asc' } });
  res.json(equipment);
});

router.post('/', authenticateToken, requireRoles('ADMIN'), async (req, res) => {
  const { name, type } = req.body;
  const created = await prisma.equipment.create({ data: { name, type } });
  res.status(201).json(created);
});

export default router;
