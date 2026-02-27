import { ApiProperty } from '@nestjs/swagger';
import { Task } from '@prisma/client';

class TaskWithUserEmail {
  @ApiProperty()
  id: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  dueDate: Date;

  @ApiProperty()
  completed: boolean;

  @ApiProperty({ nullable: true })
  completedAt: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  userEmail: string; 
}

export class PaginatedTasksResponseDto {
  @ApiProperty({ type: [TaskWithUserEmail] })
  data: TaskWithUserEmail[];

  @ApiProperty()
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}