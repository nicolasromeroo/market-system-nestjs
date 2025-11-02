import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto {
  @ApiProperty({
    description: 'Product ID to update in cart',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({
    description: 'New quantity for the product',
    example: 3,
    minimum: 0,
  })
  @IsInt()
  @IsNotEmpty()
  quantity: number;
}
