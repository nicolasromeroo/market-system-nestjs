import { IsNotEmpty, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../constants/roles';

export class CreateAuthDto {
  @ApiProperty({ description: 'Email del usuario' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ description: 'Contraseña del usuario' })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ description: 'Nombre del usuario' })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: Role,
    default: Role.USER,
  })
  @IsEnum(Role)
  @IsOptional()
  readonly role?: Role;
}
