import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../tasks.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('TasksService', () => {
  let service: TasksService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const userId = 1;
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'PENDING',
      };

      const mockTask = {
        id: 1,
        ...taskData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.task.create.mockResolvedValue(mockTask);

      const result = await service.create(taskData, userId);

      expect(result).toEqual(mockTask);
      expect(mockPrismaService.task.create).toHaveBeenCalledWith({
        data: { ...taskData, userId },
      });
    });
  });

  describe('findAll', () => {
    it('should return all tasks for a user', async () => {
      const userId = 1;
      const mockTasks = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Desc 1',
          status: 'PENDING',
          userId,
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Desc 2',
          status: 'COMPLETED',
          userId,
        },
      ];

      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);

      const result = await service.findAll(userId);

      expect(result).toEqual(mockTasks);
      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const taskId = 1;
      const userId = 1;
      const updateData = {
        status: 'COMPLETED',
      };

      const mockUpdatedTask = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        status: 'COMPLETED',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.task.update.mockResolvedValue(mockUpdatedTask);

      const result = await service.update(taskId, updateData, userId);

      expect(result).toEqual(mockUpdatedTask);
      expect(mockPrismaService.task.update).toHaveBeenCalledWith({
        where: { id: taskId, userId },
        data: updateData,
      });
    });
  });
});
