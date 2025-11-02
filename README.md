<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

API de Gestión de Supermercado y E-commerce

Esta API proporciona las funcionalidades necesarias para administrar un sistema de supermercado con tienda online.
Permite la gestión de productos, usuarios, pedidos y categorías, integrando autenticación segura y operaciones CRUD completas.

Características principales

Gestión de productos: creación, actualización y eliminación.

Gestión de usuarios y roles: autenticación con JWT y control de acceso.

Gestión de pedidos: registro y seguimiento de compras.

Gestión de categorías: organización y clasificación de productos.

Arquitectura modular: desarrollo basado en NestJS y principios SOLID.

Base de datos relacional: integración con Prisma y PostgreSQL.

Documentación integrada: endpoints disponibles mediante Swagger.

Tecnologías utilizadas
Categoría	Tecnologías
Framework	NestJS
Lenguaje	TypeScript
Base de datos	PostgreSQL
ORM	Prisma
Autenticación	JWT
Validación	Class Validator
Documentación	Swagger
Entorno	dotenv
Instalación y configuración
# Clonar el repositorio
git clone https://github.com/tuusuario/supermarket-api.git
cd supermarket-api

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env


Ejemplo de variables de entorno:

DATABASE_URL="postgresql://usuario:password@localhost:5432/supermarket"
JWT_SECRET=tu_clave_secreta
PORT=3000

Ejecución del proyecto
# Ejecutar migraciones de la base de datos
npx prisma migrate dev

# Iniciar el servidor en modo desarrollo
npm run start:dev


La API estará disponible en:
http://localhost:3000

Documentación Swagger:
http://localhost:3000/api

Estructura del proyecto
src/
├── modules/
│   ├── products/
│   ├── users/
│   ├── orders/
│   └── categories/
├── common/
│   ├── guards/
│   ├── filters/
│   └── dto/
└── main.ts

Próximas mejoras

Integración con pasarelas de pago.

Sistema de stock en tiempo real.

Dashboard de métricas y reportes.

Notificaciones por correo y SMS.
