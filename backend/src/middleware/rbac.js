export function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (allowedRoles.length === 0 || allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({ message: 'Forbidden' });
  };
}

export function scopeToBase(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.user.role === 'ADMIN') {
    return next();
  }

  if (req.user.baseId && req.query.baseId && Number(req.query.baseId) !== req.user.baseId) {
    return res.status(403).json({ message: 'You can only access your assigned base' });
  }

  if (req.user.baseId && !req.query.baseId) {
    req.query.baseId = String(req.user.baseId);
  }

  next();
}
