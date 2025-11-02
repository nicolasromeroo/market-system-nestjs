import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductPositionDto } from './dto/update-product-position.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  create(data: CreateProductDto, prisma: PrismaService) {
    try {
      return prisma.product.create({ data });
    } catch (error) {
      throw new Error('Error creating product');
    }
  }

  findAll(prisma: PrismaService) {
    return prisma.product.findMany();
  }

  findOne(id: number, prisma: PrismaService) {
    return prisma.product.findUnique({ where: { id } });
  }

  update(
    id: number,
    updateProductDto: UpdateProductDto,
    prisma: PrismaService,
  ) {
    return prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: number, prisma: PrismaService) {
    return prisma.product.delete({ where: { id } });
  }

  async updatePosition(
    updatePositionDto: UpdateProductPositionDto,
    prisma: PrismaService,
  ) {
    const { productId, positionInStorage } = updatePositionDto;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    return prisma.product.update({
      where: { id: productId },
      data: { positionInStorage },
    });
  }
}
