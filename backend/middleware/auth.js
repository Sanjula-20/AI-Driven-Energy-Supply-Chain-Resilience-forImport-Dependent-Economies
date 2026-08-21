const jwt = require('jsonwebtoken');

/**
 * Verifies the Bearer JWT on the request and attaches { id, role, email } to req.user.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Missing or malformed Authorization header.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

/**
 * Restricts a route to a set of roles. Use after requireAuth.
 * Example: router.post('/', requireAuth, requireRole('ADMIN', 'ANALYST'), handler)
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions for this action.' });
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole };
