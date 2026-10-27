'use strict';

const config = require('../config/app');
const authService = require('../services/authService');

/**
 * Admin authorization middleware (verifies x-admin-api-key, Bearer admin key, or Admin JWT)
 */
async function authMiddleware(req, res, next) {
  let apiKey = req.headers['x-admin-api-key'] || req.headers['x-api-key'];

  // Also support Authorization: Bearer <token>
  if (!apiKey && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      apiKey = parts[1];
    } else {
      apiKey = req.headers.authorization;
    }
  }

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Admin authorization required. Please provide a valid admin API key in the x-admin-api-key or Authorization header.',
        statusCode: 401
      }
    });
  }

  if (typeof apiKey === 'string') {
    apiKey = apiKey.trim();
  }

  // 1. Check direct admin API key
  if (apiKey === config.adminApiKey) {
    req.admin = {
      role: 'admin',
      authenticated: true,
      permissions: ['manage:tours', 'manage:categories', 'manage:events', 'manage:inquiries', 'manage:content', 'manage:users']
    };
    return next();
  }

  // 2. Check if valid admin JWT token
  try {
    const decoded = authService.verifyToken(apiKey);
    if (decoded && decoded.role === 'admin') {
      if (decoded.status === 'suspended') {
        return res.status(403).json({
          success: false,
          error: {
            message: 'Admin account is suspended. Access denied.',
            statusCode: 403
          }
        });
      }

      req.admin = {
        role: 'admin',
        authenticated: true,
        user: decoded,
        permissions: ['manage:tours', 'manage:categories', 'manage:events', 'manage:inquiries', 'manage:content', 'manage:users']
      };
      return next();
    }
  } catch (_) {
    // Not a valid admin JWT
  }

  return res.status(403).json({
    success: false,
    error: {
      message: 'Invalid admin credentials. Access forbidden.',
      statusCode: 403
    }
  });
}

/**
 * Middleware to block suspended users from accessing public routes
 * If token is provided and belongs to a suspended user, reject with 403
 */
async function blockSuspendedUsers(req, res, next) {
  try {
    let token = req.headers['x-admin-api-key'] || req.headers['x-api-key'] || req.headers['x-user-token'];
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
        token = parts[1];
      } else {
        token = req.headers.authorization;
      }
    }

    if (!token || typeof token !== 'string') {
      return next();
    }

    token = token.trim();
    if (token === config.adminApiKey) {
      return next();
    }

    try {
      const decoded = authService.verifyToken(token);
      if (decoded && decoded.status === 'suspended') {
        return res.status(403).json({
          success: false,
          error: {
            message: 'Account is suspended. You cannot access any public routes.',
            statusCode: 403,
            code: 'ACCOUNT_SUSPENDED'
          }
        });
      }

      // Check DB in case user was suspended after token generation
      if (decoded && (decoded.id || decoded.email)) {
        const { User } = require('../models');
        const dbUser = decoded.id
          ? await User.findByPk(decoded.id)
          : await User.findOne({ where: { email: decoded.email } });

        if (dbUser && dbUser.status === 'suspended') {
          return res.status(403).json({
            success: false,
            error: {
              message: 'Account is suspended. You cannot access any public routes.',
              statusCode: 403,
              code: 'ACCOUNT_SUSPENDED'
            }
          });
        }
      }
    } catch (_) {
      // Invalid token handled downstream by protected route or passed through for public views
    }

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Require valid authentication (admin API key or user/guest JWT)
 */
async function requireAuth(req, res, next) {
  try {
    const identity = await authService.parseSessionIdentity(req.headers);

    if (!identity.authenticated) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Authentication required. Please provide a valid Bearer token or admin key.',
          statusCode: 401
        }
      });
    }

    if (identity.status === 'suspended' || (identity.user && identity.user.status === 'suspended')) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Account is suspended. You cannot access this service.',
          statusCode: 403,
          code: 'ACCOUNT_SUSPENDED'
        }
      });
    }

    if (identity.role === 'admin') {
      req.admin = identity;
      req.user = identity.user || { role: 'admin' };
    } else {
      req.user = identity.user;
      req.userRole = identity.role;
      req.userStatus = identity.status;
    }

    next();
  } catch (err) {
    return res.status(err.statusCode || 401).json({
      success: false,
      error: {
        message: err.message || 'Invalid or expired authentication token',
        statusCode: err.statusCode || 401
      }
    });
  }
}

/**
 * Require active verified user (blocks inactive guests until OTP verification)
 */
async function requireActiveUser(req, res, next) {
  try {
    const identity = await authService.parseSessionIdentity(req.headers);

    if (!identity.authenticated) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Authentication required. Please log in.',
          statusCode: 401
        }
      });
    }

    if (identity.status === 'suspended' || (identity.user && identity.user.status === 'suspended')) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Account is suspended. You cannot access this service.',
          statusCode: 403,
          code: 'ACCOUNT_SUSPENDED'
        }
      });
    }

    if (identity.role === 'admin') {
      req.admin = identity;
      return next();
    }

    if (identity.status === 'inactive' || identity.role === 'guest') {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Account is unverified. Please verify your OTP email to activate your account.',
          statusCode: 403,
          code: 'UNVERIFIED_ACCOUNT'
        }
      });
    }

    req.user = identity.user;
    req.userRole = identity.role;
    req.userStatus = identity.status;
    next();
  } catch (err) {
    return res.status(err.statusCode || 401).json({
      success: false,
      error: {
        message: err.message || 'Authentication error',
        statusCode: err.statusCode || 401
      }
    });
  }
}

/**
 * Optional authentication: attaches req.user if present, but never blocks
 */
async function optionalAuth(req, res, next) {
  try {
    const identity = await authService.parseSessionIdentity(req.headers);
    if (identity.authenticated) {
      if (identity.status === 'suspended' || (identity.user && identity.user.status === 'suspended')) {
        return res.status(403).json({
          success: false,
          error: {
            message: 'Account is suspended. You cannot access any public routes.',
            statusCode: 403,
            code: 'ACCOUNT_SUSPENDED'
          }
        });
      }
      req.user = identity.user || (identity.role === 'admin' ? { role: 'admin' } : null);
      req.userRole = identity.role;
      req.userStatus = identity.status;
    }
    next();
  } catch (err) {
    if (err.statusCode === 403) {
      return res.status(403).json({
        success: false,
        error: {
          message: err.message || 'Account is suspended.',
          statusCode: 403
        }
      });
    }
    // Continue as guest
    next();
  }
}

// Export authMiddleware as primary function, with attached methods and named exports
authMiddleware.authMiddleware = authMiddleware;
authMiddleware.adminAuth = authMiddleware;
authMiddleware.requireAuth = requireAuth;
authMiddleware.requireActiveUser = requireActiveUser;
authMiddleware.optionalAuth = optionalAuth;
authMiddleware.blockSuspendedUsers = blockSuspendedUsers;

module.exports = authMiddleware;
module.exports.authMiddleware = authMiddleware;
module.exports.adminAuth = authMiddleware;
module.exports.requireAuth = requireAuth;
module.exports.requireActiveUser = requireActiveUser;
module.exports.optionalAuth = optionalAuth;
module.exports.blockSuspendedUsers = blockSuspendedUsers;
