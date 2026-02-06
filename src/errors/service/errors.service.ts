import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { CreateErrorDto, UpdateErrorDto } from "../dto/create-error.dto";

@Injectable()
export class ErrorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateErrorDto) {
    const created = await this.prisma.errorEntry.create({
      data: {
        title: dto.title,
        message: dto.message,
        stack: dto.stack,
        solution: dto.solution,
        tags: dto.tags.join(","),
      },
    });

    // devolver la entidad completa con images (vacío si no hay)
    return this.findOne(created.id);
  }

  async findAll() {
    const results = await this.prisma.errorEntry.findMany({
      orderBy: { createdAt: 'desc' },
      include: { images: true },
    });

    return results.map(r => ({
      ...r,
      tags: r.tags ? r.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      images: Array.isArray(r.images) ? r.images.map(img => `/uploads/${img.filename}`) : [],
    }));
  }

  async findByTag(tag: string) {
    if (!tag) return [];

    // Soportar múltiples tags separados por coma en el parámetro 'tag'
    const searchTags = String(tag)
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    const all = await this.prisma.errorEntry.findMany({
      orderBy: { createdAt: 'desc' },
      include: { images: true },
    });

    const filtered = all.filter(r => {
      if (!r.tags) return false;
      const parts = r.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
      // Nuevo comportamiento: coincidencia por prefijo (startsWith) para búsqueda en tiempo real
      if (searchTags.length === 1) return parts.some(p => p.startsWith(searchTags[0]));
      // Si hay múltiples, devolver solo los que contengan (por prefijo) todos los tags (AND)
      return searchTags.every(st => parts.some(p => p.startsWith(st)));
    });

    return filtered.map(r => ({
      ...r,
      tags: r.tags ? r.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      images: Array.isArray(r.images) ? r.images.map(img => `/uploads/${img.filename}`) : [],
    }));
  }

  async findOne(id: number) {
    const error = await this.prisma.errorEntry.findUnique({
      where: { id },
      include: { images: true },
    })
  
    if (!error) {
      throw new NotFoundException('Error not found')
    }
  
    return {
      ...error,
      tags: error.tags ? error.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      images: Array.isArray(error.images) ? error.images.map(img => `/uploads/${img.filename}`) : [],
    };
  }

  async searchAny(q: string) {
    const term = (q || '').trim();
    if (!term) return [];
    const results = await this.prisma.errorEntry.findMany({
      where: {
        OR: [
          { title: { contains: term, mode: 'insensitive' } },
          { message: { contains: term, mode: 'insensitive' } },
          { solution: { contains: term, mode: 'insensitive' } },
          { stack: { contains: term, mode: 'insensitive' } },
          { tags: { contains: term, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: { images: true },
    });
    return results.map(r => ({
      ...r,
      tags: r.tags ? r.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      images: Array.isArray(r.images) ? r.images.map(img => `/uploads/${img.filename}`) : [],
    }));
  }

  async addImages(errorId: number, filenames: string[]) {
    if (!filenames || filenames.length === 0) return [];
    const data = filenames.map(fn => ({ filename: fn, errorId }));
    await this.prisma.errorImage.createMany({ data });
    // devolver las imágenes recién añadidas como URLs
    return filenames.map(fn => `/uploads/${fn}`);
  }

  async remove(id: number) {
    await this.findOne(id) // valida existencia
    await this.prisma.errorEntry.delete({
      where: { id },
    })
  
    return { message: 'Error deleted successfully' }
  }

  async update(id: number, dto: UpdateErrorDto) {
    await this.findOne(id) // valida que exista

    const updated = await this.prisma.errorEntry.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.message && { message: dto.message }),
        ...(dto.stack !== undefined && { stack: dto.stack }),
        ...(dto.solution && { solution: dto.solution }),
        ...(dto.tags && { tags: dto.tags.join(',') }),
      },
      include: { images: true },
    });

    return {
      ...updated,
      tags: updated.tags ? updated.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      images: Array.isArray(updated.images) ? updated.images.map(img => `/uploads/${img.filename}`) : [],
    };
  }
}