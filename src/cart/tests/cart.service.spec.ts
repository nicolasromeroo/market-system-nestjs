import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../cart.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCartDto } from '../dto/create-cart.dto';

describe('CartService', () => {
  let service: CartService;
  let prisma: PrismaService;

  const mockPrismaService: jest.Mocked<PrismaService> = {
    cart: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    cartItem: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn().mockImplementation((cb) => cb(mockPrismaService)),
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $on: jest.fn(),
    onModuleInit: jest.fn(),
    onModuleDestroy: jest.fn(),
    enableShutdownHooks: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new cart and add item', async () => {
      const createCartDto: CreateCartDto = {
        productId: 1,
        quantity: 2,
      };

      const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 10,
        stock: 5,
        description: 'Test Description',
      };

      const mockCart = {
        id: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: 1,
            cartId: 1,
            productId: createCartDto.productId,
            quantity: createCartDto.quantity,
          },
        ],
      };

      (mockPrismaService.product.findUnique as jest.Mock).mockResolvedValue(
        mockProduct,
      );
      (mockPrismaService.cart.findFirst as jest.Mock).mockResolvedValue(null);
      (mockPrismaService.cart.create as jest.Mock).mockResolvedValue(mockCart);

      const result = await service.create(createCartDto, mockPrismaService);

      expect(result).toEqual(mockCart);
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: createCartDto.productId },
      });
      expect(mockPrismaService.cart.create).toHaveBeenCalled();
    });

    it('should throw error if product not found', async () => {
      const createCartDto: CreateCartDto = {
        productId: 1,
        quantity: 2,
      };

      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.create(createCartDto, prisma)).rejects.toThrow(
        'Product not found',
      );
    });

    it('should throw error if insufficient stock', async () => {
      const createCartDto: CreateCartDto = {
        productId: 1,
        quantity: 10,
      };

      const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 10,
        stock: 5,
        description: 'Test Description',
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      await expect(service.create(createCartDto, prisma)).rejects.toThrow(
        'Insufficient stock',
      );
    });

    it('should update existing cart item if product already in cart', async () => {
      const createCartDto: CreateCartDto = {
        productId: 1,
        quantity: 2,
      };

      const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 10,
        stock: 5,
        description: 'Test Description',
      };

      const existingCart = {
        id: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: 1,
            cartId: 1,
            productId: createCartDto.productId,
            quantity: 1,
          },
        ],
      };

      const updatedCart = {
        ...existingCart,
        items: [
          {
            ...existingCart.items[0],
            quantity: existingCart.items[0].quantity + createCartDto.quantity,
          },
        ],
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.cart.findFirst.mockResolvedValue(existingCart);
      mockPrismaService.cartItem.update.mockResolvedValue(updatedCart.items[0]);

      const result = await service.create(createCartDto, prisma);

      expect(result.items[0].quantity).toBe(3); // 1 (existing) + 2 (new)
      expect(mockPrismaService.cartItem.update).toHaveBeenCalled();
    });
  });
});
