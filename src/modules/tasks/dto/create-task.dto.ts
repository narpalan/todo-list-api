import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsNotEmpty, Validate } from 'class-validator';
import { IsFutureDateConstraint } from './is-future-data.validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Estudar NestJS' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2025-12-31T23:59:59Z' })
  @IsDateString()
  @Validate(IsFutureDateConstraint)
  dueDate: string;
}