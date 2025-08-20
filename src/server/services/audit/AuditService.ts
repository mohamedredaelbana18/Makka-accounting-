import { prisma } from '@/server/db/prisma';

export class AuditService {
  static async log(params: { userId: string; action: string; entity: string; entityId?: string; details?: any }) {
    return prisma.auditLog.create({ data: { ...params } });
  }
}

