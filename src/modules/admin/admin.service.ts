import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async findAllTasks(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const take = limit;

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { email: true },
          },
        },
      }),
      this.prisma.task.count(),
    ]);

    const data = tasks.map((task) => ({
      ...task,
      userEmail: task.user.email,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOverdueTasks(page: number = 1, limit: number = 10) {
    const now = new Date();
    const skip = (page - 1) * limit;
    const take = limit;

    const where = {
      completed: false,
      dueDate: { lt: now },
    };

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take,
        orderBy: { dueDate: 'asc' },
        include: {
          user: {
            select: { email: true },
          },
        },
      }),
      this.prisma.task.count({ where }),
    ]);

    const data = tasks.map((task) => ({
      ...task,
      userEmail: task.user.email,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}