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

  const assignments = await prisma.assignment.findMany({
    where,
    include: { equipment: true, base: true, user: true },
    orderBy: { date: 'desc' },
  });

  res.json(assignments);
});

router.post('/', authenticateToken, requireRoles('ADMIN', 'BASE_COMMANDER'), async (req, res) => {
  const { personnelName, equipmentId, quantity, baseId, date } = req.body;
  if (req.user.role === 'BASE_COMMANDER' && Number(baseId) !== req.user.baseId) {
    return res.status(403).json({ message: 'Base commanders can only manage their own base' });
  }

  const created = await prisma.assignment.create({
    data: {
      personnelName,
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
