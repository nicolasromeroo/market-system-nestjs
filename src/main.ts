import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Enterprise Supermarket API')
    .setDescription(
      `
  Documentación oficial de la API RESTful del sistema de gestión y e-commerce del Supermercado Enterprise.
  
  Esta API ha sido desarrollada con NestJS y Prisma ORM bajo una arquitectura modular, escalable y orientada a dominios,
  integrando tanto funcionalidades de gestión interna como servicios públicos para el cliente final.

  Alcance funcional:
  - Gestión completa del catálogo de productos, stock y control de inventario.
  - Sistema de autenticación basado en JWT con control de acceso por roles.
  - Roles definidos: administrador, cliente, operario, cocinero y personal logístico.
  - Módulo de carrito de compras y procesamiento de pedidos para el canal e-commerce.
  - Panel interno para control de tareas, pedidos en cocina y operaciones de almacén.
  - Pipeline de actualización de stock y sincronización de estados de pedido en tiempo real.
  
  Stack tecnológico:
  - Framework: NestJS (Node.js)
  - ORM: Prisma
  - Base de datos: PostgreSQL
  - Autenticación y autorización: JWT + Guards de roles
  - Documentación: Swagger / OpenAPI
  - Principios aplicados: Clean Architecture, SOLID, DTOs tipados, validaciones automáticas y manejo centralizado de errores.

  Esta API está diseñada para integrarse tanto con interfaces web internas como con el frontend de e-commerce,
  garantizando consistencia en la gestión de usuarios, pedidos y operaciones logísticas.
  `,
    )
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description:
        'Autenticación mediante token JWT. Requiere rol válido según el endpoint.',
      in: 'header',
    })
    .addTag(
      'Auth',
      'Endpoints de autenticación, registro y gestión de sesiones de usuario.',
    )
    .addTag(
      'Products',
      'Operaciones CRUD y control de inventario de productos.',
    )
    .addTag(
      'Cart',
      'Gestión del carrito de compras y flujo de pedidos del cliente.',
    )
    .addTag('Orders', 'Procesamiento, actualización y trazabilidad de pedidos.')
    .addTag(
      'Tasks',
      'Gestión interna de tareas, operaciones de cocina y logística.',
    )
    .addTag('Users', 'Administración de usuarios y asignación de roles.')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();
