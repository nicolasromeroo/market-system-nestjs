import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductTag } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name/title',
    example: 'Samsung Galaxy S23 Ultra 256GB',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada del producto',
    example: 'Smartphone con pantalla de 6.1 pulgadas, 128GB de almacenamiento',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Precio del producto',
    example: 599.99,
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    description: 'Categoría del producto',
    example: 'Electrónicos',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'Stock del producto',
    example: 100,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de bultos',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  cantidadBultos?: number;

  @ApiPropertyOptional({
    description: 'Unidades por bulto',
    example: 12,
  })
  @IsNumber()
  @IsOptional()
  unidadesPorBulto?: number;

  @ApiPropertyOptional({
    description: 'Fecha de la última entrega',
    example: '2024-10-19T10:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  lastDeliveryDate?: Date;

  @ApiPropertyOptional({
    description: 'Fechas de vencimiento del producto',
    example: ['2024-12-31T23:59:59.000Z', '2025-01-31T23:59:59.000Z'],
    type: [String],
  })
  @IsArray()
  @IsDateString({}, { each: true })
  @IsOptional()
  expirationDates?: Date[];

  @ApiPropertyOptional({
    description: 'Posición en el almacén',
    example: 'A1-B2-C3',
  })
  @IsString()
  @IsOptional()
  positionInStorage?: string;

  @ApiPropertyOptional({
    description: 'Etiquetas del producto',
    example: [ProductTag.NUEVO, ProductTag.DESTACADO],
    enum: ProductTag,
    type: [String],
  })
  @IsArray()
  @IsEnum(ProductTag, { each: true })
  @IsOptional()
  tags?: ProductTag[] = [ProductTag.NUEVO];

  @ApiProperty({
    description: 'Nivel mínimo de stock',
    example: 5,
    default: 0,
  })
  @IsNumber()
  minStockLevel: number = 0;
}
