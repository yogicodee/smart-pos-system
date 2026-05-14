import { UserRole } from '../models/types';

export interface AuditLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    module: string;
    details: string;
    timestamp: Date;
}
