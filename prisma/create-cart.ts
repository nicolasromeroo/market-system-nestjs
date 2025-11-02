import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear un carrito inicial
  const cart = await prisma.cart.create({
    data: {
      userId: 1,
    },
  });

  console.log('Created initial cart:', cart);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
