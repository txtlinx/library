import { Module } from '@nestjs/common';
import { ErrorsController } from './controller/errors.controller';
import { ErrorsService } from '../errors/service/errors.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ErrorsController],
  providers: [ErrorsService, PrismaService]
})
export class ErrorsModule {}
