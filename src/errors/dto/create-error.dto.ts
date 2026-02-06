import { IsArray, IsOptional, IsString } from "class-validator"
import { ApiProperty, PartialType } from '@nestjs/swagger'

export class CreateErrorDto {
    @ApiProperty({ example: 'TypeError en controlador' })
    @IsString()
    title: string
  
    @ApiProperty({ example: 'Cannot read property of undefined' })
    @IsString()
    message: string
  
    @ApiProperty({ required: false, example: 'at Object.foo (app.js:10:5)' })
    @IsOptional()
    @IsString()
    stack?: string
  
    @ApiProperty({ example: 'Verificar que la variable existe antes de usarla' })
    @IsString()
    solution: string
  
    @ApiProperty({ type: [String], example: ['nestjs', 'prisma'] })
    @IsArray()
    @IsString({ each: true })
    tags: string[]
  
  }


export class UpdateErrorDto extends PartialType(CreateErrorDto) {}