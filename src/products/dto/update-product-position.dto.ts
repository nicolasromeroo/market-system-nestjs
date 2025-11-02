import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductPositionDto {
  @ApiProperty({
    description: 'ID del producto',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({
    description: 'Nueva posición del producto en el almacén',
    example: 'A-123',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  positionInStorage: string;
}
