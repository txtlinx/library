import { BadRequestException, Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BankAccountsService, UpdateBankAccount } from '../service/bank-accounts.service';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

const BANKS = ['FALABELLA', 'ESTADO', 'CHILE', 'SANTANDER'] as const;
type BankEnum = (typeof BANKS)[number];

@ApiTags('bank-accounts')
@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly bankAccounts: BankAccountsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar cuentas bancarias fijas' })
  @ApiResponse({ status: 200, description: 'Lista de cuentas bancarias' })
  async list() {
    return this.bankAccounts.list();
  }

  @Post('reset')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Resetear bancos fijos a valores base' })
  @ApiResponse({ status: 200, description: 'Bancos reseteados' })
  async reset() {
    return this.bankAccounts.reset();
  }

  @Put(':bank')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Actualizar configuración de un banco fijo' })
  @ApiParam({ name: 'bank', required: true, description: 'Banco', example: 'FALABELLA' })
  @ApiBody({ description: 'Datos editables del banco' })
  @ApiResponse({ status: 200, description: 'Banco actualizado' })
  async update(@Param('bank') bank: string, @Body() dto: UpdateBankAccount) {
    const normalizedBank = String(bank || '').toUpperCase();
    if (!BANKS.includes(normalizedBank as BankEnum)) {
      throw new BadRequestException('invalid bank');
    }

    this.validate(dto);
    return this.bankAccounts.update(normalizedBank as BankEnum, dto);
  }

  private validate(dto: UpdateBankAccount) {
    if (dto.totalLimit !== undefined) {
      const n = Number(dto.totalLimit);
      if (!Number.isFinite(n) || n < 0) throw new BadRequestException('totalLimit must be >= 0');
    }
    if (dto.totalDebt !== undefined) {
      const n = Number(dto.totalDebt);
      if (!Number.isFinite(n) || n < 0) throw new BadRequestException('totalDebt must be >= 0');
    }
    if (dto.debtCreditCard !== undefined) {
      const n = Number(dto.debtCreditCard);
      if (!Number.isFinite(n) || n < 0) throw new BadRequestException('debtCreditCard must be >= 0');
    }
    if (dto.debtCreditLine !== undefined) {
      const n = Number(dto.debtCreditLine);
      if (!Number.isFinite(n) || n < 0) throw new BadRequestException('debtCreditLine must be >= 0');
    }
    if (dto.debtAdvance !== undefined) {
      const n = Number(dto.debtAdvance);
      if (!Number.isFinite(n) || n < 0) throw new BadRequestException('debtAdvance must be >= 0');
    }
    if (dto.debtConsumerCredit !== undefined) {
      const n = Number(dto.debtConsumerCredit);
      if (!Number.isFinite(n) || n < 0) throw new BadRequestException('debtConsumerCredit must be >= 0');
    }
    if (dto.totalInstallments !== undefined) {
      const n = Number(dto.totalInstallments);
      if (!Number.isInteger(n) || n < 0) throw new BadRequestException('totalInstallments must be integer >= 0');
    }
    if (dto.paidInstallments !== undefined) {
      const n = Number(dto.paidInstallments);
      if (!Number.isInteger(n) || n < 0) throw new BadRequestException('paidInstallments must be integer >= 0');
      if (dto.totalInstallments !== undefined && n > Number(dto.totalInstallments)) {
        throw new BadRequestException('paidInstallments cannot exceed totalInstallments');
      }
    }
    if (dto.paymentDate !== undefined && dto.paymentDate !== null && dto.paymentDate !== '') {
      if (!/^\d{4}-(0[1-9]|1[0-2])-([0][1-9]|[12]\d|3[01])$/.test(dto.paymentDate)) {
        throw new BadRequestException('paymentDate must be YYYY-MM-DD');
      }
    }
    if (dto.statementDate !== undefined && dto.statementDate !== null && dto.statementDate !== '') {
      if (!/^\d{4}-(0[1-9]|1[0-2])-([0][1-9]|[12]\d|3[01])$/.test(dto.statementDate)) {
        throw new BadRequestException('statementDate must be YYYY-MM-DD');
      }
    }
  }
}
