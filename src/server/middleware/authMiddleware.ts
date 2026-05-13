import { Request, Response, NextFunction } from 'express';
import { UserRole, Permission } from '../models/types';
import { RolePermissions } from '../constants/permissions';

// Extended Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      }
    }
  }
}

/**
 * Middleware to check if a user has a specific permission
 */
export const authorize = (permission: Permission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // In a real production app, we would verify JWT here
    // For this demo, we'll assume a 'role' header for quick testing
    const roleHeader = req.header('X-User-Role') as UserRole;
    const userId = req.header('X-User-Id') || 'demo-user-1';

    if (!roleHeader || !RolePermissions[roleHeader]) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: No valid role provided'
      });
    }

    // Attach user context to request
    req.user = { id: userId, role: roleHeader };

    const userPermissions = RolePermissions[roleHeader];
    
    if (userPermissions.includes(permission)) {
      return next();
    }

    return res.status(403).json({
      status: 'error',
      message: `Forbidden: Missing required permission [${permission}]`
    });
  };
};

/**
 * Middleware to check if a user is in a specific role
 */
export const requireRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const roleHeader = req.header('X-User-Role') as UserRole;

    if (!roleHeader || !roles.includes(roleHeader)) {
      return res.status(403).json({
        status: 'error',
        message: 'Forbidden: Insufficient role privileges'
      });
    }

    next();
  };
};
