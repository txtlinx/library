import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

// Use string unions aligned with Prisma enum values
type BankEnum = 'FALABELLA' | 'ESTADO' | 'CHILE' | 'SANTANDER';
type PaymentStatusEnum = 'PAID' | 'PAYING' | 'PAUSED';

type CreatePayment = {
  title: string;
  amount: number;
  type: 'INCOME' | 'FIXED_EXPENSE' | 'EXTRA_EXPENSE';
  bank: BankEnum;
  status?: PaymentStatusEnum;
  installments?: number | null;
  paidInstallments?: number | null;
  month?: string | null; // YYYY-MM opcional
};

type UpdatePayment = Partial<CreatePayment>;

type ListFilters = {
  bank?: BankEnum;
  type?: 'INCOME' | 'FIXED_EXPENSE' | 'EXTRA_EXPENSE';
  status?: PaymentStatusEnum;
  month?: string;
};

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async list(filters: ListFilters = {}) {
    const where: any = {};
    if (filters.bank) where.bank = { equals: filters.bank };
    if (filters.type) where.type = { equals: filters.type };
    if (filters.status) where.status = { equals: filters.status };
    if (filters.month) where.month = { equals: filters.month };
    return (this.prisma as any).payment.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async create(dto: CreatePayment) {
    const status = dto.status && dto.status.trim() ? dto.status : 'PAYING';
    return (this.prisma as any).payment.create({ data: { ...dto, status } });
  }

  async update(id: number, dto: UpdatePayment) {
    const exists = await (this.prisma as any).payment.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('payment not found');
    const data = { ...dto } as any;
    if (data.status !== undefined && typeof data.status === 'string' && !data.status.trim()) {
      data.status = undefined;
    }
    return (this.prisma as any).payment.update({ where: { id }, data });
  }

  async remove(id: number) {
    const exists = await (this.prisma as any).payment.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('payment not found');
    await (this.prisma as any).payment.delete({ where: { id } });
    return { ok: true };
  }

  async searchAny(q: string) {
    const query = q.trim();
    const lc = query.toLowerCase();

    // Normalización de términos comunes hacia enums
    const normalizeBank = (): BankEnum | undefined => {
      if (!query) return undefined;
      const m: Record<string, BankEnum> = {
        'falabella': 'FALABELLA',
        'banco falabella': 'FALABELLA',
        'estado': 'ESTADO',
        'banco estado': 'ESTADO',
        'chile': 'CHILE',
        'banco chile': 'CHILE',
        'santander': 'SANTANDER',
        'banco santander': 'SANTANDER',
      };
      return m[lc];
    };
    const normalizeType = (): 'INCOME' | 'FIXED_EXPENSE' | 'EXTRA_EXPENSE' | undefined => {
      if (!query) return undefined;
      const m: Record<string, 'INCOME' | 'FIXED_EXPENSE' | 'EXTRA_EXPENSE'> = {
        'income': 'INCOME',
        'ingreso': 'INCOME',
        'ingresos': 'INCOME',
        'fixed_expense': 'FIXED_EXPENSE',
        'gasto fijo': 'FIXED_EXPENSE',
        'fijo': 'FIXED_EXPENSE',
        'extra_expense': 'EXTRA_EXPENSE',
        'gasto extra': 'EXTRA_EXPENSE',
        'extra': 'EXTRA_EXPENSE',
      };
      return m[lc];
    };
    const normalizeStatus = (): PaymentStatusEnum | undefined => {
      if (!query) return undefined;
      const m: Record<string, PaymentStatusEnum> = {
        'paid': 'PAID',
        'pagado': 'PAID',
        'paying': 'PAYING',
        'pagando': 'PAYING',
        'paused': 'PAUSED',
        'detenido': 'PAUSED',
        'pausado': 'PAUSED',
      };
      return m[lc];
    };

    const bankEnum = normalizeBank();
    const typeEnum = normalizeType();
    const statusEnum = normalizeStatus();

    const amountNum = Number(query);
    const numericFilter = !isNaN(amountNum)
      ? [{ amount: amountNum }]
      : [];

    // Debido a que bank/type/status son enums en Prisma, usamos equals y apoyamos normalización.
    return (this.prisma as any).payment.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          ...(bankEnum ? [{ bank: { equals: bankEnum } }] : []),
          ...(typeEnum ? [{ type: { equals: typeEnum } }] : []),
          ...(statusEnum ? [{ status: { equals: statusEnum } }] : []),
          // Eliminamos matches incondicionales por texto en enums para evitar errores de validación
          ...numericFilter,
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
