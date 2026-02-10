import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(q?: string) {
    const where = q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' as const } },
            { content: { contains: q, mode: 'insensitive' as const } },
            { tags: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {};
    return (this.prisma as any).note.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async create(dto: { title: string; content: string; tags?: string[] }) {
    const tags = (dto.tags || []).join(',');
    return (this.prisma as any).note.create({ data: { title: dto.title, content: dto.content, tags } });
  }

  async update(id: number, dto: { title?: string; content?: string; tags?: string[] }) {
    const data: any = {};
    if (dto.title != null) data.title = dto.title;
    if (dto.content != null) data.content = dto.content;
    if (dto.tags != null) data.tags = dto.tags.join(',');
    return (this.prisma as any).note.update({ where: { id }, data });
  }

  async remove(id: number) {
    return (this.prisma as any).note.delete({ where: { id } });
  }
}
