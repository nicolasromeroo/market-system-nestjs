import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { HashPassword } from './bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(
    dto: CreateAuthDto,
  ): Promise<{ user: any; access_token: string }> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }

      const hashedPassword = await HashPassword.hashPassword(dto.password);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          role: dto.role || 'USER',
          name: dto.name,
        },
      });

      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const token = this.jwtService.sign(payload, {
        expiresIn: '24h',
        secret: process.env.JWT_SECRET,
      });

      const { password, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        access_token: token,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al registrar usuario: ' + error.message,
      );
    }
  }

  async login(
    dto: CreateAuthDto,
  ): Promise<{ user: any; access_token: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!user) {
        throw new ConflictException('Credenciales inválidas');
      }

      const isPasswordValid = await HashPassword.comparePassword(
        dto.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new ConflictException('Credenciales inválidas');
      }

      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const token = this.jwtService.sign(payload, {
        expiresIn: '24h',
        secret: process.env.JWT_SECRET || 'ssm0123',
      });

      const { password, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        access_token: token,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error al iniciar sesión');
    }
  }

  async profile(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return this.findById(decoded.sub);
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener perfil');
    }
  }

  async findById(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar usuario');
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar usuario');
    }
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: updateAuthDto,
      });
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar usuario');
    }
  }

  async remove(id: number) {
    try {
      const user = await this.prisma.user.delete({
        where: { id },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar usuario');
    }
  }
}
