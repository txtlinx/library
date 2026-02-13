import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

type BankEnum = 'FALABELLA' | 'ESTADO' | 'CHILE' | 'SANTANDER';

export type UpdateBankAccount = {
  totalLimit?: number;
  totalDebt?: number;
  debtCreditCard?: number;
  debtCreditLine?: number;
  debtAdvance?: number;
  debtConsumerCredit?: number;
  totalInstallments?: number;
  paidInstallments?: number;
  paymentStatus?: string | null;
  paymentDate?: string | null;
  statementDate?: string | null;
};

const BANKS: BankEnum[] = ['FALABELLA', 'ESTADO', 'CHILE', 'SANTANDER'];

@Injectable()
export class BankAccountsService {
  constructor(private prisma: PrismaService) {}

  private async ensureDefaults() {
    await Promise.all(
      BANKS.map((bank) =>
        (this.prisma as any).bankAccount.upsert({
          where: { bank },
          create: {
            bank,
            totalLimit: 0,
            totalDebt: 0,
            debtCreditCard: 0,
            debtCreditLine: 0,
            debtAdvance: 0,
            debtConsumerCredit: 0,
            totalInstallments: 0,
            paidInstallments: 0,
          },
          update: {},
        }),
      ),
    );
  }

  async list() {
    await this.ensureDefaults();
    const rows = await (this.prisma as any).bankAccount.findMany({
      where: { bank: { in: BANKS } },
    });
    const byBank = new Map(rows.map((r: any) => [r.bank, r]));
    return BANKS.map((bank) => byBank.get(bank)).filter(Boolean);
  }

  async update(bank: BankEnum, dto: UpdateBankAccount) {
    const exists = await (this.prisma as any).bankAccount.findUnique({ where: { bank } });
    const data: any = {};
    if (dto.totalLimit !== undefined) data.totalLimit = Number(dto.totalLimit) || 0;
    if (dto.debtCreditCard !== undefined) data.debtCreditCard = Number(dto.debtCreditCard) || 0;
    if (dto.debtCreditLine !== undefined) data.debtCreditLine = Number(dto.debtCreditLine) || 0;
    if (dto.debtAdvance !== undefined) data.debtAdvance = Number(dto.debtAdvance) || 0;
    if (dto.debtConsumerCredit !== undefined) data.debtConsumerCredit = Number(dto.debtConsumerCredit) || 0;
    if (dto.totalInstallments !== undefined) data.totalInstallments = Math.max(0, Math.trunc(Number(dto.totalInstallments) || 0));
    if (dto.paidInstallments !== undefined) data.paidInstallments = Math.max(0, Math.trunc(Number(dto.paidInstallments) || 0));
    if (data.totalInstallments !== undefined && data.paidInstallments !== undefined && data.paidInstallments > data.totalInstallments) {
      data.paidInstallments = data.totalInstallments;
    }
    if (dto.paymentStatus !== undefined) data.paymentStatus = dto.paymentStatus?.trim() || null;
    if (dto.paymentDate !== undefined) data.paymentDate = dto.paymentDate?.trim() || null;
    if (dto.statementDate !== undefined) data.statementDate = dto.statementDate?.trim() || null;

    const debtCreditCard = data.debtCreditCard ?? (Number(exists?.debtCreditCard || 0) || 0);
    const debtCreditLine = data.debtCreditLine ?? (Number(exists?.debtCreditLine || 0) || 0);
    const debtAdvance = data.debtAdvance ?? (Number(exists?.debtAdvance || 0) || 0);
    const debtConsumerCredit = data.debtConsumerCredit ?? (Number(exists?.debtConsumerCredit || 0) || 0);
    data.totalDebt = debtCreditCard + debtCreditLine + debtAdvance + debtConsumerCredit;

    return (this.prisma as any).bankAccount.upsert({
      where: { bank },
      create: {
        bank,
        totalLimit: data.totalLimit ?? 0,
        totalDebt: data.totalDebt ?? 0,
        debtCreditCard: data.debtCreditCard ?? 0,
        debtCreditLine: data.debtCreditLine ?? 0,
        debtAdvance: data.debtAdvance ?? 0,
        debtConsumerCredit: data.debtConsumerCredit ?? 0,
        totalInstallments: data.totalInstallments ?? 0,
        paidInstallments: data.paidInstallments ?? 0,
        paymentStatus: data.paymentStatus ?? null,
        paymentDate: data.paymentDate ?? null,
        statementDate: data.statementDate ?? null,
      },
      update: data,
    });
  }

  async reset() {
    await Promise.all(
      BANKS.map((bank) =>
        (this.prisma as any).bankAccount.upsert({
          where: { bank },
          create: {
            bank,
            totalLimit: 0,
            totalDebt: 0,
            debtCreditCard: 0,
            debtCreditLine: 0,
            debtAdvance: 0,
            debtConsumerCredit: 0,
            totalInstallments: 0,
            paidInstallments: 0,
            paymentStatus: null,
            paymentDate: null,
            statementDate: null,
          },
          update: {
            totalLimit: 0,
            totalDebt: 0,
            debtCreditCard: 0,
            debtCreditLine: 0,
            debtAdvance: 0,
            debtConsumerCredit: 0,
            totalInstallments: 0,
            paidInstallments: 0,
            paymentStatus: null,
            paymentDate: null,
            statementDate: null,
          },
        }),
      ),
    );
    return this.list();
  }
}
