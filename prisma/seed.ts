import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear productos de prueba
  const products = await Promise.all([
    prisma.product.create({
      data: {
        title: 'Smartphone Samsung Galaxy S23',
        description: 'Último modelo de Samsung con 256GB',
        price: 999.99,
        stock: 50,
        category: 'Electronics',
        minStockLevel: 10,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Laptop Dell XPS 15',
        description: 'Laptop profesional con Intel i9',
        price: 1499.99,
        stock: 25,
        category: 'Electronics',
        minStockLevel: 5,
      },
    }),
    prisma.product.create({
      data: {
        title: 'AirPods Pro',
        description: 'Auriculares inalámbricos de Apple',
        price: 249.99,
        stock: 100,
        category: 'Electronics',
        minStockLevel: 15,
      },
    }),
  ]);

  console.log('Created sample products:', products);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
