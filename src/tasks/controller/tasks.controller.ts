import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto, UpdateTaskDto } from '../dto/create-task.dto';
import { TasksService } from '../service/tasks.service';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las tareas' })
  @ApiResponse({ status: 200, description: 'Lista de tareas' })
  findAll() {
    return this.tasksService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Crear una tarea' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: 'Tarea creada' })
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Get('search/any')
  @ApiOperation({ summary: 'Buscar tareas por cualquier campo (title, description, tags)' })
  @ApiQuery({ name: 'q', required: true, description: 'Texto de búsqueda' })
  @ApiResponse({ status: 200, description: 'Resultados de la búsqueda' })
  searchAny(@Query('q') q: string) {
    return this.tasksService.searchAny(q);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarea por id' })
  @ApiParam({ name: 'id', required: true, description: 'ID de la tarea', example: 1 })
  @ApiResponse({ status: 200, description: 'Tarea encontrada' })
  @ApiResponse({ status: 404, description: 'No encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Eliminar una tarea por id' })
  @ApiParam({ name: 'id', required: true, description: 'ID de la tarea', example: 1 })
  @ApiResponse({ status: 200, description: 'Eliminada correctamente' })
  @ApiResponse({ status: 404, description: 'No encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una tarea' })
  @ApiParam({ name: 'id', required: true, description: 'ID de la tarea', example: 1 })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, description: 'Tarea actualizada' })
  @ApiResponse({ status: 404, description: 'No encontrada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Patch(':id/pause')
  @ApiOperation({ summary: 'Pausar tarea' })
  @ApiParam({ name: 'id', required: true, description: 'ID de la tarea' })
  pause(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.setStatus(id, 'PAUSED' as any);
  }

  @Patch(':id/start')
  @ApiOperation({ summary: 'Reanudar tarea (en progreso)' })
  @ApiParam({ name: 'id', required: true, description: 'ID de la tarea' })
  start(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.setStatus(id, 'IN_PROGRESS' as any);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Completar tarea' })
  @ApiParam({ name: 'id', required: true, description: 'ID de la tarea' })
  complete(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.setStatus(id, 'COMPLETED' as any);
  }
}
