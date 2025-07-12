import jwt from 'jsonwebtoken';
import User from '../models/user.js';

/**
 * Protects routes by verifying JWT and checking user roles.
 * This single middleware replaces the separate 'authenticate' and 'protect' functions.
 * @param {string[]} roles - Optional array of roles to allow. If empty, allows any authenticated user.
 */
export const protect = (roles = []) => async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: You do not have the required role' });
      }

      next();
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const hasPermission = (userIdParam) => (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.id === req.params[userIdParam])) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
};
