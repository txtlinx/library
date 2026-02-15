import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: {
    userId?: number | null;
    action: string;
    entity: string;
    entityId?: string | null;
    metadata?: Record<string, unknown> | null;
  }) {
    try {
      await (this.prisma as any).activityLog.create({
        data: {
          userId: params.userId ?? null,
          action: params.action,
          entity: params.entity,
          entityId: params.entityId ?? null,
          metadata: params.metadata ?? null,
        },
      });
    } catch {
      // no bloquear request por fallar auditoria
    }
  }

  list(limit = 100) {
    return (this.prisma as any).activityLog.findMany({
      take: Math.max(1, Math.min(500, Number(limit) || 100)),
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, email: true, role: true } } },
    });
  }

  async clearAll() {
    const result = await (this.prisma as any).activityLog.deleteMany({});
    return { ok: true, deleted: Number(result?.count || 0) };
  }

  async removeOne(id: number) {
    await (this.prisma as any).activityLog.delete({ where: { id } });
    return { ok: true };
  }
}
