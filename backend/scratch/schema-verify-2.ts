import 'dotenv/config';
import { PrismaService } from '../src/prisma/prisma.service';

async function main() {
  const prisma = new PrismaService();
  await prisma.$connect();
  try {
    const res = await prisma.$queryRawUnsafe(`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`);
    console.log("tables:", res);
  } finally {
    await prisma.$disconnect();
  }
}
main();
