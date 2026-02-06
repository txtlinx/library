import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsDateString, IsInt, IsOptional, IsString, Min, IsEnum } from 'class-validator';

export enum TaskStatusDto {
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
}

export class CreateTaskDto {
  @ApiProperty({ example: 'Implementar feature X' })
  @IsString()
  title: string;

  @ApiProperty({ required: false, example: 'Detalle de la tarea' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: new Date().toISOString() })
  @IsDateString()
  startAt: string;

  @ApiProperty({ example: 90, description: 'Duración en minutos' })
  @IsInt()
  @Min(1)
  durationMinutes: number;

  @ApiProperty({ type: [String], example: ['work', 'feature'] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ required: false, enum: TaskStatusDto, example: TaskStatusDto.IN_PROGRESS })
  @IsOptional()
  @IsEnum(TaskStatusDto)
  status?: TaskStatusDto;
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
