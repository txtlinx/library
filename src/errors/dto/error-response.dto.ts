import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'TypeError en controlador' })
  title: string;

  @ApiProperty({ example: 'Cannot read property of undefined' })
  message: string;

  @ApiProperty({ required: false, example: 'at Object.foo (app.js:10:5)' })
  stack?: string;

  @ApiProperty({ example: 'Verificar que la variable existe antes de usarla' })
  solution: string;

  @ApiProperty({ type: [String], example: ['nestjs', 'prisma'] })
  tags: string[];

  @ApiProperty({ type: [String], example: ['/uploads/abc.png'] })
  images: string[];

  @ApiProperty({ type: String, format: 'date-time', example: new Date().toISOString() })
  createdAt: string;
}
