import { Module } from '@nestjs/common';
import { NotesService } from './service/notes.service';
import { NotesController } from './controller/notes.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [NotesController],
  providers: [NotesService, PrismaService],
})
export class NotesModule {}
