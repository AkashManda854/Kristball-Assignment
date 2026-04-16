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
  if (req.query.baseId) {
    where.baseId = Number(req.query.baseId);
  }
  if (req.query.equipmentId) {
    where.equipmentId = Number(req.query.equipmentId);
  }
  if (req.query.startDate || req.query.endDate) {
    where.date = {};
    if (req.query.startDate) where.date.gte = new Date(req.query.startDate);
    if (req.query.endDate) where.date.lte = new Date(req.query.endDate);
  }

  const purchases = await prisma.purchase.findMany({
    where,
    include: { equipment: true, base: true, user: true },
    orderBy: { date: 'desc' },
  });

  res.json(purchases);
});

router.post('/', authenticateToken, requireRoles('ADMIN', 'LOGISTICS_OFFICER'), async (req, res) => {
  const { equipmentId, quantity, baseId, date } = req.body;
  const created = await prisma.purchase.create({
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
