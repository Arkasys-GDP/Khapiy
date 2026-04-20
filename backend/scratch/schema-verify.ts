import 'dotenv/config';
import { PrismaService } from '../src/prisma/prisma.service';

async function main() {
  const prisma = new PrismaService();
  await prisma.$connect();
  try {
    const res = await prisma.$queryRawUnsafe(`SELECT * FROM categories LIMIT 1`);
    console.log("categories:", res);
    const prod = await prisma.$queryRawUnsafe(`SELECT * FROM products LIMIT 1`);
    console.log("products:", prod);
  } catch (e) {
    console.error("error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
