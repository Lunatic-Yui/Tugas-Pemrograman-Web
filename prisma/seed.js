const prisma = require('../lib/prisma');

async function main() {
  const count = await prisma.product.count();
  if (count > 0) {
    console.log('Data sudah ada, seed dilewati');
    return;
  }

  await prisma.product.createMany({
    data: [
      { name: 'Laptop', price: 7500000 },
      { name: 'Mouse', price: 150000 },
      { name: 'Keyboard', price: 350000 }
    ]
  });
  console.log('Seed selesai');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
