import { prisma } from '../config/db';

export async function writeAuditLog(params: {
  actorId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metaJson?: Record<string, unknown>;
}) {
  const { actorId, action, entityType, entityId, metaJson } = params;
  try {
    await prisma.auditLog.create({
      data: { actorId, action, entityType, entityId, metaJson: metaJson as any },
    });
  } catch {
    // swallow audit errors
  }
}


