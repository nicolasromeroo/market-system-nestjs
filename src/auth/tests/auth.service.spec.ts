import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { hashPassword } from '../bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const userData = {
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User',
      };

      const hashedPassword = await hashPassword(userData.password);
      const createdUser = { ...userData, id: 1, password: hashedPassword };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(createdUser);
      mockJwtService.sign.mockReturnValue('jwt_token');

      const result = await service.register(userData);

      expect(result).toHaveProperty('access_token');
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    it('should throw error if user already exists', async () => {
      const userData = {
        email: 'existing@test.com',
        password: 'password123',
        name: 'Test User',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(userData);

      await expect(service.register(userData)).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('should return access token for valid credentials', async () => {
      const loginData = {
        email: 'test@test.com',
        password: 'password123',
      };

      const hashedPassword = await hashPassword(loginData.password);
      const user = { ...loginData, id: 1, password: hashedPassword };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue('jwt_token');

      const result = await service.login(loginData);

      expect(result).toHaveProperty('access_token');
      expect(mockJwtService.sign).toHaveBeenCalled();
    });
  });
});
