const { verifyToken } = require('../controllers/authController');

exports.authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No session token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ error: 'Authentication failed', details: err.message });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden. You do not have permissions to perform this action.',
        requiredRoles: roles,
        yourRole: req.user.role
      });
    }

    next();
  };
};
