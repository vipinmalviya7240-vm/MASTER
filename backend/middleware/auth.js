import jwt from 'jsonwebtoken';
import { adminAuth } from '../config/firebase.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'smartxsecretjwttokengeneratorforthefuture';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access Denied. Authorization Bearer Token is missing.'
      });
    }

    // High fidelity test bypass for development
    if (token === 'mock-jwt-token-xyz') {
      req.user = {
        uid: 'mock_uid_12345',
        email: 'nikita@smartx.ai',
        role: 'user'
      };
      return next();
    }

    try {
      // 1. Attempt to verify via Firebase Admin Token verification
      const decodedFirebase = await adminAuth.verifyIdToken(token);
      req.user = {
        uid: decodedFirebase.uid,
        email: decodedFirebase.email,
        role: decodedFirebase.role || 'user'
      };
      return next();
    } catch (firebaseErr) {
      // 2. Fallback: Attempt custom JWT verification
      try {
        const decodedJwt = jwt.verify(token, JWT_SECRET);
        req.user = {
          uid: decodedJwt.uid,
          email: decodedJwt.email,
          role: decodedJwt.role || 'user'
        };
        return next();
      } catch (jwtErr) {
        return res.status(401).json({
          success: false,
          message: 'Access Denied. Provided Authorization Token is invalid or expired.',
          errors: { firebase: firebaseErr.message, jwt: jwtErr.message }
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal Auth Middleware execution error.',
      error: err.message
    });
  }
};

// Middleware supporting role-based access authorization check
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user?.role || 'anonymous'}' is not authorized to execute this command.`
      });
    }
    next();
  };
};
