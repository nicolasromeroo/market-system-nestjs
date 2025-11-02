import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductPositionDto } from './dto/update-product-position.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/roles';

@ApiTags('Products')
@Controller('products')
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
export class ProductsController {
  @Patch('update-position')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OPERATOR_STAFF)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update product storage position',
    description:
      'Updates the storage position of a product. Only available for operator staff.',
  })
  @ApiResponse({
    status: 200,
    description: 'Product position updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User is not an operator',
  })
  async updatePosition(@Body() updatePositionDto: UpdateProductPositionDto) {
    return this.productsService.updatePosition(updatePositionDto, this.prisma);
  }
  constructor(
    private readonly productsService: ProductsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto, this.prisma);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos obtenida exitosamente',
  })
  findAll() {
    return this.productsService.findAll(this.prisma);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: 'number' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id, this.prisma);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto, this.prisma);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: 'number' })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id, this.prisma);
  }
}
