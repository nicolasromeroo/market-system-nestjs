import { IsInt, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiProperty({
    description: 'ID of the product to add to cart',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({
    description: 'Quantity of the product to add',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsNotEmpty()
  quantity: number;
}
