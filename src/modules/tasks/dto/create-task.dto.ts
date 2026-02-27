import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Estudar NestJS' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2025-12-31T23:59:59Z' })
  @IsDateString()
  dueDate: string;
}