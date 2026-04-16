import { prisma } from '../lib/prisma.js';

export function apiLogger(req, res, next) {
  const startedAt = Date.now();

  res.on('finish', async () => {
    if (!req.user) {
      return;
    }

    const action = `${req.method} ${req.originalUrl}`;
    const endpoint = req.baseUrl ? `${req.baseUrl}${req.path}` : req.path;

    try {
      await prisma.log.create({
        data: {
          userId: req.user.id,
          action,
          endpoint,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error('Failed to persist API log', error, { action, startedAt });
    }
  });

  next();
}
