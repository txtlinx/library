import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { NotesService } from '../service/notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly svc: NotesService) {}

  @Get()
  list(@Query('q') q?: string) {
    return this.svc.list(q);
  }

  @Post()
  create(@Body() dto: { title: string; content: string; tags?: string[] }) {
    return this.svc.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: { title?: string; content?: string; tags?: string[] }) {
    return this.svc.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(Number(id));
  }
}
