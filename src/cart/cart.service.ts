import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CartService {
  async create(data: CreateCartDto, prisma: PrismaService) {
    try {
      // Primero verificamos si el producto existe y hay stock suficiente
      const product = await prisma.product.findUnique({
        where: { id: data.productId },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      if (product.stock < data.quantity) {
        throw new Error('Insufficient stock');
      }

      // Buscamos o creamos el carrito del usuario
      let cart = await prisma.cart.findFirst({
        where: { userId: 1 }, // TODO: Reemplazar con el userId del token
        include: { items: true },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            userId: 1, // TODO: Reemplazar con el userId del token
            items: {
              create: {
                productId: data.productId,
                quantity: data.quantity,
              },
            },
          },
          include: { items: true },
        });
      } else {
        // Si el carrito existe, agregamos o actualizamos el item
        const existingItem = cart.items.find(
          (item) => item.productId === data.productId,
        );

        if (existingItem) {
          await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + data.quantity },
          });
        } else {
          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              productId: data.productId,
              quantity: data.quantity,
            },
          });
        }
      }

      return await prisma.cart.findUnique({
        where: { id: cart.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(error.message || 'Error adding item to cart');
    }
  }

  async findAll(prisma: PrismaService) {
    return prisma.cart.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findOne(id: number, prisma: PrismaService) {
    return prisma.cart.findUnique({
      where: { id },
    });
  }

  async update(
    id: number,
    updateCartDto: UpdateCartDto,
    prisma: PrismaService,
  ) {
    try {
      // Verificar si el producto existe y hay stock suficiente
      const product = await prisma.product.findUnique({
        where: { id: updateCartDto.productId },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      if (
        updateCartDto.quantity > 0 &&
        product.stock < updateCartDto.quantity
      ) {
        throw new Error('Insufficient stock');
      }

      // Buscar el carrito
      const cart = await prisma.cart.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!cart) {
        throw new Error('Cart not found');
      }

      // Buscar el item en el carrito
      const cartItem = cart.items.find(
        (item) => item.productId === updateCartDto.productId,
      );

      if (!cartItem) {
        throw new Error('Product not found in cart');
      }

      if (updateCartDto.quantity === 0) {
        // Si la cantidad es 0, eliminar el item
        await prisma.cartItem.delete({
          where: { id: cartItem.id },
        });
      } else {
        // Actualizar la cantidad del item
        await prisma.cartItem.update({
          where: { id: cartItem.id },
          data: { quantity: updateCartDto.quantity },
        });
      }

      // Retornar el carrito actualizado con sus items
      return await prisma.cart.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(error.message || 'Error updating cart item');
    }
  }

  async remove(id: number, prisma: PrismaService) {
    return prisma.cart.delete({
      where: { id },
    });
  }
}
