import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Cart')
@Controller('cart')
@ApiResponse({
  status: 401,
  description: 'Unauthorized - JWT token is missing or invalid',
})
@ApiResponse({
  status: 403,
  description: 'Forbidden - Insufficient role permissions',
})
@ApiResponse({
  status: 500,
  description: 'Internal server error',
})
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get current user cart',
    description: 'Returns the active shopping cart for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'User cart retrieved successfully',
  })
  async getCurrentCart() {
    return this.cartService.findAll(this.prisma);
  }

  @Post('add-item')
  @ApiOperation({
    summary: 'Add item to cart',
    description: "Adds a product to the current user's shopping cart",
  })
  @ApiResponse({
    status: 201,
    description: 'Item added to cart successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input - Product not found or insufficient stock',
  })
  async addToCart(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto, this.prisma);
  }

  @Get('all')
  @ApiOperation({ summary: 'Obtener todos los carritos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de carritos obtenida exitosamente',
  })
  findAll() {
    return this.cartService.findAll(this.prisma);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un carrito por ID' })
  @ApiParam({ name: 'id', description: 'ID del carrito', type: 'number' })
  @ApiResponse({ status: 200, description: 'Carrito encontrado' })
  @ApiResponse({ status: 404, description: 'Carrito no encontrado' })
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id, this.prisma);
  }

  @Patch('update-item')
  @ApiOperation({
    summary: 'Update cart item quantity',
    description:
      'Update the quantity of a specific product in the cart. Set quantity to 0 to remove the item.',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart item updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart or product not found',
  })
  async updateItem(@Body() updateCartDto: UpdateCartDto) {
    // Obtenemos el carrito activo del usuario (por ahora hardcodeamos el ID 1)
    const cart = await this.cartService.findOne(1, this.prisma);
    if (!cart) {
      throw new Error('Active cart not found');
    }
    return this.cartService.update(cart.id, updateCartDto, this.prisma);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update cart item quantity',
    description:
      'Update the quantity of a specific product in the cart. Set quantity to 0 to remove the item.',
  })
  @ApiParam({
    name: 'id',
    description: 'Cart ID',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart item updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart or product not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or insufficient stock',
  })
  async update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto, this.prisma);
  }

  @Delete('remove-item/:productId')
  @ApiOperation({
    summary: 'Remove item from cart',
    description: "Removes a specific product from the current user's cart",
  })
  @ApiParam({
    name: 'productId',
    description: 'ID of the product to remove from cart',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Item removed from cart successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart or product not found',
  })
  async removeItem(@Param('productId') productId: string) {
    // Obtenemos el carrito activo del usuario (por ahora hardcodeamos el ID 1)
    const cart = await this.cartService.findOne(1, this.prisma);
    if (!cart) {
      throw new Error('Active cart not found');
    }
    // Usamos el método update con quantity 0 para remover el item
    return this.cartService.update(
      cart.id,
      { productId: +productId, quantity: 0 },
      this.prisma,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete entire cart' })
  @ApiParam({ name: 'id', description: 'Cart ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Cart deleted successfully' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id, this.prisma);
  }
}
