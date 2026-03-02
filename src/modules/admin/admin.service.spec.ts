import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';
//import { Role } from '@prisma/client';

// Mock do PrismaService
const mockPrismaService = {
  task: {
    findMany: jest.fn(),
    count: jest.fn(),
  },
};

describe('AdminService', () => {
  let service: AdminService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  it('deve retornar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAllTasks', () => {
    const mockTasks = [
      {
        id: 'task-1',
        description: 'Task 1',
        dueDate: new Date('2025-01-01'),
        completed: false,
        completedAt: null,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
        userId: 'user-1',
        user: { email: 'user1@test.com' },
      },
      {
        id: 'task-2',
        description: 'Task 2',
        dueDate: new Date('2025-02-01'),
        completed: true,
        completedAt: new Date('2025-02-01'),
        createdAt: new Date('2025-01-02'),
        updatedAt: new Date('2025-01-02'),
        userId: 'user-2',
        user: { email: 'user2@test.com' },
      },
    ];

    const expectedTasks = mockTasks.map(task => ({
      ...task,
      userEmail: task.user.email,
    }));

    it('deve retornar tarefas com paginação e limite padrão', async () => {
      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);
      mockPrismaService.task.count.mockResolvedValue(2);

      const result = await service.findAllTasks();

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true } } },
      });
      expect(prisma.task.count).toHaveBeenCalled();

      expect(result).toEqual({
        data: expectedTasks,
        meta: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });

    it('deve respeitar parametros personalizados de páginas e limite', async () => {
      mockPrismaService.task.findMany.mockResolvedValue(mockTasks.slice(1));
      mockPrismaService.task.count.mockResolvedValue(2);

      const result = await service.findAllTasks(2, 1);

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        skip: 1,
        take: 1,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true } } },
      });

      expect(result).toEqual({
        data: [expectedTasks[1]],
        meta: {
          total: 2,
          page: 2,
          limit: 1,
          totalPages: 2,
        },
      });
    });

    it('deve retornar array vazzio se não existirem tarefas', async () => {
      mockPrismaService.task.findMany.mockResolvedValue([]);
      mockPrismaService.task.count.mockResolvedValue(0);

      const result = await service.findAllTasks();

      expect(result).toEqual({
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      });
    });
  });

  describe('findOverdueTasks', () => {
    const now = new Date('2025-03-01T12:00:00Z');
    const mockTasks = [
      {
        id: 'task-3',
        description: 'Overdue task',
        dueDate: new Date('2025-02-28T10:00:00Z'), 
        completed: false,
        completedAt: null,
        createdAt: new Date('2025-02-25'),
        updatedAt: new Date('2025-02-25'),
        userId: 'user-1',
        user: { email: 'user1@test.com' },
      },
      {
        id: 'task-4',
        description: 'Not overdue (future)',
        dueDate: new Date('2025-03-02T10:00:00Z'),
        completed: false,
        completedAt: null,
        createdAt: new Date('2025-02-26'),
        updatedAt: new Date('2025-02-26'),
        userId: 'user-2',
        user: { email: 'user2@test.com' },
      },
    ];

    const overdueMock = [mockTasks[0]];
    const expectedOverdue = overdueMock.map(task => ({
      ...task,
      userEmail: task.user.email,
    }));

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(now);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('deve retornar apenas tarefas atrasadas (não completas e dueDate < now)', async () => {
      mockPrismaService.task.findMany.mockResolvedValue(overdueMock);
      mockPrismaService.task.count.mockResolvedValue(1);

      const result = await service.findOverdueTasks();

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: {
          completed: false,
          dueDate: { lt: now },
        },
        skip: 0,
        take: 10,
        orderBy: { dueDate: 'asc' },
        include: { user: { select: { email: true } } },
      });
      expect(prisma.task.count).toHaveBeenCalledWith({
        where: {
          completed: false,
          dueDate: { lt: now },
        },
      });

      expect(result).toEqual({
        data: expectedOverdue,
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });

    it('deve paginar tarefas atrasadas corretamente', async () => {
      mockPrismaService.task.findMany.mockResolvedValue(overdueMock);
      mockPrismaService.task.count.mockResolvedValue(1);

      const result = await service.findOverdueTasks(1, 5);

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: {
          completed: false,
          dueDate: { lt: now },
        },
        skip: 0,
        take: 5,
        orderBy: { dueDate: 'asc' },
        include: { user: { select: { email: true } } },
      });

      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 5,
        totalPages: 1,
      });
    });

    it('deve retornar array vazizo caso não existam tarefas atrasadas', async () => {
      mockPrismaService.task.findMany.mockResolvedValue([]);
      mockPrismaService.task.count.mockResolvedValue(0);

      const result = await service.findOverdueTasks();

      expect(result).toEqual({
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      });
    });

    it('deve ordenar tarefas dueDate ascendente', async () => {
      mockPrismaService.task.findMany.mockResolvedValue([]);
      mockPrismaService.task.count.mockResolvedValue(0);

      await service.findOverdueTasks();

      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { dueDate: 'asc' },
        })
      );
    });
  });
});