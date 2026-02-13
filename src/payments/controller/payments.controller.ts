import { Body, Controller, Delete, Get, Param, Post, Put, Patch, BadRequestException, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from '../service/payments.service';

const BANKS = ['FALABELLA', 'ESTADO', 'CHILE', 'SANTANDER'] as const;
const STATUSES = ['PAID', 'PAYING', 'PAUSED'] as const;
const TYPES = ['INCOME', 'FIXED_EXPENSE', 'EXTRA_EXPENSE'] as const;

type CreatePaymentDto = {
  title: string;
  amount: number;
  type: (typeof TYPES)[number];
  bank: (typeof BANKS)[number];
  status?: (typeof STATUSES)[number];
  installments?: number | null;
  paidInstallments?: number | null;
  month?: string | null; // YYYY-MM opcional
};

type UpdatePaymentDto = Partial<CreatePaymentDto>;

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los pagos' })
  @ApiResponse({ status: 200, description: 'Lista de pagos' })
  async list(
    @Query('bank') bank?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('month') month?: string,
  ) {
    const filters: any = {};
    if (bank) {
      const b = bank.toUpperCase();
      if (BANKS.includes(b as any)) filters.bank = b;
    }
    if (type) {
      const t = type.toUpperCase();
      if (TYPES.includes(t as any)) filters.type = t;
    }
    if (status) {
      const s = status.toUpperCase();
      if (STATUSES.includes(s as any)) filters.status = s;
    }
    if (month != null) {
      const m = String(month).trim();
      if (m !== '') {
        if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(m)) throw new BadRequestException('month must be YYYY-MM');
        filters.month = m;
      }
    }

    const items = await this.payments.list(filters);
    return items.map((p: any) => ({
      ...p,
      monthlyAmount: p.installments && p.installments > 1 ? Number(p.amount) / Number(p.installments) : null,
    }));
  }

  @Get('search/any')
  @ApiOperation({ summary: 'Buscar pagos por texto' })
  @ApiResponse({ status: 200, description: 'Resultados de búsqueda' })
  async searchAny(@Query('q') q: string) {
    const query = (q || '').trim();
    if (!query) return [];
    const items = await this.payments.searchAny(query);
    return items.map((p: any) => ({
      ...p,
      monthlyAmount: p.installments && p.installments > 1 ? Number(p.amount) / Number(p.installments) : null,
    }));
  }

  @Post()
  @ApiOperation({ summary: 'Crear un pago' })
  @ApiBody({ description: 'Datos del pago' })
  @ApiResponse({ status: 201, description: 'Pago creado' })
  async create(@Body() dto: CreatePaymentDto) {
    this.validate(dto);
    const payload = { ...dto };
    return this.payments.create(payload);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un pago' })
  @ApiParam({ name: 'id', required: true, description: 'ID del pago', example: 1 })
  @ApiResponse({ status: 200, description: 'Pago actualizado' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePaymentDto) {
    this.validate(dto, true);
    const payload = { ...dto };
    return this.payments.update(id, payload);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar parcialmente un pago' })
  @ApiParam({ name: 'id', required: true, description: 'ID del pago', example: 1 })
  @ApiResponse({ status: 200, description: 'Pago actualizado (PATCH)' })
  async patch(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePaymentDto) {
    this.validate(dto, true);
    const payload = { ...dto };
    return this.payments.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un pago por id' })
  @ApiParam({ name: 'id', required: true, description: 'ID del pago', example: 1 })
  @ApiResponse({ status: 200, description: 'Eliminado correctamente' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.payments.remove(id);
  }

  private validate(dto: Partial<CreatePaymentDto>, isPartial = false) {
    if (!isPartial) {
      if (!dto.title || typeof dto.title !== 'string') throw new BadRequestException('title required');
      if (typeof dto.amount !== 'number') throw new BadRequestException('amount required');
      if (!dto.type || !TYPES.includes(dto.type)) throw new BadRequestException('invalid type');
      if (!dto.bank || !BANKS.includes(dto.bank)) throw new BadRequestException('invalid bank');
    }
    if (dto.status && !STATUSES.includes(dto.status)) throw new BadRequestException('invalid status');
    if (dto.installments != null) {
      const n = Number(dto.installments);
      if (!Number.isInteger(n) || n < 1 || n > 58) throw new BadRequestException('installments must be 1-58');
    }
    if (dto.paidInstallments != null) {
      const p = Number(dto.paidInstallments);
      if (!Number.isInteger(p) || p < 0 || p > 58) throw new BadRequestException('paidInstallments must be 0-58');
      if (dto.installments != null && p > Number(dto.installments)) throw new BadRequestException('paidInstallments cannot exceed installments');
    }
    if (dto.month != null) {
      const m = String(dto.month).trim();
      if (m !== '' && !/^\d{4}-(0[1-9]|1[0-2])$/.test(m)) {
        throw new BadRequestException('month must be YYYY-MM');
      }
    }
  }
}
