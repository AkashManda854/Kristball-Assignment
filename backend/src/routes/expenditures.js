import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRoles } from '../middleware/rbac.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  const where = {};
  if (req.user.role !== 'ADMIN' && req.user.baseId) {
    where.baseId = req.user.baseId;
  }

  const records = await prisma.expenditure.findMany({
    where,
    include: { equipment: true, base: true, user: true },
    orderBy: { date: 'desc' },
  });

  res.json(records);
});

router.post('/', authenticateToken, requireRoles('ADMIN', 'BASE_COMMANDER'), async (req, res) => {
  const { equipmentId, quantity, baseId, date } = req.body;
  if (req.user.role === 'BASE_COMMANDER' && Number(baseId) !== req.user.baseId) {
    return res.status(403).json({ message: 'Base commanders can only manage their own base' });
  }

  const created = await prisma.expenditure.create({
    data: {
      equipmentId: Number(equipmentId),
      quantity: Number(quantity),
      baseId: Number(baseId),
      date: date ? new Date(date) : new Date(),
      createdById: req.user.id,
    },
  });

  res.status(201).json(created);
});

export default router;
