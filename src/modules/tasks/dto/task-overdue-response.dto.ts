import { ApiProperty } from '@nestjs/swagger';
import { TaskResponseDto } from './task-response.dto';

export class TaskWithOverdueResponseDto extends TaskResponseDto {
  @ApiProperty({
    description: 'Indica se a tarefa está atrasada (considerando data de vencimento e conclusão)',
    example: true,
  })
  overdue: boolean;
}