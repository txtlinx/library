import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from '../dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTaskDto) {
    const prismaAny = this.prisma as any;
    const startDate = new Date(dto.startAt);
    if (isNaN(startDate.getTime())) throw new BadRequestException('startAt inválido');
    const now = new Date();
    if (startDate.getTime() < now.getTime()) throw new BadRequestException('startAt no puede estar en el pasado');

    // Si la fecha aún no ha ocurrido, mantener en PAUSED
    const initialStatus = startDate.getTime() > now.getTime() ? 'PAUSED' : (dto.status || 'IN_PROGRESS');

    const created = await prismaAny.taskEntry.create({
      data: {
        title: dto.title,
        description: dto.description,
        startAt: startDate,
        durationMinutes: dto.durationMinutes,
        tags: dto.tags.join(','),
        status: initialStatus,
      },
    });
    return this.findOne(created.id);
  }

  async findAll() {
    const prismaAny = this.prisma as any;
    const results = await prismaAny.taskEntry.findMany({ orderBy: { createdAt: 'desc' } });

    // Auto-transiciones por tiempo:
    // - PAUSED y dentro de su ventana => IN_PROGRESS
    // - PAUSED fuera de ventana (pasada) => STOPPED
    // - IN_PROGRESS cuyo tiempo terminó => STOPPED
    const now = Date.now();
    const toProgressIds: number[] = [];
    const toStopIds: number[] = [];
    results.forEach(r => {
      if (!r.startAt) return;
      const startMs = new Date(r.startAt).getTime();
      const endMs = startMs + Number(r.durationMinutes || 0) * 60_000;
      if (r.status === 'PAUSED') {
        if (now >= startMs && now < endMs) toProgressIds.push(r.id);
        else if (now >= endMs) toStopIds.push(r.id);
      } else if (r.status === 'IN_PROGRESS') {
        if (now >= endMs) toStopIds.push(r.id);
      } else if (r.status !== 'COMPLETED' && r.status !== 'STOPPED') {
        const startMs = new Date(r.startAt).getTime();
        if (now >= startMs) toProgressIds.push(r.id);
      }
    });    
    if (toProgressIds.length > 0 || toStopIds.length > 0) {
      await Promise.all(
        [
          ...toProgressIds.map(id => prismaAny.taskEntry.update({ where: { id }, data: { status: 'IN_PROGRESS' } })),
          ...toStopIds.map(id => prismaAny.taskEntry.update({ where: { id }, data: { status: 'STOPPED' } })),
        ]
      );
      // Recargar resultados para reflejar cambios
      const refreshed = await prismaAny.taskEntry.findMany({ orderBy: { createdAt: 'desc' } });
      return refreshed.map(r => ({
        ...r,
        tags: r.tags ? r.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      }));
    }

    return results.map(r => ({
      ...r,
      tags: r.tags ? r.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    }));
  }

  async findByTag(tag: string) {
    if (!tag) return [];
    const searchTags = String(tag)
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    const prismaAny = this.prisma as any;
    const all = await prismaAny.taskEntry.findMany({ orderBy: { createdAt: 'desc' } });

    const filtered = all.filter(r => {
      if (!r.tags) return false;
      const parts = r.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
      if (searchTags.length === 1) return parts.some(p => p.startsWith(searchTags[0]));
      return searchTags.every(st => parts.some(p => p.startsWith(st)));
    });

    return filtered.map(r => ({
      ...r,
      tags: r.tags ? r.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    }));
  }

  async findOne(id: number) {
    const prismaAny = this.prisma as any;
    const task = await prismaAny.taskEntry.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    return {
      ...task,
      tags: task.tags ? task.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
  }

  async searchAny(q: string) {
    const term = (q || '').trim();
    if (!term) return [];
    const prismaAny = this.prisma as any;

    // Mapear posibles términos de estado
    const tLow = term.toLowerCase();
    const statusMap: Record<string, 'IN_PROGRESS'|'PAUSED'|'STOPPED'|'COMPLETED'|undefined> = {
      'in_progress': 'IN_PROGRESS',
      'en_proceso': 'IN_PROGRESS',
      'progreso': 'IN_PROGRESS',
      'pausada': 'PAUSED',
      'pausa': 'PAUSED',
      'detenida': 'STOPPED',
      'detenido': 'STOPPED',
      'stop': 'STOPPED',
      'stopped': 'STOPPED',
      'paused': 'PAUSED',
      'completada': 'COMPLETED',
      'terminada': 'COMPLETED',
      'completed': 'COMPLETED',
    };
    const statusFilter = statusMap[tLow] || (['IN_PROGRESS','PAUSED','STOPPED','COMPLETED'].includes(term) ? (term as any) : undefined);

    const results = await prismaAny.taskEntry.findMany({
      where: statusFilter ? {
        OR: [
          { title: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
          { tags: { contains: term, mode: 'insensitive' } },
          { status: statusFilter },
        ],
      } : {
        OR: [
          { title: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
          { tags: { contains: term, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
    return results.map(r => ({
      ...r,
      tags: r.tags ? r.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    }));
  }

  async remove(id: number) {
    await this.findOne(id);
    const prismaAny = this.prisma as any;
    await prismaAny.taskEntry.delete({ where: { id } });
    return { message: 'Task deleted successfully' };
  }

  async update(id: number, dto: UpdateTaskDto) {
    await this.findOne(id);
    const prismaAny = this.prisma as any;
    let startDate: Date | undefined = undefined;
    if (dto.startAt !== undefined) {
      const d = new Date(dto.startAt);
      if (isNaN(d.getTime())) throw new BadRequestException('startAt inválido');
      const now = new Date();
      if (d.getTime() < now.getTime()) throw new BadRequestException('startAt no puede estar en el pasado');
      startDate = d;
    }

    // Si se actualiza el estado y el inicio es futuro, forzar PAUSED
    let statusToSet = dto.status;
    if (statusToSet) {
      const now = new Date().getTime();
      const startMs = (startDate ? startDate.getTime() : undefined) ?? undefined;
      if (startMs && startMs > now) {
        statusToSet = 'PAUSED' as any;
      }
    }

    const updated = await prismaAny.taskEntry.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(startDate !== undefined && { startAt: startDate }),
        ...(dto.durationMinutes !== undefined && { durationMinutes: dto.durationMinutes }),
        ...(dto.tags && { tags: dto.tags.join(',') }),
        ...(statusToSet && { status: statusToSet }),
      },
    });
    return {
      ...updated,
      tags: updated.tags ? updated.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
  }

  async setStatus(id: number, status: 'IN_PROGRESS'|'PAUSED'|'STOPPED'|'COMPLETED') {
    const task = await this.findOne(id);
    const startMs = task.startAt ? new Date(task.startAt).getTime() : 0;
    const now = Date.now();

    // No permitir COMPLETED antes de que haya iniciado
    if (status === 'COMPLETED' as any && now < startMs) {
      throw new BadRequestException('No se puede completar antes de iniciar');
    }

    // Solo permitir IN_PROGRESS dentro de las 2 horas previas al inicio o después
    const twoHoursMs = 2 * 60 * 60 * 1000;
    if (status === 'IN_PROGRESS' as any) {
      if (now < startMs - twoHoursMs) {
        throw new BadRequestException('Solo se puede pasar a En proceso 2 horas antes del inicio');
      }
    }

    // Si aún no ocurre el inicio y el estado solicitado no es IN_PROGRESS, forzar PAUSED
    let statusToSet: 'IN_PROGRESS'|'PAUSED'|'STOPPED'|'COMPLETED' = status;
    if (now < startMs && status !== ('IN_PROGRESS' as any)) {
      statusToSet = 'PAUSED';
    }

    const prismaAny = this.prisma as any;

    // Si se inicia antes del startAt programado, ajustar startAt a ahora para que el countdown sea igual a duration
    let dataUpdate: any = { status: statusToSet };
    if (statusToSet === 'IN_PROGRESS' && now < startMs) {
      dataUpdate.startAt = new Date(now);
    }

    const updated = await prismaAny.taskEntry.update({
      where: { id },
      data: dataUpdate,
    });

    // Si al actualizar a IN_PROGRESS el fin ya pasó, completar inmediatamente
    if (updated.status === 'IN_PROGRESS' && updated.startAt) {
      const sMs = new Date(updated.startAt).getTime();
      const eMs = sMs + Number(updated.durationMinutes || 0) * 60_000;
      if (Date.now() >= eMs) {
        const completed = await prismaAny.taskEntry.update({ where: { id }, data: { status: 'COMPLETED' } });
        return {
          ...completed,
          tags: completed.tags ? completed.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        };
      }
    }

    return {
      ...updated,
      tags: updated.tags ? updated.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
  }
}
