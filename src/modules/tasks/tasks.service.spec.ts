import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

// Mock do PrismaService
const mockPrismaService = {
  task: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('TasksService', () => {
  let service: TasksService;
  let prisma: typeof mockPrismaService;

  const userId = 'user-123';
  const taskId = 'task-456';
  const now = new Date('2025-03-02T12:00:00Z');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(now);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve retornar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      description: 'Test task',
      dueDate: '2025-12-31T23:59:59Z',
    };
    const expectedDueDate = new Date(createDto.dueDate);
    const createdTask = {
      id: 'new-task',
      description: createDto.description,
      dueDate: expectedDueDate,
      completed: false,
      completedAt: null,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    it('deve criar uma tarefa e recebe-la como retorno', async () => {
      mockPrismaService.task.create.mockResolvedValue(createdTask);

      const result = await service.create(userId, createDto);

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          description: createDto.description,
          dueDate: expectedDueDate,
          userId,
        },
      });
      expect(result).toEqual(createdTask);
    });
  });

  describe('findAllByUser', () => {
    const tasks = [
      {
        id: 'task1',
        description: 'Task 1',
        dueDate: new Date('2025-02-28T10:00:00Z'), 
        completed: false,
        completedAt: null,
        userId,
        createdAt: new Date('2025-02-25'),
        updatedAt: new Date('2025-02-25'),
      },
      {
        id: 'task2',
        description: 'Task 2',
        dueDate: new Date('2025-03-01T10:00:00Z'),
        completed: true,
        completedAt: new Date('2025-03-01T11:00:00Z'),
        userId,
        createdAt: new Date('2025-02-26'),
        updatedAt: new Date('2025-02-26'),
      },
      {
        id: 'task3',
        description: 'Task 3',
        dueDate: new Date('2025-03-03T10:00:00Z'),
        completed: false,
        completedAt: null,
        userId,
        createdAt: new Date('2025-02-27'),
        updatedAt: new Date('2025-02-27'),
      },
      {
        id: 'task4',
        description: 'Task 4',
        dueDate: new Date('2025-03-01T10:00:00Z'),
        completed: true,
        completedAt: new Date('2025-03-01T09:00:00Z'),
        userId,
        createdAt: new Date('2025-02-28'),
        updatedAt: new Date('2025-02-28'),
      },
    ];

    const expectedTasks = tasks.map(task => ({
      ...task,
      overdue:
        task.completed
          ? (task.completedAt && task.completedAt > task.dueDate)
          : task.dueDate < now,
    }));

    it('deve retornar as tarefas do usuário com a flag overdue (atrasadas) corretamente', async () => {
      mockPrismaService.task.findMany.mockResolvedValue(tasks);

      const result = await service.findAllByUser(userId);

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      expect(result).toEqual(expectedTasks);
    });

    it('deve retornar um array vazzio se o usuário não tiver tarefas', async () => {
      mockPrismaService.task.findMany.mockResolvedValue([]);

      const result = await service.findAllByUser(userId);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    const task = {
      id: taskId,
      userId,
      description: 'Test',
      dueDate: new Date(),
      completed: false,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    it('deve retornar uma tarefa se ela existir e pertencer ao usuário', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(task);

      const result = await service.findOne(taskId, userId);

      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: taskId },
      });
      expect(result).toEqual(task);
    });

    it('deve lançar NotFoundException se a tarefa não existir', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.findOne(taskId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar ForbiddenException se a tarefa pertencer a outro usuário', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue({
        ...task,
        userId: 'other-user',
      });

      await expect(service.findOne(taskId, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    const updateDto = {
      description: 'Updated description',
      dueDate: '2026-01-01T00:00:00Z',
    };
    const existingTask = {
      id: taskId,
      userId,
      description: 'Original',
      dueDate: new Date('2025-01-01'),
      completed: false,
      completedAt: null,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    };
    const updatedTask = {
      ...existingTask,
      description: updateDto.description,
      dueDate: new Date(updateDto.dueDate),
      updatedAt: now,
    };

    it('deve atualizar a terafa se ela não estiver conclusa', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(existingTask);
      mockPrismaService.task.update.mockResolvedValue(updatedTask);

      const result = await service.update(taskId, userId, updateDto);

      expect(prisma.task.findUnique).toHaveBeenCalledWith({ where: { id: taskId } });
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: {
          description: updateDto.description,
          dueDate: new Date(updateDto.dueDate),
        },
      });
      expect(result).toEqual(updatedTask);
    });

    it('deve lançar ForbiddenException se a tarefa está conclusa', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue({
        ...existingTask,
        completed: true,
      });

      await expect(service.update(taskId, userId, updateDto)).rejects.toThrow(
        ForbiddenException,
      );

      expect(prisma.task.update).not.toHaveBeenCalled();
    });

    it('deve propagar o erro de findOne (not found) ao atualizar tarefa', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.update(taskId, userId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve propagar o erro de findOne (forbidden) ao atualizar tarefa', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue({
        ...existingTask,
        userId: 'other-user',
      });

      await expect(service.update(taskId, userId, updateDto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('deve permitir atualização parcial da tarefa (apenas descrição)', async () => {
      const partialDto = { description: 'New desc' };
      mockPrismaService.task.findUnique.mockResolvedValue(existingTask);
      mockPrismaService.task.update.mockResolvedValue({
        ...existingTask,
        description: 'New desc',
        updatedAt: now,
      });

      await service.update(taskId, userId, partialDto);

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: { description: 'New desc' },
      });
    });

    it('deve permitir atualização parcial da tarefa (apenas data)', async () => {
      const partialDto = { dueDate: '2026-01-01T00:00:00Z' };
      mockPrismaService.task.findUnique.mockResolvedValue(existingTask);
      mockPrismaService.task.update.mockResolvedValue({
        ...existingTask,
        dueDate: new Date(partialDto.dueDate),
        updatedAt: now,
      });

      await service.update(taskId, userId, partialDto);

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: { dueDate: new Date(partialDto.dueDate) },
      });
    });
  });

  describe('complete', () => {
    const existingTask = {
      id: taskId,
      userId,
      description: 'Task',
      dueDate: new Date('2025-01-01'),
      completed: false,
      completedAt: null,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    };
    const completedTask = {
      ...existingTask,
      completed: true,
      completedAt: now,
      updatedAt: now,
    };

    it('deve marcar a tarefa como concluída', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(existingTask);
      mockPrismaService.task.update.mockResolvedValue(completedTask);

      const result = await service.complete(taskId, userId);

      expect(prisma.task.findUnique).toHaveBeenCalledWith({ where: { id: taskId } });
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: {
          completed: true,
          completedAt: now,
        },
      });
      expect(result).toEqual(completedTask);
    });

    it('deve retornar uma tarefa concluída sem atualiza-la', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(completedTask);

      const result = await service.complete(taskId, userId);

      expect(prisma.task.update).not.toHaveBeenCalled();
      expect(result).toEqual(completedTask);
    });

    it('deve propagar o erro de findOne (not found) ao concluir tarefa', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.complete(taskId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve propagar o erro de findOne (forbidden) ao concluir tarefa', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue({
        ...existingTask,
        userId: 'other-user',
      });

      await expect(service.complete(taskId, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
