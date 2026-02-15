import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { CreateErrorDto, UpdateErrorDto } from '../dto/create-error.dto';
import { ErrorResponseDto } from '../dto/error-response.dto';
import { ErrorsService } from '../service/errors.service';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Multer } from 'multer';
import { join } from 'path';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@ApiTags('errors')
@Controller('errors')
export class ErrorsController {
    constructor(private readonly errorsService: ErrorsService) { }

    @Get()
    @ApiOperation({ summary: 'Listar todos los errores' })
    @ApiResponse({ status: 200, description: 'Lista de errores', type: [ErrorResponseDto] })
    findAll() {
        return this.errorsService.findAll();
    }

    @Post()
    @ApiOperation({ summary: 'Crear un error' })
    @ApiBody({ type: CreateErrorDto })
    @ApiResponse({ status: 201, description: 'Error creado', type: ErrorResponseDto })
    create(@Body() dto: CreateErrorDto) {
        return this.errorsService.create(dto)
    }

    @Get('search/any')
    @ApiOperation({ summary: 'Buscar por cualquier campo (title, message, solution, stack, tags)' })
    @ApiQuery({ name: 'q', required: true, description: 'Texto de búsqueda' })
    @ApiResponse({ status: 200, description: 'Resultados de la búsqueda', type: [ErrorResponseDto] })
    searchAny(@Query('q') q: string) {
        return this.errorsService.searchAny(q)
    }

    @Get('search/by-tag')
    @ApiOperation({ summary: 'Buscar por tags (prefijo, soporta múltiples separados por coma)' })
    @ApiQuery({ name: 'tag', required: true, description: 'Tag o lista de tags separados por coma' })
    @ApiResponse({ status: 200, description: 'Resultados de la búsqueda por tag', type: [ErrorResponseDto] })
    searchByTag(@Query('tag') tag: string) {
        return this.errorsService.findByTag(tag);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un error por id' })
    @ApiParam({ name: 'id', required: true, description: 'ID del error', example: 1 })
    @ApiResponse({ status: 200, description: 'Error encontrado', type: ErrorResponseDto })
    @ApiResponse({ status: 404, description: 'No encontrado' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.errorsService.findOne(id)
    }

    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Eliminar un error por id' })
    @ApiParam({ name: 'id', required: true, description: 'ID del error', example: 1 })
    @ApiResponse({ status: 200, description: 'Eliminado correctamente' })
    @ApiResponse({ status: 404, description: 'No encontrado' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.errorsService.remove(id)
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un error' })
    @ApiParam({ name: 'id', required: true, description: 'ID del error', example: 1 })
    @ApiBody({ type: UpdateErrorDto })
    @ApiResponse({ status: 200, description: 'Error actualizado', type: ErrorResponseDto })
    @ApiResponse({ status: 404, description: 'No encontrado' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateErrorDto,
    ) {
        return this.errorsService.update(id, dto)
    }

    @Post(':id/images')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Subir imágenes para un error' })
    @ApiParam({ name: 'id', required: true, description: 'ID del error' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          images: {
            type: 'array',
            items: { type: 'string', format: 'binary' },
          },
        },
      },
    })
    @UseInterceptors(FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (req, file, cb) => {
          const safe = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
          cb(null, safe);
        },
      }),
    }))
    async uploadImages(@Param('id', ParseIntPipe) id: number, @UploadedFiles() files: Multer.File[]) {
      const filenames = (files || []).map(f => f.filename);
      const images = await this.errorsService.addImages(id, filenames);
      return { images };
    }
}
