import { Module } from '@nestjs/common';
import { PaymentsController } from './controller/payments.controller';
import { BankAccountsController } from './controller/bank-accounts.controller';
import { PaymentsService } from './service/payments.service';
import { BankAccountsService } from './service/bank-accounts.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PaymentsController, BankAccountsController],
  providers: [PaymentsService, BankAccountsService, PrismaService],
})
export class PaymentsModule {}
