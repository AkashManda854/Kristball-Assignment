import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRoles } from '../middleware/rbac.js';
import { buildDashboardRows } from '../utils/dashboard.js';

const router = express.Router();

router.get('/', authenticateToken, requireRoles('ADMIN', 'BASE_COMMANDER'), async (req, res) => {
  const [purchases, transfers, assignments, expenditures, bases, equipment] = await Promise.all([
    prisma.purchase.findMany(),
    prisma.transfer.findMany(),
    prisma.assignment.findMany(),
    prisma.expenditure.findMany(),
    prisma.base.findMany({ orderBy: { name: 'asc' } }),
    prisma.equipment.findMany({ orderBy: { name: 'asc' } }),
  ]);

  const baseId = req.user.role === 'BASE_COMMANDER' ? req.user.baseId : req.query.baseId;
  const summary = buildDashboardRows({
    purchases,
    transfers,
    assignments,
    expenditures,
    baseId,
    equipmentId: req.query.equipmentId,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
  });

  res.json({
    filters: { bases, equipment },
    summary,
  });
});

export default router;
