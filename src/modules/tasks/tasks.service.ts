import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        description: dto.description,
        dueDate: new Date(dto.dueDate),
        userId,
      },
    });
  }

  async findAllByUser(userId: string) {
    const tasks = await this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    const now = new Date();
    return tasks.map(task => ({
      ...task,
      overdue: !task.completed && task.dueDate < now,
    }));
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Tarefa não encontrada');
    if (task.userId !== userId) throw new ForbiddenException('Acesso negado');
    return task;
  }

  async update(id: string, userId: string, dto: UpdateTaskDto) {
    const task = await this.findOne(id, userId);
    if (task.completed) {
      throw new ForbiddenException('Não é possível editar uma tarefa concluída');
    }
    return this.prisma.task.update({
      where: { id },
      data: {
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  async complete(id: string, userId: string) {
    const task = await this.findOne(id, userId);
    if (task.completed) {
      return task; 
    }
    return this.prisma.task.update({
      where: { id },
      data: {
        completed: true,
        completedAt: new Date(),
      },
    });
  }
}