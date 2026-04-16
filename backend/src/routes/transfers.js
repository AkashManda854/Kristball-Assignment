import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRoles } from '../middleware/rbac.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  const where = {};
  if (req.user.role !== 'ADMIN' && req.user.baseId) {
    where.OR = [{ fromBaseId: req.user.baseId }, { toBaseId: req.user.baseId }];
  }
  if (req.query.baseId) {
    const baseId = Number(req.query.baseId);
    where.OR = [{ fromBaseId: baseId }, { toBaseId: baseId }];
  }

  const transfers = await prisma.transfer.findMany({
    where,
    include: { equipment: true, fromBase: true, toBase: true, user: true },
    orderBy: { date: 'desc' },
  });

  res.json(transfers);
});

router.post('/', authenticateToken, requireRoles('ADMIN', 'LOGISTICS_OFFICER'), async (req, res) => {
  const { fromBaseId, toBaseId, equipmentId, quantity, date } = req.body;
  const created = await prisma.transfer.create({
    data: {
      fromBaseId: Number(fromBaseId),
      toBaseId: Number(toBaseId),
      equipmentId: Number(equipmentId),
      quantity: Number(quantity),
      date: date ? new Date(date) : new Date(),
      createdById: req.user.id,
    },
  });

  res.status(201).json(created);
});

export default router;
