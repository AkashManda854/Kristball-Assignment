import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRoles } from '../middleware/rbac.js';

const router = express.Router();

router.get('/', authenticateToken, requireRoles('ADMIN'), async (_req, res) => {
  const logs = await prisma.log.findMany({
    include: { user: true },
    orderBy: { timestamp: 'desc' },
  });

  res.json(logs);
});

export default router;
