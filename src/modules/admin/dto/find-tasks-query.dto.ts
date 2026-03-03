import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllTasksQueryDto {
  @ApiPropertyOptional({ default: 1, description: 'Número da página' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, description: 'Quantidade de itens por página' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 10;

  @ApiPropertyOptional({ type: Boolean, description: 'Filtrar apenas tarefas atrasadas' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  overdue?: boolean;
}