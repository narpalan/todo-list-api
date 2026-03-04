import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty({ example: 'ckl8f7g3h0000abc123def' })
  id: string;

  @ApiProperty({ example: 'Estudar NestJS' })
  description: string;

  @ApiProperty({ example: '2025-12-31T23:59:59.000Z' })
  dueDate: Date;

  @ApiProperty({ example: false })
  completed: boolean;

  @ApiProperty({ example: null, nullable: true })
  completedAt: Date | null;

  @ApiProperty({ example: '2025-03-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-03-01T10:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ example: 'user-123' })
  userId: string;
}